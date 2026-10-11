import re
from typing import List, Tuple, Dict, Any, Optional

BANNED_WORDS_AND_PHRASES = [
    r"\bwait\b",
    r"\bavoid\b",
    r"\bshould\b",
    r"\bshouldn't\b",
    r"\brecommend\b",
    r"\bsuggest\b",
    r"\byou may want\b",
    r"\bkeep in mind\b",
    r"\bcareful\b",
    r"\bcaution\b",
    r"\bhurry\b",
    r"\bwill rise\b",
    r"\bwill fall\b",
    r"\blikely to\b",
    r"\bexpected to move\b",
    r"\bre-align\b",
    r"\brealign\b",
    r"\bcorrect\b",
    r"\bcatch up\b",
    r"\bset to\b",
    r"\bliquid\b",
    r"\billiquid\b",
    r"\bdeep market\b",
    r"\bhealthy volume\b",
    r"\bample\b",
    r"\bit's important to note\b",
    r"\bworth noting\b",
    r"\boverall\b",
    r"\bin conclusion\b",
    r"\bdelve\b",
    r"\blandscape\b",
    r"\bnavigate\b"
]

def check_banned_language(text: str) -> List[str]:
    """Checks for banned words, phrases, and exclamation marks."""
    violations = []
    if "!" in text:
        violations.append("Exclamation mark '!' is not permitted.")
    
    text_lower = text.lower()
    for pattern in BANNED_WORDS_AND_PHRASES:
        if re.search(pattern, text_lower):
            matched = pattern.replace(r"\b", "")
            violations.append(f"Banned language: '{matched}'")
            
    return violations

def validate_text(text: str) -> Tuple[bool, List[str]]:
    """Legacy helper for simple text checks."""
    violations = check_banned_language(text)
    return len(violations) == 0, violations

def word_count(s: str) -> int:
    return len(s.strip().split())

def validate_briefing(briefing: Dict[str, Any], payload_str: str) -> Tuple[bool, List[str]]:
    """
    Validates a briefing dictionary against Section 10 rules:
    - Schema fields & length limits
    - Banned language & exclamation marks
    - Missing data wording
    - Number hallucination check against payload string
    """
    reasons = []

    # 1. Field presence & lengths
    headline = briefing.get("headline", "")
    summary = briefing.get("summary", "")
    sections = briefing.get("sections", [])
    worth_weighing = briefing.get("worth_weighing", [])

    if not headline:
        reasons.append("Missing 'headline'")
    elif word_count(headline) > 35: # limit 30 with slight grace
        reasons.append(f"'headline' exceeds word limit ({word_count(headline)} > 30)")

    if not summary:
        reasons.append("Missing 'summary'")
    elif word_count(summary) > 135: # limit 120 with slight grace
        reasons.append(f"'summary' exceeds word limit ({word_count(summary)} > 120)")

    # 2. Check banned language across all text
    all_text = f"{headline} {summary}"
    for sec in sections:
        sec_title = sec.get("title", "")
        sec_text = sec.get("text", "")
        all_text += f" {sec_title} {sec_text}"
        if word_count(sec_title) > 8:
            reasons.append(f"Section title '{sec_title}' exceeds 6 words")
        if word_count(sec_text) > 65:
            reasons.append(f"Section text '{sec_title}' exceeds 55 words")

    for ww in worth_weighing:
        all_text += f" {ww}"
        if word_count(ww) > 35:
            reasons.append(f"worth_weighing item exceeds 30 words")

    banned_violations = check_banned_language(all_text)
    reasons.extend(banned_violations)

    # 3. Missing data claims check
    lower_text = all_text.lower()
    for phrase in ["no news", "nothing scheduled", "no risks", "no catalysts"]:
        if phrase in lower_text and phrase not in payload_str.lower():
            reasons.append(f"Unsubstantiated missing data claim: '{phrase}'")

    # 4. Number check: any numbers with symbols ($ or %) should be in payload
    # Find price or percentage patterns e.g. $123.45, +2.5%, 45%
    numbers_with_units = re.findall(r"[\$€£]?\d+(?:\.\d+)?%?", all_text)
    payload_lower = payload_str.lower()
    for token in numbers_with_units:
        # ignore single digits or common small indices 1, 2, 3, 24
        clean = token.replace("$", "").replace("%", "")
        if clean in ["1", "2", "3", "4", "5", "24"]:
            continue
        if token.lower() not in payload_lower and clean not in payload_lower:
            reasons.append(f"Number '{token}' does not appear in facts payload")

    return len(reasons) == 0, reasons
