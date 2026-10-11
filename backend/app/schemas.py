from typing import List, Optional, Literal, Dict, Any, Union
from pydantic import BaseModel, Field

# Origin tags as defined in Part C.2
OriginTag = Literal["observed", "estimated", "historical", "unavailable"]
FreshnessTag = Literal["live", "delayed", "stale", "unknown"]

class Value(BaseModel):
    value: Optional[float] = None
    unit: str = "USD"
    display: str
    tag: OriginTag
    source: str
    as_of: Optional[str] = None
    freshness: FreshnessTag
    age_sec: Optional[int] = None
    reason: Optional[str] = None

class FactItem(BaseModel):
    id: str
    label: str
    value: Value

class Verdict(BaseModel):
    code: Literal["WAIT", "CAUTION", "QUIET", "REASONABLE", "INSUFFICIENT_DATA"]
    tone: Literal["positive", "neutral", "warning", "negative"]
    headline: str
    reason: str
    limitation: str
    evidence: List[str]

class MarketSession(BaseModel):
    state: Literal["pre_market", "regular", "after_hours", "overnight", "closed", "holiday"]
    next_open: Optional[str] = None
    next_open_relative: Optional[str] = None

class MarketReference(BaseModel):
    kind: Literal["live_quote", "last_close"]
    label_text: str

class MarketActivity(BaseModel):
    sample_size: int
    confidence: Literal["low", "medium", "high"]
    bucket: str

class MarketConflict(BaseModel):
    field: str
    primary_source: str
    primary_value: str
    conflict_source: str
    conflict_value: str

class MarketData(BaseModel):
    session: MarketSession
    reference: MarketReference
    activity: MarketActivity
    conflicts: List[MarketConflict] = Field(default_factory=list)

class EventItem(BaseModel):
    id: str
    type: Literal["earnings", "dividend_split", "regulatory", "macro", "company_update"]
    title: str
    event_time: str
    timing: Literal["before_open", "during", "after_close", "unknown"]
    relative: str
    source: str
    source_url: Optional[str] = None
    summary: str

class EventBanner(BaseModel):
    event_id: str
    text: str
    tone: Literal["positive", "neutral", "warning", "negative"]

class EventsData(BaseModel):
    banner: Optional[EventBanner] = None
    upcoming: List[EventItem] = Field(default_factory=list)
    recent: List[EventItem] = Field(default_factory=list)

class LookbackRow(BaseModel):
    event_id: str
    event_title: str
    date: str
    timing: Literal["before_open", "during", "after_close", "unknown"]
    stock_move_pct: float
    token_move_pct: Optional[float] = None
    activity_change_pct: Optional[float] = None
    origin: Literal["historical", "live"]
    notes: Optional[str] = None

class OutlookBasis(BaseModel):
    analyst_updates: int
    articles: int
    window_days: int

class OutlookBrief(BaseModel):
    kind: Literal["interpretation"]
    text: str
    validated: bool
    fallback_used: bool
    basis: OutlookBasis

class OutlookConsensus(BaseModel):
    buy: int
    hold: int
    sell: int
    tag: OriginTag
    source: str
    as_of: str
    freshness: FreshnessTag

class OutlookTargets(BaseModel):
    low: Value
    mean: Value
    high: Value
    current_price: Value
    analyst_count: int
    as_of: str

class ArgumentSource(BaseModel):
    title: str
    source: str
    published_at: str
    url: Optional[str] = None

class ArgumentPoint(BaseModel):
    text: str
    source_count: int
    sources: List[ArgumentSource]

class OutlookArguments(BaseModel):
    supporters: List[ArgumentPoint] = Field(default_factory=list)
    skeptics: List[ArgumentPoint] = Field(default_factory=list)

class ExpectationItem(BaseModel):
    expected: Value
    year_ago: Value
    growth: Optional[Value] = None

class OutlookExpectations(BaseModel):
    event_id: Optional[str] = None
    eps: ExpectationItem
    revenue: ExpectationItem

