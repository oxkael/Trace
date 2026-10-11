from datetime import datetime, timezone
from typing import Dict, Any, List, Optional
from zoneinfo import ZoneInfo

from ..schemas import MarketSession, Value, EventsData, LookbackRow, OutlookData, SignalItem
from ..llm.interpret import ParsedIntent
from ..llm.session_explainers import get_session_explainer
from ..llm.meaning_notes import get_meaning_note

def get_now_times() -> Dict[str, str]:
    now_utc = datetime.now(timezone.utc)
    try:
        ny_tz = ZoneInfo("America/New_York")
        now_ny = now_utc.astimezone(ny_tz)
        ny_str = now_ny.strftime("%a %b %d, %I:%M %p ET").replace(" 0", " ")
    except Exception:
        ny_str = now_utc.strftime("%a %b %d, %I:%M %p UTC").replace(" 0", " ")
        
    return {
        "utc": now_utc.isoformat().replace("+00:00", "Z"),
        "new_york": ny_str
    }

def build_briefing_payload(
    question: str,
    parsed: ParsedIntent,
    clean_ticker: str,
    token_symbol: str,
    session: MarketSession,
    token_val: Value,
    ref_val: Value,
    divergence_val: Value,
    activity_val: Value,
    turnover_24h: float,
    events_data: EventsData,
    history: List[LookbackRow],
    outlook: OutlookData,
    signals: List[SignalItem],
    unavailable_items: Optional[List[Dict[str, str]]] = None
) -> Dict[str, Any]:
    now_dict = get_now_times()
    
    # 1. Session Explainer
    close_str = ref_val.display if ref_val else "$0.00"
    next_open_str = session.next_open or "Mon 9:30 am ET"
    close_date_str = "recent close"
    if ref_val and ref_val.as_of:
        close_date_str = ref_val.as_of
    session_explainer = get_session_explainer(
        state=session.state,
        close=close_str,
        close_date=close_date_str,
        next_open=next_open_str
    )

    # 2. Facts list
    is_live_ref = session.state == "regular"
    facts = [
        {
            "id": "token_price",
            "label": f"{token_symbol} price",
            "display": token_val.display,
            "tag": token_val.tag,
            "source": token_val.source,
            "official": True,
            "as_of": token_val.as_of or now_dict["utc"],
            "freshness": token_val.freshness,
            "meaning": get_meaning_note("token_price")
        },
        {
            "id": "reference_price",
            "label": f"{clean_ticker} {'quote' if is_live_ref else 'last close'} (Unofficial)",
            "display": ref_val.display,
            "tag": ref_val.tag,
            "source": ref_val.source,
            "official": False,
            "as_of": ref_val.as_of or now_dict["utc"],
            "freshness": ref_val.freshness,
            "meaning": get_meaning_note("reference_price", is_live_quote=is_live_ref)
        },
        {
            "id": "premium_pct",
            "label": f"Gap vs {'quote' if is_live_ref else 'last close'}",
            "display": divergence_val.display,
            "tag": divergence_val.tag,
            "source": "Trace Engine",
            "official": False,
            "as_of": now_dict["utc"],
            "freshness": divergence_val.freshness,
            "meaning": get_meaning_note("premium_pct")
        },
        {
            "id": "activity_ratio",
            "label": "Turnover vs usual pace",
            "display": activity_val.display,
            "tag": activity_val.tag,
            "source": "Trace Activity Model",
            "official": False,
            "as_of": now_dict["utc"],
            "freshness": activity_val.freshness,
            "meaning": get_meaning_note("activity_ratio")
        }
    ]

    # 3. Order context
    order_context = None
    if parsed.amount_usd is not None and parsed.amount_usd > 0:
        if turnover_24h > 0:
            share_pct = (parsed.amount_usd / turnover_24h) * 100.0
            order_context = {
                "amount_usd": f"${parsed.amount_usd:,.0f}" if parsed.amount_usd >= 1 else f"${parsed.amount_usd:.2f}",
                "share_of_24h_turnover": f"about {share_pct:.1f}%" if share_pct >= 0.1 else "under 0.1%"
            }
        else:
            order_context = {
                "amount_usd": f"${parsed.amount_usd:,.0f}" if parsed.amount_usd >= 1 else f"${parsed.amount_usd:.2f}",
                "share_of_24h_turnover": "unknown"
            }

    # 4. Events
    upcoming_events = []
    for ev in events_data.upcoming:
        upcoming_events.append({
            "id": ev.id,
            "type": ev.type,
            "title": ev.title,
            "when": ev.event_time,
            "relative": ev.relative,
            "source": ev.source,
            "official": True
        })

    # 5. History summary
    history_list = []
    if history:
        moves = [{"date": h.date, "display": f"{h.stock_move_pct:+.1f}%"} for h in history]
        move_vals = [h.stock_move_pct for h in history]
        low_move = min(move_vals)
        high_move = max(move_vals)
        over_threshold_cnt = sum(1 for m in move_vals if abs(m) >= 5.0)
        history_list.append({
            "event_type": "earnings",
            "ticker": clean_ticker,
            "sample_size": len(history),
            "excluded": 0,
            "moves": moves[:4],
            "range": {"low": f"{low_move:+.1f}%", "high": f"{high_move:+.1f}%"},
            "over_threshold": {"count": over_threshold_cnt, "threshold": "5%"},
            "note": "Moves are the stock's change from the close before to the close after each report."
        })

    # 6. Analysts
    analysts_dict: Dict[str, Any] = {}
    if outlook and outlook.consensus:
        analysts_dict["consensus"] = {
            "buy": outlook.consensus.buy,
            "hold": outlook.consensus.hold,
            "sell": outlook.consensus.sell,
            "source": outlook.consensus.source,
            "as_of": outlook.consensus.as_of
        }
    if outlook and outlook.targets:
        analysts_dict["targets"] = {
            "low": outlook.targets.low.display,
            "mean": outlook.targets.mean.display,
            "high": outlook.targets.high.display,
            "analyst_count": outlook.targets.analyst_count,
            "current_price": outlook.targets.current_price.display,
            "as_of": outlook.targets.as_of
        }

    # 7. Headlines and Arguments
    headlines_list = []
    if outlook and outlook.timeline:
        for t in outlook.timeline[:4]:
            headlines_list.append({
                "id": t.id,
                "title": t.title,
                "source": t.source,
                "published_at": t.time,
                "text": t.title,
                "official": False
            })

    arguments_dict = {"supporters": [], "skeptics": []}
    if outlook and outlook.arguments:
        for sup in outlook.arguments.supporters[:2]:
            arguments_dict["supporters"].append({
                "point": sup.text,
                "article_ids": [s.source for s in sup.sources]
            })
        for skp in outlook.arguments.skeptics[:2]:
            arguments_dict["skeptics"].append({
                "point": skp.text,
                "article_ids": [s.source for s in skp.sources]
            })

    # Signals for prompt
    prompt_signals = [{"id": s.id, "text": s.text} for s in signals]

    payload: Dict[str, Any] = {
        "question": question,
        "intent": parsed.intent,
        "asks_prediction": parsed.asks_prediction,
        "asks_advice": parsed.asks_advice,
        "now": now_dict,
        "session": {
            "state": session.state,
            "explainer": session_explainer,
            "next_open": next_open_str
        },
        "facts": facts,
        "events": {
            "upcoming": upcoming_events,
            "recent": []
        },
        "history": history_list,
        "analysts": analysts_dict,
        "headlines": headlines_list,
        "arguments": arguments_dict,
        "signals": prompt_signals,
        "unavailable": unavailable_items or []
    }

    if order_context:
        payload["order_context"] = order_context

    return payload
