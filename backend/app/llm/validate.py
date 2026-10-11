import os
from typing import List, Tuple

BANNED_PHRASES_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "data", "banned_phrases.txt")

def load_banned_phrases() -> List[str]:
    if not os.path.exists(BANNED_PHRASES_PATH):
        return []
    with open(BANNED_PHRASES_PATH, "r", encoding="utf-8") as f:
        return [line.strip().lower() for line in f if line.strip()]

def validate_text(text: str) -> Tuple[bool, List[str]]:
    """
    Validates model or template output against banned phrases (predictions, advice, guaranteed profit).
    Returns (is_valid, violated_phrases).
    """
    lower = text.lower()
    banned = load_banned_phrases()
    violations = [p for p in banned if p in lower]
    return len(violations) == 0, violations
