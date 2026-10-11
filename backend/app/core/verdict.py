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
    Evaluates condition verdict based on Part B.5 F6:
    First match wins:
    1. INSUFFICIENT_DATA: Session status or token price unavailable
    2. WAIT: Underlying market closed and reference is a last close
    3. CAUTION: Token and underlying differ beyond threshold, both fresh
    4. QUIET: Activity ratio below threshold
    5. REASONABLE: None of the above
    """
    # 1. INSUFFICIENT_DATA
    if token_price_val.tag == "unavailable" or token_price_val.value is None:
        return Verdict(
            code="INSUFFICIENT_DATA",
            tone="warning",
            headline="Live feed data is currently unavailable",
            reason=f"Cannot establish audited real-time token pricing for {ticker}.",
            limitation="Describes missing data state only. Cannot assess current conditions.",
            evidence=["token_price"]
        )

    # 2. WAIT
    if session.state in ("closed", "overnight", "holiday"):
        return Verdict(
            code="WAIT",
            tone="warning",
            headline="The real stock market is closed",
            reason=f"The underlying US market is closed ({session.state}). The price you see trades against last regular close and may not reflect underlying market-open valuation.",
            limitation="Describes current session conditions only. Not a price prediction or advice.",
            evidence=["session", "reference_price"]
        )

    # 3. CAUTION
    if deviation_val.value is not None and abs(deviation_val.value) >= settings.DIVERGENCE_CAUTION_PCT:
        direction = "premium" if deviation_val.value > 0 else "discount"
        return Verdict(
            code="CAUTION",
            tone="warning",
            headline=f"Token price divergence ({deviation_val.display})",
            reason=f"Tokenized {ticker} is trading at a {abs(deviation_val.value):.2f}% {direction} relative to official underlying reference pricing.",
            limitation="Spread and liquidity dynamics may widen outside regular equity order books.",
            evidence=["deviation", "token_price", "reference_price"]
        )

    # 4. QUIET
    if activity_ratio_val.value is not None and activity_ratio_val.value < settings.ACTIVITY_QUIET_RATIO:
        return Verdict(
            code="QUIET",
            tone="neutral",
            headline="Trading activity is quieter than normal",
            reason=f"Observed turnover is {activity_ratio_val.display} of normal session activity. Liquidity may be thin.",
            limitation="Low volume indicates lower market engagement, not guaranteed adverse movement.",
            evidence=["activity_ratio"]
        )

    # 5. REASONABLE
    return Verdict(
        code="REASONABLE",
        tone="positive",
        headline="Market conditions look normal",
        reason=f"Underlying equity session is active, token spread is within normal boundaries ({deviation_val.display}), and turnover is healthy.",
        limitation="Normal conditions do not guarantee favorable execution fills or immune from subsequent catalyst volatility.",
        evidence=["session", "deviation", "activity_ratio"]
    )
