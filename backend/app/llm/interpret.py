import re
import json
import os
from typing import Dict, Any, List, Optional
from pydantic import BaseModel

class ParsedIntent(BaseModel):
    intent: str # "trade", "check", "research", "event_question", "outlook_question", "activity_question", "holding_check", "scoreboard", "unsupported"
    ticker: str = "NVDA"
    token: str = "rNVDA"
    side: str = "buy" # "buy", "sell", "hold"
    amount_usd: Optional[float] = None
    needs_clarification: bool = False
    clarification_question: Optional[str] = None

SUPPORTED_TICKERS = {
    "NVDA": "rNVDA",
    "TSLA": "rTSLA",
    "AMD": "rAMD",
    "AMZN": "rAMZN"
}

TICKER_ALIASES = {
    "NVIDIA": "NVDA",
    "TESLA": "TSLA",
    "ADVANCED MICRO DEVICES": "AMD",
    "AMAZON": "AMZN",
    "RNVDA": "NVDA",
    "RTSLA": "TSLA",
    "RAMD": "AMD",
    "RAMZN": "AMZN"
}

def parse_user_query(message: str) -> ParsedIntent:
    """
    Four-stage interpreter matching Part D.8.2:
    1. Pre-pass (rules): extract amounts ($2k, 500, etc), side, supported tickers.
    2. Entity resolution: resolve aliases or detect unsupported tickers.
    3. Intent classification: trade, check, research, event, outlook, activity, scoreboard.
    4. Refusal handling: refusals for prediction questions ('will NVDA go up?').
    """
    clean = message.strip()
    upper = clean.upper()

    # Check for direct prediction asks
    if any(phrase in upper for phrase in ["WILL IT GO UP", "WILL IT GO DOWN", "PRICE PREDICTION", "PRICE TARGET", "SHOULD I BUY TO MAKE PROFIT"]):
        # Unsupported prediction request (refusal according to Part B.5)
        return ParsedIntent(
            intent="unsupported",
            ticker="NVDA",
            token="rNVDA",
            needs_clarification=True,
            clarification_question="Trace evaluates observed market conditions and historical catalyst look-backs only. It does not provide price forecasts, predictions, or investment advice."
        )

    # 1. Resolve ticker
    detected_ticker = "NVDA" # default
    ticker_found = False
    for alias, standard in TICKER_ALIASES.items():
        if alias in upper:
            detected_ticker = standard
            ticker_found = True
            break
    
    if not ticker_found:
        for sym in SUPPORTED_TICKERS.keys():
            if re.search(r'\b' + sym + r'\b', upper):
                detected_ticker = sym
                ticker_found = True
                break

    # 2. Extract amount
    amount_usd = None
    amount_match = re.search(r'\$\s*([0-9,]+(?:\.[0-9]+)?)', clean)
    if amount_match:
        amount_usd = float(amount_match.group(1).replace(",", ""))
    else:
        # Check for words like 500 dollars or 2k
        k_match = re.search(r'([0-9]+(?:\.[0-9]+)?)\s*k\b', clean, re.IGNORECASE)
        if k_match:
            amount_usd = float(k_match.group(1)) * 1000.0
        else:
            num_match = re.search(r'([0-9]+)\s*(?:dollars|usd)', clean, re.IGNORECASE)
            if num_match:
                amount_usd = float(num_match.group(1))

    # 3. Extract side
    side = "buy"
    if "SELL" in upper:
        side = "sell"
    elif "HOLD" in upper or "HOLDING" in upper:
        side = "hold"

    # 4. Classify intent
    intent = "check"
    if amount_usd is not None or any(w in upper for w in ["CAN I BUY", "CAN I SELL", "PLACE ORDER", "PURCHASE"]):
        intent = "trade"
    elif any(w in upper for w in ["EARNINGS", "CATALYST", "WHEN DOES", "REPORT", "LOOKBACK", "LAST TIME"]):
        intent = "event_question"
    elif any(w in upper for w in ["ANALYST", "ANALYSTS", "TARGETS", "WALL STREET", "SPLIT ON", "NEWS"]):
        intent = "outlook_question"
    elif any(w in upper for w in ["ACTIVITY", "QUIET", "VOLUME", "TURNOVER", "LIQUIDITY", "BUSY"]):
        intent = "activity_question"
    elif any(w in upper for w in ["SCOREBOARD", "ACCURACY", "WARNINGS", "LEDGER", "TRACK RECORD"]):
        intent = "scoreboard"
    elif any(w in upper for w in ["HOLDING", "OVER THE WEEKEND", "WATCH"]):
        intent = "holding_check"
    elif any(w in upper for w in ["WHAT'S GOING ON", "TELL ME ABOUT", "RESEARCH", "OVERVIEW"]):
        intent = "research"

    return ParsedIntent(
        intent=intent,
        ticker=detected_ticker,
        token=SUPPORTED_TICKERS[detected_ticker],
        side=side,
        amount_usd=amount_usd
    )
