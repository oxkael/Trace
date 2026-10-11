import re
import json
import os
from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field

class ParsedIntent(BaseModel):
    intent: str = "check"  # check | trade | holding_check | event_question | outlook_question | activity_question | compare | scoreboard | other
    ticker: str = "NVDA"
    tickers: List[str] = Field(default_factory=lambda: ["NVDA"])
    token: str = "rNVDA"
    side: Optional[str] = "buy"  # "buy", "sell", or None
    amount_usd: Optional[float] = None
    event_type: Optional[str] = None
    timeframe: Optional[str] = None
    holding: bool = False
    followup: bool = False
    asks_prediction: bool = False
    asks_advice: bool = False
    missing: List[str] = Field(default_factory=list)
    clarifying_question: Optional[str] = None

SUPPORTED_TICKERS = {
    "NVDA": "rNVDA",
    "TSLA": "rTSLA",
    "AMD": "rAMD",
    "AMZN": "rAMZN"
}

TICKER_ALIASES = {
    "NVIDIA": "NVDA",
    "TESLA": "TSLA",
    "ADVANCED MICRO DEVICES": "AMD",
    "AMAZON": "AMZN",
    "RNVDA": "NVDA",
    "RTSLA": "TSLA",
    "RAMD": "AMD",
    "RAMZN": "AMZN"
}

def parse_user_query_rules(message: str) -> ParsedIntent:
    """
    Rule-based parser adhering to LLM_PROMPTS.md Section 8.
    Never refuses prediction or advice queries; marks asks_prediction or asks_advice instead.
    """
    clean = message.strip()
    upper = clean.upper()

    asks_prediction = any(p in upper for p in ["WILL IT GO UP", "WILL IT GO DOWN", "PRICE PREDICTION", "PRICE TARGET", "WILL NVDA GO UP", "WILL TSLA GO UP", "WHERE IS THE PRICE GOING", "WHERE WILL"])
    asks_advice = any(p in upper for p in ["SHOULD I BUY", "SHOULD I SELL", "IS IT A GOOD TIME", "ADVISE ME", "WHAT SHOULD I DO"])

    # 1. Resolve tickers
    found_tickers: List[str] = []
    for alias, standard in TICKER_ALIASES.items():
        if alias in upper and standard not in found_tickers:
            found_tickers.append(standard)

    for sym in SUPPORTED_TICKERS.keys():
        if re.search(r'\b' + sym + r'\b', upper) and sym not in found_tickers:
            found_tickers.append(sym)

    missing = []
    clarifying_question = None
    if not found_tickers:
        detected_ticker = "NVDA"
        found_tickers = ["NVDA"]
    else:
        detected_ticker = found_tickers[0]

    token_symbol = SUPPORTED_TICKERS.get(detected_ticker, f"r{detected_ticker}")

    # 2. Extract amount
    amount_usd = None
    amount_match = re.search(r'\$\s*([0-9,]+(?:\.[0-9]+)?)', clean)
    if amount_match:
        try:
            amount_usd = float(amount_match.group(1).replace(",", ""))
        except ValueError:
            pass
    else:
        k_match = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*k\b', clean, re.IGNORECASE)
        if k_match:
            try:
                amount_usd = float(k_match.group(1)) * 1000.0
            except ValueError:
                pass
        else:
            num_match = re.search(r'([0-9]+)\s*(?:dollars|usd)', clean, re.IGNORECASE)
            if num_match:
                try:
                    amount_usd = float(num_match.group(1))
                except ValueError:
                    pass

    # 3. Extract side
    side = "buy"
    if "SELL" in upper:
        side = "sell"
    elif "HOLD" in upper or "HOLDING" in upper:
        side = None

    holding = "HOLDING" in upper or "I HOLD" in upper or "I'M HOLDING" in upper or "I AM HOLDING" in upper

    # 4. Classify intent
    intent = "check"
    if len(found_tickers) > 1 or "COMPARE" in upper or "VS" in upper:
        intent = "compare"
    elif amount_usd is not None or any(w in upper for w in ["CAN I BUY", "CAN I SELL", "PLACE ORDER", "PURCHASE", "SHOULD I BUY", "SHOULD I SELL"]):
        intent = "trade"
    elif any(w in upper for w in ["EARNINGS", "CATALYST", "WHEN DOES", "REPORT", "LOOKBACK", "LAST TIME"]):
        intent = "event_question"
    elif any(w in upper for w in ["ANALYST", "ANALYSTS", "TARGETS", "WALL STREET", "SPLIT ON", "NEWS", "CONSENSUS"]):
        intent = "outlook_question"
    elif any(w in upper for w in ["ACTIVITY", "QUIET", "VOLUME", "TURNOVER", "BUSY", "PACE"]):
        intent = "activity_question"
    elif any(w in upper for w in ["SCOREBOARD", "ACCURACY", "WARNINGS", "LEDGER", "TRACK RECORD"]):
        intent = "scoreboard"
    elif holding:
        intent = "holding_check"

    return ParsedIntent(
        intent=intent,
        ticker=detected_ticker,
        tickers=found_tickers,
        token=token_symbol,
        side=side,
        amount_usd=amount_usd,
        holding=holding,
        asks_prediction=asks_prediction,
        asks_advice=asks_advice,
        missing=missing,
        clarifying_question=clarifying_question
    )

def parse_user_query(message: str) -> ParsedIntent:
    return parse_user_query_rules(message)
