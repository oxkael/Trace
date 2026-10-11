# Code-side meaning notes matching LLM_PROMPTS.md Section 4.4

MEANING_NOTES = {
    "token_price": "The token's current price on Bitget.",
    "reference_price_live": "The stock's current price.",
    "reference_price_last_close": "The stock has no live price while US markets are closed. This is its last regular-session close.",
    "premium_pct": "How far the token sits above or below the stock's reference price. A gap can reflect news, differences in trading activity, or both; the data cannot separate them.",
    "activity_ratio": "The token's recent trading turnover compared with its typical turnover for this time of week. It shows how busy trading is, not how much can be traded.",
    "turnover_24h": "Total value traded in the token over the last 24 hours.",
    "price_range_24h": "The token's lowest and highest price over the last 24 hours.",
    "order_share_24h": "The user's amount as a share of the token's last 24 hours of turnover. It gives a sense of size relative to this market.",
    "next_earnings": "The date the company is scheduled to report quarterly results.",
    "history_range": "The range of the stock's moves after its last several reports. Past outcomes only.",
    "consensus": "How many analysts rate the stock buy, hold or sell.",
    "price_targets": "Analysts' published price targets. They are opinions, not forecasts the app endorses.",
    "estimates": "What analysts expect the company to report, compared with a year ago."
}

def get_meaning_note(fact_id: str, is_live_quote: bool = False) -> str:
    if fact_id == "reference_price":
        return MEANING_NOTES["reference_price_live"] if is_live_quote else MEANING_NOTES["reference_price_last_close"]
    return MEANING_NOTES.get(fact_id, "Market metric tracked by the app.")
