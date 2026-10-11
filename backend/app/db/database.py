import sqlite3
import json
import os
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List, Tuple

DB_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "trace.db")

def get_connection():
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.executescript("""
        CREATE TABLE IF NOT EXISTS requests (
            id TEXT PRIMARY KEY,
            session_id TEXT,
            ts TEXT,
            parsed_json TEXT,
            payload_json TEXT
        );

        CREATE TABLE IF NOT EXISTS sessions (
            session_id TEXT PRIMARY KEY,
            context_json TEXT,
            updated_at TEXT
        );

        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            ticker TEXT,
            type TEXT,
            event_time TEXT,
            timing TEXT,
            title TEXT,
            source TEXT,
            source_url TEXT,
            summary TEXT,
            origin TEXT,
            outcome_json TEXT,
            recorded_at TEXT
        );

        CREATE TABLE IF NOT EXISTS verdicts (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ts TEXT,
            ticker TEXT,
            code TEXT,
            facts_json TEXT,
            price_at REAL,
            price_after_1h REAL,
            price_after_24h REAL,
            resolved_at TEXT
        );

        CREATE TABLE IF NOT EXISTS source_cache (
            key TEXT PRIMARY KEY,
            value_json TEXT,
            fetched_at TEXT,
            ttl_sec INTEGER
        );

        CREATE TABLE IF NOT EXISTS orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ts TEXT,
            ticker TEXT,
            side TEXT,
            usd REAL,
            mode TEXT,
            status TEXT,
            exchange_ref TEXT,
            confirmation_token TEXT UNIQUE
        );

        CREATE TABLE IF NOT EXISTS confirmations (
            token TEXT PRIMARY KEY,
            request_id TEXT,
            order_json TEXT,
            created_at TEXT,
            expires_at TEXT,
            used INTEGER DEFAULT 0
        );
    """)
    conn.commit()
    conn.close()

# Database operations
def save_request(req_id: str, session_id: str, parsed: Dict[str, Any], payload: Dict[str, Any]):
    conn = get_connection()
    now_str = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    conn.execute(
        "INSERT OR REPLACE INTO requests (id, session_id, ts, parsed_json, payload_json) VALUES (?, ?, ?, ?, ?)",
        (req_id, session_id, now_str, json.dumps(parsed), json.dumps(payload))
    )
    conn.commit()
    conn.close()

def get_request_payload(req_id: str) -> Optional[Dict[str, Any]]:
    conn = get_connection()
    row = conn.execute("SELECT payload_json FROM requests WHERE id = ?", (req_id,)).fetchone()
    conn.close()
    if row and row["payload_json"]:
        return json.loads(row["payload_json"])
    return None

def log_verdict(ticker: str, code: str, facts: List[Dict[str, Any]], price_at: float):
    conn = get_connection()
    now_str = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    conn.execute(
        "INSERT INTO verdicts (ts, ticker, code, facts_json, price_at) VALUES (?, ?, ?, ?, ?)",
        (now_str, ticker, code, json.dumps(facts), price_at)
    )
    conn.commit()
    conn.close()

def get_verdict_stats() -> Dict[str, Any]:
    conn = get_connection()
    rows = conn.execute("SELECT code, COUNT(*) as count FROM verdicts GROUP BY code").fetchall()
    total_row = conn.execute("SELECT COUNT(*) as total FROM verdicts").fetchone()
    conn.close()
    
    total = total_row["total"] if total_row else 0
    by_code = {r["code"]: r["count"] for r in rows}
    return {"total": total, "by_code": by_code}

def create_confirmation(token: str, req_id: str, order_data: Dict[str, Any], ttl_sec: int = 120):
    conn = get_connection()
    now_ts = datetime.now(timezone.utc).timestamp()
    exp_ts = now_ts + ttl_sec
    conn.execute(
        "INSERT INTO confirmations (token, request_id, order_json, created_at, expires_at, used) VALUES (?, ?, ?, ?, ?, 0)",
        (token, req_id, json.dumps(order_data), str(now_ts), str(exp_ts))
    )
    conn.commit()
    conn.close()

def consume_confirmation(token: str) -> Tuple[bool, Optional[Dict[str, Any]], str]:
    conn = get_connection()
    row = conn.execute("SELECT * FROM confirmations WHERE token = ?", (token,)).fetchone()
    if not row:
        conn.close()
        return False, None, "Invalid confirmation token"
    
    if row["used"] == 1:
        conn.close()
        return False, None, "Confirmation token already used"
    
    now_ts = datetime.now(timezone.utc).timestamp()
    if now_ts > float(row["expires_at"]):
        conn.close()
        return False, None, "Confirmation token expired"

    conn.execute("UPDATE confirmations SET used = 1 WHERE token = ?", (token,))
    conn.commit()
    order_data = json.loads(row["order_json"])
    conn.close()
    return True, order_data, "OK"
