import React, { useState, useEffect } from 'react';
import { Stock, StrategyType, User } from '../types';
import StrategySelector from './StrategySelector';
import StockTable from './StockTable';
import { getAIStockRecommendations, getMarketAnalysis } from '../services/geminiService';
import { LineChart, Line, ResponsiveContainer, XAxis, YAxis, Tooltip } from 'recharts';
import { TrendingUp, Activity, Bell } from 'lucide-react';

interface DashboardProps {
  user: User;
  onUpdateWatchlist: (stock: Stock) => void;
  isSuperUser: boolean;
}

const Dashboard: React.FC<DashboardProps> = ({ user, onUpdateWatchlist, isSuperUser }) => {
  const [selectedStrategies, setSelectedStrategies] = useState<StrategyType[]>([]);
  const [recommendedStocks, setRecommendedStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);
  const [marketAnalysis, setMarketAnalysis] = useState<string>("");

  useEffect(() => {
    // Initial market check
    getMarketAnalysis().then(setMarketAnalysis);
  }, []);

  const handleStrategyToggle = (strategy: StrategyType) => {
    setSelectedStrategies(prev => 
      prev.includes(strategy) ? prev.filter(s => s !== strategy) : [...prev, strategy]
    );
  };

  const handleRunScan = async () => {
    if (selectedStrategies.length === 0) return;
    setLoading(true);
    const results = await getAIStockRecommendations(selectedStrategies);
    setRecommendedStocks(results);
    setLoading(false);
  };

  // Mock data for mini charts
  const chartData = [
    { v: 100 }, { v: 102 }, { v: 101 }, { v: 105 }, { v: 104 }, { v: 108 }, { v: 110 }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Top Section: User Tracking / Daily Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Market Overview Panel */}
        <div className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white p-6 rounded-xl shadow-lg lg:col-span-3">
             <div className="flex items-center gap-2 mb-2 opacity-80">
                <Activity size={18} />
                <span className="text-sm font-medium tracking-wide uppercase">Market Intelligence</span>
             </div>
             <h1 className="text-2xl font-bold mb-2">Hello, {user.name}</h1>
             <p className="text-indigo-100 max-w-3xl leading-relaxed">
                {marketAnalysis || "Loading market insights..."}
             </p>
        </div>

        {/* Watchlist Section */}
        <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    <TrendingUp className="text-emerald-500" />
                    Your Watchlist
                </h2>
                <button className="text-sm text-indigo-600 font-medium hover:underline">Manage Alerts</button>
            </div>
            
            {user.watchlist.length === 0 ? (
                 <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center text-slate-500">
                    <Bell className="mx-auto mb-2 text-slate-300" size={32} />
                    <p>Your watchlist is empty. Use the scanner below to find stocks.</p>
                 </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {user.watchlist.map(stock => (
                        <div key={stock.symbol} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                            <div className="flex justify-between items-start mb-2">
                                <div>
                                    <div className="font-bold text-lg text-slate-900">{stock.symbol}</div>
                                    <div className="text-xs text-slate-500">{stock.name}</div>
                                </div>
                                <span className={`text-sm font-bold ${stock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {stock.changePercent.toFixed(2)}%
                                </span>
                            </div>
                            <div className="h-16 w-full -ml-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={chartData}>
                                        <Line type="monotone" dataKey="v" stroke={stock.change >= 0 ? '#10b981' : '#f43f5e'} strokeWidth={2} dot={false} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="flex justify-between items-center mt-2 pt-2 border-t border-slate-100 text-sm">
                                <span className="text-slate-500">Price</span>
                                <span className="font-mono font-medium">${stock.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>

      <hr className="border-slate-200" />

      {/* Main Section: Strategy Scanner */}
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
                <h2 className="text-xl font-bold text-slate-800">AI Strategy Screener</h2>
                <p className="text-slate-500">Select multiple technical indicators to filter stocks.</p>
            </div>
            <button 
                onClick={handleRunScan}
                disabled={loading || selectedStrategies.length === 0}
                className={`px-6 py-3 rounded-lg font-semibold text-white transition-all shadow-md
                    ${loading || selectedStrategies.length === 0 
                        ? 'bg-slate-300 cursor-not-allowed' 
                        : 'bg-indigo-600 hover:bg-indigo-700 hover:shadow-lg active:scale-95'
                    }`}
            >
                {loading ? 'Scanning...' : 'Run Analysis'}
            </button>
        </div>

        <StrategySelector 
            selectedStrategies={selectedStrategies} 
            onToggleStrategy={handleStrategyToggle} 
        />

        <StockTable 
            stocks={recommendedStocks} 
            loading={loading}
            onAddToWatchlist={onUpdateWatchlist}
        />
      </div>
    </div>
  );
};

export default Dashboard;
