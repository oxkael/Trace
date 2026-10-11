from datetime import datetime, timezone, timedelta
from typing import Tuple, Optional
from ..schemas import MarketSession

def get_market_session() -> MarketSession:
    """
    Computes official US market session state using America/New_York (UTC-4 / EDT or UTC-5 / EST).
    Regular trading hours: 09:30 - 16:00 ET, Monday to Friday.
    Pre-market: 04:00 - 09:30 ET.
    After-hours: 16:00 - 20:00 ET.
    Overnight / Closed: 20:00 - 04:00 ET or Weekends.
    """
    # America/New_York offset approx UTC-4 during EDT
    now_utc = datetime.now(timezone.utc)
    ny_tz = timezone(timedelta(hours=-4))
    now_ny = now_utc.astimezone(ny_tz)

    weekday = now_ny.weekday() # 0 = Monday, 6 = Sunday
    hour = now_ny.hour
    minute = now_ny.minute
    current_time_minutes = hour * 60 + minute

    pre_market_start = 4 * 60        # 04:00
    regular_open = 9 * 60 + 30       # 09:30
    regular_close = 16 * 60          # 16:00
    after_hours_close = 20 * 60      # 20:00

    # Determine state
    if weekday in (5, 6): # Saturday or Sunday
        state = "closed"
    elif current_time_minutes < pre_market_start:
        state = "overnight"
    elif pre_market_start <= current_time_minutes < regular_open:
        state = "pre_market"
    elif regular_open <= current_time_minutes < regular_close:
        state = "regular"
    elif regular_close <= current_time_minutes < after_hours_close:
        state = "after_hours"
    else:
        state = "closed"

    # Calculate next regular open (Monday 09:30 ET if weekend, or next trading day)
    days_to_add = 0
    if weekday == 4 and current_time_minutes >= regular_close: # Friday after close
        days_to_add = 3
    elif weekday == 5: # Saturday
        days_to_add = 2
    elif weekday == 6: # Sunday
        days_to_add = 1
    elif current_time_minutes >= regular_close:
        days_to_add = 1

    next_open_dt_ny = (now_ny + timedelta(days=days_to_add)).replace(
        hour=9, minute=30, second=0, microsecond=0
    )
    next_open_dt_utc = next_open_dt_ny.astimezone(timezone.utc)
    
    diff = next_open_dt_utc - now_utc
    hours_left = int(diff.total_seconds() // 3600)
    minutes_left = int((diff.total_seconds() % 3600) // 60)

    if hours_left >= 24:
        days = hours_left // 24
        next_open_relative = f"in {days} day{'s' if days > 1 else ''}"
    elif hours_left > 0:
        next_open_relative = f"in {hours_left}h {minutes_left}m"
    else:
        next_open_relative = f"in {minutes_left} minutes"

    return MarketSession(
        state=state,
        next_open=next_open_dt_utc.isoformat().replace("+00:00", "Z"),
        next_open_relative=next_open_relative
    )
