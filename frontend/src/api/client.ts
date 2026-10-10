import type { AssessmentResponse, ProgressStep, OrderPreview, OrderResult, ScoreboardData } from '../types/contract';
import { MOCK_ASSESSMENT_NVDA, MOCK_SCOREBOARD, MOCK_ORDER_PREVIEW } from '../mock/data';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

export interface ChatStreamCallbacks {
  onStep: (step: ProgressStep) => void;
  onResult: (result: AssessmentResponse) => void;
  onError: (error: string) => void;
}

export async function askAssistant(
  message: string,
  callbacks: ChatStreamCallbacks
): Promise<void> {
  try {
    // Attempt real SSE backend stream if API is available
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'text/event-stream'
      },
      body: JSON.stringify({ message, session_id: 's_ui_session' })
    });

    if (response.ok && response.body) {
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const dataStr = line.slice(6).trim();
            if (!dataStr) continue;
            try {
              const parsed = JSON.parse(dataStr);
              if (parsed.step) {
                callbacks.onStep(parsed as ProgressStep);
              } else if (parsed.type === 'assessment') {
                callbacks.onResult(parsed as AssessmentResponse);
              }
            } catch (err) {
              console.warn('Failed to parse SSE chunk:', dataStr);
            }
          }
        }
      }
      return;
    }
  } catch (err) {
    // Fall back to high-fidelity mock stream simulation
  }

  // High-fidelity client-side mock simulation with real step delays
  const steps: ProgressStep[] = [
    { step: 'parsed', status: 'done', label: 'Parsed question intent (Trade Check)', ms: 65 },
    { step: 'session_checked', status: 'done', label: 'Checked market session (NYSE Weekend Closed)', ms: 140 },
    { step: 'token_loaded', status: 'done', label: 'Loaded rNVDA ticker & candles', ms: 210 },
    { step: 'underlying_loaded', status: 'done', label: 'Loaded NVDA regular close ($186.20)', ms: 195 },
    { step: 'activity_computed', status: 'done', label: 'Computed turnover ratio vs weekend normal (0.42×)', ms: 120 },
    { step: 'events_loaded', status: 'done', label: 'Loaded upcoming earnings catalyst (18 hours)', ms: 180 },
    { step: 'history_loaded', status: 'done', label: 'Measured 6 past earnings event moves', ms: 240 },
    { step: 'verdict_ready', status: 'done', label: 'Evaluated WAIT verdict (US market closed)', ms: 45 },
    { step: 'explanation_ready', status: 'done', label: 'Fact-validated interpretation synthesis', ms: 90 },
    { step: 'done', status: 'done', label: 'Card assembled', ms: 25 }
  ];

  for (let i = 0; i < steps.length; i++) {
    const s = steps[i];
    callbacks.onStep({ ...s, status: 'running' });
    await new Promise((r) => setTimeout(r, 120));
    callbacks.onStep(s);
  }

  callbacks.onResult(MOCK_ASSESSMENT_NVDA);
}

export async function fetchScoreboard(): Promise<ScoreboardData> {
  try {
    const res = await fetch(`${API_BASE_URL}/ledger`);
    if (res.ok) {
      return await res.json();
    }
  } catch (err) {
    // Use mock
  }
  return MOCK_SCOREBOARD;
}

export async function getOrderPreview(): Promise<OrderPreview> {
  return MOCK_ORDER_PREVIEW;
}

export async function confirmOrder(_token: string): Promise<OrderResult> {
  return {
    type: 'order_result',
    status: 'placed',
    mode: 'demo',
    exchange_ref: 'BG_DEMO_ORD_89234',
    message: 'Demo buy order of $50 placed into simulation matching engine.',
    retryable: false
  };
}
