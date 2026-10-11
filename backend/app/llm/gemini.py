import os
import json
import logging
from typing import Optional, Dict, Any
import httpx
from ..config import settings

logger = logging.getLogger(__name__)

GEMINI_API_BASE = "https://generativelanguage.googleapis.com/v1beta"

class GeminiProvider:
    """
    Direct Gemini REST provider via Google Generative Language API.
    One provider module satisfying Part D.8.1.
    Gracefully returns None if API key is absent or on network/rate-limit error.
    """
    def __init__(self):
        self.api_key = (
            settings.LLM_API_KEY
            or os.getenv("GEMINI_API_KEY", "")
            or os.getenv("GOOGLE_API_KEY", "")
        )
        self.model = settings.LLM_MODEL if settings.LLM_MODEL not in ("none", "", None) else "gemini-flash-latest"
        self.client = httpx.AsyncClient(timeout=12.0)

    def is_configured(self) -> bool:
        return bool(self.api_key and self.api_key.strip())

    async def generate_text(
        self,
        prompt: str,
        system_instruction: Optional[str] = None
    ) -> Optional[str]:
        if not self.is_configured():
            return None

        candidate_models = [self.model]
        if "gemini-flash-lite-latest" not in candidate_models:
            candidate_models.append("gemini-flash-lite-latest")

        for mdl in candidate_models:
            url = f"{GEMINI_API_BASE}/models/{mdl}:generateContent?key={self.api_key}"
            body: Dict[str, Any] = {
                "contents": [
                    {
                        "role": "user",
                        "parts": [{"text": prompt}]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.2,
                    "maxOutputTokens": 1024
                }
            }

            if system_instruction:
                body["systemInstruction"] = {
                    "parts": [{"text": system_instruction}]
                }

            try:
                resp = await self.client.post(url, json=body)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            return parts[0].get("text", "").strip()
                elif resp.status_code == 503:
                    logger.warning(f"Gemini model {mdl} busy (503), trying fallback model...")
                    continue
                else:
                    logger.warning(f"Gemini API returned status {resp.status_code}: {resp.text[:200]}")
            except Exception as e:
                logger.error(f"Gemini API call failed for {mdl}: {e}")

        return None

    async def generate_json(
        self,
        prompt: str,
        schema: Optional[Dict[str, Any]] = None,
        system_instruction: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        if not self.is_configured():
            return None

        candidate_models = [self.model]
        if "gemini-flash-lite-latest" not in candidate_models:
            candidate_models.append("gemini-flash-lite-latest")

        gen_config: Dict[str, Any] = {
            "temperature": 0.1,
            "responseMimeType": "application/json"
        }
        if schema:
            gen_config["responseSchema"] = schema

        body: Dict[str, Any] = {
            "contents": [
                {
                    "role": "user",
                    "parts": [{"text": prompt}]
                }
            ],
            "generationConfig": gen_config
        }

        if system_instruction:
            body["systemInstruction"] = {
                "parts": [{"text": system_instruction}]
            }

        for mdl in candidate_models:
            url = f"{GEMINI_API_BASE}/models/{mdl}:generateContent?key={self.api_key}"
            try:
                resp = await self.client.post(url, json=body)
                if resp.status_code == 200:
                    data = resp.json()
                    candidates = data.get("candidates", [])
                    if candidates:
                        parts = candidates[0].get("content", {}).get("parts", [])
                        if parts:
                            text = parts[0].get("text", "").strip()
                            return json.loads(text)
                elif resp.status_code == 503:
                    logger.warning(f"Gemini JSON model {mdl} busy (503), trying fallback model...")
                    continue
                else:
                    logger.warning(f"Gemini JSON API returned status {resp.status_code}: {resp.text[:200]}")
            except Exception as e:
                logger.error(f"Gemini JSON generation failed for {mdl}: {e}")

        return None

    async def close(self):
        await self.client.aclose()

gemini_provider = GeminiProvider()
