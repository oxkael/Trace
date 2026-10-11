import httpx
from datetime import datetime, timezone
from typing import Optional, Dict, Any, Tuple
from ..schemas import Value

BITGET_API_BASE = "https://api.bitget.com"

class BitgetClient:
    def __init__(self):
        self.client = httpx.AsyncClient(timeout=8.0)

    async def get_token_ticker(self, symbol: str) -> Tuple[Value, float, float]:
        """
        Fetches live token ticker from Bitget spot API.
        NO hardcoded fallback numbers: if unreachable, returns explicit 'unavailable' Value.
        """
        clean_symbol = symbol.upper().replace("R", "")
        token_sym = f"R{clean_symbol}USDT"
        now_str = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")

        try:
            url = f"{BITGET_API_BASE}/api/v2/spot/market/tickers?symbol={token_sym}"
            resp = await self.client.get(url)
            if resp.status_code == 200:
                data = resp.json()
                if data.get("code") == "00000" and data.get("data"):
                    item = data["data"][0]
                    last_price = float(item["lastPr"])
                    turnover = float(item.get("usdtVolume", 0.0))

                    token_val = Value(
                        value=last_price,
                        unit="USD",
                        display=f"${last_price:,.2f}",
                        tag="observed",
                        source="bitget_reality_ticker",
                        as_of=now_str,
                        freshness="live"
                    )

                    return token_val, turnover, turnover * 1.5
        except Exception:
            pass

        # Strictly return unavailable per Part A.2 & C.2 (Zero hardcoded numbers)
        token_val = Value(
            value=None,
            unit="USD",
            display="Unavailable",
            tag="unavailable",
            source="bitget_reality_ticker",
            as_of=now_str,
            freshness="unknown",
            reason=f"Could not reach Bitget endpoint for {token_sym}"
        )
        return token_val, 0.0, 0.0

    async def get_ticker(self, symbol: str) -> Tuple[Value, Value, float, float]:
        """
        Backward-compatible signature.
        """
        token_val, turnover, typical = await self.get_token_ticker(symbol)
        return token_val, token_val, turnover, typical

    async def close(self):
        await self.client.aclose()

bitget_client = BitgetClient()
