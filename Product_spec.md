PRODUCT_SPEC.md
Event-aware trading assistant for tokenized US stocks (Bitget)
One consolidated document for the coding agent. It contains the working rules, the product, the frontend data contract, the backend design, and the data sources. Frontend visual design is not included; Part C defines everything a frontend needs to wire to the backend.
How to use this document
Read Part A first. It is short and sets priorities.
Part C is the shared agreement between backend and frontend. Build the backend to produce those shapes exactly.
Nothing here has been tested against real data yet. Part E turns every "reported" claim into pass or fail. Build on what passes, and adapt the product to what is real.
Wording like default, should and avoid means a strong suggestion. Deviate when real data or a better design justifies it, and record why in docs/decisions.md. Only the four firm lines in A.2 are non-negotiable.
Contents
Part A: Agent rules, phases, repo layout, done checklist
Part B: Product (problem, user, capabilities, behavior)
Part C: Data contract (what the frontend receives)
Part D: Backend design
Part E: Data sources and Phase 0 verification
Suggested split, if you want separate files later
File
Parts
AGENT_RULES.md
Part A
PRODUCT.md
Parts B and C
BACKEND.md
Part D
DATA_SOURCES.md
Part E
No invented market data, news or events. If something is unavailable, show it as unavailable.
No order is placed without an explicit user action.
A stale reference price is never shown as live. Outside regular hours it is a last close, and the label says so.
Nothing is presented as a prediction or investment advice. Describe conditions and history only.
A.3 Strong defaults (deviate with a reason)
Openly accessible data only. If an endpoint returns a permission or access error, drop that feature and note it. Do not look for workarounds. Order-book style data (depth, fills, bid/ask) is not used.
Verify before building. Test each data source with real calls (Phase 0) before building features on top of it. Do not implement an integration that has not been verified.
Tag every number with its origin (observed, estimated, historical, unavailable) and its freshness (C.2).
The language model parses and phrases. It does not invent. Numbers and facts come from the data layer. If no model is available, the app runs in template mode (D.8).
Demo mode and small amounts by default. Orders are optional, capped and need confirmation.
Secrets stay out of the repo. Use .env, commit .env.example. Never send secrets or wallet details to a model.
Check rather than guess. Where real responses differ from documentation, trust the response.
A.4 How to work
Small steps. Say what you're about to do, then do it. Commit after each working step.
Prefer simple and readable over clever.
Save sanitized real API responses to docs/samples/ and use them as test fixtures.
Log surprises (rate limits, odd fields, doc mistakes) in docs/decisions.md.
When something is unclear, write the question in docs/open-questions.md, pick the safest option, and keep going. Ask the user only when it blocks progress.
If this document seems wrong, say so and propose a change. When behavior changes, update the document so it never disagrees with the code.
Phase
Goal
Output
0
Verify data sources with scripts/phase0.py
Results recorded in Part E (E.8), samples in docs/samples/
1
Clients and core logic: session, freshness, divergence, activity
Unit tests on saved real samples
2
Events and look-back (earnings and corporate actions first)
Look-back works for one stock
3
Verdict engine and facts object
Command-line run of a real question end to end
4
Interpreter and language layer, including template mode
Varied questions parse correctly; validator tested
5
API, streaming and mock mode matching Part C
Frontend can be wired
6
Outlook (analysts, news, arguments, timeline), learning jobs
Outlook fills what the data allows
7
Optional: order preview and confirmation (demo mode)
Only if order checks pass
8
README, demo script, final checks
Ready to submit
A.6 Repo layout
/backend/app
  config.py              # thresholds and env (D.3)
  schemas.py             # models mirroring Part C
  /clients               # one module per data source
  /core                  # session, freshness, divergence, activity, events, outlook, facts, verdict, pipeline
  /llm                   # client, interpret, phrase, extract, classify, validate, templates
  /learning              # journal, ledger, jobs
  /orders                # service (optional feature)
  /api                   # routes and streaming
  /db                    # schema and access
/backend/tests
/scripts/phase0.py       # runs every Phase 0 check, saves samples, prints pass/fail
/data
  tickers.json           # supported tickers (filled in Phase 0)
  macro_events.json      # only if no macro source works; labeled manual
  banned_phrases.txt
/docs
  decisions.md
  open-questions.md
  samples/               # sanitized real responses; samples/mock/ for UI wiring
