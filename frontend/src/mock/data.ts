import type { AssessmentResponse, ScoreboardData, OrderPreview } from '../types/contract';

export const MOCK_ASSESSMENT_NVDA: AssessmentResponse = {
  type: 'assessment',
  request_id: 'req_nvda_9824',
  generated_at: '2026-10-10T19:45:00Z',
  mode: 'demo',
  mock: false,
  request: {
    ticker: 'NVDA',
    token: 'rNVDA',
    side: 'buy',
    amount_usd: 500,
    context: 'trade'
  },
  verdict: {
    code: 'WAIT',
    tone: 'warning',
    headline: 'The real stock market is closed',
    reason: 'The token price you see reflects off-hours trading and may not represent where NVIDIA will open on the regular US session.',
    limitation: 'Describes current conditions only. Not a price prediction or financial advice.',
    evidence: ['session', 'reference_price']
  },
  facts: [
    {
      id: 'session',
      label: 'US Equity Market',
      value: {
        value: 'closed',
        display: 'Closed (Weekend)',
        tag: 'observed',
        source: 'nyse_calendar',
        as_of: '2026-10-10T19:45:00Z',
        freshness: 'live',
        age_sec: 14,
        reason: null
      }
    },
    {
      id: 'token_price',
      label: 'rNVDA Token Price',
      value: {
        value: 231.35,
        unit: 'USD',
        display: '$231.35',
        tag: 'observed',
        source: 'bitget_reality_ticker',
        as_of: '2026-10-11T20:00:00Z',
        freshness: 'live',
        age_sec: 10,
        reason: null
      }
    },
    {
      id: 'reference_price',
      label: 'NVDA Last Close (Unofficial)',
      value: {
        value: 229.28,
        unit: 'USD',
        display: '$229.28',
        tag: 'observed',
        source: 'yahoo_finance_unofficial',
        as_of: '2026-10-09T20:00:00Z',
        freshness: 'stale',
        age_sec: 85500,
        reason: 'Regular session closed Friday 4:00 PM ET (Unofficial reference quote)'
      }
    },
    {
      id: 'deviation',
      label: 'Gap vs Last Close',
      value: {
        value: 0.90,
        unit: '%',
        display: '+0.90%',
        tag: 'estimated',
        source: 'internal_calc',
        as_of: '2026-10-11T20:00:00Z',
        freshness: 'live',
        age_sec: 10,
        reason: null
      }
    },
    {
      id: 'activity_ratio',
      label: 'Weekend Activity vs Normal',
      value: {
        value: 0.67,
        unit: 'ratio',
        display: '0.67× (Below-median)',
        tag: 'estimated',
        source: 'bitget_turnover_aggregator',
        as_of: '2026-10-11T20:00:00Z',
        freshness: 'delayed',
        age_sec: 120,
        reason: null
      }
    }
  ],
  market: {
    session: {
      state: 'closed',
      next_open: '2026-10-12T13:30:00Z',
      next_open_relative: 'in 1 day 18 hours'
    },
    reference: {
      kind: 'last_close',
      label_text: 'Last regular-session close'
    },
    activity: {
      sample_size: 142,
      confidence: 'medium',
      bucket: 'weekend'
    },
    conflicts: []
  },
  events: {
    banner: {
      event_id: 'evt_nvda_q3',
      text: 'NVDA upcoming catalyst: NVIDIA Q3 FY2026 Earnings Release scheduled for Nov 19 (in 39 days)',
      tone: 'neutral'
    },
    upcoming: [
      {
        id: 'evt_nvda_q3',
        type: 'earnings',
        title: 'NVIDIA Q3 FY2026 Earnings Release & Webcast',
        event_time: '2026-11-19T21:00:00Z',
        timing: 'after_close',
        relative: 'in 39 days',
        source: 'ir.nvidia.com',
        source_url: 'https://investor.nvidia.com',
        summary: 'Company report followed by conference call at 5:00 PM ET regarding Blackwell data center shipments.'
      },
      {
        id: 'evt_nvda_div',
        type: 'dividend_split',
        title: 'Quarterly Cash Dividend Ex-Date',
        event_time: '2026-10-24T13:30:00Z',
        timing: 'before_open',
        relative: 'in 14 days',
        source: 'nasdaq_dividends',
        source_url: 'https://nasdaq.com',
        summary: '$0.01 per share quarterly dividend payable to shareholders of record.'
      }
    ],
    recent: [
      {
        id: 'evt_nvda_gtc',
        type: 'company_update',
        title: 'Executive Architecture Keynote at Tech Summit',
        event_time: '2026-09-28T14:00:00Z',
        timing: 'during',
        relative: '12 days ago',
        source: 'pr_newswire',
        source_url: 'https://prnewswire.com',
        summary: 'Announced expanded enterprise deployment partnerships for next-gen clusters.'
      }
    ]
  },
  history: [
    {
      event_id: 'hist_q2_26',
      event_title: 'Q2 Earnings',
      date: '2026-07-22',
      timing: 'after_close',
      stock_move_pct: 6.4,
      token_move_pct: 5.9,
      activity_change_pct: 184.0,
      origin: 'live'
    },
    {
      event_id: 'hist_q1_26',
      event_title: 'Q1 Earnings',
      date: '2026-04-24',
      timing: 'after_close',
      stock_move_pct: -3.8,
      token_move_pct: -4.1,
      activity_change_pct: 120.0,
      origin: 'live'
    },
    {
      event_id: 'hist_q4_25',
      event_title: 'Q4 Earnings',
      date: '2026-01-20',
      timing: 'after_close',
      stock_move_pct: 9.1,
      token_move_pct: 8.7,
      activity_change_pct: 210.0,
      origin: 'historical'
    },
    {
      event_id: 'hist_q3_25',
      event_title: 'Q3 Earnings',
      date: '2025-10-18',
      timing: 'after_close',
      stock_move_pct: 2.3,
      token_move_pct: null,
      activity_change_pct: null,
      origin: 'historical',
      flags: ['token_not_trading']
    },
    {
      event_id: 'hist_q2_25',
      event_title: 'Q2 Earnings',
      date: '2025-07-15',
      timing: 'after_close',
      stock_move_pct: -1.7,
      token_move_pct: null,
      activity_change_pct: null,
      origin: 'historical',
      flags: ['token_not_trading']
    },
    {
      event_id: 'hist_q1_25',
      event_title: 'Q1 Earnings',
      date: '2025-04-16',
      timing: 'after_close',
      stock_move_pct: 7.8,
      token_move_pct: null,
      activity_change_pct: null,
      origin: 'historical',
      flags: ['token_not_trading']
    }
  ],
  outlook: {
    brief: {
      kind: 'interpretation',
      text: 'Wall Street consensus remains overwhelmingly positive heading into Q3 earnings. While hyperscaler capital expenditure continues to underpin strong revenue revisions, skeptic desks highlight potential margin normalization and supply chain bottlenecks for liquid cooling systems.',
      validated: true,
      fallback_used: false,
      basis: {
        analyst_updates: 24,
        articles: 18,
        window_days: 30
      }
    },
    consensus: {
      buy: 39,
      hold: 5,
      sell: 1,
      tag: 'observed',
      source: 'bitget_mcp_consensus',
      as_of: '2026-10-11T20:00:00Z',
      freshness: 'live'
    },
    targets: {
      low: {
        value: 250.0,
        unit: 'USD',
        display: '$250.00',
        tag: 'observed',
        source: 'bitget_mcp_analyst_targets',
        as_of: '2026-10-11T20:00:00Z',
        freshness: 'live'
      },
      mean: {
        value: 338.50,
        unit: 'USD',
        display: '$338.50',
        tag: 'observed',
        source: 'bitget_mcp_analyst_targets',
        as_of: '2026-10-11T20:00:00Z',
        freshness: 'live'
      },
      high: {
        value: 515.0,
        unit: 'USD',
        display: '$515.00',
        tag: 'observed',
        source: 'bitget_mcp_analyst_targets',
        as_of: '2026-10-11T20:00:00Z',
        freshness: 'live'
      },
      current_price: {
        value: 231.35,
        unit: 'USD',
        display: '$231.35',
        tag: 'observed',
        source: 'bitget_reality_ticker',
        as_of: '2026-10-11T20:00:00Z',
        freshness: 'live'
      },
      analyst_count: 45,
      as_of: '2026-10-11T20:00:00Z'
    },
    arguments: {
      supporters: [
        {
          text: 'Hyperscaler demand remains structural, with enterprise AI inference workloads expanding server order backlogs into 2028.',
          source_count: 12,
          sources: [
            {
              title: 'Goldman Sachs Equity Research: Semiconductor Infrastructure Outlook',
              source: 'Goldman Sachs',
              published_at: '2026-10-05T11:00:00Z',
              url: 'https://goldmansachs.com'
            },
            {
              title: 'Morgan Stanley: Blackwell Volume Ramp Verification',
              source: 'Morgan Stanley',
              published_at: '2026-10-03T09:30:00Z',
              url: 'https://morganstanley.com'
            }
          ]
        },
        {
          text: 'Software ecosystem moat (CUDA, NIM microservices) continues to retain customer stickiness despite ASIC competition.',
          source_count: 6,
          sources: [
            {
              title: 'Bernstein Research: Platform Monetization and Enterprise Software',
              source: 'Bernstein',
              published_at: '2026-09-29T14:15:00Z',
              url: 'https://bernstein.com'
            }
          ]
        }
      ],
      skeptics: [
        {
          text: 'Potential gross margin compression as initial Blackwell packaging yields stabilize and power density constraints delay rack activations.',
          source_count: 4,
          sources: [
            {
              title: 'Barclays Semiconductor Note: Thermal Management Bottlenecks',
              source: 'Barclays',
              published_at: '2026-10-04T16:00:00Z',
              url: 'https://barclays.com'
            },
            {
              title: 'MoffettNathanson: CapEx Digestion Risk into Next Fiscal Year',
              source: 'MoffettNathanson',
              published_at: '2026-09-30T10:00:00Z',
              url: 'https://moffettnathanson.com'
            }
          ]
        }
      ]
    },
    expectations: {
      event_id: 'evt_nvda_q3',
      eps: {
        expected: {
          value: 0.88,
          unit: 'USD',
          display: '$0.88',
          tag: 'estimated',
          source: 'zacks_consensus',
          as_of: '2026-10-09T18:00:00Z',
          freshness: 'delayed'
        },
        year_ago: {
          value: 0.68,
          unit: 'USD',
          display: '$0.68',
          tag: 'historical',
          source: 'sec_10q',
          as_of: '2025-10-20T00:00:00Z',
          freshness: 'stale'
        }
      },
      revenue: {
        expected: {
          value: 37.8,
          unit: 'B USD',
          display: '$37.8B',
          tag: 'estimated',
          source: 'zacks_consensus',
          as_of: '2026-10-09T18:00:00Z',
          freshness: 'delayed'
        },
        year_ago: {
          value: 30.04,
          unit: 'B USD',
          display: '$30.04B',
          tag: 'historical',
          source: 'sec_10q',
          as_of: '2025-10-20T00:00:00Z',
          freshness: 'stale'
        },
        growth: {
          value: 25.8,
          unit: '%',
          display: '+25.8% YoY',
          tag: 'estimated',
          source: 'internal_calc',
          as_of: '2026-10-09T18:00:00Z',
          freshness: 'delayed'
        }
      }
    },
    recent_changes: [
      {
        date: '2026-10-07',
        firm: 'Goldman Sachs',
        action: 'raised',
        target_from: {
          value: 200.0,
          display: '$200.00',
          tag: 'historical',
          source: 'goldman_sachs',
          as_of: '2026-08-15T00:00:00Z',
          freshness: 'stale'
        },
        target_to: {
          value: 225.0,
          display: '$225.00',
          tag: 'observed',
          source: 'goldman_sachs',
          as_of: '2026-10-07T00:00:00Z',
          freshness: 'delayed'
        },
        rating_from: 'Buy',
        rating_to: 'Buy',
        source: 'goldman_research_portal'
      },
      {
        date: '2026-10-03',
        firm: 'Morgan Stanley',
        action: 'maintained',
        target_from: {
          value: 210.0,
          display: '$210.00',
          tag: 'historical',
          source: 'morgan_stanley',
          as_of: '2026-09-01T00:00:00Z',
          freshness: 'stale'
        },
        target_to: {
          value: 210.0,
          display: '$210.00',
          tag: 'observed',
          source: 'morgan_stanley',
          as_of: '2026-10-03T00:00:00Z',
          freshness: 'delayed'
        },
        rating_from: 'Overweight',
        rating_to: 'Overweight',
        source: 'morgan_stanley_desk'
      },
      {
        date: '2026-09-24',
        firm: 'Mizuho Securities',
        action: 'upgraded',
        target_from: {
          value: 175.0,
          display: '$175.00',
          tag: 'historical',
          source: 'mizuho',
          as_of: '2026-07-10T00:00:00Z',
          freshness: 'stale'
        },
        target_to: {
          value: 205.0,
          display: '$205.00',
          tag: 'observed',
          source: 'mizuho',
          as_of: '2026-09-24T00:00:00Z',
          freshness: 'delayed'
        },
        rating_from: 'Neutral',
        rating_to: 'Outperform',
        source: 'mizuho_equity'
      }
    ],
    timeline: [
      {
        id: 'tl_1',
        kind: 'analyst',
        title: 'Goldman Sachs raises target to $225 citing accelerated shipments',
        time: '2026-10-07T11:20:00Z',
        relative: '3 days ago',
        source: 'Goldman Sachs',
        url: 'https://goldmansachs.com'
      },
      {
        id: 'tl_2',
        kind: 'news',
        title: 'Major Cloud Provider adds 50k cluster deployment ahead of schedule',
        time: '2026-10-06T15:45:00Z',
        relative: '4 days ago',
        source: 'Reuters Technology',
        url: 'https://reuters.com'
      },
      {
        id: 'tl_3',
        kind: 'company',
        title: 'Executive VP of Data Center presents at Global Compute Forum',
        time: '2026-09-29T18:00:00Z',
        relative: '11 days ago',
        source: 'NVIDIA Newsroom',
        url: 'https://nvidianews.nvidia.com'
      }
    ],
    availability: {
      consensus: 'ok',
      targets: 'ok',
      arguments: 'ok',
      expectations: 'ok',
      recent_changes: 'ok',
      timeline: 'ok'
    }
  },
  explanation: {
    kind: 'interpretation',
    text: 'NVIDIA is currently in an off-hours weekend window with the real US stock market closed. The token is quoted at $188.40, a +1.18% gap over Friday\'s $186.20 regular session close. Turnover activity is muted at 0.42× normal weekend volume. An upcoming earnings catalyst will trigger tomorrow afternoon. Historically, across the last 6 reported quarters, NVDA has moved an average of ±5.2% on the first trading session post-earnings.',
    validated: true,
    fallback_used: false
  },
  options: [
    {
      id: 'opt_order',
      kind: 'confirm_order',
      label: 'Preview Demo Buy ($500)',
      enabled: true,
      disabled_reason: null,
      requires_confirmation: true,
      params: {
        ticker: 'NVDA',
        token: 'rNVDA',
        side: 'buy',
        amount_usd: 500
      }
    },
    {
      id: 'opt_amount',
      kind: 'adjust_amount',
      label: 'Adjust Amount',
      enabled: true,
      disabled_reason: null,
      requires_confirmation: false,
      params: {}
    },
    {
      id: 'opt_followup',
      kind: 'ask_followup',
      label: 'What happened last time?',
      enabled: true,
      disabled_reason: null,
      requires_confirmation: false,
      params: {
        message: 'What happened around the last earnings report?'
      }
    }
  ],
  data_status: {
    bitget_reality: { status: 'ok', detail: null },
    nyse_session: { status: 'ok', detail: null },
    nasdaq_close: { status: 'ok', detail: 'Market closed' },
    bloomberg_consensus: { status: 'ok', detail: null }
  }
};

