FRONTEND.md
A light guide to help the agent understand the product and design its frontend like a reference site. It is guidance, not a rulebook. Use judgment.
Read first: PRODUCT_SPEC.md, especially Part C (data contract). That is what the frontend receives from the backend.
Reference site: REFERENCE_URL: <nor.ma> (screenshots, if any, in frontend/docs/reference/)
1. The product, from the frontend's point of view
People ask questions about tokenized stocks in plain language ("What should I know before trading rNVDA this weekend?", "What are analysts split on for Microsoft?"). The app answers with clear, readable cards: a verdict on current conditions, upcoming events, what happened around similar past events, and an outlook that brings analysts, news and company events into one place.
The feel should be calm, clear and honest. It explains and informs. It does not push, predict or alert. The user always decides.
It should look and work well on both laptop and phone, as a first-class experience on each.
2. Using the reference site
Part of the product
What it is
Data (Part C)
Chat
Input, example questions, the conversation
/api/chat, parse_confirmation, clarification
Progress
Live steps while an answer builds
streaming progress events
Assessment card
Verdict, key facts, event banner, past-event history, outlook, explanation, options
assessment
Verdict
One short label for current conditions with a reason
assessment.verdict
Event history
What happened around the last similar events, with sample size
history
Outlook
Brief, analyst consensus, target range vs price, supporter and skeptic arguments, expectations, recent analyst changes, a merged timeline of news, analysts and company events
outlook
Event, outlook and activity answers
Focused answers to those questions
event_answer, outlook_answer, activity_answer
Comparison
Two or three tickers side by side
comparison
Scoreboard
How past verdicts held up, with sample sizes
scoreboard
Options
Buttons for what the user can do next
options
Order confirmation
Only if the backend has orders enabled
order_preview, order_result
Status
Demo or live, sample-data badge, source health
/api/health, mock
Messages and errors
Info, refusals, friendly errors
info, refusal, error
Secondary pages are optional: a scoreboard page, and a short "how it works" page explaining the data sources and what the product does not do.
4. Ideas worth keeping in mind
Show where numbers come from. Every value arrives with a tag (observed, estimated, historical, unavailable) and sometimes a freshness label. Showing these builds trust.
Mark AI-written text (anything with kind: "interpretation") so it reads differently from facts, and link its sources.
Missing data is normal. Parts with availability: unavailable can simply be hidden, and values can show as unavailable with their reason.
Options come from the server. Render the ones it sends, including disabled ones with a reason. If there is no order option, there is no order UI.
Progress is real. Drive it from the streaming events, including steps that fail or are skipped.
Design the in-between states: loading, partial data, empty, error.
5. Wiring to the backend
Everything is in PRODUCT_SPEC.md Part C. In short:
Types can be generated from the backend's /openapi.json, or written from Part C.
POST /api/chat streams events (message, progress, result, error). Read it with fetch and a stream reader. A plain JSON mode also exists.
The final message has a type; pick the component from it.
Actions go back with action_id, request_id and any params, as Part C describes.
With mock mode on, responses carry "mock": true. Build the whole UI against mock data first, show a "sample data" badge, then switch to the real backend.
The API base URL comes from an environment variable.
6. Suggested stack (change freely)
React with TypeScript and Vite, styled with whatever matches the reference best (Tailwind or CSS variables). If the reference is built on something else, matching it is fine.