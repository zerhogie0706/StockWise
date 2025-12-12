export interface Stock {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: string;
  market: 'US' | 'TW';
  strategyMatch?: string[];
  aiReasoning?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  watchlist: Stock[];
  picture?: string;
}

export const StrategyType = {
  MACD_GOLDEN_CROSS: 'MACD Golden Cross',
  RSI_DIVERGENCE: 'RSI Divergence',
  VOLUME_SPIKE: 'Large Trading Volume',
  BOLLINGER_SQUEEZE: 'Bollinger Band Squeeze',
  MA_SUPPORT: 'Moving Average Support',
} as const;

export type StrategyType = typeof StrategyType[keyof typeof StrategyType];

export interface StrategyOption {
  id: string;
  label: string;
  description: string;
  type: StrategyType;
}

declare global {
    interface Window {
        google: any;
    }
}