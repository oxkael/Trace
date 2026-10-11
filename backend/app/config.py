import os
from pydantic import BaseModel
from dotenv import load_dotenv

# Load .env from backend directory
backend_env = os.path.join(os.path.dirname(__file__), "..", ".env")
if os.path.exists(backend_env):
    load_dotenv(backend_env)
load_dotenv()

class Settings(BaseModel):
    # App Settings
    APP_NAME: str = "Trace Engine"
    API_PREFIX: str = "/api"
    ENV: str = os.getenv("ENV", "development")
    MOCK_RESPONSES: bool = os.getenv("MOCK_RESPONSES", "false").lower() == "true"
    ALLOWED_ORIGINS: str = os.getenv("ALLOWED_ORIGINS", "*")
    
    # Orders feature
    ORDERS_AVAILABLE: bool = os.getenv("ORDERS_AVAILABLE", "true").lower() == "true"
    ORDER_MODE: str = os.getenv("ORDER_MODE", "demo")
    ORDERS_ENABLED: bool = os.getenv("ORDERS_ENABLED", "true").lower() == "true"
    MAX_ORDER_USD: float = float(os.getenv("MAX_ORDER_USD", "50.0"))
    CONFIRMATION_TTL_SEC: int = int(os.getenv("CONFIRMATION_TTL_SEC", "120"))
    PREVIEW_STALE_PCT: float = float(os.getenv("PREVIEW_STALE_PCT", "0.5"))

    # Freshness & Evaluation Thresholds (Part D.3)
    FRESH_LIVE_SEC: int = 60
    FRESH_DELAYED_SEC: int = 900
    ANALYST_STALE_DAYS: int = 60
    TIMESTAMP_TOLERANCE_MIN: int = 5
    DIVERGENCE_CAUTION_PCT: float = 1.0
    ACTIVITY_QUIET_RATIO: float = 0.5
    ACTIVITY_RECENT_HOURS: int = 3
    EVENT_BANNER_WINDOW_HOURS: int = 48
    LOOKBACK_N: int = 6
    LOOKBACK_MOVE_THRESHOLD_PCT: float = 5.0
    PRICE_CONFLICT_PCT: float = 0.5
    DATE_CONFLICT_DAYS: int = 1
    ARGUMENT_MIN_SOURCES: int = 3
    OUTLOOK_WINDOW_DAYS: int = 30

    # LLM Settings
    LLM_MODE: str = os.getenv("LLM_MODE", "auto") # "auto" or "template"
    LLM_PROVIDER: str = os.getenv("LLM_PROVIDER", "gemini")
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-flash-latest")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", "")

settings = Settings()