/frontend
[ ] Phase 0 results are recorded; every source in use has a pass.
[ ] Every number shown traces to a source or a documented calculation, with origin and freshness.
[ ] No hardcoded market data, news or events outside clearly labeled fixtures.
[ ] The four firm lines hold (check each explicitly).
[ ] At least five different kinds of question (trade check, research, event, analysts, activity) work end to end on real data.
[ ] Look-back shows real past events with sources, dates, timing and sample size.
[ ] Outlook parts with no data are omitted from display and flagged in availability.
[ ] Each source failing alone still produces a valid response.
[ ] The app runs in template mode with no model configured.
[ ] If orders are included: confirmation required, cap enforced, demo mode works. If not verified, the product ships research-only.
[ ] Every API response validates against schemas.py.
[ ] .env.example exists, no secrets committed, README explains setup and limits.
PART B: PRODUCT
B.1 Summary
Pitch: Ask about a tokenized stock in plain words. It reads the news, analyst views and upcoming events, explains them simply, shows what happened the last times something similar came up, and you decide.
Hackathon fit: Bitget AI Base Camp Hackathon S2, AI Trading Desk track (AI assists, human decides).
B.2 The problem
Tokenized stocks trade around the clock, but the real stock market does not. Users can't easily tell:
Is this price meaningful? Outside US hours the token may trade against a stale reference.
Is the market busy or quiet right now compared with normal?
What is coming, what are experts saying, and what happened last time? The information is scattered across many platforms and written for professionals.
B.3 Target user
Stated as targets, not measured facts: retail traders of tokenized US stocks with moderate risk appetite, typical trades of roughly $500 to $5,000, often trading outside US hours and outside the US, without a professional research setup. They want a calm, plain-language read before committing money, and many will ask research questions without any intention to trade.
B.4 Core concepts
Concept
Meaning
Token / rToken
Bitget's tokenized version of a US stock, e.g. rNVDA
Underlying
The real stock, e.g. NVDA
Session
pre_market, regular, after_hours, overnight, closed, holiday
Reference price
The underlying's latest price. Outside regular hours it may be the last regular-session close and must be labeled last_close
Activity ratio
Recent token turnover compared with typical turnover for the same session type (a proxy for how busy the market is, not liquidity)
Event
Something scheduled or reported that can move a stock: earnings, dividend/split, regulatory, macro, company update
Look-back
What the stock (and token where data exists) did around the last N similar events
Verdict
One short label for current conditions, with evidence
Origin tag
observed, estimated, historical, unavailable
Freshness
live, delayed, stale, unknown (C.2, D.5.1)
Interpretation
Model-written explanation grounded in facts. Always labeled as such
Intent
Examples
Result
trade
"Can I buy $1,500 of rAMD right now?"
assessment, with order options if available
check
"Is now a good time to buy Tesla?"
assessment
research
"What's going on with rTSLA?" / "What should I know before trading rNVDA?"
assessment (no order options)
event_question
"When does Apple report, and how did it move last time?"
event_answer
outlook_question
"What are analysts split on for Microsoft?"
outlook_answer
activity_question
"Is rNVDA always this quiet at night?"
activity_answer
holding_check
"I'm holding rAMZN over the weekend. What should I watch?"
assessment with side hold, focused on events and activity
compare
"Compare rNVDA and rAMD before earnings"
comparison (optional, later)
scoreboard
"How accurate have your warnings been?"
scoreboard
unsupported
"Will NVDA go up?"
refusal: explains it checks conditions and history only
other
greetings, off-topic
info
Rules: echo the parsed request (the UI may auto-continue); ask one short question when something essential is missing; unsupported tickers get a clear message listing supported ones. Nothing is stored about the user's holdings. A holding is only what the user states in the question.
Type
What the user sees
earnings
Date and timing, what analysts expect, latest result if recent
dividend_split
Dates and terms
regulatory
Pending or recent approvals and rulings, with source
macro
Rate decisions and economic releases that matter to the stock
company_update
Management changes, guidance, announcements
Each item has a title, time (absolute and relative), source and link, and a short summary written from the source text. Avoid stating causes. An event banner accompanies any verdict when an event is within a set window (default 48 hours).
F4b. Outlook (analysts, news and events in one place)
Purpose: the user shouldn't need several platforms. Parts, in display order:
Brief: where views lean, the main disagreement, and what it is based on (counts, window).
Consensus: buy / hold / sell counts.
Targets vs today: low, mean, high published targets set against the latest price, with analyst count.
Arguments: main points from supporters and skeptics, each with source count and links.
Expectations: next earnings estimates compared with prior periods.
Recent analyst changes: date, firm (only if the source gives it), action, old and new target or rating.
Timeline: news, analyst actions and company events merged in time order, filterable by kind.
Guidelines: everything is attributed ("analysts expect", "8 sources say"); the product doesn't pick a side; brief and arguments are written from fetched source text and figures must match the facts; arguments are hidden by default if fewer than 3 sources support them; firm names appear only if the source returns them; avoid cause claims; conflicting estimates are shown as a range with source labels, never silently averaged; any part without data is omitted from display and listed in outlook.availability.
Shows what happened around the last N similar events (default 6) so the user decides with context. Per event: stock move, token move where the token existed, activity change where candles exist, the timing of the event (before open, during, after close), and whether the row is historical (loaded) or live (recorded by this app). Summary: range, count above a threshold, sample size, and the fixed note "Past outcomes only. Not a forecast." Measurement rules are in D.5.6.
F6. Verdict
One short label for current conditions, always with evidence and a limitation line. First match wins:
Code
Condition
Meaning
INSUFFICIENT_DATA
Session status or token price unavailable
Cannot assess; shows what is missing
WAIT
Underlying market closed and reference is a last close
The price shown may not reflect the real stock
CAUTION
Token and underlying differ beyond a threshold, both fresh
Token is behaving differently from the stock
QUIET
Activity ratio below threshold
Fewer people are trading than usual
REASONABLE
None of the above
Conditions look normal; no guarantee of a good fill
Verdicts describe conditions, not advice. Verdict text comes from deterministic templates, never the model. The verdict applies to trade, check, research and holding_check assessments.
F7. Options and actions
After a result, the user may be offered:
Option kind
Meaning
Needs confirmation
confirm_order
Place an order after a confirmation step. Only present if orders are available (see D.10)
Yes, always
adjust_amount
Re-run with a different amount
No
ask_followup
Open a suggested question (e.g. "What happened last time?")
No
cancel
Dismiss
No
If the amount is above the cap or orders are disabled, confirm_order is shown with enabled: false and a plain disabled_reason. If orders are not part of this build, the option is omitted and the product is research-only.
F8. Learning (memory that grows)
Event journal: when a tracked event passes, the app measures and records what happened (origin: live), kept separate from loaded historical rows.
Verdict ledger: each verdict is logged with its facts; later the price after 1 hour and 24 hours is recorded. A plain scoreboard shows counts and ranges with sample size.
Thresholds may be recalculated from stored history with simple statistics. Document each.
Allowed claim: "records outcomes and compares them." Avoid "improves over time" or accuracy claims without data.
A short explanation written from the facts object only, always labeled kind: "interpretation". Dollars and everyday terms first, raw percentages in the detail. Validation and fallback rules are in D.8.
B.6 Supported scope (initial)
Start with 2 or 3 tokens that pass Phase 0 (NVDA first). Buy-side orders only, if orders are included at all. English only. Modes: demo (default) and live with small capped amounts. No alerts, no notifications, no stored user holdings.
B.7 Failure and edge behavior
Situation
Behavior
A source is down or errors
Show unavailable for affected facts and keep the rest. Verdict becomes INSUFFICIENT_DATA only if session status or token price is missing
Primary source fails, fallback works
Use the fallback, tag its source id, set data_status to partial
Two sources disagree
Show both with a conflict flag (D.5.2)
Token history shorter than needed
Show with a low-confidence note and sample size
Fewer than N past events
Show what exists and state the count
Weekend or holiday
Treated as closed; show next open
Stale or mismatched timestamps
Skip the deviation and show why
Amount missing, zero or above cap
Ask, or explain the cap
Unsupported ticker
Say so and list supported ones
Ask for prediction or advice
refusal explaining what the assistant does
Model output fails validation
Use template text and flag fallback_used
No model available
Template mode (D.8.5)
Order placement fails
Show the exact failure; no silent retries
Conditions changed since the card
Re-check before placing and show the change
PART C: DATA CONTRACT (FRONTEND)
Names are stable. If a shape must change, update this part first.
C.1 General rules
Timestamps are ISO 8601 UTC. The server also supplies a relative string where useful.
No pre-formatted HTML. Plain text plus structured fields.
Every response includes request_id, generated_at, mode (demo or live).
Missing data is shown explicitly as a Value with tag: "unavailable" and a reason.
Color and styling belong to the frontend. The API supplies a semantic tone only.
Sample responses carry "mock": true. The frontend should show a visible "sample data" badge.
JSON uses snake_case.
C.2 Value object (used wherever a number appears)
{
  "value": 188.4,
  "unit": "USD",
  "display": "$188.40",
  "tag": "observed",
  "source": "bitget_reality_ticker",
  "as_of": "2026-10-09T14:32:05Z",
  "freshness": "live",
  "age_sec": 12,
  "reason": null
}
{
  "type": "assessment",
  "request_id": "r_123",
  "generated_at": "2026-10-09T14:32:10Z",
  "mode": "demo",
  "request": { "ticker": "NVDA", "token": "rNVDA", "side": "buy", "amount_usd": 500, "context": "trade" },

  "verdict": {
    "code": "WAIT", "tone": "warning",
    "headline": "The real stock market is closed",
    "reason": "The price you see may not reflect where NVIDIA would trade right now.",
    "limitation": "Describes current conditions only. Not a prediction.",
    "evidence": ["session", "reference_price"]
  },

  "facts": [
    { "id": "session", "label": "US market", "value": { } },
    { "id": "token_price", "label": "rNVDA price", "value": { } },
    { "id": "reference_price", "label": "NVDA last close", "value": { } },
    { "id": "deviation", "label": "Gap vs last close", "value": { } },
    { "id": "activity_ratio", "label": "Trading activity vs normal", "value": { } }
  ],

  "market": {
    "session": { "state": "closed", "next_open": "2026-10-12T13:30:00Z", "next_open_relative": "in 2 days" },
    "reference": { "kind": "last_close", "label_text": "Last regular-session close" },
    "activity": { "sample_size": 84, "confidence": "low", "bucket": "weekend" },
    "conflicts": []
  },

  "events": {
    "banner": { "event_id": "e_9", "text": "NVDA reports earnings in 18 hours", "tone": "warning" },
    "upcoming": [ { "id": "e_9", "type": "earnings", "title": "...", "event_time": "...", "timing": "after_close", "relative": "in 18 hours", "source": "...", "source_url": "...", "summary": "..." } ],
    "recent": []
  },

  "history": [ ],
  "outlook": { },

  "explanation": { "kind": "interpretation", "text": "...", "validated": true, "fallback_used": false },
  "options": [ ],

  "data_status": {
    "bitget_reality": { "status": "ok", "detail": null },
    "bitget_stock_mcp": { "status": "partial", "detail": "analyst targets unavailable" }
  }
}
{
  "brief": { "kind": "interpretation", "text": "...", "validated": true, "fallback_used": false,
             "basis": { "analyst_updates": 14, "articles": 9, "window_days": 30 } },
  "consensus": { "buy": 10, "hold": 3, "sell": 1, "tag": "observed", "source": "...", "as_of": "...", "freshness": "stale" },
  "targets": { "low": { }, "mean": { }, "high": { }, "current_price": { }, "analyst_count": 14, "as_of": "..." },
  "arguments": {
    "supporters": [ { "text": "...", "source_count": 8, "sources": [ { "title": "...", "source": "...", "published_at": "...", "url": "..." } ] } ],
    "skeptics": [ ]
  },
  "expectations": { "event_id": "e_9", "eps": { "expected": { }, "year_ago": { } }, "revenue": { "expected": { }, "year_ago": { }, "growth": { } } },
  "recent_changes": [ { "date": "...", "firm": "Firm A", "action": "raised", "target_from": { }, "target_to": { }, "rating_from": null, "rating_to": null, "source": "..." } ],
  "estimate_conflicts": [ { "metric": "eps", "range": { "low": { }, "high": { } }, "sources": ["...", "..."] } ],
  "timeline": [ { "id": "t_1", "kind": "news", "title": "...", "time": "...", "relative": "...", "source": "...", "url": "..." } ],
  "availability": { "consensus": "ok", "targets": "ok", "arguments": "unavailable", "expectations": "ok", "recent_changes": "partial", "timeline": "ok" }
}
timeline[].kind: news | analyst | company.
recent_changes[].action: raised | lowered | maintained | initiated | upgraded | downgraded.
availability.*: ok | partial | unavailable. The frontend hides a part whose value is unavailable.
Every claim shown to the user has a source and a publication time.
C.8 Other answers
event_answer: { type, ticker, event_type, upcoming, history, outlook, explanation, options, data_status }
outlook_answer: { type, ticker, outlook, explanation, options, data_status }
activity_answer: { type, ticker, profile: [{ bucket, typical_turnover, sample_size, confidence }], now: { bucket, ratio }, explanation, options }
comparison (optional): { type, tickers: [...], rows: [{ id, label, values: { NVDA: Value, AMD: Value } }], explanation, options }
scoreboard: { type, totals: { verdicts_logged, resolved }, by_verdict: [{ code, count, resolved }, by_verdict: [{ code, count, resolved, median_move_24h, range_24h }], journal: { events_recorded_live, events_loaded_historical }, note }
C.9 Options
{ "id": "opt_1", "kind": "confirm_order", "label": "Buy $500", "enabled": true, "disabled_reason": null,
  "requires_confirmation": true, "params": { "ticker": "NVDA", "side": "buy", "amount_usd": 500 } }
Kinds: confirm_order, adjust_amount, ask_followup (params.message), cancel.
C.10 Streaming progress
The backend streams real progress (Server-Sent Events) so the UI can show steps as they complete:
{ "step": "session_checked", "status": "done", "label": "Checked market session", "ms": 220 }
Steps in order: parsed, session_checked, token_loaded, underlying_loaded, activity_computed, events_loaded, history_loaded, verdict_ready, explanation_ready, done. status: running | done | skipped | failed. A failed step doesn't stop the stream. The final event carries the full typed message.
C.11 Actions (frontend to backend)
{ "action_id": "opt_1", "request_id": "r_123", "confirm": false, "confirmation_token": null, "params": {} }
For confirm_order, step 1 returns an order_preview; step 2 (with the token and confirm: true) returns an order_result.
{ "type": "order_preview", "mode": "demo",
  "order": { "ticker": "NVDA", "token": "rNVDA", "side": "buy", "amount_usd": 50 },
  "cap": { "max_usd": 50, "within_cap": true, "message": null },
  "changed": false, "change_summary": null,
  "confirmation_token": "ct_...", "expires_at": "..." }
{ "type": "order_result", "status": "placed", "mode": "demo", "exchange_ref": "...", "message": "...", "retryable": false }
C.12 Errors
{ "type": "error", "code": "SOURCE_UNAVAILABLE", "message": "Could not reach the stock data service.", "retryable": true, "partial": { } }
Codes: SOURCE_UNAVAILABLE, UNSUPPORTED_TICKER, INVALID_REQUEST, CAP_EXCEEDED, ORDERS_DISABLED, RATE_LIMITED, INTERNAL. Partial data is not an error: return 200 with data_status and unavailable values.
PART D: BACKEND
D.1 Stack (suggested)
Python 3.11+, FastAPI, Pydantic models mirroring Part C, SQLite, APScheduler (or a simple loop), httpx, and a language model used only for narrow tasks (D.8). Change anything with a reason and note it in docs/decisions.md.
D.2 Layers
Clients fetch, core interprets, llm phrases, api serves. Do not mix interpretation into clients or business logic into routes. This keeps each piece testable with saved samples.
core/ session.py  freshness.py  divergence.py  activity.py  events.py  outlook.py  facts.py  verdict.py  pipeline.py
llm/  client.py  interpret.py  phrase.py  extract.py  classify.py  validate.py  templates.py
learning/ journal.py  ledger.py  jobs.py
orders/ service.py        # optional feature
D.3 Config
Environment
Variable
Default
Purpose
ORDERS_AVAILABLE
false until verified
Whether the order feature exists at all
ORDER_MODE
demo
demo or live
ORDERS_ENABLED
true
Kill switch
MAX_ORDER_USD
50
Hard cap
MOCK_RESPONSES
false
Serve fixtures from docs/samples/mock/ with "mock": true
API_KEY
none
If set, requests need X-API-Key
ALLOWED_ORIGINS
* (dev)
CORS
LLM_MODE
auto
auto or template (no model)
LLM_PROVIDER, LLM_MODEL, LLM_API_KEY
none
Primary model
LLM_FALLBACKS
none
Ordered backup providers/models
Source keys
none
One per source (Part E)
Thresholds (starting values, tune after seeing data)
Name
Default
Used by
FRESH_LIVE_SEC
60
Freshness: live if data age is within this
FRESH_DELAYED_SEC
900
Freshness: delayed up to this, then stale
ANALYST_STALE_DAYS
60
Analyst data older than this is stale
TIMESTAMP_TOLERANCE_MIN
5
Max gap between token and stock timestamps
DIVERGENCE_CAUTION_PCT
1.0
CAUTION
ACTIVITY_QUIET_RATIO
0.5
QUIET
ACTIVITY_RECENT_HOURS
3
Recent-activity window
MIN_SAMPLES_MEDIUM / MIN_SAMPLES_HIGH
50 / 200
Confidence
EVENT_BANNER_WINDOW_HOURS
48
Banner
LOOKBACK_N
6
Past events reviewed
LOOKBACK_MOVE_THRESHOLD_PCT
5
Count of "large" moves
MIN_CANDLE_COVERAGE
0.8
Share of expected candles needed in a window
PRICE_CONFLICT_PCT
0.5
Two sources' prices count as conflicting beyond this
DATE_CONFLICT_DAYS
1
Two sources' event dates conflict beyond this
ARGUMENT_MIN_SOURCES
3
Min sources before showing an argument
OUTLOOK_WINDOW_DAYS
30
Outlook window
CONFIRMATION_TTL_SEC
120
Order confirmation lifetime
PREVIEW_STALE_PCT
0.5
Price change that sets changed: true
D.4 The facts object
Internal data passed through the pipeline. It is the only input the language layer sees, besides source text for the Outlook.
Facts = {
  "request": {...},
  "facts": [ {"id": "token_price", "label": "...", "value": Value} ],
  "market": {...}, "events": {...}, "history": [...], "outlook": {...},
  "data_status": {source_id: {"status": "...", "detail": "..."}}
}
facts.py is the one place that turns raw data into Value objects and assigns tag, source and freshness. Unavailable data becomes a Value with tag: "unavailable", not a dropped field.
D.5 Core logic
D.5.1 Freshness (freshness.py)
Freshness comes from the data's own timestamp (as_of), not the fetch time. A fresh fetch of old data is still old.
Quotes and token prices: live if age ≤ FRESH_LIVE_SEC, delayed if ≤ FRESH_DELAYED_SEC, otherwise stale. No timestamp means unknown.
Outside regular hours, a stock price is a last close. Mark reference.kind = "last_close", never live, even if the fetch just happened.
Candles: fresh if the latest candle is within two intervals of now.
Analyst data: stale if older than ANALYST_STALE_DAYS.
News: always show the publication time; flag items older than the Outlook window as background.
A response that has any stale input used in a verdict adds a note to verdict.limitation.
D.5.2 Provider fallback and conflicts
Try the primary source. On timeout or error, try the fallback in DATA_SOURCES order and tag the source id that served the data. Set that source's data_status to partial.
On an access error (permission denied), drop the feature. Do not hunt for a way around it.
If two sources both return the same field and disagree (prices beyond PRICE_CONFLICT_PCT, event dates beyond DATE_CONFLICT_DAYS), keep the primary value, add an entry to market.conflicts, and show both with their sources. Do not hide the disagreement.
Analyst estimates that differ are shown as a range with source labels (estimate_conflicts). Never average silently.
Facts, estimates and interpretations stay separate: tag marks observed vs estimated vs historical; model prose is labeled kind: "interpretation" and grounded in listed facts.
D.5.3 Session (session.py)
Session endpoint is the source of truth: state, next_open, next_open_relative. Fallback: an exchange-calendar library using America/New_York, tagged estimated, with data_status set to partial. Weekends and holidays are closed. All internal times are UTC; market logic converts to New York time.
D.5.4 Divergence (divergence.py)
deviation_pct = (token_price - reference_price) / reference_price * 100. Compute only if both timestamps are within TIMESTAMP_TOLERANCE_MIN, or the reference is a last close and labeled so. If a timestamp cannot be established, skip it and say why.
D.5.5 Activity (activity.py)
Group historical hourly turnover by (session type, is_weekend). recent = turnover over the last ACTIVITY_RECENT_HOURS; typical = median of same-length windows in that bucket; ratio = recent / typical (tag estimated). Confidence comes from sample count. Skip periods where turnover is empty. Don't describe it as depth or liquidity.
D.5.6 Events and look-back (events.py)
Collection: normalize to {id, type, title, event_time, timing, source, source_url, summary}. Types: earnings, dividend_split, regulatory, macro, company_update. Scheduled sources give the type directly; headlines are classified into one type by llm/classify.py (default company_update) with the headline text stored untouched.
Timing: before_open, during, after_close or unknown, from the source or from the event time converted to New York time.
Measurement window for each past event of the same type (last LOOKBACK_N):
Timing
before
after
after_close
close on the event day
close on the next trading day
before_open
close on the previous trading day
close on the event day
during
close on the previous trading day
close on the event day
unknown
close on the previous trading day
close on the event day (flag timing_unknown)
stock_move = (after - before) / before * 100. Use the trading calendar so holidays and weekends shift to the next trading day.
Token vs stock: report them separately. token_move exists only for events where the token had candles; otherwise it is unavailable. Activity change is turnover in the 24 hours after vs typical for that bucket.
Data problems:
If candle coverage in a window is below MIN_CANDLE_COVERAGE, mark token metrics unavailable and flag thin_candles.
If sources disagree on the event date by more than DATE_CONFLICT_DAYS, flag date_conflict, list the row, and exclude it from summary statistics (excluded counts these).
Halts and missing sessions: skip the affected measurement and flag it.
Summary: low and high stock move, count above LOOKBACK_MOVE_THRESHOLD_PCT, sample size, fixed note. Rows are historical (loaded) or live (recorded by the app).
D.5.7 Verdict (verdict.py)
Rules in B.5 F6, evaluated in order. headline, reason and limitation come from templates in templates.py. evidence lists the fact ids that triggered it. The options builder adds confirm_order only if ORDERS_AVAILABLE, marking it enabled: false with a disabled_reason when the amount exceeds MAX_ORDER_USD or ORDERS_ENABLED is false (and then also offers adjust_amount).
D.5.8 Outlook (outlook.py)
Builds each part independently (C.7) from the sources in Part E. Arguments use llm/extract.py. Parts without data are set unavailable in availability.
D.6 Pipeline
pipeline.py runs the steps in C.10 in order, emitting a progress event for each. Independent fetches (token, stock, events, news) run in parallel. A failed step marks status: "failed" and the run continues with unavailable values. Each step records its duration.
D.7 Database (SQLite)
requests      (id TEXT PRIMARY KEY, session_id TEXT, ts TEXT, parsed_json TEXT, payload_json TEXT);
sessions      (session_id TEXT PRIMARY KEY, context_json TEXT, updated_at TEXT);   -- short conversation memory
events        (id TEXT PRIMARY KEY, ticker TEXT, type TEXT, event_time TEXT, timing TEXT, title TEXT,
               source TEXT, source_url TEXT, summary TEXT, origin TEXT, outcome_json TEXT, recorded_at TEXT);
verdicts      (id INTEGER PRIMARY KEY, ts TEXT, ticker TEXT, code TEXT, facts_json TEXT,
               price_at REAL, price_after_1h REAL, price_after_24h REAL, resolved_at TEXT);
source_cache  (key TEXT PRIMARY KEY, value_json TEXT, fetched_at TEXT, ttl_sec INTEGER);
-- only if orders are included:
orders        (id INTEGER PRIMARY KEY, ts TEXT, ticker TEXT, side TEXT, usd REAL, mode TEXT, status TEXT,
               exchange_ref TEXT, confirmation_token TEXT UNIQUE);
confirmations (token TEXT PRIMARY KEY, request_id TEXT, order_json TEXT, created_at TEXT, expires_at TEXT, used INTEGER DEFAULT 0);
D.8 Language layer
D.8.1 Model client (llm/client.py)
One interface: complete_json(schema, prompt) and complete_text(prompt). Providers sit behind it (a free-tier provider, an aggregator, or the hackathon's Qwen credits, whichever you can call reliably). Behavior:
Try the primary, then each fallback in LLM_FALLBACKS, then template mode.
Use the provider's structured-output mode if it has one. Free tiers may not support it, so test early. Otherwise ask for JSON in the prompt, parse, validate against the schema, and retry once.
Timeouts and per-provider rate-limit handling. Log which provider served each call.
Send only the user's question and public market data. Never send secrets or wallet details.
D.8.2 Interpreter (llm/interpret.py)
Understands what the user asked, in four stages:
Pre-pass (rules): extract amounts ("$2k", "2,000", "two thousand"), side words (buy, sell, hold, "holding"), supported tickers and company names from tickers.json, and cue words for events, analysts, activity and compare.
Model (structured output): only if stage 1 is incomplete or ambiguous. Output schema: {intent, tickers[], side, amount_usd, event_type, timeframe, focus, needs_clarification, clarification_question}.
Entity resolver: maps "Nvidia", "NVDA", "rNVDA" to one supported token; unknown names return UNSUPPORTED_TICKER with the supported list.
Conversation context: sessions stores the last few turns, ticker and intent. Follow-ups like "what about Tesla?" or "and the time before that?" inherit missing fields.
If it still can't resolve, return a clarification with one short question and 2 or 3 example prompts.
D.8.3 Phrase (llm/phrase.py)
Input is the facts object (and structured outlook data). Output: explanation.text and outlook.brief.text. Rules in the prompt: use only supplied facts, attribute views, keep it short and plain, dollars and everyday words before raw percentages, no predictions, advice or causes.
D.8.4 Extract and classify
Extract (extract.py): the model gets articles with ids and returns supporter and skeptic points with the article ids that back each point. Code verifies ids, builds sources, and computes source_count. Points under ARGUMENT_MIN_SOURCES are dropped. No usable article text means arguments is unavailable.
Classify (classify.py): label a headline with one fixed event type; on any failure return company_update.
D.8.5 Validate and template mode
Validator: every number, percentage and dollar figure in model text must exist in the allowed set (facts, counts, and figures present in the source snippets given for that text). Text containing phrases from data/banned_phrases.txt (predictions, advice, causal claims about price moves) is rejected. On rejection retry once; if it fails again use the template and set fallback_used: true. validated must be truthful.
Template mode (no model configured, or all providers failing): the interpreter uses stages 1, 3 and 4 only; verdicts and explanations come from templates filled with real data; Outlook brief and arguments are unavailable while consensus, targets and timeline still show. State this honestly wherever the role of the language model is described.
D.9 API
Base path /api. HTTP 4xx/5xx carry { "type": "error" }; partial data returns 200.
Method
Path
Returns
POST
/api/chat
Stream or JSON (D.9.1)
POST
/api/run
Run a previously parsed request (when auto_continue was false)
POST
/api/actions
Handle an option (D.9.2)
GET
/api/events/{ticker}
event_answer
GET
/api/outlook/{ticker}
outlook_answer
GET
/api/profile/{ticker}
activity_answer
GET
/api/ledger
scoreboard
GET
/api/tickers
Supported tickers
GET
/api/health
Per-source status, orders_available, llm_mode
POST
/api/admin/kill-switch
Toggle ORDERS_ENABLED (needs X-API-Key)
D.9.1 /api/chat
Body: { "message": "...", "session_id": "s_abc", "parsed": null }. If parsed is given, parsing is skipped. With Accept: text/event-stream the response streams; otherwise it returns the final message as JSON.
event: message   data: {"type":"parse_confirmation", ...}      # or clarification
event: progress  data: {"step":"session_checked","status":"done","label":"...","ms":220}
event: result    data: {"type":"assessment", ...}
event: error     data: {"type":"error","code":"SOURCE_UNAVAILABLE", ...}
If auto_continue is false the stream ends after parse_confirmation, and the client calls /api/run with the request_id (and edited parsed if corrected).
D.9.2 /api/actions
The server looks the option up in the stored requests.payload_json, so a client cannot invent an action.
Kind
params
Server does
confirm_order
none, then confirmation_token
Step 1: order_preview. Step 2: place and return order_result
adjust_amount
{amount_usd}
Re-run the assessment (streams like /api/chat)
ask_followup
{message}
Behaves like /api/chat with that message
cancel
none
Returns info
HTTP mapping for error codes: INVALID_REQUEST and UNSUPPORTED_TICKER and CAP_EXCEEDED 400, ORDERS_DISABLED 403, RATE_LIMITED 429, SOURCE_UNAVAILABLE 502, INTERNAL 500.
D.10 Orders (optional feature)
Orders are included only if Phase 0 order checks pass. If not, set ORDERS_AVAILABLE=false; the product ships research-only and the confirm_order option never appears.
Preview: validate ticker, side, amount; check ORDERS_ENABLED and MAX_ORDER_USD; re-fetch latest price and session; if the price moved more than PREVIEW_STALE_PCT or the session changed, set changed: true with a plain change_summary; create a one-time confirmation_token valid for CONFIRMATION_TTL_SEC.
Confirm: token must exist, be unexpired and unused; mark it used; place the order in the current ORDER_MODE; log it; return order_result.
Failures are returned as they are, with no silent retries. Every attempt is logged. Setting ORDERS_ENABLED=false blocks both steps. Demo mode is the default; live mode needs an explicit env change.
D.11 Learning jobs
Job
Frequency
Does
Initial backfill
first run
Load past events for the look-back, marked historical
Candle refresh
daily
Update stored token candles
Event sync
every few hours
Pull upcoming and recent events into events
Event journal
hourly
Measure events that have passed and set origin: live
Verdict resolver
every 15 min
Fill price_after_1h and price_after_24h
The scoreboard reads from verdicts and events and always shows sample sizes. Nothing here notifies anyone.
D.12 Wiring to the frontend
Schemas in schemas.py mirror Part C. FastAPI's /docs and /openapi.json expose them, so the frontend can generate types.
CORS from ALLOWED_ORIGINS.
Mock mode (MOCK_RESPONSES=true) serves fixtures from docs/samples/mock/ with "mock": true.
Streaming uses SSE, with a plain-JSON path when no Accept header is sent.
request_id ties a card to its options. Actions reference request_id and action_id only.
mode appears in every response. /api/health reports source status, orders_available and llm_mode.
D.13 Testing
Fixtures: sanitized real responses from Phase 0 in docs/samples/ drive unit tests of core/.
Contract tests: every endpoint's output parses through the matching schemas.py model.
Provider failures: malformed payloads, timeouts, rate limits, access denial; each source failing alone still yields a valid response.
Freshness: stale cached prices and missing timestamps produce the right freshness.
Conflicts: two sources disagreeing on price and on event date.
Events: missing or contradictory event info; before-open, after-close and unknown timing; holidays and weekends; thin candles.
Time zones: UTC storage and New York market logic, including daylight-saving changes.
Interpreter: at least 20 varied questions covering every intent, follow-ups, amounts in several formats, and unsupported tickers.
Validator: invented number, banned phrase, clean text.
Verdicts: one case per code.
Template mode: the full flow with no model configured.
Orders (if included): expired token, reused token, over cap, kill switch on, changed conditions.
End to end: question in, evidence-based answer out, for several question types.
D.14 Logging
Log request id, step durations, source calls (source id, status, latency), model provider used, and validation outcomes. Never log secrets.
PART E: DATA SOURCES
Everything here is documented or reported, not yet tested. Phase 0 turns each "untested" into pass or fail. Record results in E.8 and adapt the product.
E.1 Principles
Bitget tools are the spine. The hackathon recommends them and judges look at how well they are integrated.
External sources fill gaps and are added only after they pass Phase 0.
One client per source, in backend/app/clients/, returning typed raw data plus metadata.
Every value carries its source id (C.2).
Openly accessible data only (A.3).
Trust real responses over documentation. Record differences in E.9.
E.2 Source registry
Priority: P1 core, P2 Outlook depth, P3 optional.
Source id
Provider
Used for
Priority
Key needed?
Status
bitget_reality_instruments
Bitget Reality market API
Token list, s