/**
 * Product Spec Part C Data Contract TypeScript definitions
 */

export type ValueTag = 'observed' | 'estimated' | 'historical' | 'unavailable';
export type Freshness = 'live' | 'delayed' | 'stale' | 'unknown';

export interface Value {
  value: number | string | null;
  unit?: string | null;
  display: string;
  tag: ValueTag;
  source: string;
  as_of: string;
  freshness: Freshness;
  age_sec?: number | null;
  reason?: string | null;
}

export type VerdictCode = 'WAIT' | 'CAUTION' | 'QUIET' | 'REASONABLE' | 'INSUFFICIENT_DATA';
export type SemanticTone = 'warning' | 'caution' | 'neutral' | 'positive' | 'info';

export interface Verdict {
  code: VerdictCode;
  tone: SemanticTone;
  headline: string;
  reason: string;
  limitation: string;
  evidence: string[];
}

export type SessionState = 'pre_market' | 'regular' | 'after_hours' | 'overnight' | 'closed' | 'holiday';
export type ReferenceKind = 'live' | 'last_close' | 'delayed';

export interface MarketInfo {
  session: {
    state: SessionState;
    next_open?: string;
    next_open_relative?: string;
  };
  reference: {
    kind: ReferenceKind;
    label_text: string;
  };
  activity: {
    sample_size: number;
    confidence: 'low' | 'medium' | 'high';
    bucket: string;
  };
  conflicts: Array<{
    field: string;
    source_a: string;
    value_a: any;
    source_b: string;
    value_b: any;
  }>;
}

export type EventType = 'earnings' | 'dividend_split' | 'regulatory' | 'macro' | 'company_update';
export type EventTiming = 'before_open' | 'during' | 'after_close' | 'unknown';

export interface EventItem {
  id: string;
  type: EventType;
  title: string;
  event_time: string;
  timing: EventTiming;
  relative: string;
  source: string;
  source_url: string;
  summary: string;
}

export interface LookbackRow {
  event_id: string;
  event_title: string;
  date: string;
  timing: EventTiming;
  stock_move_pct: number;
  token_move_pct: number | null;
  activity_change_pct: number | null;
  origin: 'historical' | 'live';
  flags?: string[];
}

export interface ArgumentSource {
  title: string;
  source: string;
  published_at: string;
  url: string;
}

export interface ArgumentPoint {
  text: string;
  source_count: number;
  sources: ArgumentSource[];
}

export type AnalystAction = 'raised' | 'lowered' | 'maintained' | 'initiated' | 'upgraded' | 'downgraded';

export interface AnalystChange {
  date: string;
  firm: string;
  action: AnalystAction;
  target_from?: Value;
  target_to?: Value;
  rating_from?: string | null;
  rating_to?: string | null;
  source: string;
}

export interface TimelineItem {
  id: string;
  kind: 'news' | 'analyst' | 'company';
  title: string;
  time: string;
  relative: string;
  source: string;
  url: string;
}

export interface OutlookData {
  brief: {
    kind: 'interpretation';
    text: string;
    validated: boolean;
    fallback_used: boolean;
    basis: {
      analyst_updates: number;
      articles: number;
      window_days: number;
    };
  };
  consensus: {
    buy: number;
    hold: number;
    sell: number;
    tag: ValueTag;
    source: string;
    as_of: string;
    freshness: Freshness;
  };
  targets: {
    low: Value;
    mean: Value;
    high: Value;
    current_price: Value;
    analyst_count: number;
    as_of: string;
  };
  arguments: {
    supporters: ArgumentPoint[];
    skeptics: ArgumentPoint[];
  };
  expectations?: {
    event_id: string;
    eps: {
      expected: Value;
      year_ago: Value;
    };
    revenue: {
      expected: Value;
      year_ago: Value;
      growth: Value;
    };
  };
  recent_changes: AnalystChange[];
  estimate_conflicts?: Array<{
    metric: string;
    range: { low: Value; high: Value };
    sources: string[];
  }>;
  timeline: TimelineItem[];
  availability: Record<string, 'ok' | 'partial' | 'unavailable'>;
}

export type OptionKind = 'confirm_order' | 'adjust_amount' | 'ask_followup' | 'cancel';

export interface OptionItem {
  id: string;
  kind: OptionKind;
  label: string;
  enabled: boolean;
  disabled_reason?: string | null;
  requires_confirmation: boolean;
  params: Record<string, any>;
}

export interface AssessmentResponse {
  type: 'assessment';
  request_id: string;
  generated_at: string;
  mode: 'demo' | 'live';
  mock?: boolean;
  request: {
    ticker: string;
    token: string;
    side: 'buy' | 'sell' | 'hold';
    amount_usd?: number;
    context?: string;
  };
  verdict: Verdict;
  facts: Array<{
    id: string;
    label: string;
    value: Value;
  }>;
  market: MarketInfo;
  events: {
    banner?: {
      event_id: string;
      text: string;
      tone: SemanticTone;
    };
    upcoming: EventItem[];
    recent: EventItem[];
  };
  history: LookbackRow[];
  outlook: OutlookData;
  explanation: {
    kind: 'interpretation';
    text: string;
    validated: boolean;
    fallback_used: boolean;
  };
  options: OptionItem[];
  data_status: Record<string, {
    status: 'ok' | 'partial' | 'down';
    detail: string | null;
  }>;
}

export interface ProgressStep {
  step: string;
  status: 'running' | 'done' | 'skipped' | 'failed';
  label: string;
  ms?: number;
}

export interface ScoreboardData {
  type: 'scoreboard';
  totals: {
    verdicts_logged: number;
    resolved: number;
  };
  by_verdict: Array<{
    code: VerdictCode;
    count: number;
    resolved: number;
    median_move_24h?: string;
    range_24h?: string;
  }>;
  journal: {
    events_recorded_live: number;
    events_loaded_historical: number;
  };
  note: string;
}

export interface OrderPreview {
  type: 'order_preview';
  mode: 'demo' | 'live';
  order: {
    ticker: string;
    token: string;
    side: 'buy' | 'sell';
    amount_usd: number;
  };
  cap: {
    max_usd: number;
    within_cap: boolean;
    message?: string | null;
  };
  changed: boolean;
  change_summary?: string | null;
  confirmation_token: string;
  expires_at: string;
}

export interface OrderResult {
  type: 'order_result';
  status: 'placed' | 'failed';
  mode: 'demo' | 'live';
  exchange_ref?: string;
  message: string;
  retryable: boolean;
}
