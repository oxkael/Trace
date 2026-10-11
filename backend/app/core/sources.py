from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class SourceDefinition(BaseModel):
    id: str
    name: str
    category: str # "crypto_token", "equity_reference", "calendar", "regulatory", "analyst_outlook"
    is_official: bool
    status: str # "verified_live", "verified_delayed", "unsupported", "degraded"
    provider: str
    url_pattern: str
    description: str
    notes: Optional[str] = None

# Comprehensive Source Registry matching Product Spec Part E.2
SOURCE_REGISTRY: Dict[str, SourceDefinition] = {
    "bitget_reality_ticker": SourceDefinition(
        id="bitget_reality_ticker",
        name="Bitget Spot Reality Ticker",
        category="crypto_token",
        is_official=True,
        status="verified_live",
        provider="Bitget Spot Market API (v2)",
        url_pattern="https://api.bitget.com/api/v2/spot/market/tickers?symbol={token}",
        description="Official real-time spot trading feed for tokenized US equity instruments (e.g. RNVDAUSDT). Provides lastPr, bidPr, askPr, quoteVolume."
    ),
    "bitget_reality_candles": SourceDefinition(
        id="bitget_reality_candles",
        name="Bitget Spot Candles",
        category="crypto_token",
        is_official=True,
        status="verified_live",
        provider="Bitget Spot Market API (v2)",
        url_pattern="https://api.bitget.com/api/v2/spot/market/candles?symbol={token}&granularity=1h",
        description="Official 1-hour and daily OHLCV candles with depth up to 1,000 bars (~41.8 days of historical token turnover)."
    ),
    "bitget_reality_depth": SourceDefinition(
        id="bitget_reality_depth",
        name="Bitget Spot Orderbook Depth",
        category="crypto_token",
        is_official=True,
        status="verified_live",
        provider="Bitget Spot Market API (v2)",
        url_pattern="https://api.bitget.com/api/v2/spot/market/orderbook?symbol={token}&type=step0&limit=5",
        description="Official orderbook ask/bid depth and spread inspection."
    ),
    "bitget_reality_instruments": SourceDefinition(
        id="bitget_reality_instruments",
        name="Bitget Supported Symbols (Reality Instruments)",
        category="crypto_token",
        is_official=True,
        status="verified_live",
        provider="Bitget Spot Market API (v2)",
        url_pattern="https://api.bitget.com/api/v2/spot/public/symbols",
        description="Official registry of active tokenized equity assets listed on Bitget."
    ),
    "bitget_stock_research": SourceDefinition(
        id="bitget_stock_research",
        name="Bitget Stock Research Service (MCP)",
        category="equity_reference",
        is_official=True,
        status="verified_live",
        provider="Bitget Stock Research MCP Server",
        url_pattern="https://agent.bitget.com/mcp",
        description="Official Bitget Model Context Protocol (MCP) server providing 22 equity catalog tools including real-time quotes, earnings calendar, forward EPS, analyst targets, consensus, and dividends.",
        notes="Connected via MCP JSON-RPC protocol over HTTP (session-managed)."
    ),
    "yahoo_finance_unofficial": SourceDefinition(
        id="yahoo_finance_unofficial",
        name="Yahoo Finance Chart & News (Unofficial Aggregator)",
        category="equity_reference",
        is_official=False,
        status="verified_live",
        provider="Yahoo Finance Public Web API",
        url_pattern="https://query1.finance.yahoo.com/v8/finance/chart/{ticker}",
        description="Unofficial third-party market data aggregator. Used as an indicative equity reference price and headline news feed. Never labeled as official Nasdaq/NYSE data.",
        notes="Values are tagged with source='yahoo_finance_unofficial' and labeled 'Unofficial Reference'."
    ),
    "sec_edgar_filings": SourceDefinition(
        id="sec_edgar_filings",
        name="SEC EDGAR Company Submissions",
        category="regulatory",
        is_official=True,
        status="verified_live",
        provider="U.S. Securities and Exchange Commission (EDGAR)",
        url_pattern="https://data.sec.gov/submissions/CIK{cik}.json",
        description="Official U.S. government regulatory filing repository for 10-K, 10-Q, 8-K filings and corporate events calendar."
    ),
    "nyse_session_clock": SourceDefinition(
        id="nyse_session_clock",
        name="NYSE / NASDAQ Session Clock & Calendar",
        category="calendar",
        is_official=True,
        status="verified_live",
        provider="Trace America/New_York Trading Calendar",
        url_pattern="internal: 09:30-16:00 ET regular hours, weekend/holiday rules",
        description="Official US equity exchange market hours calculator (regular, pre-market, after-hours, closed, holiday)."
    )
}

def get_source_info(source_id: str) -> Optional[SourceDefinition]:
    return SOURCE_REGISTRY.get(source_id)

def list_sources() -> List[SourceDefinition]:
    return list(SOURCE_REGISTRY.values())
