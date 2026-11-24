import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/common/LeafletMap';
import { runDeterministicAnalytics } from '../services/predictiveAnalyticsEngine';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  Globe,
  Download,
  CheckCircle2,
  Clock,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  ArrowRight,
  Info,
  Flame,
  AlertTriangle,
  Building,
  MapPin,
  Calendar,
  Layers,
  Sparkles,
  Search,
  ExternalLink,
  Cpu,
  Route,
  UserCheck,
  BrainCircuit,
  Activity,
  Award,
} from 'lucide-react';

export const TransparencyDashboard: React.FC = () => {
  const { complaints, wards, language, showToast, viewComplaintDetail, setCurrentView } = useApp();
  const isHi = language === 'hi';

  // 1. High-level Transparency & Accountability Metrics
  const totalReported = complaints.length;
  const resolvedIssues = complaints.filter(
    (c) => c.status === 'Resolved' || c.status === 'Citizen Verified'
  ).length;

  const averageResolutionTime = '24.8h';
  const slaCompliance = totalReported > 0 ? Math.round((resolvedIssues / totalReported) * 100) : 88;

  // 2. Deterministic Hotspots Analytics
  const analytics = useMemo(() => {
    return runDeterministicAnalytics(complaints, wards);
  }, [complaints, wards]);

  const currentHotspots = analytics.repeatedLocationClusters;

  // 3. Issue Categories Breakdown
  const categoriesList = [
    'Road / Pothole',
    'Streetlight',
    'Garbage',
    'Water Leakage',
    'Waterlogging',
    'Drainage',
    'Fallen Tree',
  ];

  const categoryBreakdown = useMemo(() => {
    return categoriesList.map((cat) => {
      const catComplaints = complaints.filter((c) => c.category === cat);
      const res = catComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Citizen Verified').length;
      return {
        name: cat.split('/')[0].trim(),
        total: catComplaints.length,
        resolved: res,
        open: catComplaints.length - res,
      };
    });
  }, [complaints]);

  // 4. Resolution Trends (Weekly simulated operational cadence)
  const resolutionTrendsData = [
    { period: 'Week 1', reported: 18, resolved: 16, slaRate: 88 },
    { period: 'Week 2', reported: 24, resolved: 22, slaRate: 91 },
    { period: 'Week 3', reported: 31, resolved: 28, slaRate: 90 },
    { period: 'Week 4', reported: 28, resolved: 27, slaRate: 96 },
    { period: 'Week 5', reported: 36, resolved: 32, slaRate: 89 },
    { period: 'Week 6 (Current)', reported: totalReported, resolved: resolvedIssues, slaRate: slaCompliance },
  ];

  // 5. Open Data Export in JSON
  const handleExportData = () => {
    const publicExport = complaints.map((c) => ({
      ticketId: c.id,
      category: c.category,
      ward: c.location.wardName,
      status: c.status,
      priority: c.priority,
      reportedAt: c.sla.createdAt,
      resolvedAt: c.sla.resolvedAt || null,
      slaHours: c.sla.slaHours,
      slaStatus: c.sla.status,
    }));

    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(publicExport, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `nagar_ai_rewa_public_audit_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Downloaded Open Civic Audit dataset', 'success');
  };

  // 6. Section "How Rewa's Civic Issues Flow Through Nagar-AI" requested in brief
  const flowSteps = [
    {
      step: 1,
      name: 'Citizen Report',
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      desc: 'Resident logs grievance in English, Hindi, or Bagheli dialect with photo & exact GPS pin.',
      badge: 'Multilingual Intake',
    },
    {
      step: 2,
      name: 'AI Verification',
      icon: <Sparkles className="w-5 h-5 text-purple-500" />,
      desc: 'Gemini visual inspection checks defect severity, depth, roadway hazard, and proximity duplicates.',
      badge: 'Multimodal Vision',
    },
    {
      step: 3,
      name: 'Smart Routing',
      icon: <Route className="w-5 h-5 text-indigo-500" />,
      desc: 'Work order auto-assigned immediately to the responsible Rewa municipal ward engineer.',
      badge: 'Zero Bureaucratic Lag',
    },
    {
      step: 4,
      name: 'SLA Monitoring',
      icon: <Clock className="w-5 h-5 text-amber-500" />,
      desc: 'Live countdown enforces statutory resolution window (12h to 72h) with proactive escalation.',
      badge: 'Charter Accountability',
    },
    {
      step: 5,
      name: 'Resolution',
      icon: <ShieldCheck className="w-5 h-5 text-emerald-500" />,
      desc: 'Field engineering crew uploads post-repair photo; visual AI cross-verifies physical restoration.',
      badge: 'Proof of Execution',
    },
    {
      step: 6,
      name: 'Citizen Confirmation',
      icon: <UserCheck className="w-5 h-5 text-teal-500" />,
      desc: 'Complainant inspects the fix, validates satisfactory closure, and earns civic reward points.',
      badge: 'Democratic Audit',
    },
    {
      step: 7,
      name: 'Predictive Planning',
      icon: <BrainCircuit className="w-5 h-5 text-rose-500" />,
      desc: 'Repeated coordinates convert into pre-monsoon desilting and asphalt rejuvenation work orders.',
      badge: 'Preventive Governance',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-10">
      {/* 1. Header Banner & Strict Public Transparency Theme */}
      <div className="rounded-3xl bg-gradient-to-r from-[#22332a] via-[#1a2620] to-[#141d18] text-white p-6 sm:p-10 border border-[#445b4e]/50 shadow-2xl relative overflow-hidden space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-bold border border-teal-400/40">
                <Globe className="w-3.5 h-3.5 text-teal-400" />
                <span>Public Civic Audit & Transparency Portal</span>
              </span>
              <span className="text-[11px] font-mono bg-teal-950/80 text-teal-300 px-2.5 py-1 rounded-lg border border-teal-600/50">
                Open Governance
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
              Rewa Open Civic Transparency Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-teal-100 max-w-3xl leading-relaxed">
              Unconditional public transparency into municipal defect turnaround times, statutory SLA compliance, ward rankings, and chronic infrastructure fatigue points across Rewa.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={handleExportData}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-500 text-white font-bold text-xs shadow-lg transition-all cursor-pointer hover:shadow-teal-500/25 active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Export Open Audit Data (JSON)</span>
            </button>
          </div>
        </div>

        {/* Mandatory Transparency Disclaimer Banner explicitly required in brief */}
        <div className="bg-slate-950/90 rounded-2xl p-3.5 border border-teal-500/40 flex items-start gap-3 text-xs text-teal-200">
          <Info className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
          <div className="leading-snug">
            <b>Mandatory Civic Disclaimer:</b> Prototype dashboard using simulated data. Not an official Rewa Municipal Corporation data source. Developed to showcase automated public transparency, citizen verification, and proactive infrastructure governance.
          </div>
        </div>
      </div>

      {/* 2. Four Core Transparency Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total reported issues */}
        <div className="glass-card p-5 rounded-3xl shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Total Reported Issues</span>
            <span className="p-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{totalReported}</div>
          <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400">100% Publicly Auditable</div>
        </div>

        {/* Resolved issues */}
        <div className="glass-card p-5 rounded-3xl shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Resolved Issues</span>
            <span className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{resolvedIssues}</div>
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Verified by residents</div>
        </div>

        {/* Average resolution time */}
        <div className="glass-card p-5 rounded-3xl shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>Average Resolution Time</span>
            <span className="p-1.5 rounded-xl bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-900">
              <Clock className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{averageResolutionTime}</div>
          <div className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400">Against 48.0h municipal norm</div>
        </div>

        {/* SLA compliance */}
        <div className="glass-card p-5 rounded-3xl shadow-md space-y-1">
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span>SLA Compliance</span>
            <span className="p-1.5 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-700 dark:text-teal-400 border border-teal-200 dark:border-teal-900">
              <ShieldCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-teal-600 dark:text-teal-400">{slaCompliance}%</div>
          <div className="text-[11px] font-bold text-teal-600 dark:text-teal-400">Target benchmark: 85%</div>
        </div>
      </div>

      {/* 3. "How Rewa's Civic Issues Flow Through Nagar-AI" Section */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 border border-indigo-800/60 shadow-2xl space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-teal-300">
            <Route className="w-4 h-4" />
            <span>Closed-Loop Accountability Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black">
            How Rewa's Civic Issues Flow Through Nagar-AI
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            From the initial citizen voice prompt to autonomous AI verification, statutory countdown, physical repair, resident confirmation, and preventive capital planning.
          </p>
        </div>

        {/* 7-Step Visual Progression Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
          {flowSteps.map((item, idx) => (
            <div
              key={item.step}
              className="glass-card-hover border border-white/15 rounded-2xl p-4 flex flex-col justify-between space-y-3 transition-all relative backdrop-blur-md"
            >
              <div className="flex items-center justify-between">
                <span className="w-6 h-6 rounded-full bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center font-mono text-xs font-bold shadow-xs">
                  {item.step}
                </span>
                <span className="p-1.5 rounded-xl bg-white/10 border border-white/10">
                  {item.icon}
                </span>
              </div>

              <div className="space-y-1">
                <div className="text-xs font-black text-white">{item.name}</div>
                <div className="text-[10px] text-teal-300 font-mono font-bold uppercase tracking-wider">
                  {item.badge}
                </div>
                <p className="text-[11px] text-slate-300 leading-snug pt-1">
                  {item.desc}
                </p>
              </div>

              {idx < 6 && (
                <div className="hidden lg:block absolute -right-2 top-1/2 -translate-y-1/2 z-10 text-teal-400/60 font-mono text-xs">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 text-xs text-teal-200 border-t border-white/15">
          <span>
            <b>Guaranteed SLA:</b> Garbage (12h) · Streetlight (24h) · Water Leak (24h) · Pothole (72h)
          </span>
          <span className="font-mono text-teal-300">
            Citizen Confirmation Required for Permanent Closure
          </span>
        </div>
      </div>

      {/* 4. Interactive Map with Live Hotspots & Triage */}
      <div className="glass-panel rounded-3xl p-6 shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400">
                Public GIS Transparency Map
              </span>
              <span className="text-[10px] font-mono bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded font-bold">
                Live Geographic Telemetry
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              Rewa Open Civic GIS Work Orders & Hotspot Clustering
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Interactive map displaying open municipal issues, verified repairs, and chronic defect hotspot zones.
            </p>
          </div>
        </div>

        <LeafletMap
          complaints={complaints}
          height="460px"
          showHotspots={true}
          defaultMode="live"
          title="Rewa Public Civic Work Order Map"
        />
      </div>

      {/* 5. Issue Categories Breakdown & Resolution Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issue Categories Chart */}
        <div className="glass-panel p-6 rounded-3xl shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Issue Categories & Resolution Status
            </h3>
            <p className="text-xs text-slate-400">Total reported civic defects across sectors vs. resolved count</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryBreakdown}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(8px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Bar dataKey="total" name="Total Reported" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="resolved" name="Physically Resolved" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Resolution Trends Chart */}
        <div className="glass-panel p-6 rounded-3xl shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10 space-y-4">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Weekly Resolution Trends & SLA Compliance
            </h3>
            <p className="text-xs text-slate-400">Pace of municipal resolution compared against intake volume</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={resolutionTrendsData}>
                <defs>
                  <linearGradient id="trendGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0D9488" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#0D9488" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="period" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(15, 23, 42, 0.9)',
                    backdropFilter: 'blur(8px)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area
                  type="monotone"
                  dataKey="resolved"
                  stroke="#0D9488"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#trendGrad)"
                  name="Resolved Complaints"
                />
                <Area
                  type="monotone"
                  dataKey="reported"
                  stroke="#6366F1"
                  strokeWidth={2}
                  fillOpacity={0}
                  name="Reported Complaints"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 6. Ward-Level Demo Indicators Table */}
      <div className="glass-panel rounded-3xl p-6 shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Ward-Level Demo Indicators & Performance Matrix
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Comparative responsiveness across all 8 demonstration wards in Rewa Municipal Corporation.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-teal-500/20 text-teal-700 dark:text-teal-300 border border-teal-400/30 px-2 py-0.5 rounded font-bold self-start sm:self-auto">
            Simulated Demo Dataset
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="glass-card text-slate-600 dark:text-slate-300 font-bold border-b border-white/20 dark:border-white/10">
              <tr>
                <th className="p-3">Ward Name</th>
                <th className="p-3">Zone</th>
                <th className="p-3">Open Issues</th>
                <th className="p-3">Resolved</th>
                <th className="p-3">SLA Compliance</th>
                <th className="p-3">Mean Fix Time</th>
                <th className="p-3">Citizen Satisfaction</th>
                <th className="p-3">Performance Index</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {wards.map((w) => (
                <tr key={w.id} className="hover:bg-white/10 dark:hover:bg-white/5 transition-colors">
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{w.name}</td>
                  <td className="p-3 text-slate-500 dark:text-slate-400">{w.zone}</td>
                  <td className="p-3 font-semibold text-blue-600 dark:text-blue-400">{w.openComplaints}</td>
                  <td className="p-3 font-semibold text-emerald-600 dark:text-emerald-400">{w.resolvedComplaints}</td>
                  <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                    {w.slaComplianceRate}%
                  </td>
                  <td className="p-3 font-mono text-slate-500 dark:text-slate-400">{w.avgResolutionHours}h</td>
                  <td className="p-3 font-bold text-teal-600 dark:text-teal-400">{w.citizenSatisfaction}%</td>
                  <td className="p-3">
                    <span
                      className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                        w.healthIndex >= 85
                          ? 'bg-emerald-500/20 text-emerald-800 dark:text-emerald-300 border-emerald-400/30'
                          : 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400/30'
                      }`}
                    >
                      {w.healthIndex.toFixed(1)} / 100
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* 7. Current Hotspots Identified in Rewa */}
      <div className="glass-panel rounded-3xl p-6 shadow-xl backdrop-blur-2xl border border-white/20 dark:border-white/10 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-600" />
              <span>Current Chronic Infrastructure Hotspots</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Corridors showing repeated fatigue within 90-day cycles requiring preventive municipal capital work.
            </p>
          </div>
          <span className="text-[10px] font-mono bg-rose-500/20 text-rose-700 dark:text-rose-300 border border-rose-400/30 px-2 py-0.5 rounded font-bold self-start sm:self-auto">
            {currentHotspots.length} Identified Hotspots
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentHotspots.slice(0, 6).map((hotspot, idx) => (
            <div
              key={idx}
              className="p-4 rounded-2xl glass-card-hover space-y-2.5 flex flex-col justify-between shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-rose-600 dark:text-rose-400 bg-rose-500/15 border border-rose-400/30 px-2 py-0.5 rounded uppercase tracking-wider">
                    {hotspot.insightBadge}
                  </span>
                  <span className="text-[10px] font-extrabold text-slate-500 dark:text-slate-400">
                    {hotspot.complaintCount} Reports
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                  {hotspot.representativeName}
                </h4>

                <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-snug">
                  {hotspot.patternDescription}
                </p>
              </div>

              <div className="pt-2 border-t border-slate-200/50 dark:border-white/10 text-[10.5px] text-emerald-700 dark:text-emerald-300 flex items-center gap-1 font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{hotspot.recommendedPreventiveAction}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
