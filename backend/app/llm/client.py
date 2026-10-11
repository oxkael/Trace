import os
import json
import logging
from typing import Dict, Any, Optional, Tuple, List
from pydantic import BaseModel

from .gemini import gemini_provider
from .validate import validate_text, validate_briefing
from ..schemas import Briefing, BriefingSection, BriefingNotFound, BriefingTerm

logger = logging.getLogger(__name__)

PROMPTS_DIR = os.path.join(os.path.dirname(__file__), "prompts")

def load_prompt_file(filename: str) -> str:
    path = os.path.join(PROMPTS_DIR, filename)
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return f.read()
    return ""

def load_briefing_examples() -> List[Dict[str, Any]]:
    path = os.path.join(PROMPTS_DIR, "briefing_examples.json")
    if os.path.exists(path):
        try:
            with open(path, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception as e:
            logger.error(f"Error reading briefing_examples.json: {e}")
    return []

TASK_FILE_MAP = {
    "trade": "briefing_task_trade.txt",
    "check": "briefing_task_check.txt",
    "holding_check": "briefing_task_holding_check.txt",
    "event_question": "briefing_task_event_question.txt",
    "outlook_question": "briefing_task_outlook_question.txt",
    "activity_question": "briefing_task_activity_question.txt",
    "compare": "briefing_task_compare.txt"
}

def synthesize_template_briefing(payload: Dict[str, Any]) -> Briefing:
    """
    Template fallback briefing adhering to Section 10 rules.
    Free of banned words, completely factual.
    """
    token_price = "$0.00"
    ref_price = "$0.00"
    premium_pct = "0.0%"
    activity_ratio = "1.0x"
    token_symbol = "Token"
    clean_ticker = "Stock"

    for fact in payload.get("facts", []):
        fid = fact.get("id")
        if fid == "token_price":
            token_price = fact.get("display", "$0.00")
            token_symbol = fact.get("label", "Token").split()[0]
        elif fid == "reference_price":
            ref_price = fact.get("display", "$0.00")
            clean_ticker = fact.get("label", "Stock").split()[0]
        elif fid == "premium_pct":
            premium_pct = fact.get("display", "0.0%")
        elif fid == "activity_ratio":
            activity_ratio = fact.get("display", "1.0x")

    session_state = payload.get("session", {}).get("state", "closed")
    session_explainer = payload.get("session", {}).get("explainer", "")
    next_open = payload.get("session", {}).get("next_open", "at next regular session")

    if session_state in ("weekend", "holiday", "overnight", "closed"):
        headline = f"{token_symbol} is trading at {token_price} while US stock markets are closed."
        summary = (
            f"{token_symbol} is at {token_price}, {premium_pct} relative to {clean_ticker}'s last regular close of {ref_price}. "
            f"US markets are closed until {next_open}. "
            f"Trading activity is at {activity_ratio} its typical pace."
        )
    else:
        headline = f"{token_symbol} is trading at {token_price} during regular US market hours."
        summary = (
            f"{token_symbol} is at {token_price}, {premium_pct} compared to {clean_ticker}'s equity reference of {ref_price}. "
            f"Trading activity is currently at {activity_ratio} its typical pace."
        )

    sections = [
        BriefingSection(
            topic="session",
            title="Market session context",
            text=session_explainer[:200] if session_explainer else f"US stock markets are {session_state}.",
            fact_ids=["reference_price", "premium_pct"],
            headline_ids=[]
        ),
        BriefingSection(
            topic="price",
            title="Token and reference price",
            text=f"{token_symbol} is at {token_price} with a gap of {premium_pct} vs {ref_price}.",
            fact_ids=["token_price", "reference_price", "premium_pct"],
            headline_ids=[]
        ),
        BriefingSection(
            topic="activity",
            title="Turnover pace",
            text=f"Turnover is currently running at {activity_ratio} its typical pace.",
            fact_ids=["activity_ratio"],
            headline_ids=[]
        )
    ]

    worth_weighing = [
        f"The equity reference price is an unofficial quote from Yahoo Finance.",
        f"Token trading occurs 24/7 on Bitget independent of US exchange market hours."
    ]

    not_found = []
    for un in payload.get("unavailable", []):
        not_found.append(BriefingNotFound(
            item=un.get("item", "Metric"),
            note=un.get("reason", "Not available")
        ))

    return Briefing(
        headline=headline,
        summary=summary,
        sections=sections,
        worth_weighing=worth_weighing,
        not_found=not_found,
        terms=[],
        validated=True,
        fallback_used=True
    )

class LLMClient:
    """
    Unified LLM Client adhering to LLM_PROMPTS.md.
    Provides generate_briefing() with few-shot prompting, JSON schema enforcement,
    and automatic validation / single-retry guardrails.
    """
    def __init__(self):
        self.provider = gemini_provider
        self.system_prompt = load_prompt_file("briefing_system.txt")
        self.examples = load_briefing_examples()

    async def generate_briefing(self, payload: Dict[str, Any]) -> Briefing:
        intent = payload.get("intent", "check")
        task_filename = TASK_FILE_MAP.get(intent, "briefing_task_check.txt")
        task_text = load_prompt_file(task_filename)
        payload["task"] = task_text

        payload_json = json.dumps(payload, indent=2)

        # Find matching few-shot example
        matching_example = None
        for ex in self.examples:
            if ex.get("intent") == intent:
                matching_example = ex
                break
        if not matching_example and self.examples:
            matching_example = self.examples[0]

        example_prompt_segment = ""
        if matching_example:
            example_prompt_segment = (
                f"\n\nExample Output Format (for structure only):\n"
                f"{json.dumps(matching_example.get('output', {}), indent=2)}\n\n"
            )

        prompt = (
            f"Input Data Payload:\n"
            f"```json\n{payload_json}\n```\n"
            f"{example_prompt_segment}"
            f"Output Requirement:\n"
            f"Return ONLY valid JSON matching the Section 3.3 briefing schema. "
            f"Respect all length limits, use exact figures from the payload, and obey all banned language rules."
        )

        if self.provider.is_configured():
            try:
                # Call 1
                result_data = await self.provider.generate_json(
                    prompt=prompt,
                    system_instruction=self.system_prompt
                )
                if result_data:
                    is_valid, reasons = validate_briefing(result_data, payload_json)
                    if is_valid:
                        return Briefing(
                            headline=result_data.get("headline", ""),
                            summary=result_data.get("summary", ""),
                            sections=[BriefingSection(**s) for s in result_data.get("sections", [])],
                            worth_weighing=result_data.get("worth_weighing", []),
                            not_found=[BriefingNotFound(**n) for n in result_data.get("not_found", [])],
                            terms=[BriefingTerm(**t) for t in result_data.get("terms", [])],
                            validated=True,
                            fallback_used=False
                        )
                    
                    # Validation failed -> Retry once as mandated in Section 10
                    logger.warning(f"Briefing validation failed on first attempt: {reasons}. Retrying once.")
                    retry_prompt = (
                        f"{prompt}\n\n"
                        f"Your previous answer failed validation: {'; '.join(reasons)}. "
                        f"Rewrite it fixing only those problems, still returning JSON only."
                    )
                    retry_data = await self.provider.generate_json(
                        prompt=retry_prompt,
                        system_instruction=self.system_prompt
                    )
                    if retry_data:
                        retry_valid, retry_reasons = validate_briefing(retry_data, payload_json)
                        if retry_valid:
                            return Briefing(
                                headline=retry_data.get("headline", ""),
                                summary=retry_data.get("summary", ""),
                                sections=[BriefingSection(**s) for s in retry_data.get("sections", [])],
                                worth_weighing=retry_data.get("worth_weighing", []),
                                not_found=[BriefingNotFound(**n) for n in retry_data.get("not_found", [])],
                                terms=[BriefingTerm(**t) for t in retry_data.get("terms", [])],
                                validated=True,
                                fallback_used=False
                            )
                        logger.warning(f"Briefing validation failed on retry: {retry_reasons}. Falling back to template.")
            except Exception as e:
                logger.error(f"Error during generate_briefing: {e}")

        # Fallback to plain template briefing
        return synthesize_template_briefing(payload)

    async def complete_text(
        self,
        prompt: str,
        fallback_template: str
    ) -> Tuple[str, bool, bool]:
        if self.provider.is_configured():
            try:
                candidate = await self.provider.generate_text(
                    prompt=prompt,
                    system_instruction=self.system_prompt
                )
                if candidate:
                    is_valid, violations = validate_text(candidate)
                    if is_valid:
                        return candidate, True, False
            except Exception as e:
                logger.error(f"Error in complete_text: {e}")
        is_valid, _ = validate_text(fallback_template)
        return fallback_template, is_valid, True

llm_client = LLMClient()
