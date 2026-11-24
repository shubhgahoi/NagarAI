import React, { useState, useEffect, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/common/LeafletMap';
import { runDeterministicAnalytics } from '../services/predictiveAnalyticsEngine';
import { AIService, PredictiveBriefingResult } from '../services/aiService';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  BrainCircuit,
  AlertTriangle,
  Sparkles,
  TrendingUp,
  MapPin,
  Calendar,
  ShieldCheck,
  Flame,
  Activity,
  Layers,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  RefreshCw,
  ArrowRight,
  Filter,
  BarChart3,
  Compass,
  Zap,
} from 'lucide-react';

export const PredictiveAnalytics: React.FC = () => {
  const { complaints, wards, language } = useApp();
  const isHi = language === 'hi';

  // 1. Run deterministic spatial and trend analytics on existing complaints
  const analytics = useMemo(() => {
    return runDeterministicAnalytics(complaints, wards);
  }, [complaints, wards]);

  // 2. Gemini-powered human readable executive recommendation state
  const [briefing, setBriefing] = useState<PredictiveBriefingResult | null>(null);
  const [loadingBriefing, setLoadingBriefing] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'hotspots' | 'trends' | 'wards' | 'sla' | 'timeline'>('hotspots');
  const [selectedClusterCategory, setSelectedClusterCategory] = useState<string>('All');

  // Fetch or regenerate Gemini-powered executive recommendations
  const generateBriefing = async () => {
    setLoadingBriefing(true);
    try {
      const summaryPayload = {
        totalComplaints: analytics.totalAnalyzed,
        topHotspotClusters: analytics.repeatedLocationClusters.slice(0, 3).map((c) => ({
          name: c.representativeName,
          category: c.category,
          reports: c.complaintCount,
          badge: c.insightBadge,
        })),
        categoryBreakdown: analytics.categoryTrends.map((t) => ({
          category: t.category,
          total: t.totalCount,
          breachRate: `${t.breachRate}%`,
        })),
        vulnerableWards: analytics.wardDensities.slice(0, 3).map((w) => ({
          ward: w.wardName,
          densityScore: w.densityScore,
          primaryIssue: w.primaryIssue,
        })),
      };

      const result = await AIService.summarizePredictiveAnalytics(summaryPayload, language);
      setBriefing(result);
    } catch (e) {
      console.error('Failed to generate briefing:', e);
    } finally {
      setLoadingBriefing(false);
    }
  };

  useEffect(() => {
    generateBriefing();
  }, [language, analytics.totalAnalyzed]);

  // Seasonal Precipitation & Infrastructure Stress Simulation Model
  const monsoonTimelineData = [
    { month: 'Apr', baselineWear: 12, monsoonalStress: 14, preventiveInterventions: 8 },
    { month: 'May', baselineWear: 15, monsoonalStress: 22, preventiveInterventions: 25 },
    { month: 'Jun', baselineWear: 28, monsoonalStress: 68, preventiveInterventions: 40 },
    { month: 'Jul', baselineWear: 38, monsoonalStress: 112, preventiveInterventions: 18 },
    { month: 'Aug', baselineWear: 42, monsoonalStress: 96, preventiveInterventions: 15 },
    { month: 'Sep', baselineWear: 25, monsoonalStress: 50, preventiveInterventions: 12 },
    { month: 'Oct', baselineWear: 18, monsoonalStress: 24, preventiveInterventions: 10 },
  ];

  // Filter clusters by category if selected
  const filteredClusters = useMemo(() => {
    if (selectedClusterCategory === 'All') return analytics.repeatedLocationClusters;
    return analytics.repeatedLocationClusters.filter((c) =>
      c.category.toLowerCase().includes(selectedClusterCategory.toLowerCase())
    );
  }, [analytics.repeatedLocationClusters, selectedClusterCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
      {/* Top Banner with Strict Disclaimer & POC Label */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-purple-950 text-white p-6 sm:p-8 border border-indigo-800/60 shadow-2xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-bold border border-purple-400/40">
            <BrainCircuit className="w-4 h-4 text-purple-400 animate-pulse" />
            <span>Predictive Analytics — POC</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono bg-purple-900/60 text-purple-300 px-2.5 py-1 rounded-lg border border-purple-700/50">
              Deterministic Analytics + Gemini Recommendations
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            {isHi ? 'पूर्वानुमानित नागरिक अवसंरचना बुद्धिमत्ता — संकल्पना प्रमाण (POC)' : 'Predictive Civic Infrastructure Intelligence — POC'}
          </h1>
          <p className="text-xs sm:text-sm text-purple-200 max-w-3xl leading-relaxed">
            Nagar-AI applies deterministic spatial clustering and recurrence algorithms over historical grievance coordinates to transition Rewa Municipal Corporation from <i>reactive complaint resolution</i> to <i>proactive preventive infrastructure planning</i>.
          </p>
        </div>

        {/* Clear Non-ML Disclaimer Notice */}
        <div className="bg-slate-950/80 rounded-2xl p-3 border border-purple-500/30 flex items-start gap-2.5 text-[11px] text-purple-200">
          <AlertCircle className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
          <p className="leading-snug">
            <b>System Transparency Notice:</b> This feature does not pretend to run an unverified machine learning neural network. Pattern recognition, recurrence frequencies, and ward density scores are computed deterministically from municipal demo telemetry. Gemini is utilized exclusively to synthesize findings into concise, readable engineering recommendations.
          </p>
        </div>
      </div>

      {/* Top Risk Indicators Counters */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Analyzed</span>
            <span className="p-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600">
              <Activity className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">
            {analytics.totalAnalyzed}
          </div>
          <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400">
            100% Deterministic Dataset
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active Hotspots</span>
            <span className="p-1 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-600">
              <Flame className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400">
            {analytics.hotspotsCount}
          </div>
          <div className="text-[11px] font-semibold text-rose-600 dark:text-rose-400">
            Critical recurrence zones
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Preventive Zones</span>
            <span className="p-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
              <ShieldCheck className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">
            {analytics.preventiveZonesCount}
          </div>
          <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
            Pre-emptive action candidates
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">SLA Breach Rate</span>
            <span className="p-1 rounded-lg bg-amber-50 dark:bg-amber-950 text-amber-600">
              <Clock className="w-3.5 h-3.5" />
            </span>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">
            {analytics.slaBreachAnalysis.breachRate}%
          </div>
          <div className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            {analytics.slaBreachAnalysis.totalBreached} breached tickets
          </div>
        </div>
      </div>

      {/* Gemini-Powered Executive Recommendations Card */}
      <div className="bg-gradient-to-br from-indigo-900/90 to-purple-900/90 text-white rounded-3xl border border-indigo-700/60 p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/30 flex items-center justify-center text-purple-300">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold uppercase tracking-wide text-purple-200">
                  Municipal Commissioner Briefing
                </span>
                <span className="text-[10px] font-mono bg-purple-950/80 px-2 py-0.5 rounded text-purple-300">
                  {briefing?.source === 'gemini-live' ? 'Generated via Gemini 3.8 Flash' : 'Deterministic Advisory Fallback'}
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white mt-0.5">
                {briefing?.executiveHeadline || 'Synthesizing Civic Telemetry into Actionable Directives...'}
              </h3>
            </div>
          </div>

          <button
            onClick={generateBriefing}
            disabled={loadingBriefing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600/60 hover:bg-purple-600 text-white text-xs font-semibold border border-purple-400/40 cursor-pointer self-start sm:self-auto disabled:opacity-50 transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loadingBriefing ? 'animate-spin' : ''}`} />
            <span>{loadingBriefing ? 'Refreshing...' : 'Regenerate Briefing'}</span>
          </button>
        </div>

        {briefing && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="bg-slate-950/40 rounded-2xl p-4 border border-purple-500/20 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 font-bold block">
                Critical Hotspots Summary
              </span>
              <p className="text-xs text-purple-100 leading-relaxed">
                {briefing.criticalHotspotsBrief}
              </p>
            </div>

            <div className="bg-slate-950/40 rounded-2xl p-4 border border-purple-500/20 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-emerald-300 font-bold block">
                Top Recommended Interventions
              </span>
              <ul className="text-xs text-purple-100 space-y-1 list-disc list-inside">
                {briefing.topPreventiveActions.map((action, idx) => (
                  <li key={idx} className="leading-snug">{action}</li>
                ))}
              </ul>
            </div>

            <div className="bg-slate-950/40 rounded-2xl p-4 border border-purple-500/20 space-y-1.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                Strategic Paradigm Shift
              </span>
              <p className="text-xs text-purple-100 leading-relaxed">
                {briefing.transitionRecommendation}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Tab Bar for Deep Analytics Views */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2 overflow-x-auto text-xs font-bold">
        <button
          onClick={() => setActiveTab('hotspots')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'hotspots'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Flame className="w-3.5 h-3.5" />
          <span>Hotspot Cards & Map ({analytics.repeatedLocationClusters.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('trends')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'trends'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Category Trends</span>
        </button>

        <button
          onClick={() => setActiveTab('wards')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'wards'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Ward Density Audit</span>
        </button>

        <button
          onClick={() => setActiveTab('sla')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'sla'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          <span>SLA Breach Patterns</span>
        </button>

        <button
          onClick={() => setActiveTab('timeline')}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
            activeTab === 'timeline'
              ? 'bg-blue-600 text-white shadow-sm'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          <span>Timeline Simulation</span>
        </button>
      </div>

      {/* 1. HOTSPOTS & SPATIAL RADAR TAB */}
      {activeTab === 'hotspots' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* GIS Interactive Leaflet Radar */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-rose-600">
                    Spatiotemporal Hotspot Radar
                  </span>
                  <span className="text-[10px] font-mono bg-rose-50 text-rose-700 dark:bg-rose-950 px-2 py-0.5 rounded font-bold">
                    Interactive Geospatial Projection
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                  Rewa Repeated Problem Zones & Heat Clustering
                </h2>
                <p className="text-xs text-slate-500">
                  Switch between <b>Live Issues</b> and <b>Hotspot Analysis</b> to inspect chronic infrastructure corridors.
                </p>
              </div>
            </div>

            <LeafletMap
              complaints={complaints}
              height="480px"
              showHotspots={true}
              defaultMode="hotspot"
              title="Rewa Predictive Infrastructure Vulnerability Hotspots"
            />
          </div>

          {/* Hotspot Cards Grid */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Flame className="w-4 h-4 text-rose-600" />
                  <span>Identified Chronic Infrastructure Hotspots</span>
                </h3>
                <p className="text-xs text-slate-500">
                  Corridors showing repeated fatigue within 90-day maintenance cycles.
                </p>
              </div>

              {/* Category Filter for Cards */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400 font-semibold">Filter:</span>
                <select
                  value={selectedClusterCategory}
                  onChange={(e) => setSelectedClusterCategory(e.target.value)}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-1.5 text-xs font-semibold text-slate-800 dark:text-slate-200"
                >
                  <option value="All">All Categories ({analytics.repeatedLocationClusters.length})</option>
                  <option value="Water">Waterlogging & Drainage</option>
                  <option value="Road">Roads & Potholes</option>
                  <option value="Light">Streetlights</option>
                  <option value="Garbage">Garbage & Sanitation</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredClusters.map((cluster, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs hover:border-indigo-300 dark:hover:border-indigo-700 transition-all flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded">
                        {cluster.category}
                      </span>
                      <span
                        className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                          cluster.riskLevel === 'Critical'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : cluster.riskLevel === 'High'
                            ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {cluster.riskLevel} Risk
                      </span>
                    </div>

                    <div>
                      <div className="text-xs font-black text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-0.5">
                        {cluster.insightBadge}
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                        {cluster.representativeName}
                      </h4>
                    </div>

                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-600 dark:text-slate-300 leading-relaxed space-y-1">
                      <div className="text-[10px] font-bold text-slate-400">Pattern Observation</div>
                      <div>{cluster.patternDescription}</div>
                    </div>

                    <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-900 dark:text-emerald-200 leading-relaxed space-y-1">
                      <div className="text-[10px] font-bold text-emerald-700 dark:text-emerald-300 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Recommended Preventive Action
                      </div>
                      <div>{cluster.recommendedPreventiveAction}</div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px] flex items-center justify-between text-slate-500">
                    <span>
                      {cluster.wards[0] ? cluster.wards[0].split('-')[0].trim() : 'Rewa Ward'}
                    </span>
                    <span className="font-bold text-blue-600">
                      {cluster.complaintCount} Logged Reports
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 2. CATEGORY TRENDS TAB */}
      {activeTab === 'trends' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Volume vs SLA Breaches Chart */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Issue Category Volumes & SLA Breach Rates
                </h3>
                <p className="text-xs text-slate-500">
                  Distribution of grievances across municipal departments and breach incidence.
                </p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={analytics.categoryTrends}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="category" stroke="#94a3b8" fontSize={10} tickLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={11} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0f172a',
                        borderColor: '#334155',
                        borderRadius: '12px',
                        color: '#fff',
                        fontSize: '12px',
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="totalCount" name="Total Reports" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="slaBreachedCount" name="SLA Breached" fill="#EF4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category Vulnerability Breakdown Table */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Root Cause & Preventive Engineering Directives
                </h3>
                <p className="text-xs text-slate-500">
                  Technical vulnerability root-cause analysis for top complaint categories.
                </p>
              </div>

              <div className="space-y-2.5 overflow-y-auto max-h-80 pr-1">
                {analytics.categoryTrends.map((cat, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">
                        {cat.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          cat.trendDirection === 'Surging'
                            ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                            : 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                        }`}
                      >
                        {cat.trendDirection} Trend ({cat.totalCount} issues)
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-600 dark:text-slate-300">
                      <b>Root Vulnerability:</b> {cat.rootVulnerability}
                    </div>

                    <div className="text-[11px] text-emerald-700 dark:text-emerald-300">
                      <b>Preventive Solution:</b> {cat.preventiveRecommendation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. WARD COMPLAINT DENSITY TAB */}
      {activeTab === 'wards' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Ward-Level Complaint Density & Vulnerability Matrix
              </h3>
              <p className="text-xs text-slate-500">
                Composite density scores prioritizing infrastructure allocation and resource deployment across Rewa.
              </p>
            </div>
            <span className="text-xs font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-1 rounded-lg font-bold">
              {analytics.wardDensities.length} Municipal Wards
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Ward Name</th>
                  <th className="p-3">Zone</th>
                  <th className="p-3">Total Issues</th>
                  <th className="p-3">Critical Count</th>
                  <th className="p-3">SLA Compliance</th>
                  <th className="p-3">Vulnerability Score</th>
                  <th className="p-3">Primary Defect Category</th>
                  <th className="p-3">Status Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {analytics.wardDensities.map((ward) => (
                  <tr key={ward.wardId} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                    <td className="p-3 font-bold text-slate-900 dark:text-white">{ward.wardName}</td>
                    <td className="p-3 text-slate-500">{ward.zone}</td>
                    <td className="p-3 font-semibold text-blue-600">{ward.complaintCount}</td>
                    <td className="p-3 font-semibold text-rose-600">{ward.criticalCount}</td>
                    <td className="p-3 font-bold text-slate-800 dark:text-slate-200">
                      {ward.slaComplianceRate}%
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              ward.densityScore > 60
                                ? 'bg-rose-500'
                                : ward.densityScore > 30
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${ward.densityScore}%` }}
                          />
                        </div>
                        <span className="font-mono text-[11px] font-bold">{ward.densityScore}</span>
                      </div>
                    </td>
                    <td className="p-3 font-medium text-slate-600 dark:text-slate-300">
                      {ward.primaryIssue}
                    </td>
                    <td className="p-3">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                          ward.riskCategory === 'High Vulnerability'
                            ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                            : ward.riskCategory === 'Moderate'
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                            : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        }`}
                      >
                        {ward.riskCategory}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 4. SLA BREACH PATTERNS TAB */}
      {activeTab === 'sla' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Departmental Delay & SLA Breaches
              </h3>
              <p className="text-xs text-slate-500">
                Breakdown of overdue complaints and mean resolution delay in hours.
              </p>
            </div>

            <div className="space-y-3">
              {analytics.slaBreachAnalysis.byDepartment.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No statutory SLA breaches detected in current dataset.
                </div>
              ) : (
                analytics.slaBreachAnalysis.byDepartment.map((dept, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-xs font-bold text-slate-900 dark:text-white">
                        {dept.department}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Average Overdue: +{dept.meanDelayHours} hours beyond statutory SLA
                      </div>
                    </div>
                    <span className="text-xs font-bold text-rose-600 bg-rose-50 dark:bg-rose-950 px-2.5 py-1 rounded-lg">
                      {dept.count} Breaches
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Primary Root Bottlenecks Identified
              </h3>
              <p className="text-xs text-slate-500">
                Operational friction points slowing municipal resolution workflows.
              </p>
            </div>

            <div className="space-y-3">
              {analytics.slaBreachAnalysis.primaryBottlenecks.map((bottleneck, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-rose-50/60 dark:bg-rose-950/30 border border-rose-200/80 dark:border-rose-900/60 flex items-start gap-3"
                >
                  <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-xs text-slate-800 dark:text-slate-200 leading-snug">
                    {bottleneck}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TIMELINE SIMULATION TAB */}
      {activeTab === 'timeline' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Seasonal Precipitation Stress Forecast (Simulated Monsoonal Model)
              </h3>
              <p className="text-xs text-slate-500">
                Simulation showing anticipated drainage and waterlogging surges without preventive desilting versus scheduled pre-monsoon interventions.
              </p>
            </div>
            <span className="text-[10px] font-mono bg-purple-50 text-purple-700 dark:bg-purple-950 px-2 py-0.5 rounded font-bold self-start sm:self-auto">
              Simulated Forecast
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monsoonTimelineData}>
                <defs>
                  <linearGradient id="monsoonGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="preventiveGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    borderColor: '#334155',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
                <Area
                  type="monotone"
                  dataKey="monsoonalStress"
                  stroke="#8B5CF6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#monsoonGrad)"
                  name="Unmitigated Weather Stress Index"
                />
                <Area
                  type="monotone"
                  dataKey="baselineWear"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  fillOpacity={0}
                  name="Dry Season Baseline"
                />
                <Area
                  type="monotone"
                  dataKey="preventiveInterventions"
                  stroke="#10B981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#preventiveGrad)"
                  name="Preventive Interventions Completed"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};
