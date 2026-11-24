import React from 'react';
import { useApp, AppView } from '../../context/AppContext';
import {
  Mic,
  ListOrdered,
  Bot,
  Award,
  LayoutDashboard,
  ShieldCheck,
  TrendingUp,
  BarChart3,
  Globe,
  Info,
  PhoneCall,
  Sparkles,
  Play,
  Network,
  FileText,
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { currentView, setCurrentView, language, setIsDemoModalOpen, startDemoJourney, demoJourneyState } = useApp();
  const isHi = language === 'hi' || language === 'bg';

  const citizenNavItems: {
    id: string;
    view: AppView;
    label: string;
    sub?: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'citizen-portal',
      view: 'citizen-portal',
      label: isHi ? 'नागरिक पोर्टल' : 'Citizen Portal',
      sub: isHi ? 'सेवाएं व प्रोफाइल' : 'Services & Profile',
      icon: <Award className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'voice-report',
      view: 'report',
      label: isHi ? 'बोलकर रिपोर्ट' : 'Voice Report',
      sub: isHi ? 'बघेली / हिन्दी' : 'Bagheli / Hindi',
      icon: <Mic className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'civic-bot',
      view: 'nagar-sathi',
      label: isHi ? 'नगर साथी' : 'CivicBot',
      sub: isHi ? '24x7 AI सहायक' : '24x7 AI Assistant',
      icon: <Bot className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'my-tickets',
      view: 'my-complaints',
      label: isHi ? 'मेरी शिकायतें' : 'My Tickets',
      sub: isHi ? 'लाइव स्थिति' : 'Live Status',
      icon: <ListOrdered className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'leaderboard',
      view: 'ward-performance',
      label: isHi ? 'लीडरबोर्ड व वार्ड स्वास्थ्य' : 'Leaderboard & Wards',
      sub: isHi ? 'वार्ड रैंकिंग व सूचकांक' : 'Ward Index & Rankings',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
  ];

  const municipalNavItems: {
    id: string;
    view: AppView;
    label: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: 'command-center',
      view: 'officer-dashboard',
      label: isHi ? 'कमांड सेंटर' : 'Command Center',
      icon: <LayoutDashboard className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'complaint-ops',
      view: 'complaint-management',
      label: isHi ? 'शिकायत समाधान व SLA' : 'Ticket SLA Ops',
      icon: <ShieldCheck className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'predictive-ai',
      view: 'predictive',
      label: isHi ? 'पूर्वानुमानित AI' : 'Predictive AI',
      icon: <TrendingUp className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'ward-performance',
      view: 'ward-performance',
      label: isHi ? 'वार्ड रैंकिंग' : 'Ward Rankings',
      icon: <BarChart3 className="w-4 h-4 shrink-0" />,
    },
    {
      id: 'transparency',
      view: 'transparency',
      label: isHi ? 'सार्वजनिक खुला डेटा' : 'Public Transparency',
      icon: <Globe className="w-4 h-4 shrink-0 text-teal-400" />,
    },
    {
      id: 'architecture',
      view: 'architecture',
      label: isHi ? 'सिस्टम आर्किटेक्चर' : 'System Architecture',
      icon: <Network className="w-4 h-4 shrink-0 text-amber-400" />,
    },
    {
      id: 'whitepaper-pdf',
      view: 'whitepaper-pdf',
      label: isHi ? 'PDF रिपोर्ट व गाइड' : 'PDF Whitepaper & Guide',
      icon: <FileText className="w-4 h-4 shrink-0 text-rose-400" />,
    },
    {
      id: 'about',
      view: 'about',
      label: isHi ? 'नगर-AI परिचय' : 'About Nagar-AI',
      icon: <Info className="w-4 h-4 shrink-0" />,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 glass-panel border-r border-white/50 dark:border-white/10 text-slate-800 dark:text-slate-200 min-h-[calc(100vh-4rem)] p-4 select-none justify-between transition-colors">
      {/* Top / Main Navigation Groups */}
      <div className="space-y-6">
        {/* Citizen Services Group */}
        <div>
          <div className="px-3 mb-2.5 text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            {isHi ? 'नागरिक सेवाएं' : 'CITIZEN SERVICES'}
          </div>

          <div className="space-y-1.5">
            {citizenNavItems.map((item) => {
              const isActive =
                item.id === 'voice-report' || item.id === 'ai-camera'
                  ? currentView === 'report'
                  : currentView === item.view;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.view)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer text-left ${
                    isActive
                      ? 'backdrop-blur-xl bg-[#678274] dark:bg-[#4f675b] text-white font-bold shadow-sm border border-[#8da598]/50 translate-x-1'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 hover:translate-x-0.5'
                  }`}
                >
                  <div
                    className={`${
                      isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1 truncate">
                    <span>{item.label}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Municipal & Governance Group */}
        <div>
          <div className="px-3 mb-2.5 text-[11px] font-bold tracking-wider uppercase text-slate-500 dark:text-slate-400">
            {isHi ? 'प्रशासन व विश्लेषण' : 'MUNICIPAL HUB & AI'}
          </div>

          <div className="space-y-1.5">
            {municipalNavItems.map((item) => {
              const isActive = currentView === item.view;

              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.view)}
                  className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all duration-150 cursor-pointer text-left ${
                    isActive
                      ? 'backdrop-blur-xl bg-[#ede8f5] dark:bg-[#2c243b] text-purple-900 dark:text-purple-200 font-bold border border-purple-200 dark:border-purple-800/60 shadow-xs translate-x-1'
                      : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/50 dark:hover:bg-white/10 hover:translate-x-0.5'
                  }`}
                >
                  <div
                    className={`${
                      isActive ? 'text-purple-700 dark:text-purple-300' : 'text-slate-500 dark:text-slate-400 group-hover:text-white'
                    }`}
                  >
                    {item.icon}
                  </div>
                  <span className="truncate">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Section: Compact Demo Launcher & Helpline */}
      <div className="pt-4 border-t border-white/30 dark:border-white/10 space-y-3">
        {/* Compact Demo Mode Button (Web-only) */}
        <div className="p-3 rounded-2xl glass-card space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              {isHi ? 'डेमो मोड' : 'Demo Mode'}
            </span>
            {demoJourneyState.isRunning && (
              <span className="text-[9px] font-mono text-purple-800 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/70 px-1.5 py-0.5 rounded-md border border-purple-200/50">
                Step {demoJourneyState.currentStepIndex + 1}/6
              </span>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={startDemoJourney}
              className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[#678274] hover:bg-[#587164] dark:bg-[#4a6356] dark:hover:bg-[#3d5348] active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all cursor-pointer"
              title="Start 3-minute automated judge journey"
            >
              <Play className="w-3 h-3 fill-white shrink-0" />
              <span>{isHi ? 'डेमो शुरू' : 'Run Demo'}</span>
            </button>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="flex items-center justify-center gap-1 py-1.5 px-2 glass-button active:scale-95 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-all cursor-pointer"
              title="Open full interactive demo walkthrough console"
            >
              <Sparkles className="w-3 h-3 text-amber-500 shrink-0" />
              <span>{isHi ? 'कंसोल' : 'Console'}</span>
            </button>
          </div>
        </div>

        {/* Helpline Dispatch Widget */}
        <div className="p-3 rounded-2xl glass-card space-y-2">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
              <PhoneCall className="w-3.5 h-3.5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white">Rewa Helpline</div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400">Toll-free 24x7 civic dispatch.</div>
            </div>
          </div>

          <a
            href="tel:07662251234"
            className="block w-full py-1.5 px-3 rounded-xl glass-button text-center text-xs font-mono font-bold text-amber-600 dark:text-amber-400 transition-all"
          >
            07662-251234
          </a>
        </div>
      </div>
    </aside>
  );
};
