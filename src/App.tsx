import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/common/Navbar';
import { DemoJourneyModal } from './components/common/DemoJourneyModal';
import { Toast } from './components/common/Toast';
import { StartupSplash } from './components/common/StartupSplash';
import { NagarAiLogo } from './components/common/NagarAiLogo';
import { MobileBottomBar } from './components/common/MobileBottomBar';
import { Sidebar } from './components/common/Sidebar';

import { LandingPage } from './views/LandingPage';
import { CitizenPortal } from './views/CitizenPortal';
import { ReportIssueFlow } from './views/ReportIssueFlow';
import { MyComplaints } from './views/MyComplaints';
import { ComplaintDetailView } from './views/ComplaintDetailView';
import { OfficerDashboard } from './views/OfficerDashboard';
import { ComplaintManagement } from './views/ComplaintManagement';
import { PredictiveAnalytics } from './views/PredictiveAnalytics';
import { WardPerformance } from './views/WardPerformance';
import { TransparencyDashboard } from './views/TransparencyDashboard';
import { NagarSathiChatbot } from './views/NagarSathiChatbot';
import { RuntimeArchitectureView } from './views/RuntimeArchitectureView';
import { ProjectWhitepaperPDFView } from './views/ProjectWhitepaperPDFView';
import { AboutView } from './views/AboutView';

import {
  ShieldAlert,
  Bot,
  HeartHandshake,
  ExternalLink,
} from 'lucide-react';

const AppContent: React.FC = () => {
  const { currentView, setCurrentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingPage />;
      case 'citizen-portal':
        return <CitizenPortal />;
      case 'report':
        return <ReportIssueFlow />;
      case 'my-complaints':
        return <MyComplaints />;
      case 'complaint-detail':
        return <ComplaintDetailView />;
      case 'officer-dashboard':
        return <OfficerDashboard />;
      case 'complaint-management':
        return <ComplaintManagement />;
      case 'predictive':
        return <PredictiveAnalytics />;
      case 'ward-performance':
        return <WardPerformance />;
      case 'transparency':
        return <TransparencyDashboard />;
      case 'nagar-sathi':
        return <NagarSathiChatbot />;
      case 'architecture':
        return <RuntimeArchitectureView />;
      case 'whitepaper-pdf':
        return <ProjectWhitepaperPDFView />;
      case 'about':
        return <AboutView />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col bg-[#fbf5e6] dark:bg-black text-stone-900 dark:text-stone-100 transition-colors pb-16 md:pb-0 selection:bg-emerald-500/20">
      {/* Ambient Pastel Aura Background Shimmer */}
      <div className="glass-aura-bg" aria-hidden="true">
        <div className="glass-orb glass-orb-sage" />
        <div className="glass-orb glass-orb-peach" />
        <div className="glass-orb glass-orb-lavender" />
        <div className="glass-orb glass-orb-sand" />
      </div>

      {/* Subtle Civic Grid Texture */}
      <div className="fixed inset-0 bg-civic-grid opacity-35 dark:opacity-20 pointer-events-none z-0" aria-hidden="true" />

      <StartupSplash />
      <Navbar />
      <Toast />

      {/* Main App Layout: Sidebar + Main Content Area */}
      <div className="relative z-10 flex-1 flex w-full">
        {/* Desktop Sidebar with Citizen Services & Municipal Hub */}
        <Sidebar />

        {/* Main View Area */}
        <main className="flex-1 min-w-0 overflow-x-hidden">
          {renderCurrentView()}
        </main>
      </div>

      {/* Floating Nagar Sathi Chatbot Quick Launcher on Desktop */}
      {currentView !== 'nagar-sathi' && (
        <button
          onClick={() => setCurrentView('nagar-sathi')}
          className="hidden md:flex fixed bottom-8 right-6 z-40 items-center gap-2.5 px-4.5 py-3 rounded-full backdrop-blur-xl bg-emerald-800/90 dark:bg-emerald-700/85 hover:bg-emerald-700 dark:hover:bg-emerald-600 text-white font-bold text-xs sm:text-sm border border-emerald-400/30 shadow-[0_12px_28px_rgba(16,149,100,0.25)] hover:shadow-[0_16px_32px_rgba(16,149,100,0.35)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 group cursor-pointer"
          title="Open Nagar Sathi AI Civic Assistant"
        >
          <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Bot className="w-4 h-4 text-emerald-100 group-hover:rotate-12 transition-transform" />
          </div>
          <span>Ask Nagar Sathi</span>
        </button>
      )}

      {/* Mobile Android Bottom Navigation Bar */}
      <MobileBottomBar />

      {/* Glassmorphic Footer */}
      <footer className="relative z-10 glass-panel border-t border-stone-200/80 dark:border-stone-800/80 py-10 mt-12 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl overflow-hidden border border-emerald-500/30 bg-stone-900 flex items-center justify-center shrink-0 shadow-sm">
                  <NagarAiLogo className="w-full h-full" />
                </div>
                <span className="font-extrabold text-base tracking-tight bg-gradient-to-r from-emerald-700 via-teal-700 to-stone-800 dark:from-emerald-400 dark:to-teal-300 bg-clip-text text-transparent">
                  NAGAR-AI
                </span>
                <span className="text-[10px] font-bold uppercase bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300 px-2 py-0.5 rounded-md border border-stone-200/60 dark:border-stone-700">
                  Smart Rewa POC
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 max-w-sm">
                AI-Driven Urban Governance & Predictive Municipal Infrastructure Platform for Rewa, Madhya Pradesh.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs font-semibold text-stone-600 dark:text-stone-400">
              <button
                onClick={() => setCurrentView('landing')}
                className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                Home
              </button>
              <button
                onClick={() => setCurrentView('citizen-portal')}
                className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                Citizen Portal
              </button>
              <button
                onClick={() => setCurrentView('report')}
                className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                Report Issue
              </button>
              <button
                onClick={() => setCurrentView('officer-dashboard')}
                className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                Command Center
              </button>
              <button
                onClick={() => setCurrentView('ward-performance')}
                className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                Ward Index
              </button>
              <button
                onClick={() => setCurrentView('transparency')}
                className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                Transparency
              </button>
              <button
                onClick={() => setCurrentView('architecture')}
                className="hover:text-amber-600 font-bold text-amber-600/90 dark:text-amber-400 transition-colors"
              >
                System Architecture
              </button>
              <button
                onClick={() => setCurrentView('whitepaper-pdf')}
                className="hover:text-rose-600 font-bold text-rose-600/90 dark:text-rose-400 transition-colors"
              >
                PDF Whitepaper & Guide
              </button>
              <button
                onClick={() => setCurrentView('about')}
                className="hover:text-emerald-700 dark:hover:text-emerald-300 transition-colors"
              >
                About POC
              </button>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-200/60 dark:border-stone-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-400">
            <div>
              Smart Rewa Municipal Corporation Central Helpline: <span className="font-mono font-bold text-stone-700 dark:text-stone-300">1800-233-0104</span>
            </div>
            <div>
              Built for Technology Competition Demonstration • Simulated Civic Datasets
            </div>
          </div>
        </div>
      </footer>

      {/* Interactive Demo Journey Walkthrough Modal (Triggered via Sidebar or Header) */}
      <DemoJourneyModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
