import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  RotateCcw,
  Play,
  CheckCircle2,
  ChevronUp,
  ChevronDown,
  Tv,
} from 'lucide-react';

export const DemoBanner: React.FC = () => {
  const {
    demoJourneyState,
    startDemoJourney,
    resetAllData,
    setIsDemoModalOpen,
  } = useApp();

  const [expanded, setExpanded] = useState<boolean>(false);
  const { isRunning, currentStepIndex, steps } = demoJourneyState;

  return (
    <aside aria-label="Demo Mode Control Panel" className="sticky bottom-0 z-40 bg-slate-950/95 text-white border-t border-slate-800/80 shadow-2xl backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Status Label */}
          <div className="flex items-center gap-2.5">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex items-center gap-2 font-medium tracking-wide">
              <span className="text-[10px] font-bold tracking-wider text-amber-400 uppercase bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded">
                DEMO MODE
              </span>
              <span className="text-slate-300 hidden md:inline text-xs">
                Smart Rewa Municipal Simulation · 3-Min Judge Journey
              </span>
            </div>
            {isRunning && (
              <span className="bg-blue-600/90 text-white px-2 py-0.5 rounded-md text-[10px] font-mono animate-pulse">
                Running Step {currentStepIndex + 1}/{steps.length}
              </span>
            )}
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={startDemoJourney}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-600 hover:brightness-110 text-white font-bold rounded-lg shadow-sm shadow-blue-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Play className="w-3 h-3 fill-white" />
              <span>Run Demo Journey</span>
            </button>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 active:scale-95 transition-all cursor-pointer"
              title="Open full interactive demo walkthrough console"
            >
              <Tv className="w-3 h-3 text-indigo-400" />
              <span className="hidden sm:inline">Console</span>
            </button>

            <button
              onClick={resetAllData}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white rounded-lg border border-slate-800 active:scale-95 transition-all cursor-pointer"
              title="Reset complaints and points to initial clean state"
            >
              <RotateCcw className="w-3 h-3" />
              <span className="hidden sm:inline">Reset</span>
            </button>

            <button
              onClick={() => setExpanded(!expanded)}
              className="flex items-center gap-1 px-2.5 py-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900 transition-colors cursor-pointer"
              title="Toggle Demo Journey Steps Overview"
            >
              <span className="text-[11px] font-medium">Pipeline Flow</span>
              {expanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Pipeline Stream & Steps */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-slate-800/80 text-slate-300 animate-in fade-in duration-200 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Data Moving Pipeline: Citizen → AI → Ward → Officer → Resolution → Public Dashboard
              </h4>
              <span className="text-[10.5px] text-slate-400">
                Notice: All numbers and tickets represent calibrated competition simulation data.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-2 text-[11px]">
              {['Citizen', 'AI', 'Ward', 'Officer', 'Resolution', 'Public Dashboard'].map((phase, pIdx) => {
                const phaseSteps = steps.filter((s) => s.phase === phase);
                const isCurrent = steps[currentStepIndex]?.phase === phase;

                return (
                  <div
                    key={pIdx}
                    className={`p-2.5 rounded-xl border transition-all ${
                      isCurrent
                        ? 'bg-blue-900/50 border-blue-400 text-white font-bold ring-1 ring-blue-400'
                        : 'bg-slate-900/80 border-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-extrabold uppercase text-[10px] text-blue-300">{phase}</span>
                      <span className="text-[9px] font-mono text-slate-400">{phaseSteps.length} steps</span>
                    </div>
                    <p className="text-[10.5px] text-slate-400 leading-tight">
                      {phase === 'Citizen' && 'Pothole spot & photo capture'}
                      {phase === 'AI' && 'Gemini vision & priority routing'}
                      {phase === 'Ward' && 'Geofence match & SLA clock'}
                      {phase === 'Officer' && 'Dispatch console & live map'}
                      {phase === 'Resolution' && 'After-image & AI audit'}
                      {phase === 'Public Dashboard' && 'Audit log & ward index'}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
