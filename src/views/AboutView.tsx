import React from 'react';
import { useApp } from '../context/AppContext';
import {
  ShieldAlert,
  Sparkles,
  Bot,
  MapPin,
  CheckCircle2,
  Clock,
  Code2,
  Cpu,
  Layers,
  Award,
} from 'lucide-react';

export const AboutView: React.FC = () => {
  const { setCurrentView } = useApp();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      {/* Hero Banner */}
      <div className="bg-gradient-to-br from-[#4d6657] via-[#3a4d42] to-[#26332c] text-white rounded-3xl p-8 border border-[#5e7769]/50 shadow-xl space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30">
          <ShieldAlert className="w-4 h-4 text-emerald-400" />
          <span>Competition Proof of Concept</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
          NAGAR-AI: Smart Rewa
        </h1>
        <p className="text-sm sm:text-base text-stone-200 max-w-2xl leading-relaxed">
          AI-Driven Urban Governance & Predictive Municipal Infrastructure Platform engineered specifically for Rewa Municipal Corporation, Madhya Pradesh.
        </p>
      </div>

      {/* Strategic Problem Statement & Solution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-rose-600">
            The Civic Challenge in Tier-2 Indian Cities
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Information Asymmetry & Reactive Maintenance
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            In growing urban centers like Rewa, civic grievances often face long delays due to manual paperwork, ambiguous defect classification, lack of statutory SLA tracking, and zero post-repair quality verification. Citizens feel unheard and municipal engineers lack predictive early-warning tools.
          </p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-emerald-600">
            The NAGAR-AI Innovation
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Autonomous Closed-Loop Governance
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            NAGAR-AI replaces manual routing with multimodal vision triage, strict statutory SLA countdowns, automated Before/After repair audits, and spatiotemporal hotspot forecasting to prevent monsoon flooding and road failure before citizen distress occurs.
          </p>
        </div>
      </div>

      {/* Architecture Stack */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Cpu className="w-5 h-5 text-blue-600" />
          <span>Technology & AI Architecture</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm">Frontend & UI</span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              <li>• React 19 + TypeScript + Vite</li>
              <li>• Tailwind CSS modern styling</li>
              <li>• Recharts analytics engine</li>
              <li>• Leaflet / OpenStreetMap geospatial engine</li>
              <li>• Browser localStorage demo persistence</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm">Gemini AI Engine</span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              <li>• Gemini 3.8 Flash Multimodal Vision</li>
              <li>• Automated defect hazard & depth detection</li>
              <li>• Nagar Sathi bilingual conversational AI</li>
              <li>• Before/After repair verification audit</li>
              <li>• Zero crash deterministic fallbacks</li>
            </ul>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 space-y-2">
            <span className="font-bold text-slate-900 dark:text-white text-sm">Civic Governance</span>
            <ul className="space-y-1 text-slate-600 dark:text-slate-400">
              <li>• 12h–72h Statutory SLA policies</li>
              <li>• Ward Health Index (4-pillar formula)</li>
              <li>• Spatiotemporal duplicate detection</li>
              <li>• Pre-monsoon predictive risk scoring</li>
              <li>• Civic participation reward gamification</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Competition Presentation Disclaimer */}
      <div className="bg-amber-50 dark:bg-amber-950/40 p-5 rounded-2xl border border-amber-200 dark:border-amber-900/60 text-xs text-amber-900 dark:text-amber-300 space-y-1 leading-relaxed">
        <div className="font-bold flex items-center gap-1.5">
          <Award className="w-4 h-4 text-amber-600" />
          <span>Competition Evaluation Notice</span>
        </div>
        <p>
          NAGAR-AI is an independent, non-official technological proof-of-concept developed to demonstrate the transformative role of autonomous artificial intelligence in modern Indian urban local bodies (ULBs). All figures, ward names, and ticket records are calibrated simulated demo artifacts created for demonstration integrity.
        </p>
      </div>

      <div className="flex justify-center pt-2">
        <button
          onClick={() => setCurrentView('landing')}
          className="px-6 py-2.5 rounded-xl bg-[#5e7769] hover:bg-[#506659] text-white font-bold text-xs shadow-md transition-all cursor-pointer"
        >
          Back to Home Page
        </button>
      </div>
    </div>
  );
};
