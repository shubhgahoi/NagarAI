import React, { useState, useRef, useEffect } from 'react';
import { useApp, AppView } from '../../context/AppContext';
import { SUPPORTED_LANGUAGES, AppLanguage } from '../../data/translations';
import { PWAInstallButton } from './PWAInstallButton';
import { NagarAiLogo } from './NagarAiLogo';
import {
  ShieldAlert,
  Flame,
  Moon,
  Sun,
  Menu,
  X,
  PlusCircle,
  FileText,
  Bot,
  LayoutDashboard,
  BrainCircuit,
  Activity,
  Award,
  Globe,
  Info,
  Layers,
  ChevronDown,
  Languages,
  Network,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const {
    currentView,
    setCurrentView,
    citizenProfile,
    darkMode,
    toggleDarkMode,
    language,
    setLanguage,
    startDemoJourney,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [officerDropdownOpen, setOfficerDropdownOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItem = (view: AppView, label: string, icon: React.ReactNode, isAction: boolean = false) => {
    const isActive = currentView === view;
    return (
      <button
        key={view}
        onClick={() => {
          setCurrentView(view);
          setMobileMenuOpen(false);
          setOfficerDropdownOpen(false);
        }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-150 ${
          isAction
            ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-sm shadow-emerald-700/20'
            : isActive
            ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-semibold border border-emerald-200/60 dark:border-emerald-800/40'
            : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100/70 dark:hover:bg-stone-800/50'
        }`}
      >
        {icon}
        <span>{label}</span>
      </button>
    );
  };

  const isHi = language === 'hi';

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-stone-200/80 dark:border-stone-800/80 shadow-xs transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Civic Branding */}
          <div
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group select-none shrink-0"
            onClick={() => setCurrentView('landing')}
          >
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-2xl overflow-hidden shadow-sm shadow-stone-800/10 border border-emerald-500/20 dark:border-emerald-400/30 group-hover:scale-105 active:scale-95 transition-transform duration-200 bg-stone-900 flex items-center justify-center shrink-0">
              <NagarAiLogo className="w-full h-full" />
            </div>
            <div className="flex flex-col justify-center">
              <div className="flex items-center gap-1.5 whitespace-nowrap">
                <span className="text-lg sm:text-xl font-black tracking-tight text-stone-900 dark:text-white">
                  NAGAR<span className="text-emerald-700 dark:text-emerald-400">-AI</span>
                </span>
                <span className="hidden sm:inline-block text-[10px] font-semibold tracking-wider text-stone-600 dark:text-stone-300 glass-pill px-2 py-0.5 rounded-full border border-stone-200/60 dark:border-stone-700">
                  REWA · POC
                </span>
              </div>
              <p className="hidden md:block text-[11px] font-medium text-stone-500 dark:text-stone-400 leading-none">
                Smart Rewa · AI Civic Intelligence
              </p>
            </div>
          </div>

          {/* Right Tools & Badges */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0">
            {/* Gamification Points item - clean non-pill indicator */}
            <button
              onClick={() => setCurrentView('citizen-portal')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-amber-800 dark:text-amber-300 glass-card glass-card-hover active:scale-95 transition-all cursor-pointer"
              title="Citizen Civic Engagement Points"
            >
              <Award className="w-4 h-4 text-amber-500 fill-amber-500/20" />
              <span>{citizenProfile.points} pts</span>
            </button>

            {/* Language Switcher with English, हिन्दी, and Bagheli */}
            <div className="relative" ref={langDropdownRef}>
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1.5 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-xl text-xs font-bold glass-button text-stone-700 dark:text-stone-200 active:scale-95 transition-all cursor-pointer"
                title="Switch Language / भाषा बदलें"
              >
                <Languages className="w-3.5 h-3.5 text-emerald-700 dark:text-emerald-400 shrink-0" />
                <span className="hidden sm:inline">
                  {language === 'en' ? 'English' : language === 'hi' ? 'हिन्दी' : 'बघेली'}
                </span>
                <span className="sm:hidden font-mono text-[11px]">
                  {language === 'en' ? 'EN' : language === 'hi' ? 'हि' : 'बघ'}
                </span>
                <ChevronDown className={`w-3 h-3 opacity-60 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {langDropdownOpen && (
                <div className="absolute right-0 mt-2 w-52 glass-panel rounded-2xl shadow-xl py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-200/40 dark:border-stone-800 mb-1">
                    Select Language / भाषा
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                        language === lang.code
                          ? 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 font-bold'
                          : 'text-stone-700 dark:text-stone-200 hover:bg-stone-100/60 dark:hover:bg-stone-800/40'
                      }`}
                    >
                      <div className="flex flex-col">
                        <span>{lang.label} {lang.subLabel ? `(${lang.subLabel})` : ''}</span>
                        {lang.badge && (
                          <span className="text-[9.5px] font-mono text-purple-600 dark:text-purple-400">
                            {lang.badge}
                          </span>
                        )}
                      </div>
                      {language === lang.code && <span className="text-emerald-700 dark:text-emerald-400">✓</span>}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Dark Mode Switcher */}
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl text-slate-600 dark:text-slate-300 glass-button active:scale-95 transition-all cursor-pointer"
              title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            {/* PWA Install App Button */}
            <PWAInstallButton />

            {/* Competition Walkthrough CTA */}
            <button
              onClick={startDemoJourney}
              className="hidden md:flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-emerald-600/90 via-teal-600/90 to-indigo-600/90 hover:from-emerald-600 hover:to-indigo-600 text-white border border-white/20 shadow-md shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer backdrop-blur-md"
              title="Execute full autonomous 3-minute judge demonstration flow"
            >
              <Flame className="w-3.5 h-3.5 animate-pulse text-amber-200" />
              <span>3-Min Demo</span>
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl text-slate-700 dark:text-slate-200 glass-button active:scale-95 transition-all cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5 sm:w-6 sm:h-6" /> : <Menu className="w-5 h-5 sm:w-6 sm:h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden px-4 pt-2 pb-6 glass-panel border-b border-white/40 dark:border-white/10 space-y-2 animate-in slide-in-from-top duration-200">
          <div className="py-2 flex items-center justify-between border-b border-white/20 dark:border-white/10">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {citizenProfile.name} • {citizenProfile.points} Civic Points
              </span>
            </div>
            <button
              onClick={startDemoJourney}
              className="px-3 py-1.5 text-xs font-bold bg-emerald-600 text-white rounded-xl flex items-center gap-1 cursor-pointer shadow-sm"
            >
              <Flame className="w-3 h-3 text-amber-200" /> Demo Run
            </button>
          </div>

          <div className="grid grid-cols-2 gap-1.5 pt-1">
            {navItem('landing', 'Home', <Globe className="w-4 h-4" />)}
            {navItem('citizen-portal', 'Citizen Portal', <FileText className="w-4 h-4" />)}
            {navItem('report', '+ Report Issue', <PlusCircle className="w-4 h-4" />, true)}
            {navItem('my-complaints', 'My Complaints', <Layers className="w-4 h-4" />)}
            {navItem('nagar-sathi', 'Nagar Sathi AI', <Bot className="w-4 h-4 text-indigo-500" />)}
            {navItem('officer-dashboard', 'Command Center', <LayoutDashboard className="w-4 h-4" />)}
            {navItem('complaint-management', 'Manage Issues', <Layers className="w-4 h-4" />)}
            {navItem('predictive', 'Predictive Intel', <BrainCircuit className="w-4 h-4" />)}
            {navItem('ward-performance', 'Ward Health Index', <Activity className="w-4 h-4" />)}
            {navItem('transparency', 'Transparency', <Globe className="w-4 h-4" />)}
            {navItem('architecture', 'Architecture', <Network className="w-4 h-4 text-amber-500" />)}
            {navItem('whitepaper-pdf', 'PDF Whitepaper', <FileText className="w-4 h-4 text-rose-500" />)}
            {navItem('about', 'About NAGAR-AI', <Info className="w-4 h-4" />)}
          </div>
        </div>
      )}
    </header>
  );
};
