import httpx
from datetime import datetime, timezone
from typing import Optional, Dict, Any, List, Tuple
from ..schemas import Value

class YahooClient:
    def __init__(self):
        self.headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Trace-App/1.0"
        }
        self.client = httpx.AsyncClient(timeout=8.0, headers=self.headers)

    async def get_reference_quote(self, ticker: str, market_state: str) -> Value:
        """
        Fetches underlying equity quote from Yahoo Finance aggregator.
        CRITICAL: Labeled strictly with source='yahoo_finance_unofficial'.
        Never represented as official direct Nasdaq/NYSE feed.
        """
        clean_ticker = ticker.upper().replace("R", "")
        now_dt = datetime.now(timezone.utc)
        now_str = now_dt.isoformat().replace("+00:00", "Z")

        try:
            url = f"https://query1.finance.yahoo.com/v8/finance/chart/{clean_ticker}?interval=1d&range=5d"
            resp = await self.client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                chart = data.get("chart", {})
                result = chart.get("result", [])
                if result:
                    meta = result[0].get("meta", {})
                    regular_price = meta.get("regularMarketPrice")
                    # Fallback to last close in indicators if regularMarketPrice is missing
                    if regular_price is None:
                        closes = result[0].get("indicators", {}).get("quote", [{}])[0].get("close", [])
                        valid_closes = [c for c in closes if c is not None]
                        if valid_closes:
                            regular_price = valid_closes[-1]

                    if regular_price is not None:
                        regular_price = float(regular_price)
                        market_time_ts = meta.get("regularMarketTime")
                        as_of_str = now_str
                        freshness = "live"
                        age_sec = None

                        if market_time_ts:
                            market_dt = datetime.fromtimestamp(market_time_ts, tz=timezone.utc)
                            as_of_str = market_dt.isoformat().replace("+00:00", "Z")
                            age_sec = int((now_dt - market_dt).total_seconds())

                        # Under Rule #3: Outside regular hours, reference is last_close and cannot be live
                        if market_state in ("closed", "overnight", "holiday"):
                            freshness = "stale"
                            tag = "historical"
                        else:
                            freshness = "delayed" if (age_sec and age_sec > 60) else "live"
                            tag = "observed"

                        return Value(
                            value=regular_price,
                            unit="USD",
                            display=f"${regular_price:,.2f}",
                            tag=tag,
                            source="yahoo_finance_unofficial",
                            as_of=as_of_str,
                            freshness=freshness,
                            age_sec=age_sec,
                            reason="Unofficial equity reference aggregated via Yahoo Finance API"
                        )
        except Exception as e:
            err_msg = str(e)

        return Value(
            value=None,
            unit="USD",
            display="Unavailable",
            tag="unavailable",
            source="yahoo_finance_unofficial",
            as_of=now_str,
            freshness="unknown",
            reason=f"Could not reach Yahoo Finance unofficial quote feed for {clean_ticker}"
        )

    async def get_recent_news(self, ticker: str) -> List[Dict[str, Any]]:
        """
        Fetches recent news items for the ticker from Yahoo search endpoint.
        """
        clean_ticker = ticker.upper().replace("R", "")
        try:
            url = f"https://query2.finance.yahoo.com/v1/finance/search?q={clean_ticker}&quotesCount=1&newsCount=5"
            resp = await self.client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                news = data.get("news", [])
                items = []
                for n in news:
                    pub_ts = n.get("providerPublishTime")
                    pub_iso = (
                        datetime.fromtimestamp(pub_ts, tz=timezone.utc).isoformat().replace("+00:00", "Z")
                        if pub_ts else None
                    )
                    items.append({
                        "id": n.get("uuid", ""),
                        "title": n.get("title", ""),
                        "publisher": n.get("publisher", "Yahoo Finance"),
                        "link": n.get("link", ""),
                        "published_at": pub_iso,
                        "source": "yahoo_finance_unofficial"
                    })
                return items
        except Exception:
            pass
        return []

    async def close(self):
        await self.client.aclose()

yahoo_client = YahooClient()
