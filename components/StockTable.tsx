import React from 'react';
import { Stock } from '../types';
import { TrendingUp, TrendingDown, PlusCircle, ExternalLink, Bot } from 'lucide-react';

interface StockTableProps {
  stocks: Stock[];
  loading: boolean;
  onAddToWatchlist: (stock: Stock) => void;
  title?: string;
}

const StockTable: React.FC<StockTableProps> = ({ stocks, loading, onAddToWatchlist, title = "Results" }) => {
  if (loading) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center text-slate-400 bg-white rounded-xl border border-slate-200 animate-pulse">
         <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
         <p>Analyzing market data with Gemini AI...</p>
      </div>
    );
  }

  if (stocks.length === 0) {
    return (
      <div className="w-full p-8 text-center text-slate-500 bg-white rounded-xl border border-slate-200">
        <p>No stocks found matching the selected criteria.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        {title && <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
            <h3 className="font-semibold text-slate-800">{title}</h3>
        </div>}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">Symbol</th>
              <th className="px-6 py-4">Price</th>
              <th className="px-6 py-4">Change</th>
              <th className="px-6 py-4">Market</th>
              <th className="px-6 py-4 w-1/3">AI Insight</th>
              <th className="px-6 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {stocks.map((stock) => (
              <tr key={stock.symbol} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="font-bold text-slate-900">{stock.symbol}</div>
                    <div className="text-xs text-slate-500 hidden sm:block">{stock.name}</div>
                  </div>
                </td>
                <td className="px-6 py-4 font-mono text-slate-700">
                  {stock.price.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <div className={`flex items-center gap-1 ${stock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {stock.change >= 0 ? <TrendingUp size={16} /> : <TrendingDown size={16} />}
                    <span className="font-medium">
                        {stock.change > 0 ? '+' : ''}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${stock.market === 'US' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                        {stock.market}
                    </span>
                </td>
                <td className="px-6 py-4">
                    {stock.aiReasoning && (
                        <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-2 rounded border border-slate-100">
                             <Bot size={14} className="mt-0.5 text-indigo-500 flex-shrink-0" />
                             <span>{stock.aiReasoning}</span>
                        </div>
                    )}
                </td>
                <td className="px-6 py-4 text-right">
                  <button
                    onClick={() => onAddToWatchlist(stock)}
                    className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 p-2 rounded-full transition-colors"
                    title="Add to Watchlist"
                  >
                    <PlusCircle size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockTable;
