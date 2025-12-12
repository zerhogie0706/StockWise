import React, { useState } from 'react';
import Tutorial from './components/Tutorial';
import Dashboard from './components/Dashboard';
import AdminView from './components/AdminView';
import { User, Stock } from './types';
import { LogOut, LayoutDashboard, Settings } from 'lucide-react';

// Mock DB of users for Admin view
const MOCK_USERS: User[] = [
  { 
    id: '1', 
    name: 'Guest User', 
    email: 'guest@stockwise.ai', 
    role: 'user', 
    watchlist: [
        { symbol: 'AMD', name: 'Advanced Micro Devices', price: 180.0, change: 2.5, changePercent: 1.4, volume: '40M', market: 'US' }
    ] 
  },
  { 
    id: '2', 
    name: 'Alice Chen', 
    email: 'alice@example.tw', 
    role: 'user', 
    watchlist: [
         { symbol: '2330.TW', name: 'TSMC', price: 780.0, change: 5.0, changePercent: 0.65, volume: '20M', market: 'TW' }
    ] 
  },
];

// Helper to decode JWT without external library for demo purposes
const parseJwt = (token: string) => {
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        return JSON.parse(jsonPayload);
    } catch (e) {
        return {};
    }
};

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(MOCK_USERS[0]);
  const [view, setView] = useState<'dashboard' | 'admin'>('dashboard');

  const handleLogin = (credentialResponse: any) => {
    // 1. Get the Google JWT Token
    const token = credentialResponse.credential;
    
    // 2. Decode user info from token (Frontend only decode)
    // In production, send `token` to Django backend for verification:
    // await fetch('/api/auth/google/', { method: 'POST', body: JSON.stringify({ token }) })
    let userInfo = { name: 'Guest', email: 'guest@example.com', picture: '' };
    
    if (token && token !== "MOCK_TOKEN_FOR_DEMO") {
        const decoded = parseJwt(token);
        userInfo = {
            name: decoded.name || 'Google User',
            email: decoded.email || 'user@google.com',
            picture: decoded.picture
        };
    }

    setIsAuthenticated(true);
    
    // 3. Set User State
    // Check if this user is a "Superuser" (simple email check for demo)
    const isAdmin = userInfo.email === 'your_admin_email@gmail.com' || userInfo.email === 'admin@stockwise.ai';
    
    setCurrentUser({
      id: token ? token.substring(0, 10) : 'guest-id',
      name: userInfo.name,
      email: userInfo.email,
      picture: userInfo.picture,
      role: isAdmin ? 'admin' : 'user',
      watchlist: MOCK_USERS[0].watchlist // Inherit mock watchlist for demo
    }); 
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setView('dashboard');
    // Also sign out from Google context if needed
    if (window.google) {
        window.google.accounts.id.disableAutoSelect();
    }
  };

  const addToWatchlist = (stock: Stock) => {
    setCurrentUser(prev => {
      if (prev.watchlist.some(s => s.symbol === stock.symbol)) return prev;
      return {
        ...prev,
        watchlist: [...prev.watchlist, stock]
      };
    });
  };

  if (!isAuthenticated) {
    return <Tutorial onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Bar */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="text-xl font-extrabold text-slate-900">Stock<span className="text-indigo-600">Wise</span></span>
              
              <div className="ml-10 flex items-baseline space-x-4">
                 <button 
                    onClick={() => setView('dashboard')}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'dashboard' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
                 >
                    Dashboard
                 </button>
                 {currentUser.role === 'admin' && (
                    <button 
                        onClick={() => setView('admin')}
                        className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${view === 'admin' ? 'bg-indigo-50 text-indigo-700' : 'text-slate-600 hover:text-slate-900'}`}
                    >
                        Admin View
                    </button>
                 )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-100 rounded-full">
                  {currentUser.picture ? (
                       <img src={currentUser.picture} alt="profile" className="w-6 h-6 rounded-full" />
                  ) : (
                      <div className="w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center text-xs text-white font-bold">
                          {currentUser.name.charAt(0)}
                      </div>
                  )}
                  <span className="text-sm font-medium text-slate-700 hidden sm:block">{currentUser.name}</span>
              </div>
              <button 
                onClick={handleLogout}
                className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                title="Logout"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pb-12">
        {view === 'dashboard' ? (
            <Dashboard 
                user={currentUser} 
                onUpdateWatchlist={addToWatchlist}
                isSuperUser={currentUser.role === 'admin'}
            />
        ) : (
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <AdminView users={MOCK_USERS} />
            </div>
        )}
      </main>
    </div>
  );
};

export default App;