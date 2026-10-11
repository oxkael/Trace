# Code-side session explainers matching LLM_PROMPTS.md Section 4.3

SESSION_EXPLAINERS = {
    "weekend": "US stock markets are closed for the weekend. The token keeps trading on Bitget. The stock has no live price right now; its last regular-session close was {close} on {close_date}. US trading resumes {next_open}.",
    "holiday": "US stock markets are closed for {holiday}. The token keeps trading on Bitget. The stock has no live price right now; its last regular-session close was {close} on {close_date}. US trading resumes {next_open}.",
    "overnight": "US stock markets are closed overnight. The token keeps trading on Bitget. The stock's last regular-session close was {close} on {close_date}. US trading resumes {next_open}.",
    "pre_market": "US stock markets are in pre-market. Regular trading opens {next_open}. The token trades on Bitget throughout.",
    "after_hours": "US stock markets are in after-hours trading. Regular trading resumes {next_open}. The token trades on Bitget throughout.",
    "regular": "US stock markets are open, so the token and the stock are trading at the same time.",
    "closed": "US stock markets are closed. The token keeps trading on Bitget. The stock has no live price right now; its last regular-session close was {close} on {close_date}. US trading resumes {next_open}."
}

def get_session_explainer(state: str, close: str = "$0.00", close_date: str = "recent close", next_open: str = "Mon 9:30 am ET", holiday: str = "the holiday") -> str:
    template = SESSION_EXPLAINERS.get(state, SESSION_EXPLAINERS["closed"])
    return template.format(
        close=close,
        close_date=close_date,
        next_open=next_open,
        holiday=holiday
    )
