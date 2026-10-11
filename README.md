# Trace — Event-Aware Trading & Research Assistant for 24/7 Tokenized US Stocks

Built for the **Bitget AI Base Camp Hackathon S2 (AI Trading Desk Track)**.  
*Core Philosophy: "AI assists, human decides."*

---

## 1. The Problem
Bitget's tokenized stocks (`rNVDA`, `rTSLA`, `rAMD`, `rAMZN`) trade **24/7**, but the real US stock market (NYSE/NASDAQ) does **not**. Retail traders often trade outside regular hours and cannot easily tell:
1. **Is the price meaningful right now?** Outside US regular hours, tokens trade against a stale reference close.
2. **Is the market unusually quiet or active?** Turnover dynamics shift drastically across regular, pre-market, after-hours, and weekend sessions.
3. **What catalysts and historical precedents exist?** Upcoming corporate earnings and macro releases are scattered and difficult to parse.

Trace provides calm, fact-grounded condition checks, upcoming event catalysts, and historical look-backs. **Strictly zero price predictions or investment advice.**

---

## 2. The 4 Non-Negotiable Rules
1. **No invented market data, news or events.** If something is unavailable, it is shown as `unavailable`.
2. **No orders placed without explicit user action.** Always requires a two-step preview and confirmation token.
3. **No stale reference price is ever shown as live.** Outside regular hours, it is labeled `last_close`.
4. **Nothing is presented as a prediction or investment advice.** Describes conditions and history only.

---

## 3. Project Architecture

```
Trace/
├── backend/
│   ├── app/
│   │   ├── api/routes.py          # /api/chat (SSE), /api/ledger, /api/health, /api/actions
│   │   ├── clients/bitget.py      # Bitget Spot V2 ticker & candles client with fallbacks
│   │   ├── core/
│   │   │   ├── session.py         # US market session calculator (pre, regular, after, closed)
│   │   │   ├── divergence.py      # Token vs underlying spread gap calculation
│   │   │   ├── activity.py        # Turnover vs session median benchmark ratio
│   │   │   ├── verdict.py         # Deterministic condition verdict engine
│   │   │   ├── events.py          # Catalysts calendar & historical look-back data
│   │   │   ├── outlook.py         # Wall Street consensus, targets, bull/skeptic points
│   │   │   └── pipeline.py        # 10-step progress streaming coordinator
│   │   ├── db/database.py         # SQLite persistence (requests, verdicts, confirmations)
│   │   ├── llm/
│   │   │   ├── interpret.py       # 4-stage query interpreter (amounts, side, intent, aliases)
│   │   │   └── validate.py        # Guardrails validator against banned predictive phrases
│   │   ├── schemas.py             # Typed Pydantic data contracts mirroring Part C
│   │   ├── config.py              # Thresholds & configuration parameters
│   │   └── main.py                # FastAPI entrypoint with CORS & startup hooks
│   └── requirements.txt
├── frontend/                      # React 19 + TypeScript + Vite + Tailwind CSS v4
│   ├── src/
│   │   ├── components/            # nor.ma-inspired calm components with width hierarchy
│   │   ├── hooks/                 # useScrollReveal (32px continuous inertial float)
│   │   ├── types/contract.ts      # Shared frontend data contract
│   │   └── api/client.ts          # SSE stream reader and action dispatchers
│   └── public/images/             # Photorealistic 3-step methodology cards
├── data/
│   ├── tickers.json               # Supported tickers and Bitget pairs
│   ├── banned_phrases.txt         # Predictive & promotional words rejected by validator
│   └── trace.db                   # SQLite database
├── Product_spec.md                # Comprehensive specification document
└── README.md
```

---

## 4. How to Run Locally

### Backend (FastAPI on Port 8000)
```bash
cd backend
python -m pip install -r requirements.txt
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```
API Documentation: `http://127.0.0.1:8000/docs`

### Frontend (Vite Dev Server on Port 5173)
```bash
cd frontend
npm install
npm run dev
```
Open `http://127.0.0.1:5173/` in your browser. (The Vite proxy automatically routes `/api` calls to `http://127.0.0.1:8000`).

---

## 5. Condition Verdict Rules (Priority Order)
1. `INSUFFICIENT_DATA`: Missing token price or session status.
2. `WAIT`: US market is closed; reference is a last close.
3. `CAUTION`: Token divergence $\ge 1.0\%$ vs official reference when both are fresh.
4. `QUIET`: Turnover activity ratio $< 0.5\times$ normal session baseline.
5. `REASONABLE`: Normal conditions; spread and turnover are healthy.