export const MOCK_SCOREBOARD: ScoreboardData = {
  type: 'scoreboard',
  totals: {
    verdicts_logged: 384,
    resolved: 326
  },
  by_verdict: [
    {
      code: 'WAIT',
      count: 142,
      resolved: 138,
      median_move_24h: '+0.42%',
      range_24h: '-2.1% to +3.4%'
    },
    {
      code: 'CAUTION',
      count: 48,
      resolved: 44,
      median_move_24h: '-1.85%',
      range_24h: '-8.4% to +6.1%'
    },
    {
      code: 'QUIET',
      count: 96,
      resolved: 88,
      median_move_24h: '+0.11%',
      range_24h: '-1.2% to +1.4%'
    },
    {
      code: 'REASONABLE',
      count: 92,
      resolved: 52,
      median_move_24h: '+0.34%',
      range_24h: '-3.2% to +4.0%'
    },
    {
      code: 'INSUFFICIENT_DATA',
      count: 6,
      resolved: 4,
      median_move_24h: '0.00%',
      range_24h: 'N/A'
    }
  ],
  journal: {
    events_recorded_live: 38,
    events_loaded_historical: 288
  },
  note: 'Records past outcome divergence after 1h and 24h. Past distribution only. Never represents predictive certainty.'
};

export const MOCK_ORDER_PREVIEW: OrderPreview = {
  type: 'order_preview',
  mode: 'demo',
  order: {
    ticker: 'NVDA',
    token: 'rNVDA',
    side: 'buy',
    amount_usd: 50
  },
  cap: {
    max_usd: 50,
    within_cap: true,
    message: null
  },
  changed: false,
  change_summary: null,
  confirmation_token: 'ct_demo_9824_xyz',
  expires_at: '2026-10-10T20:47:00Z'
};