class AnalystChange(BaseModel):
    date: str
    firm: str
    action: Literal["raised", "lowered", "maintained", "initiated", "upgraded", "downgraded"]
    target_from: Optional[Value] = None
    target_to: Optional[Value] = None
    rating_from: Optional[str] = None
    rating_to: Optional[str] = None
    source: str

class TimelineItem(BaseModel):
    id: str
    kind: Literal["news", "analyst", "company"]
    title: str
    time: str
    relative: str
    source: str
    url: Optional[str] = None

class OutlookAvailability(BaseModel):
    consensus: Literal["ok", "partial", "unavailable"]
    targets: Literal["ok", "partial", "unavailable"]
    arguments: Literal["ok", "partial", "unavailable"]
    expectations: Literal["ok", "partial", "unavailable"]
    recent_changes: Literal["ok", "partial", "unavailable"]
    timeline: Literal["ok", "partial", "unavailable"]

class OutlookData(BaseModel):
    brief: OutlookBrief
    consensus: OutlookConsensus
    targets: OutlookTargets
    arguments: OutlookArguments
    expectations: Optional[OutlookExpectations] = None
    recent_changes: List[AnalystChange] = Field(default_factory=list)
    timeline: List[TimelineItem] = Field(default_factory=list)
    availability: OutlookAvailability

class Explanation(BaseModel):
    kind: Literal["interpretation"]
    text: str
    validated: bool
    fallback_used: bool

class OptionItem(BaseModel):
    id: str
    kind: Literal["confirm_order", "adjust_amount", "ask_followup", "cancel"]
    label: str
    enabled: bool
    disabled_reason: Optional[str] = None
    requires_confirmation: bool
    params: Optional[Dict[str, Any]] = None

class DataStatusSource(BaseModel):
    status: Literal["ok", "partial", "unavailable"]
    detail: Optional[str] = None

class AssessmentRequest(BaseModel):
    ticker: str
    token: str
    side: Literal["buy", "sell", "hold"] = "buy"
    amount_usd: Optional[float] = None
    context: Literal["trade", "check", "research", "holding_check"] = "trade"

class AssessmentResponse(BaseModel):
    type: Literal["assessment"] = "assessment"
    request_id: str
    generated_at: str
    mode: Literal["demo", "live"] = "demo"
    mock: Optional[bool] = False
    request: AssessmentRequest
    verdict: Verdict
    facts: List[FactItem]
    market: MarketData
    events: EventsData
    history: List[LookbackRow]
    outlook: OutlookData
    explanation: Explanation
    options: List[OptionItem]
    data_status: Dict[str, DataStatusSource]

class ProgressStep(BaseModel):
    step: str
    status: Literal["running", "done", "skipped", "failed"]
    label: str
    ms: int

class OrderPreviewCap(BaseModel):
    max_usd: float
    within_cap: bool
    message: Optional[str] = None

class OrderPreviewOrder(BaseModel):
    ticker: str
    token: str
    side: Literal["buy", "sell"] = "buy"
    amount_usd: float

class OrderPreview(BaseModel):
    type: Literal["order_preview"] = "order_preview"
    mode: Literal["demo", "live"] = "demo"
    order: OrderPreviewOrder
    cap: OrderPreviewCap
    changed: bool = False
    change_summary: Optional[str] = None
    confirmation_token: str
    expires_at: str

class OrderResult(BaseModel):
    type: Literal["order_result"] = "order_result"
    status: Literal["placed", "failed", "cancelled"]
    mode: Literal["demo", "live"] = "demo"
    exchange_ref: Optional[str] = None
    message: str
    retryable: bool = False

class ScoreboardTotal(BaseModel):
    verdicts_logged: int
    resolved: int

class ScoreboardVerdictStat(BaseModel):
    code: str
    count: int
    resolved: int
    median_move_24h: Optional[str] = None
    range_24h: Optional[str] = None

class ScoreboardJournal(BaseModel):
    events_recorded_live: int
    events_loaded_historical: int

class ScoreboardData(BaseModel):
    type: Literal["scoreboard"] = "scoreboard"
    totals: ScoreboardTotal
    by_verdict: List[ScoreboardVerdictStat]
    journal: ScoreboardJournal
    note: str
