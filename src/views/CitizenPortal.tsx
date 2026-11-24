import React from 'react';
import { useApp } from '../context/AppContext';
import { IssueCategory } from '../types';
import {
  PlusCircle,
  Award,
  Layers,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  Flame,
  ShieldCheck,
  Eye,
  Camera,
  ArrowRight,
} from 'lucide-react';

export const CitizenPortal: React.FC = () => {
  const {
    complaints,
    citizenProfile,
    setCurrentView,
    viewComplaintDetail,
    language,
  } = useApp();

  const isHi = language === 'hi';

  const activeCount = complaints.filter(
    (c) => c.status === 'In Progress' || c.status === 'Assigned' || c.status === 'AI Verified'
  ).length;
  const resolvedCount = complaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Citizen Verified'
  ).length;
  const pendingCount = complaints.filter((c) => c.status === 'Reported').length;
  const breachedCount = complaints.filter(
    (c) => c.status === 'SLA Breached' || c.sla.status === 'SLA Breached'
  ).length;

  const categories: { label: IssueCategory; icon: string; count: number; desc: string }[] = [
    { label: 'Road / Pothole', icon: '🛣️', count: complaints.filter((c) => c.category === 'Road / Pothole').length, desc: 'Potholes, surface cracks' },
    { label: 'Streetlight', icon: '💡', count: complaints.filter((c) => c.category === 'Streetlight').length, desc: 'Lamps, dark spots, wires' },
    { label: 'Garbage', icon: '🗑️', count: complaints.filter((c) => c.category === 'Garbage').length, desc: 'Overflowing bins, litter' },
    { label: 'Water Leakage', icon: '💧', count: complaints.filter((c) => c.category === 'Water Leakage').length, desc: 'Burst mains, pipe leak' },
    { label: 'Waterlogging', icon: '🌊', count: complaints.filter((c) => c.category === 'Waterlogging').length, desc: 'Road flooding, rainwater' },
    { label: 'Drainage', icon: '🕳️', count: complaints.filter((c) => c.category === 'Drainage').length, desc: 'Clogged drains, manholes' },
    { label: 'Fallen Tree', icon: '🌳', count: complaints.filter((c) => c.category === 'Fallen Tree').length, desc: 'Branches on roads' },
    { label: 'Other', icon: '⚠️', count: complaints.filter((c) => c.category === 'Other').length, desc: 'Encroachments, public assets' },
  ];

  const recentComplaints = complaints.slice(0, 6);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Citizen Verified':
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" /> {status}
          </span>
        );
      case 'In Progress':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
            <Clock className="w-3.5 h-3.5 animate-spin" /> In Progress
          </span>
        );
      case 'SLA Breached':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-600 dark:text-rose-400">
            <AlertTriangle className="w-3.5 h-3.5" /> SLA Breached
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> {status}
          </span>
        );
    }
  };

  const getPriorityDot = (p: string) => {
    switch (p) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span> Critical
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span> High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#5e7769] dark:text-[#8ea899]">
            <span className="w-2 h-2 rounded-full bg-[#5e7769]"></span> Medium
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
            <span className="w-2 h-2 rounded-full bg-slate-400"></span> Low
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-br from-[#eaf0ec] via-[#f5f2eb] to-[#f6ede8] dark:from-[#1b2520] dark:via-[#1e201d] dark:to-[#241c19] text-stone-900 dark:text-stone-100 rounded-3xl p-6 sm:p-8 border border-stone-200/90 dark:border-stone-800 shadow-sm">
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-stone-800/80 text-emerald-800 dark:text-emerald-300 text-xs font-bold border border-emerald-300/50 dark:border-emerald-700/50 shadow-xs">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Smart Rewa Citizen Empowerment Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900 dark:text-white">
            {isHi ? 'नागरिक सेवा डैशबोर्ड' : 'Nagar-AI Citizen Portal'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 max-w-xl">
            Welcome back, <span className="font-bold text-stone-900 dark:text-stone-100">{citizenProfile.name}</span>. Report grievances in seconds, track field engineers, and earn civic points for verifying resolutions.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setCurrentView('report')}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white dark:bg-stone-100 dark:hover:bg-white dark:text-stone-900 font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
          >
            <PlusCircle className="w-5 h-5 text-emerald-400 dark:text-emerald-700" />
            <span>{isHi ? '+ समस्या रिपोर्ट करें' : '+ Report a Civic Issue'}</span>
          </button>
        </div>
      </div>

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="glass-card glass-card-hover p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isHi ? 'सक्रिय शिकायतें' : 'Active In-Progress'}
            </div>
            <div className="text-2xl font-black text-[#b86244] dark:text-[#ea8e72] mt-1">
              {activeCount}
            </div>
            <div className="text-[10px] text-slate-400">Under field execution</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#faeee8] dark:bg-[#2b1f1a] border border-[#f3d4c5] dark:border-[#523528] flex items-center justify-center text-[#b86244] dark:text-[#ea8e72]">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isHi ? 'हल की गई' : 'Resolved Complaints'}
            </div>
            <div className="text-2xl font-black text-[#4b7a64] dark:text-[#7bb29a] mt-1">
              {resolvedCount}
            </div>
            <div className="text-[10px] text-slate-400">Verified by citizens</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#eaf4ef] dark:bg-[#1a2b22] border border-[#cde8db] dark:border-[#2d4d3d] flex items-center justify-center text-[#4b7a64] dark:text-[#7bb29a]">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isHi ? 'लंबित / समीक्षाधीन' : 'Pending Verification'}
            </div>
            <div className="text-2xl font-black text-[#a67a33] dark:text-[#dfb166] mt-1">
              {pendingCount}
            </div>
            <div className="text-[10px] text-slate-400">AI triage in progress</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#fdf7ea] dark:bg-[#2c2417] border border-[#f3e7c3] dark:border-[#4d3f23] flex items-center justify-center text-[#a67a33] dark:text-[#dfb166]">
            <Layers className="w-5 h-5" />
          </div>
        </div>

        <div className="glass-card glass-card-hover p-5 rounded-2xl shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              {isHi ? 'नागरिक अंक (Points)' : 'Civic Reward Points'}
            </div>
            <div className="text-2xl font-black text-[#7a648b] dark:text-[#bda4ce] mt-1">
              {citizenProfile.points}
            </div>
            <div className="text-[10px] text-slate-400">Level 2 Civic Champion</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#f5eef9] dark:bg-[#271e30] border border-[#e4d2ec] dark:border-[#4d365f] flex items-center justify-center text-[#7a648b] dark:text-[#bda4ce]">
            <Award className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Quick Report Category Selector */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isHi ? 'त्वरित शिकायत श्रेणियां' : 'Quick Report by Category'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select an issue type to immediately launch the AI-assisted complaint wizard.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentView('report')}
              className="glass-card-hover p-3.5 rounded-2xl text-left transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <div>
                <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                  {cat.label}
                </div>
                <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">{cat.desc}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Gamification Badges Section */}
      <div className="glass-panel bg-linear-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-400/30 p-5 rounded-2xl space-y-3 backdrop-blur-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500 fill-amber-500" />
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Civic Participation Badges & Impact
            </h3>
            <span className="text-[10px] font-semibold text-slate-400">
              (Prototype Gamification • Non-monetary)
            </span>
          </div>
          <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
            Points rule: <span className="font-bold text-amber-600 dark:text-amber-400">+10 Report</span> • <span className="font-bold text-emerald-600 dark:text-emerald-400">+5 Confirmed Fix</span> • <span className="font-bold text-blue-600 dark:text-blue-400">+3 Avoid Duplicate</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {citizenProfile.badges.map((b) => (
            <div
              key={b.id}
              className={`p-3 rounded-xl border flex items-center gap-3 transition-colors ${
                b.unlocked
                  ? 'glass-card border-amber-300/40 dark:border-amber-700/50 shadow-sm'
                  : 'glass-card opacity-50 border-white/10'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-600 dark:text-amber-400 shrink-0">
                {b.id === 'badge-1' && <Award className="w-5 h-5" />}
                {b.id === 'badge-2' && <Eye className="w-5 h-5" />}
                {b.id === 'badge-3' && <ShieldCheck className="w-5 h-5" />}
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <span>{b.name}</span>
                  {b.unlocked && (
                    <span className="text-[9px] bg-emerald-500/20 border border-emerald-400/30 text-emerald-700 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                      Unlocked
                    </span>
                  )}
                </div>
                <div className="text-[10.5px] text-slate-500 dark:text-slate-400 leading-tight">
                  {b.description}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Complaints Table & Feed */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {isHi ? 'हालिया नागरिक शिकायतें' : 'Recent Grievances in Rewa'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Track status, active SLA countdowns, and field inspection progress.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('my-complaints')}
            className="text-xs font-bold text-[#5e7769] dark:text-[#8ea899] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({complaints.length})</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentComplaints.map((c) => (
            <div
              key={c.id}
              onClick={() => viewComplaintDetail(c.id)}
              className="glass-card-hover p-5 rounded-2xl cursor-pointer transition-all flex flex-col justify-between space-y-4 group shadow-md"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold text-[#5e7769] dark:text-[#8ea899]">
                    {c.id}
                  </span>
                  <div className="flex items-center gap-2.5">
                    {getPriorityDot(c.priority)}
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    {getStatusBadge(c.status)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#5e7769] dark:group-hover:text-[#8ea899] transition-colors line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {c.description}
                  </p>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-slate-200/50 dark:border-white/10 text-[11.5px] text-slate-500 dark:text-slate-400">
                  <div className="flex items-center justify-between">
                    <span className="truncate">📍 {c.location.landmark || c.location.address}</span>
                  </div>
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 font-medium">
                    <span className="truncate">🏛️ {c.department}</span>
                    <span className="text-[10px] font-mono text-slate-400 shrink-0">
                      {new Date(c.sla.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-slate-200/50 dark:border-white/10 text-xs font-semibold text-[#5e7769] dark:text-[#8ea899]">
                <span>View Timeline & SLA →</span>
                <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  SLA: {c.sla.slaHours}h target
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Helplines & Municipal Contacts */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs shadow-md">
        <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
          <span className="font-bold text-slate-900 dark:text-white">Rewa Emergency Helplines:</span>
          <span>Municipal Control Room: <a href="tel:18002330104" className="font-mono font-bold text-[#5e7769] dark:text-[#8ea899] hover:underline">1800-233-0104</a></span>
          <span>·</span>
          <span>Ambulance: <a href="tel:108" className="font-mono font-bold text-emerald-600 dark:text-emerald-400 hover:underline">108</a></span>
          <span>·</span>
          <span>Police: <a href="tel:112" className="font-mono font-bold text-rose-600 dark:text-rose-400 hover:underline">112</a></span>
        </div>
        <div className="text-[11px] text-slate-400 dark:text-slate-400">
          Civic complaints resolved per MP Public Services Guarantee Act (CM Helpline 181 sync)
        </div>
      </div>
    </div>
  );
};
