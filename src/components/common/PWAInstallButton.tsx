import React, { useState } from 'react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { Download, Share2, X, Monitor, Smartphone, CheckCircle2, Sparkles } from 'lucide-react';
import { NagarAiLogo } from './NagarAiLogo';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);

  // If already running as an installed PWA, hide the button
  if (isInstalled) {
    return null;
  }

  const handleInstallClick = async () => {
    if (isInstallable) {
      await install();
    } else {
      setShowModal(true);
    }
  };

  return (
    <>
      <button
        onClick={handleInstallClick}
        className="flex items-center gap-1 px-2 py-1.5 sm:px-3 sm:py-1.5 rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 text-white font-bold text-xs shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
        title="Install NAGAR-AI App on your device"
      >
        <Download className="w-3.5 h-3.5 text-emerald-200 shrink-0" />
        <span className="hidden sm:inline">Install App</span>
        <span className="sm:hidden text-[11px]">Install</span>
      </button>

      {/* Install Guidance & One-Click Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-xs p-4 animate-fade-in">
          <div className="w-full max-w-md rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-xl shadow-blue-600/30 border border-blue-500/30 bg-slate-950 flex items-center justify-center shrink-0">
                  <NagarAiLogo className="w-full h-full" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    Install NAGAR-AI <Sparkles className="w-4 h-4 text-amber-400" />
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Smart Rewa Civic Intelligence App
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300">
              <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
                <p>
                  Installing gives you a <strong>standalone native app window</strong> (no browser URL bars), <strong>offline access</strong>, and instant home-screen launch!
                </p>
              </div>

              {isIOS ? (
                <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Smartphone className="w-4 h-4 text-blue-600" /> iOS Safari Instructions:
                  </div>
                  <ol className="space-y-2 pl-5 list-decimal text-slate-600 dark:text-slate-300">
                    <li>Tap the <Share2 className="w-3.5 h-3.5 inline text-blue-600 mx-0.5" /> <strong>Share</strong> button in Safari toolbar.</li>
                    <li>Scroll down and tap <strong>"Add to Home Screen"</strong>.</li>
                    <li>Tap <strong>Add</strong> at the top right.</li>
                  </ol>
                </div>
              ) : (
                <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Monitor className="w-4 h-4 text-blue-600" /> Chrome / Edge / Android Instructions:
                  </div>
                  <ol className="space-y-2 pl-5 list-decimal text-slate-600 dark:text-slate-300">
                    <li>Click your browser menu icon (<span className="font-mono font-bold text-blue-600 px-1 py-0.5 bg-blue-100 dark:bg-blue-900 rounded">⋮</span> three dots at top-right).</li>
                    <li>Select <strong className="text-blue-600 dark:text-blue-400">"Install app..."</strong> or <strong className="text-blue-600 dark:text-blue-400">"Add to Home screen"</strong>.</li>
                    <li>Click <strong className="text-emerald-600">Install</strong> in the confirmation popup.</li>
                  </ol>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowModal(false)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-xs shadow-xl shadow-blue-600/30 hover:brightness-110 transition cursor-pointer"
            >
              Got It, Let's Explore
            </button>
          </div>
        </div>
      )}
    </>
  );
};
