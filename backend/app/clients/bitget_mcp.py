import httpx
import json
import logging
from typing import Dict, Any, Optional, List

logger = logging.getLogger(__name__)

BITGET_MCP_URL = "https://agent.bitget.com/mcp"

class BitgetMCPClient:
    """
    Client for Bitget's Stock Research MCP Server at https://agent.bitget.com/mcp.
    Communicates via MCP JSON-RPC protocol over HTTP with session tracking.
    """
    def __init__(self):
        self.headers = {
            "User-Agent": "Trace-MCP-Client/1.0"
        }
        self.client = httpx.AsyncClient(timeout=20.0, headers=self.headers)
        self.session_id: Optional[str] = None
        self._request_counter = 0

    def _next_id(self) -> int:
        self._request_counter += 1
        return self._request_counter

    async def ensure_session(self) -> str:
        """
        Initializes MCP session if not already established.
        """
        if self.session_id:
            return self.session_id

        init_payload = {
            "jsonrpc": "2.0",
            "id": self._next_id(),
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {"name": "trace-mcp-client", "version": "1.0"}
            }
        }
        resp = await self.client.post(BITGET_MCP_URL, json=init_payload)
        self.session_id = resp.headers.get("mcp-session-id")
        if not self.session_id:
            raise RuntimeError(f"Failed to obtain mcp-session-id from {BITGET_MCP_URL}")

        # Send notifications/initialized
        await self.client.post(
            BITGET_MCP_URL,
            json={"jsonrpc": "2.0", "method": "notifications/initialized"},
            headers={"mcp-session-id": self.session_id}
        )
        return self.session_id

    async def list_tools(self) -> List[Dict[str, Any]]:
        """
        Lists available MCP tools on the server.
        """
        session_id = await self.ensure_session()
        payload = {
            "jsonrpc": "2.0",
            "id": self._next_id(),
            "method": "tools/list",
            "params": {}
        }
        resp = await self.client.post(
            BITGET_MCP_URL,
            json=payload,
            headers={"mcp-session-id": session_id}
        )
        for line in resp.text.split("\n"):
            if line.startswith("data: "):
                data = json.loads(line[6:])
                return data.get("result", {}).get("tools", [])
        return []

    async def call_tool(self, name: str, arguments: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Calls a tool on the MCP server and returns the parsed result data.
        """
        try:
            session_id = await self.ensure_session()
        except Exception:
            # Re-try once on session reset
            self.session_id = None
            session_id = await self.ensure_session()

        payload = {
            "jsonrpc": "2.0",
            "id": self._next_id(),
            "method": "tools/call",
            "params": {
                "name": name,
                "arguments": arguments
            }
        }
        resp = await self.client.post(
            BITGET_MCP_URL,
            json=payload,
            headers={"mcp-session-id": session_id}
        )

        # Handle session expiration
        if resp.status_code == 400 and "session" in resp.text.lower():
            self.session_id = None
            session_id = await self.ensure_session()
            resp = await self.client.post(
                BITGET_MCP_URL,
                json=payload,
                headers={"mcp-session-id": session_id}
            )

        for line in resp.text.split("\n"):
            if line.startswith("data: "):
                event_data = json.loads(line[6:])
                res = event_data.get("result", {})
                content_items = res.get("content", [])
                if content_items:
                    raw_text = content_items[0].get("text", "")
                    try:
                        return json.loads(raw_text)
                    except Exception:
                        return {"raw": raw_text}
        return None

    async def do_query(self, entry_id: str, params: Optional[Dict[str, Any]] = None) -> Optional[Dict[str, Any]]:
        """
        Executes a catalog query on the agent-data-platform via do_query tool.
        """
        return await self.call_tool("do_query", {
            "entry_id": entry_id,
            "params": params or {}
        })

    # Convenience domain queries
    async def get_equity_quote(self, symbol: str) -> Optional[Dict[str, Any]]:
        return await self.do_query("equity_price_quote", {"symbol": symbol.upper()})

    async def get_earnings_calendar(self, symbol: str) -> Optional[Dict[str, Any]]:
        return await self.do_query("equity_calendar", {"symbol": symbol.upper()})

    async def get_analyst_price_targets(self, symbol: str) -> Optional[Dict[str, Any]]:
        return await self.do_query("equity_estimates_price_target", {"symbol": symbol.upper()})

    async def get_analyst_consensus(self, symbol: str) -> Optional[Dict[str, Any]]:
        return await self.do_query("equity_estimates_consensus", {"symbol": symbol.upper()})

    async def get_forward_eps(self, symbol: str) -> Optional[Dict[str, Any]]:
        return await self.do_query("equity_estimates_forward_eps", {"symbol": symbol.upper()})

    async def get_dividends(self, symbol: str) -> Optional[Dict[str, Any]]:
        return await self.do_query("equity_fundamental_dividends", {"symbol": symbol.upper()})

    async def close(self):
        await self.client.aclose()

bitget_mcp_client = BitgetMCPClient()
