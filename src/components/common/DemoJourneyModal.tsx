import React, { useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Sparkles,
  Play,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
  Clock,
  Shield,
  Bot,
  MapPin,
  Building,
  UserCheck,
  Eye,
  BarChart3,
  X,
  Camera,
  Layers,
  Activity,
  AlertTriangle,
  Zap,
} from 'lucide-react';

export const DemoJourneyModal: React.FC = () => {
  const {
    isDemoModalOpen,
    setIsDemoModalOpen,
    demoJourneyState,
    startDemoJourney,
    stopDemoJourney,
    nextDemoStep,
    prevDemoStep,
    resetAllData,
  } = useApp();

  const { isRunning, currentStepIndex, autoPlay, speedMs, ticketId, steps } = demoJourneyState;
  const currentStep = steps[currentStepIndex];

  // Auto-advance timer when autoPlay is enabled
  useEffect(() => {
    if (!isRunning || !autoPlay) return;

    const timer = setTimeout(() => {
      if (currentStepIndex < steps.length - 1) {
        nextDemoStep();
      } else {
        // Completed all steps
        stopDemoJourney();
      }
    }, speedMs);

    return () => clearTimeout(timer);
  }, [isRunning, autoPlay, currentStepIndex, speedMs, steps.length, nextDemoStep, stopDemoJourney]);

  if (!isDemoModalOpen) return null;

  const getStepIcon = (iconName: string) => {
    switch (iconName) {
      case 'eye':
        return <Eye className="w-4 h-4" />;
      case 'camera':
        return <Camera className="w-4 h-4" />;
      case 'bot':
        return <Bot className="w-4 h-4" />;
      case 'map-pin':
        return <MapPin className="w-4 h-4" />;
      case 'clock':
        return <Clock className="w-4 h-4" />;
      case 'building':
        return <Building className="w-4 h-4" />;
      case 'layers':
        return <Layers className="w-4 h-4" />;
      case 'activity':
        return <Activity className="w-4 h-4" />;
      case 'check-circle':
        return <CheckCircle2 className="w-4 h-4" />;
      case 'user-check':
        return <UserCheck className="w-4 h-4" />;
      case 'bar-chart':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getPhaseBadgeColor = (phase: string) => {
    switch (phase) {
      case 'Citizen':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'AI':
        return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
      case 'Ward':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Officer':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'Resolution':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'Public Dashboard':
        return 'bg-teal-500/20 text-teal-300 border-teal-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/75 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-4xl glass-panel bg-slate-900/90 text-white rounded-3xl border border-white/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh] backdrop-blur-2xl">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-blue-500/20 border border-blue-400/30 flex items-center justify-center text-blue-300 shadow-inner">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-amber-400 bg-amber-500/20 border border-amber-500/30 px-2 py-0.5 rounded">
                  LIVE COMPETITION RUNNER
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  3-Minute Autonomous Demo Experience
                </span>
              </div>
              <h2 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
                NAGAR-AI Closed-Loop Governance Flow
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDemoModalOpen(false)}
              className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
              title="Close Demo Console"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Animated Data Pipeline Stream Graphic */}
        <div className="bg-slate-950 px-6 py-3 border-b border-slate-800/80 flex items-center justify-between text-xs overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-2 sm:gap-3 min-w-max mx-auto py-1">
            {['Citizen', 'AI', 'Ward', 'Officer', 'Resolution', 'Public Dashboard'].map((phase, pIdx) => {
              const isCurrentPhase = currentStep?.phase === phase;
              const isPassed = steps.findIndex((s) => s.phase === phase) < currentStepIndex;

              return (
                <React.Fragment key={phase}>
                  <div
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition-all duration-300 ${
                      isCurrentPhase
                        ? 'bg-blue-600/30 border-blue-400 text-white font-bold ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/20 scale-105'
                        : isPassed
                        ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300 font-medium'
                        : 'bg-slate-900 border-slate-800 text-slate-500'
                    }`}
                  >
                    {isPassed ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <span className={`w-2 h-2 rounded-full ${isCurrentPhase ? 'bg-blue-400 animate-ping' : 'bg-slate-600'}`} />
                    )}
                    <span>{phase}</span>
                  </div>
                  {pIdx < 5 && (
                    <div className="flex items-center text-slate-600">
                      <ChevronRight className={`w-4 h-4 ${isCurrentPhase ? 'text-blue-400 animate-pulse' : ''}`} />
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Main Step Detail View */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-slate-900/60">
          {/* Progress bar */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-400">
              <span className="flex items-center gap-1.5">
                <span className="text-white font-bold">Step {currentStepIndex + 1}</span> of {steps.length}
                <span>·</span>
                <span className={`px-2 py-0.5 rounded border text-[11px] ${getPhaseBadgeColor(currentStep?.phase || '')}`}>
                  {currentStep?.phase} Stage
                </span>
                {ticketId && (
                  <>
                    <span>·</span>
                    <span className="font-mono text-blue-400 bg-blue-950/60 px-2 py-0.5 rounded border border-blue-900">
                      {ticketId}
                    </span>
                  </>
                )}
              </span>
              <span className="font-mono text-[11px] text-amber-400">
                {Math.round(((currentStepIndex + 1) / steps.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 transition-all duration-300"
                style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Step Spotlight Card */}
          <div className="bg-slate-950 rounded-2xl border border-slate-800 p-5 space-y-4 shadow-xl relative overflow-hidden">
            <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center shrink-0 shadow-lg shadow-blue-500/25">
                {getStepIcon(currentStep?.icon || 'sparkles')}
              </div>
              <div className="space-y-1 flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-blue-400">
                  {currentStep?.headline}
                </div>
                <h3 className="text-lg sm:text-xl font-black text-white">
                  {currentStep?.title}
                </h3>
                <p className="text-sm text-slate-300 leading-relaxed pt-1">
                  {currentStep?.description}
                </p>
              </div>
            </div>

            {/* Contextual Visual Data Inspection Panel */}
            {currentStep?.previewData && (
              <div className="mt-4 pt-4 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {Object.entries(currentStep.previewData).map(([key, val]) => (
                  <div key={key} className="bg-slate-900/90 rounded-xl p-3 border border-slate-800">
                    <div className="text-[10px] font-mono uppercase text-slate-400">{key}</div>
                    <div className="text-xs font-bold text-slate-100 mt-0.5 truncate">{String(val)}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Visual Images Comparison Preview if in Resolution Phase */}
            {currentStep?.images && (
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-rose-500"></span> Before Repair
                  </div>
                  <img
                    src={currentStep.images.before}
                    alt="Before repair"
                    className="w-full h-32 object-cover rounded-xl border border-slate-800"
                  />
                </div>
                <div className="space-y-1">
                  <div className="text-[10px] font-mono uppercase text-slate-400 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500"></span> After Repair (Bituminous Premix)
                  </div>
                  <img
                    src={currentStep.images.after}
                    alt="After repair"
                    className="w-full h-32 object-cover rounded-xl border border-slate-800"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Quick Steps Breadcrumbs Checklist */}
          <div className="space-y-2">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>Full 21-Step Journey Breakdown</span>
              <span className="text-[11px] font-mono text-slate-500">Notice: Demo Simulation Baseline</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {steps.map((st, sIdx) => {
                const isCur = sIdx === currentStepIndex;
                const isDone = sIdx < currentStepIndex;

                return (
                  <div
                    key={sIdx}
                    className={`p-2.5 rounded-xl border text-xs transition-all ${
                      isCur
                        ? 'bg-blue-900/40 border-blue-400 text-white font-bold ring-1 ring-blue-400/40'
                        : isDone
                        ? 'bg-slate-950/80 border-slate-800 text-slate-300'
                        : 'bg-slate-950/40 border-slate-900 text-slate-500'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {isDone ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-mono shrink-0 ${
                          isCur ? 'bg-blue-600 text-white font-bold' : 'bg-slate-800 text-slate-400'
                        }`}>
                          {sIdx + 1}
                        </span>
                      )}
                      <span className="truncate">{st.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Playback Controls */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={isRunning ? stopDemoJourney : startDemoJourney}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold transition-all shadow-md cursor-pointer ${
                isRunning
                  ? 'bg-rose-600 hover:bg-rose-700 text-white shadow-rose-600/30'
                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30'
              }`}
            >
              {isRunning ? (
                <>
                  <Zap className="w-4 h-4 animate-spin" />
                  <span>Pause Demo</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Autonomous Demo</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                resetAllData();
                startDemoJourney();
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 font-semibold cursor-pointer"
              title="Reset data & restart demo journey from step 1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart Flow</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={prevDemoStep}
              disabled={currentStepIndex === 0}
              className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 text-xs font-semibold disabled:opacity-30 cursor-pointer"
            >
              ← Previous Step
            </button>

            <button
              onClick={nextDemoStep}
              disabled={currentStepIndex >= steps.length - 1}
              className="flex items-center gap-1 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold disabled:opacity-30 cursor-pointer shadow-md shadow-blue-600/20"
            >
              <span>Next Step</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
