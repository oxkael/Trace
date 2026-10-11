from typing import Optional
from ..schemas import Value

def compute_divergence(
    token_price: float,
    reference_price: float,
    source: str = "trace_divergence_engine"
) -> Value:
    """
    Computes percentage divergence: (token_price - reference_price) / reference_price * 100.
    """
    if reference_price <= 0:
        return Value(
            value=None,
            unit="%",
            display="Unavailable",
            tag="unavailable",
            source=source,
            freshness="unknown",
            reason="Reference price must be positive"
        )

    gap_pct = ((token_price - reference_price) / reference_price) * 100
    display_sign = "+" if gap_pct >= 0 else ""
    display_str = f"{display_sign}{gap_pct:.2f}%"

    return Value(
        value=round(gap_pct, 4),
        unit="%",
        display=display_str,
        tag="estimated",
        source=source,
        freshness="live"
    )
