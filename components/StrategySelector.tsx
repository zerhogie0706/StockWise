import React from 'react';
import { StrategyType, StrategyOption } from '../types';
import { Check, Info } from 'lucide-react';

interface StrategySelectorProps {
  selectedStrategies: StrategyType[];
  onToggleStrategy: (strategy: StrategyType) => void;
}

const STRATEGIES: StrategyOption[] = [
  {
    id: 'macd',
    label: 'MACD Golden Cross',
    type: StrategyType.MACD_GOLDEN_CROSS,
    description: 'When the MACD line crosses above the signal line, indicating bullish momentum.'
  },
  {
    id: 'rsi',
    label: 'RSI Divergence',
    type: StrategyType.RSI_DIVERGENCE,
    description: 'When price makes a new low but RSI makes a higher low, suggesting a potential reversal.'
  },
  {
    id: 'volume',
    label: 'Large Trading Volume',
    type: StrategyType.VOLUME_SPIKE,
    description: 'Abnormal increase in trading volume relative to the average.'
  },
  {
    id: 'bollinger',
    label: 'Bollinger Band Squeeze',
    type: StrategyType.BOLLINGER_SQUEEZE,
    description: 'Periods of low volatility that are often followed by significant price moves.'
  },
  {
    id: 'ma',
    label: 'MA Support (50/200)',
    type: StrategyType.MA_SUPPORT,
    description: 'Price testing key moving averages (50-day or 200-day) which often act as support.'
  }
];

const StrategySelector: React.FC<StrategySelectorProps> = ({ selectedStrategies, onToggleStrategy }) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <span className="bg-indigo-100 text-indigo-600 p-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 11 22 2 13 21 11 13 3 11"/></svg>
        </span>
        Select Strategies
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {STRATEGIES.map((strategy) => {
          const isSelected = selectedStrategies.includes(strategy.type);
          return (
            <button
              key={strategy.id}
              onClick={() => onToggleStrategy(strategy.type)}
              className={`relative group flex flex-col items-start p-4 rounded-lg border-2 transition-all duration-200 text-left h-full
                ${isSelected 
                  ? 'border-indigo-600 bg-indigo-50/50' 
                  : 'border-slate-100 hover:border-indigo-200 hover:bg-slate-50'
                }`}
            >
              <div className="flex justify-between w-full mb-2">
                <span className={`font-medium ${isSelected ? 'text-indigo-900' : 'text-slate-700'}`}>
                  {strategy.label}
                </span>
                {isSelected && (
                  <span className="text-indigo-600">
                    <Check size={18} />
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-500 line-clamp-2">
                {strategy.description}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default StrategySelector;
