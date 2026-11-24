import React from 'react';
import { useApp } from '../../context/AppContext';
import { UserCheck, Mic, Bot, ListOrdered, Trophy } from 'lucide-react';

export const MobileBottomBar: React.FC = () => {
  const { currentView, setCurrentView, language } = useApp();
  const isHi = language === 'hi' || language === 'bg';

  // Navigation items for Android bottom tray in requested order
  const navItems = [
    {
      id: 'citizen-portal',
      view: 'citizen-portal' as const,
      label: isHi ? 'नागरिक पोर्टल' : 'Citizen Portal',
      icon: <UserCheck className="w-5 h-5" />,
      isActive: currentView === 'citizen-portal',
    },
    {
      id: 'voice-report',
      view: 'report' as const,
      label: isHi ? 'बोलकर दर्ज' : 'Voice Report',
      icon: <Mic className="w-5 h-5" />,
      isActive: currentView === 'report',
    },
    {
      id: 'civic-bot',
      view: 'nagar-sathi' as const,
      label: isHi ? 'नगर साथी' : 'CivicBot',
      icon: <Bot className="w-5 h-5" />,
      isActive: currentView === 'nagar-sathi',
    },
    {
      id: 'my-tickets',
      view: 'my-complaints' as const,
      label: isHi ? 'मेरी शिकायतें' : 'My Tickets',
      icon: <ListOrdered className="w-5 h-5" />,
      isActive: currentView === 'my-complaints',
    },
    {
      id: 'leaderboard',
      view: 'ward-performance' as const,
      label: isHi ? 'लीडरबोर्ड' : 'Leaderboard',
      icon: <Trophy className="w-5 h-5" />,
      isActive: currentView === 'ward-performance',
    },
  ];

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden glass-panel border-t border-white/50 dark:border-white/10 shadow-[0_-8px_32px_rgba(0,0,0,0.25)] px-1 py-1 pb-[max(0.45rem,env(safe-area-inset-bottom))] transition-colors"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around max-w-lg mx-auto">
        {navItems.map((item) => {
          const active = item.isActive;
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.view)}
              className="flex flex-col items-center justify-center flex-1 py-1 group select-none active:scale-90 transition-transform duration-150 cursor-pointer"
            >
              {/* Icon badge container */}
              <div
                className={`w-10 h-8 rounded-xl flex items-center justify-center transition-all duration-200 ${
                  active
                    ? 'backdrop-blur-md bg-amber-500/25 text-amber-500 dark:text-amber-400 border border-amber-500/40 shadow-sm shadow-amber-500/20 scale-105'
                    : 'text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
              >
                {item.icon}
              </div>

              {/* Label */}
              <span
                className={`text-[10px] tracking-tight leading-tight mt-0.5 whitespace-nowrap transition-colors duration-150 ${
                  active
                    ? 'font-black text-amber-600 dark:text-amber-400'
                    : 'font-semibold text-slate-500 dark:text-slate-400 group-hover:text-slate-800 dark:group-hover:text-slate-200'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
