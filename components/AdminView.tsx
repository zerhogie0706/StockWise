import React from 'react';
import { User } from '../types';
import { Users, Eye } from 'lucide-react';

interface AdminViewProps {
  users: User[];
}

const AdminView: React.FC<AdminViewProps> = ({ users }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <Users className="text-indigo-600" />
            Admin Dashboard
        </h2>
        <span className="text-sm bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium">
            Superuser Access
        </span>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {users.map(user => (
          <div key={user.id} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center justify-between">
               <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold">
                       {user.name.charAt(0)}
                   </div>
                   <div>
                        <h3 className="font-semibold text-slate-900">{user.name}</h3>
                        <p className="text-xs text-slate-500">{user.email}</p>
                   </div>
               </div>
               <div className="text-sm text-slate-500">
                   {user.watchlist.length} items tracked
               </div>
            </div>
            
            <div className="p-4">
                {user.watchlist.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                        {user.watchlist.map(stock => (
                            <div key={stock.symbol} className="flex items-center justify-between p-3 rounded border border-slate-100 bg-slate-50/50">
                                <div className="flex flex-col">
                                    <span className="font-bold text-slate-800">{stock.symbol}</span>
                                    <span className="text-xs text-slate-500">{stock.name}</span>
                                </div>
                                <div className={`text-sm font-mono ${stock.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                                    {stock.change > 0 ? '+' : ''}{stock.changePercent.toFixed(2)}%
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-slate-400 text-sm">
                        This user is not tracking any stocks.
                    </div>
                )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminView;
