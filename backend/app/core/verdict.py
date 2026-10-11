from typing import List, Optional
from ..schemas import Verdict, MarketSession, Value
from ..config import settings

def evaluate_verdict(
    session: MarketSession,
    token_price_val: Value,
    reference_price_val: Value,
    deviation_val: Value,
    activity_ratio_val: Value,
    ticker: str
) -> Verdict:
    """
    Evaluates legacy condition verdict for backward compatibility.
    Does NOT issue 'WAIT' or gate trades, as tokenized assets trade 24/7.
    Returns neutral condition summaries.
    """
    # 1. INSUFFICIENT_DATA
    if token_price_val.tag == "unavailable" or token_price_val.value is None:
        return Verdict(
            code="INSUFFICIENT_DATA",
            tone="neutral",
            headline="Live feed data is currently limited",
            reason=f"Cannot establish real-time token pricing for {ticker}.",
            limitation="Describes missing data state only. Token continues trading on Bitget.",
            evidence=["token_price"]
        )

    # 2. Closed / Overnight / Weekend (Neutral off-hours session, NOT WAIT)
    if session.state in ("closed", "overnight", "holiday", "weekend"):
        return Verdict(
            code="QUIET",
            tone="neutral",
            headline="US markets closed; token trading on its own",
            reason=f"The underlying US stock market is {session.state}. The token continues trading on Bitget against the last regular close.",
            limitation="Describes market session context only. 24/7 tokens trade continuously.",
            evidence=["session", "reference_price"]
        )

    # 3. Divergence notice
    if deviation_val.value is not None and abs(deviation_val.value) >= settings.DIVERGENCE_CAUTION_PCT:
        direction = "premium" if deviation_val.value > 0 else "discount"
        return Verdict(
            code="CAUTION",
            tone="neutral",
            headline=f"Token price gap ({deviation_val.display})",
            reason=f"Tokenized {ticker} is trading at a {abs(deviation_val.value):.2f}% {direction} relative to underlying reference pricing.",
            limitation="Observed gap reflects independent 24/7 token trading dynamics.",
            evidence=["deviation", "token_price", "reference_price"]
        )

    # 4. Low Activity
    if activity_ratio_val.value is not None and activity_ratio_val.value < settings.ACTIVITY_QUIET_RATIO:
        return Verdict(
            code="QUIET",
            tone="neutral",
            headline=f"Turnover pace is light ({activity_ratio_val.display})",
            reason=f"Trading turnover is currently running at {activity_ratio_val.display} of typical pace.",
            limitation="Turnover measures trading volume activity, not order book depth.",
            evidence=["activity_ratio"]
        )

    # 5. Regular tracking
    return Verdict(
        code="REASONABLE",
        tone="neutral",
        headline="Token tracking equity reference",
        reason=f"Trading in {ticker} is proceeding with normal session activity and narrow tracking.",
        limitation="Conditions describe recent observed metrics only.",
        evidence=["token_price", "reference_price", "deviation"]
    )
