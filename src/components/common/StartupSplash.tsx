import React, { useEffect, useState } from 'react';
import { Cpu, Sparkles } from 'lucide-react';
import { NagarAiLogo } from './NagarAiLogo';

export const StartupSplash: React.FC = () => {
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    // Check if running as standalone PWA or first session
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;

    // Show splash for 1.8 seconds on launch
    const timer = setTimeout(() => {
      setFadeOut(true);
      setTimeout(() => setVisible(false), 500);
    }, isStandalone ? 2000 : 1200);

    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950 text-white transition-opacity duration-500 ${
        fadeOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background glow effects */}
      <div className="absolute w-72 h-72 bg-blue-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute w-72 h-72 bg-emerald-500/15 rounded-full blur-3xl animate-pulse delay-700" />

      <div className="relative z-10 flex flex-col items-center space-y-6 px-6 text-center">
        {/* Logo Badge */}
        <div className="w-24 h-24 rounded-3xl overflow-hidden shadow-2xl shadow-blue-500/40 border border-blue-400/30 animate-bounce bg-slate-950 flex items-center justify-center">
          <NagarAiLogo className="w-full h-full" />
        </div>

        {/* Title & Subtitle */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-3xl font-black tracking-tight text-white">
              NAGAR<span className="text-blue-500">-AI</span>
            </h1>
            <span className="px-2 py-0.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-[10px] font-mono text-blue-300">
              REWA v2.0
            </span>
          </div>
          <p className="text-xs font-medium text-slate-400 max-w-xs leading-relaxed">
            AI-Driven Urban Governance & Predictive Municipal Infrastructure Platform
          </p>
        </div>

        {/* Loading Progress Bar */}
        <div className="w-48 h-1.5 bg-slate-800 rounded-full overflow-hidden border border-slate-700/50">
          <div className="h-full bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-[shimmer_1.5s_infinite]" style={{ width: '85%' }} />
        </div>

        <div className="flex items-center gap-2 text-[11px] font-mono text-slate-500">
          <Cpu className="w-3.5 h-3.5 text-blue-400 animate-spin" />
          <span>Initializing Rewa Municipal Telemetry & AI...</span>
        </div>
      </div>
    </div>
  );
};
