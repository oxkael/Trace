from typing import List, Optional
from ..schemas import SignalItem, MarketSession, Value, EventsData
from ..config import settings

def compute_signals(
    session: MarketSession,
    deviation_val: Value,
    activity_ratio_val: Value,
    events_data: Optional[EventsData] = None,
    data_limited_items: Optional[List[str]] = None
) -> List[SignalItem]:
    signals: List[SignalItem] = []

    # 1. Session & Gap Signals
    if session.state != "regular":
        signals.append(SignalItem(
            id="off_hours",
            text="US markets are closed; the token is trading on its own",
            tone="neutral"
        ))
    else:
        gap_val = abs(deviation_val.value) if deviation_val.value is not None else 0.0
        if gap_val >= settings.DIVERGENCE_CAUTION_PCT:
            gap_str = deviation_val.display if deviation_val.display else f"{gap_val:.1f}%"
            signals.append(SignalItem(
                id="diverging",
                text=f"Token and stock are {gap_str} apart",
                tone="notice"
            ))
        else:
            signals.append(SignalItem(
                id="tracking",
                text="Token and stock are close",
                tone="neutral"
            ))

    # 2. Activity Signals
    act_val = activity_ratio_val.value
    if act_val is not None:
        if act_val < settings.ACTIVITY_QUIET_RATIO:
            signals.append(SignalItem(
                id="activity_low",
                text=f"Trading is at {activity_ratio_val.display} its usual pace",
                tone="neutral"
            ))
        elif act_val > getattr(settings, "ACTIVITY_HIGH_RATIO", 1.5):
            signals.append(SignalItem(
                id="activity_high",
                text=f"Trading is at {activity_ratio_val.display} its usual pace",
                tone="neutral"
            ))

    # 3. Near-term Event Signal (within 48 hours)
    if events_data and events_data.banner:
        # Check upcoming events
        for ev in events_data.upcoming:
            # If banner matches or relative has hours / tomorrow / today
            rel = ev.relative.lower()
            if "hour" in rel or "today" in rel or "tomorrow" in rel or "1 day" in rel or "2 day" in rel:
                signals.append(SignalItem(
                    id="event_soon",
                    text=f"{ev.title} {ev.relative}",
                    tone="notice"
                ))
                break

    # 4. Data Limited Signal
    if data_limited_items:
        for item in data_limited_items:
            signals.append(SignalItem(
                id="data_limited",
                text=f"Couldn't check {item}",
                tone="notice"
            ))

    return signals
