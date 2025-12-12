import React, { useEffect, useState } from 'react';
import { TrendingUp, ShieldCheck, Zap, BarChart2, AlertCircle } from 'lucide-react';

interface TutorialProps {
  onLogin: (credentialResponse: any) => void;
}

// Replace this with your actual Google Client ID from Google Cloud Console
// For local development, you need to add your localhost to Authorized Origins
const GOOGLE_CLIENT_ID = "YOUR_GOOGLE_CLIENT_ID_HERE"; 

const Tutorial: React.FC<TutorialProps> = ({ onLogin }) => {
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check if google script is loaded
    if (window.google) {
        try {
            window.google.accounts.id.initialize({
                client_id: GOOGLE_CLIENT_ID,
                callback: onLogin,
                auto_select: false,
                cancel_on_tap_outside: true,
            });
            
            window.google.accounts.id.renderButton(
                document.getElementById("googleSignInBtn"),
                { theme: "outline", size: "large", width: "300", text: "continue_with" } 
            );
        } catch (e) {
            console.error("Google Auth Init Error", e);
            setError("Could not initialize Google Auth. Check Client ID.");
        }
    } else {
        setError("Google Identity Services script not loaded.");
    }
  }, [onLogin]);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#4f46e5_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 relative z-10 text-center">
            <div className="inline-flex items-center px-3 py-1 rounded-full border border-indigo-400 bg-indigo-900/50 text-indigo-300 text-sm font-medium mb-6">
                <span className="flex h-2 w-2 rounded-full bg-indigo-400 mr-2"></span>
                v1.0 MVP Live
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                Stock<span className="text-indigo-500">Wise</span>
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 max-w-2xl mx-auto mb-12">
                Intelligent stock screening for Taiwan and US markets. Combine technical strategies with AI insights.
            </p>
            
            <div className="flex flex-col items-center justify-center space-y-4">
                {/* Google Sign In Container */}
                <div id="googleSignInBtn" className="min-h-[44px]"></div>
                
                {GOOGLE_CLIENT_ID === "YOUR_GOOGLE_CLIENT_ID_HERE" && (
                    <div className="flex items-center gap-2 text-yellow-400 bg-yellow-900/30 px-4 py-2 rounded text-sm max-w-md">
                        <AlertCircle size={16} />
                        <span>Dev Mode: Replace CLIENT_ID in code to enable real Auth.</span>
                    </div>
                )}
                
                {/* Mock Login for Demo (Visible only if real auth isn't setup/working easily in preview) */}
                <button 
                    onClick={() => onLogin({ credential: "MOCK_TOKEN_FOR_DEMO" })}
                    className="text-slate-400 text-sm hover:text-white underline mt-2"
                >
                    Or continue as Guest (Demo)
                </button>
            </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-indigo-100 text-indigo-600 rounded-2xl flex items-center justify-center mb-6">
                    <BarChart2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Multi-Strategy Screening</h3>
                <p className="text-slate-600">Combine MACD, RSI, and Volume indicators to filter out the noise and find high-probability setups.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
                    <Zap size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">AI-Powered Insights</h3>
                <p className="text-slate-600">Leverage Gemini AI to analyze technical patterns and explain <em>why</em> a stock matches your criteria.</p>
            </div>
            <div className="flex flex-col items-center text-center p-6">
                <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-6">
                    <ShieldCheck size={32} />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-4">Secure Tracking</h3>
                <p className="text-slate-600">Save your favorite setups to your personal watchlist and track daily performance.</p>
            </div>
        </div>
      </div>
    </div>
  );
};

export default Tutorial;