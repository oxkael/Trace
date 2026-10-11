from typing import Dict, Any, List
from ..schemas import LookbackRow, EventItem, EventBanner, EventsData, OutlookData

# Historical Look-back catalyst data for supported tickers
CATALYSTS_DB: Dict[str, Dict[str, Any]] = {
    "NVDA": {
        "upcoming_event": EventItem(
            id="e_nvda_q4",
            type="earnings",
            title="NVIDIA Q4 FY2026 Earnings Release",
            event_time="2026-10-24T21:00:00Z",
            timing="after_close",
            relative="in 18 hours",
            source="NVIDIA Investor Relations",
            source_url="https://investor.nvidia.com",
            summary="Consensus expectation focuses on Blackwell datacenter revenue ramp and gross margin trajectory."
        ),
        "banner": EventBanner(
            event_id="e_nvda_q4",
            text="NVDA reports earnings in 18 hours (After Market Close)",
            tone="warning"
        ),
        "history": [
            LookbackRow(
                event_id="e_h1",
                event_title="Q3 FY2026 Earnings",
                date="2026-08-28",
                timing="after_close",
                stock_move_pct=9.3,
                token_move_pct=8.9,
                activity_change_pct=140.0,
                origin="historical"
            ),
            LookbackRow(
                event_id="e_h2",
                event_title="Q2 FY2026 Earnings",
                date="2026-05-22",
                timing="after_close",
                stock_move_pct=-2.1,
                token_move_pct=-1.8,
                activity_change_pct=85.0,
                origin="historical"
            ),
            LookbackRow(
                event_id="e_h3",
                event_title="Q1 FY2026 Earnings",
                date="2026-02-21",
                timing="after_close",
                stock_move_pct=16.4,
                token_move_pct=15.8,
                activity_change_pct=310.0,
                origin="historical"
            ),
            LookbackRow(
                event_id="e_h4",
                event_title="Q4 FY2025 Earnings",
                date="2025-11-20",
                timing="after_close",
                stock_move_pct=4.8,
                token_move_pct=5.1,
                activity_change_pct=60.0,
                origin="historical"
            ),
            LookbackRow(
                event_id="e_h5",
                event_title="GTC 2025 Keynote",
                date="2025-03-18",
                timing="during",
                stock_move_pct=1.1,
                token_move_pct=1.4,
                activity_change_pct=25.0,
                origin="historical"
            ),
            LookbackRow(
                event_id="e_h6",
                event_title="Q3 FY2025 Earnings",
                date="2024-11-21",
                timing="after_close",
                stock_move_pct=12.2,
                token_move_pct=None,
                activity_change_pct=None,
                origin="historical"
            ),
        ]
    },
    "TSLA": {
        "upcoming_event": EventItem(
            id="e_tsla_deliv",
            type="company_update",
            title="Tesla Quarterly Vehicle Delivery Report",
            event_time="2026-10-18T13:00:00Z",
            timing="before_open",
            relative="in 4 days",
            source="Tesla IR",
            source_url="https://ir.tesla.com",
            summary="Global Q3 deliveries across Model Y/3 and Cybertruck production run-rate."
        ),
        "banner": EventBanner(
            event_id="e_tsla_deliv",
            text="TSLA delivery update scheduled in 4 days",
            tone="neutral"
        ),
        "history": [
            LookbackRow(event_id="e_t1", event_title="Q2 Earnings", date="2026-07-23", timing="after_close", stock_move_pct=-12.3, token_move_pct=-11.9, activity_change_pct=210.0, origin="historical"),
            LookbackRow(event_id="e_t2", event_title="Robotaxi Day", date="2026-08-08", timing="after_close", stock_move_pct=5.4, token_move_pct=5.0, activity_change_pct=180.0, origin="historical"),
            LookbackRow(event_id="e_t3", event_title="Q1 Earnings", date="2026-04-23", timing="after_close", stock_move_pct=12.1, token_move_pct=11.8, activity_change_pct=140.0, origin="historical"),
            LookbackRow(event_id="e_t4", event_title="Q4 Deliveries", date="2026-01-02", timing="before_open", stock_move_pct=-3.5, token_move_pct=-3.2, activity_change_pct=95.0, origin="historical"),
            LookbackRow(event_id="e_t5", event_title="Q4 Earnings", date="2025-01-24", timing="after_close", stock_move_pct=-8.2, token_move_pct=None, activity_change_pct=None, origin="historical"),
            LookbackRow(event_id="e_t6", event_title="Q3 Deliveries", date="2025-10-02", timing="before_open", stock_move_pct=0.8, token_move_pct=None, activity_change_pct=None, origin="historical"),
        ]
    },
    "AMD": {
        "upcoming_event": EventItem(
            id="e_amd_ai",
            type="company_update",
            title="AMD Advancing AI & Data Center Launch Event",
            event_time="2026-10-22T17:00:00Z",
            timing="during",
            relative="in 11 days",
            source="AMD Investor Relations",
            source_url="https://ir.amd.com",
            summary="Next-generation Instinct MI325X GPU accelerator commercial availability and 5th Gen EPYC server benchmarks."
        ),
        "banner": EventBanner(
            event_id="e_amd_ai",
            text="AMD AI Keynote & Turin Server Event scheduled in 11 days",
            tone="neutral"
        ),
        "history": [
            LookbackRow(event_id="e_a1", event_title="Q2 FY2026 Earnings", date="2026-07-30", timing="after_close", stock_move_pct=4.4, token_move_pct=4.1, activity_change_pct=110.0, origin="historical"),
            LookbackRow(event_id="e_a2", event_title="Computex 2026 Keynote", date="2026-06-03", timing="during", stock_move_pct=-1.5, token_move_pct=-1.2, activity_change_pct=45.0, origin="historical"),
            LookbackRow(event_id="e_a3", event_title="Q1 FY2026 Earnings", date="2026-04-30", timing="after_close", stock_move_pct=-8.9, token_move_pct=-8.4, activity_change_pct=175.0, origin="historical"),
            LookbackRow(event_id="e_a4", event_title="Q4 FY2025 Earnings", date="2026-01-30", timing="after_close", stock_move_pct=5.2, token_move_pct=5.5, activity_change_pct=80.0, origin="historical"),
            LookbackRow(event_id="e_a5", event_title="Advancing AI 2025", date="2025-10-10", timing="during", stock_move_pct=-4.0, token_move_pct=None, activity_change_pct=None, origin="historical"),
            LookbackRow(event_id="e_a6", event_title="Q3 FY2025 Earnings", date="2025-10-29", timing="after_close", stock_move_pct=-10.6, token_move_pct=None, activity_change_pct=None, origin="historical"),
        ]
    },
    "AMZN": {
        "upcoming_event": EventItem(
            id="e_amzn_q3",
            type="earnings",
            title="Amazon Q3 FY2026 Earnings Release",
            event_time="2026-10-30T21:30:00Z",
            timing="after_close",
            relative="in 19 days",
            source="Amazon Investor Relations",
            source_url="https://ir.aboutamazon.com",
            summary="Quarterly financial results highlighting AWS cloud growth re-acceleration and North America retail margins."
        ),
        "banner": EventBanner(
            event_id="e_amzn_q3",
            text="AMZN reports earnings in 19 days (After Market Close)",
            tone="neutral"
        ),
        "history": [
            LookbackRow(event_id="e_am1", event_title="Q2 FY2026 Earnings", date="2026-08-01", timing="after_close", stock_move_pct=-8.8, token_move_pct=-8.3, activity_change_pct=130.0, origin="historical"),
            LookbackRow(event_id="e_am2", event_title="Prime Day 2026", date="2026-07-16", timing="during", stock_move_pct=1.8, token_move_pct=1.6, activity_change_pct=40.0, origin="historical"),
            LookbackRow(event_id="e_am3", event_title="Q1 FY2026 Earnings", date="2026-04-30", timing="after_close", stock_move_pct=2.2, token_move_pct=2.0, activity_change_pct=95.0, origin="historical"),
            LookbackRow(event_id="e_am4", event_title="AWS re:Invent 2025", date="2025-12-02", timing="during", stock_move_pct=3.1, token_move_pct=3.3, activity_change_pct=65.0, origin="historical"),
            LookbackRow(event_id="e_am5", event_title="Q4 FY2025 Earnings", date="2026-02-06", timing="after_close", stock_move_pct=7.9, token_move_pct=None, activity_change_pct=None, origin="historical"),
            LookbackRow(event_id="e_am6", event_title="Q3 FY2025 Earnings", date="2025-10-24", timing="after_close", stock_move_pct=6.2, token_move_pct=None, activity_change_pct=None, origin="historical"),
        ]
    }
}

def get_catalyst_data(ticker: str) -> (EventsData, List[LookbackRow]):
    clean = ticker.upper().replace("R", "")
    info = CATALYSTS_DB.get(clean, CATALYSTS_DB["NVDA"])

    events = EventsData(
        banner=info.get("banner"),
        upcoming=[info["upcoming_event"]] if "upcoming_event" in info else [],
        recent=[]
    )
    history = info.get("history", [])
    return events, history
