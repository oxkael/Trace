from typing import List, Dict, Any, Optional
from ..schemas import Value, MarketActivity

def compute_activity_ratio(
    recent_turnover: float,
    typical_turnover: float,
    sample_size: int = 84,
    source: str = "bitget_candles_activity"
) -> (Value, MarketActivity):
    """
    Computes recent token turnover compared with typical turnover for the same session type.
    ratio = recent / typical (tag: estimated).
    """
    if typical_turnover <= 0:
        val = Value(
            value=None,
            unit="x",
            display="Unavailable",
            tag="unavailable",
            source=source,
            freshness="unknown",
            reason="Typical turnover baseline empty"
        )
        activity = MarketActivity(sample_size=0, confidence="low", bucket="unknown")
        return val, activity

    ratio = recent_turnover / typical_turnover
    confidence = "high" if sample_size >= 200 else ("medium" if sample_size >= 50 else "low")

    val = Value(
        value=round(ratio, 2),
        unit="x",
        display=f"{ratio:.2f}x",
        tag="estimated",
        source=source,
        freshness="live"
    )

    activity = MarketActivity(
        sample_size=sample_size,
        confidence=confidence,
        bucket="session_median"
    )

    return val, activity
