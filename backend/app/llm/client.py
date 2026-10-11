import logging
from typing import Dict, Any, Optional, Tuple, Type
from pydantic import BaseModel

from .gemini import gemini_provider
from .validate import validate_text

logger = logging.getLogger(__name__)

SYSTEM_INSTRUCTION = (
    "You are Trace, a disciplined event-aware market condition interpreter for tokenized US stocks. "
    "CORE RULES: "
    "1. Never provide price predictions, targets, or investment advice. "
    "2. Ground every sentence strictly in the provided observed market data and historical facts. "
    "3. Be concise, objective, and plain-spoken. "
    "4. If market is closed, explicitly describe the reference price as the last regular-session close."
)

class LLMClient:
    """
    Unified LLM Client adhering to Part D.8.1 & D.8.5.
    Routes to configured provider (Gemini) with guardrails validation,
    falling back to deterministic template synthesis when unavailable.
    """
    def __init__(self):
        self.provider = gemini_provider

    async def complete_text(
        self,
        prompt: str,
        fallback_template: str
    ) -> Tuple[str, bool, bool]:
        """
        Returns (text, validated, fallback_used).
        Checks generated text against banned phrases guardrail.
        """
        if self.provider.is_configured():
            try:
                candidate = await self.provider.generate_text(
                    prompt=prompt,
                    system_instruction=SYSTEM_INSTRUCTION
                )
                if candidate:
                    is_valid, violations = validate_text(candidate)
                    if is_valid:
                        return candidate, True, False
                    else:
                        logger.warning(f"Gemini output rejected due to banned phrases: {violations}")
            except Exception as e:
                logger.error(f"Error calling LLM provider: {e}")

        # Fallback to deterministic template
        is_valid, _ = validate_text(fallback_template)
        return fallback_template, is_valid, True

    async def complete_json(
        self,
        prompt: str,
        schema: Optional[Dict[str, Any]] = None,
        fallback_data: Optional[Dict[str, Any]] = None
    ) -> Tuple[Optional[Dict[str, Any]], bool]:
        """
        Returns (json_data, fallback_used).
        """
        if self.provider.is_configured():
            try:
                data = await self.provider.generate_json(
                    prompt=prompt,
                    schema=schema,
                    system_instruction=SYSTEM_INSTRUCTION
                )
                if data:
                    return data, False
            except Exception as e:
                logger.error(f"Error calling LLM JSON provider: {e}")

        return fallback_data, True

    async def synthesize_explanation(
        self,
        token_symbol: str,
        clean_ticker: str,
        session_state: str,
        token_price_display: str,
        ref_price_display: str,
        divergence_display: str,
        history_count: int,
        user_query: str = "",
        activity_display: str = "",
        verdict_code: str = "",
        catalyst_banner: str = "",
        outlook_summary: str = ""
    ) -> Tuple[str, bool, bool]:
        """
        Synthesizes assessment explanation through Gemini if available, or template.
        Feeds all observed facts (query, price, session, activity, catalysts, consensus) into the LLM.
        """
        fallback_text = (
            f"Evaluated current {token_symbol} trading conditions against the underlying {clean_ticker} equity reference. "
            f"The official US stock exchange is currently {session_state.replace('_', ' ')}. "
            f"Observed 24/7 token price is {token_price_display} with an observed divergence of {divergence_display}. "
            f"Past look-back history indicates {history_count} recorded event catalysts."
        )

        facts_list = [
            f"- User inquiry: \"{user_query}\"" if user_query else "",
            f"- 24/7 Token: {token_symbol} spot price {token_price_display}",
            f"- Equity Reference: {clean_ticker} {ref_price_display} (Session: US Market {session_state})",
            f"- Price Gap / Divergence: {divergence_display}",
            f"- Trading Activity: {activity_display}" if activity_display else "",
            f"- System Condition Verdict: {verdict_code}" if verdict_code else "",
            f"- Catalyst Calendar: {catalyst_banner}" if catalyst_banner else "",
            f"- Wall Street Consensus (Bitget MCP): {outlook_summary}" if outlook_summary else "",
            f"- Past Catalyst Precedents: {history_count} recorded corporate events"
        ]
        facts_block = "\n".join([f for f in facts_list if f])

        prompt = (
            f"Observed Real-Time Facts:\n{facts_block}\n\n"
            f"Task: Directly address the user's inquiry by summarizing current trading conditions in 2 to 3 objective sentences. "
            f"Strictly adhere to the facts above. Do NOT predict future prices or provide investment advice."
        )

        return await self.complete_text(prompt, fallback_text)

llm_client = LLMClient()
