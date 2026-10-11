from datetime import datetime, timezone
import uuid
from typing import AsyncGenerator, Dict, Any

from ..schemas import (
    AssessmentResponse, AssessmentRequest, FactItem, MarketData, MarketReference,
    Explanation, OptionItem, DataStatusSource, ProgressStep, Value, SignalItem, Briefing
)
from ..config import settings
from .session import get_market_session
from .divergence import compute_divergence
from .activity import compute_activity_ratio
from .verdict import evaluate_verdict
from .signals import compute_signals
from .events import get_catalyst_data
from .outlook import get_outlook_data
from ..clients.bitget import bitget_client
from ..clients.yahoo import yahoo_client
from ..llm.interpret import parse_user_query
from ..llm.client import llm_client
from ..llm.payload_builder import build_briefing_payload
from ..db.database import save_request, log_verdict

async def run_assessment_pipeline(
    message: str,
    ticker: str = "NVDA",
    session_id: str = "s_default"
) -> AsyncGenerator[Dict[str, Any], None]:
    """
    Executes the 10-step progress pipeline specified in Part C.10 & D.6.
    Yields ProgressStep events, ending with the full AssessmentResponse.
    """
    req_id = f"r_{uuid.uuid4().hex[:8]}"

    # Step 1: Parsed
    parsed = parse_user_query(message)
    active_ticker = parsed.ticker or ticker.upper().replace("R", "")
    clean_ticker = active_ticker
    token_symbol = parsed.token or f"r{active_ticker}"
    active_amount = parsed.amount_usd or 50.0
    active_side = parsed.side or "buy"

    yield {
        "step": "parsed",
        "status": "done",
        "label": f"Parsed intent: {parsed.intent.replace('_', ' ').capitalize()} for {token_symbol}",
        "ms": 45
    }

    # Step 2: Session Checked
    session = get_market_session()
    yield {
        "step": "session_checked",
        "status": "done",
        "label": f"Checked market session (US Market {session.state.capitalize()})",
        "ms": 110
    }

    # Step 3: Token Loaded (Bitget Reality)
    token_val, turnover, typical_turnover = await bitget_client.get_token_ticker(clean_ticker)
    yield {
        "step": "token_loaded",
        "status": "done",
        "label": f"Loaded {token_symbol} spot ticker ({token_val.display})",
        "ms": 180
    }

    # Step 4: Underlying Loaded (Yahoo Finance Unofficial Reference)
    ref_kind = "last_close" if session.state in ("closed", "overnight", "holiday") else "live_quote"
    ref_val = await yahoo_client.get_reference_quote(clean_ticker, session.state)
    yield {
        "step": "underlying_loaded",
        "status": "done",
        "label": f"Loaded {clean_ticker} reference price ({ref_val.display}) [Unofficial]",
        "ms": 140
    }

    # Step 5: Activity Computed
    divergence_val = compute_divergence(token_val.value or 0.0, ref_val.value or 0.0)
    activity_val, market_activity = compute_activity_ratio(turnover, typical_turnover)
    yield {
        "step": "activity_computed",
        "status": "done",
        "label": f"Computed turnover activity ratio ({activity_val.display})",
        "ms": 95
    }

    # Step 6: Events Loaded
    events_data, history = get_catalyst_data(clean_ticker)
    event_label = events_data.banner.text if events_data.banner else "No near-term catalyst"
    yield {
        "step": "events_loaded",
        "status": "done",
        "label": f"Loaded catalyst calendar: {event_label}",
        "ms": 150
    }

    # Step 7: History Loaded
    yield {
        "step": "history_loaded",
        "status": "done",
        "label": f"Loaded {len(history)} past corporate event look-backs",
        "ms": 190
    }

    # Step 8: Signals & Condition Evaluated
    signals = compute_signals(
        session=session,
        deviation_val=divergence_val,
        activity_ratio_val=activity_val,
        events_data=events_data
    )
    verdict = evaluate_verdict(
        session=session,
        token_price_val=token_val,
        reference_price_val=ref_val,
        deviation_val=divergence_val,
        activity_ratio_val=activity_val,
        ticker=clean_ticker
    )
    yield {
        "step": "verdict_ready",
        "status": "done",
        "label": f"Evaluated condition signals ({len(signals)} signals active)",
        "ms": 40
    }

    # Step 9: Structured Briefing Synthesis (Gemini LLM with JSON mode & guardrails)
    outlook = get_outlook_data(clean_ticker, token_val)
    briefing_payload = build_briefing_payload(
        question=message,
        parsed=parsed,
        clean_ticker=clean_ticker,
        token_symbol=token_symbol,
        session=session,
        token_val=token_val,
        ref_val=ref_val,
        divergence_val=divergence_val,
        activity_val=activity_val,
        turnover_24h=turnover,
        events_data=events_data,
        history=history,
        outlook=outlook,
        signals=signals
    )

    briefing = await llm_client.generate_briefing(briefing_payload)

    yield {
        "step": "explanation_ready",
        "status": "done",
        "label": "Event-aware market briefing ready",
        "ms": 85
    }

    # Assemble Full AssessmentResponse
    facts = [
        FactItem(id="session", label="US Market", value=Value(
            value=None, unit="", display=session.state.capitalize(), tag="observed",
            source="nyse_calendar", freshness="live"
        )),
        FactItem(id="token_price", label=f"{token_symbol} price", value=token_val),
        FactItem(id="reference_price", label=f"{clean_ticker} {'last close' if ref_kind == 'last_close' else 'price'} (Unofficial)", value=ref_val),
        FactItem(id="deviation", label=f"Gap vs {'last close' if ref_kind == 'last_close' else 'price'}", value=divergence_val),
        FactItem(id="activity_ratio", label="Activity vs normal", value=activity_val)
    ]

    market = MarketData(
        session=session,
        reference=MarketReference(
            kind=ref_kind,
            label_text="Last regular close (Unofficial Yahoo Finance)" if ref_kind == "last_close" else "Indicative quote (Unofficial Yahoo Finance)"
        ),
        activity=market_activity,
        conflicts=[]
    )

    options = [
        OptionItem(
            id="opt_confirm",
            kind="confirm_order",
            label=f"Buy ${active_amount:.0f} (Demo)",
            enabled=settings.ORDERS_ENABLED,
            disabled_reason=None if settings.ORDERS_ENABLED else "Orders temporarily paused",
            requires_confirmation=True,
            params={"ticker": clean_ticker, "token": token_symbol, "side": "buy", "amount_usd": float(active_amount)}
        ),
        OptionItem(
            id="opt_adjust",
            kind="adjust_amount",
            label="Adjust amount",
            enabled=True,
            requires_confirmation=False,
            params={"amount_usd": 100.0}
        ),
        OptionItem(
            id="opt_followup",
            kind="ask_followup",
            label="What happened last time?",
            enabled=True,
            requires_confirmation=False,
            params={"message": f"Show detailed look-back breakdown for {clean_ticker}"}
        )
    ]

    # Combine headline and summary for backward-compatible explanation string
    combined_explanation_text = f"{briefing.headline} {briefing.summary}".strip()

    assessment = AssessmentResponse(
        type="assessment",
        request_id=req_id,
        generated_at=datetime.now(timezone.utc).isoformat().replace("+00:00", "Z"),
        mode="demo",
        mock=False,
        request=AssessmentRequest(
            ticker=active_ticker,
            token=token_symbol,
            side=active_side if active_side in ("buy", "sell", "hold") else "buy",
            amount_usd=active_amount,
            context=parsed.intent if parsed.intent in ("trade", "check", "research", "holding_check") else "trade"
        ),
        verdict=verdict,
        signals=signals,
        briefing=briefing,
        facts=facts,
        market=market,
        events=events_data,
        history=history,
        outlook=outlook,
        explanation=Explanation(
            kind="interpretation",
            text=combined_explanation_text,
            validated=briefing.validated,
            fallback_used=briefing.fallback_used
        ),
        options=options,
        data_status={
            "bitget_reality": DataStatusSource(
                status="ok" if token_val.tag != "unavailable" else "unavailable",
                detail="Live token spot feeds from Bitget Reality market"
            ),
            "yahoo_finance_unofficial": DataStatusSource(
                status="ok" if ref_val.tag != "unavailable" else "unavailable",
                detail="Unofficial indicative equity reference quote from Yahoo Finance aggregator (not official Nasdaq feed)"
            ),
            "nyse_session": DataStatusSource(status="ok", detail="NYSE/NASDAQ trading calendar"),
            "wall_street_consensus": DataStatusSource(status="ok", detail=None)
        }
    )

    # Persist in SQLite
    payload_dump = assessment.model_dump()
    save_request(req_id, session_id, parsed.model_dump(), payload_dump)
    log_verdict(active_ticker, verdict.code, [f.model_dump() for f in facts], token_val.value or 0.0)

    # Step 10: Done with full typed assessment
    yield {
        "step": "done",
        "status": "done",
        "label": "Card assembled",
        "ms": 15,
        "assessment": payload_dump
    }
