import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ComplaintStatus, PriorityLevel } from '../types';
import { LeafletMap } from '../components/common/LeafletMap';
import { SLACountdown } from '../components/common/SLACountdown';
import { TicketActionDrawer } from '../components/dashboard/TicketActionDrawer';
import { PredictiveAnalytics } from './PredictiveAnalytics';
import { WardPerformance } from './WardPerformance';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import {
  LayoutDashboard,
  Layers,
  MapPin,
  Clock,
  Building,
  BrainCircuit,
  Users,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle2,
  Filter,
  Search,
  ChevronRight,
  Flame,
  ArrowUpRight,
  ShieldAlert,
  ArrowDownRight,
  Sparkles,
  Download,
  Calendar,
  Compass,
  RefreshCw,
  PlusCircle,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';

export type DashboardSection =
  | 'overview'
  | 'complaints'
  | 'map'
  | 'sla'
  | 'wards'
  | 'predictive'
  | 'citizens'
  | 'reports';

export const OfficerDashboard: React.FC = () => {
  const {
    complaints,
    wards,
    citizenProfile,
    viewComplaintDetail,
    updateComplaint,
    showToast,
    language,
    startDemoJourney,
  } = useApp();

  const isHi = language === 'hi';

  // Section Navigation
  const [activeSection, setActiveSection] = useState<DashboardSection>('overview');

  // Drawer state
  const [drawerComplaintId, setDrawerComplaintId] = useState<string | null>(null);

  // Filters for Complaint Queue
  const [filterPriority, setFilterPriority] = useState<string>('All');
  const [filterDept, setFilterDept] = useState<string>('All');
  const [filterWard, setFilterWard] = useState<string>('All');
  const [filterSLA, setFilterSLA] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'priority' | 'sla' | 'recent'>('priority');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Overview KPIs
  const openComplaints = useMemo(
    () => complaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Citizen Verified'),
    [complaints]
  );
  const openCount = openComplaints.length;

  const criticalComplaints = useMemo(
    () => complaints.filter((c) => c.priority === 'Critical' && c.status !== 'Resolved'),
    [complaints]
  );
  const criticalCount = criticalComplaints.length;

  // Due Soon: within next 4 hours
  const dueSoonComplaints = useMemo(() => {
    const now = Date.now();
    return complaints.filter((c) => {
      if (c.status === 'Resolved' || c.status === 'Citizen Verified') return false;
      const deadline = new Date(c.sla.deadline).getTime();
      const diffMs = deadline - now;
      return diffMs > 0 && diffMs <= 4 * 60 * 60 * 1000;
    });
  }, [complaints]);
  const dueSoonCount = dueSoonComplaints.length;

  // SLA Breached
  const breachedComplaints = useMemo(
    () =>
      complaints.filter(
        (c) =>
          c.status === 'SLA Breached' ||
          c.sla.status === 'SLA Breached' ||
          (c.status !== 'Resolved' && new Date(c.sla.deadline).getTime() < Date.now())
      ),
    [complaints]
  );
  const breachedCount = breachedComplaints.length;

  // Resolved Today (demo data closures)
  const resolvedComplaints = useMemo(
    () => complaints.filter((c) => c.status === 'Resolved' || c.status === 'Citizen Verified'),
    [complaints]
  );
  const resolvedCount = resolvedComplaints.length;

  // Active selected complaint for Action Drawer
  const activeComplaint = useMemo(
    () => (drawerComplaintId ? complaints.find((c) => c.id === drawerComplaintId) || null : null),
    [drawerComplaintId, complaints]
  );

  // Departments List
  const departmentsList = useMemo(() => {
    const set = new Set<string>();
    complaints.forEach((c) => {
      if (c.department) set.add(c.department);
    });
    return Array.from(set);
  }, [complaints]);

  // Filtered and Sorted Complaint Queue
  const filteredQueue = useMemo(() => {
    return complaints.filter((c) => {
      if (filterPriority !== 'All' && c.priority !== filterPriority) return false;
      if (filterDept !== 'All' && c.department !== filterDept) return false;
      if (filterWard !== 'All' && c.location.wardId !== filterWard) return false;
      if (filterStatus !== 'All' && c.status !== filterStatus) return false;

      // SLA filter
      if (filterSLA === 'Breached') {
        const isBreached =
          c.status === 'SLA Breached' ||
          c.sla.status === 'SLA Breached' ||
          (c.status !== 'Resolved' && new Date(c.sla.deadline).getTime() < Date.now());
        if (!isBreached) return false;
      } else if (filterSLA === 'Due Soon') {
        const now = Date.now();
        const diff = new Date(c.sla.deadline).getTime() - now;
        if (c.status === 'Resolved' || diff <= 0 || diff > 4 * 60 * 60 * 1000) return false;
      } else if (filterSLA === 'Within SLA') {
        const now = Date.now();
        const diff = new Date(c.sla.deadline).getTime() - now;
        if (c.status !== 'Resolved' && diff <= 0) return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchId = c.id.toLowerCase().includes(q);
        const matchTitle = c.title.toLowerCase().includes(q);
        const matchWard = c.location.wardName?.toLowerCase().includes(q);
        const matchDept = c.department?.toLowerCase().includes(q);
        if (!matchId && !matchTitle && !matchWard && !matchDept) return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'priority') {
        const rank: Record<string, number> = { Critical: 4, High: 3, Medium: 2, Low: 1 };
        return (rank[b.priority] || 0) - (rank[a.priority] || 0);
      }
      if (sortBy === 'sla') {
        return new Date(a.sla.deadline).getTime() - new Date(b.sla.deadline).getTime();
      }
      // 'recent'
      return new Date(b.sla.createdAt).getTime() - new Date(a.sla.createdAt).getTime();
    });
  }, [complaints, filterPriority, filterDept, filterWard, filterStatus, filterSLA, searchQuery, sortBy]);

  // Chart Data: By Department
  const dataByDept = useMemo(() => {
    const counts: Record<string, number> = {};
    complaints.forEach((c) => {
      const d = c.department ? c.department.split('&')[0].trim() : 'General';
      counts[d] = (counts[d] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [complaints]);

  // Chart Data: By Priority
  const dataByPriority = useMemo(() => {
    return [
      { name: 'Critical', value: complaints.filter((c) => c.priority === 'Critical').length, color: '#d97764' },
      { name: 'High', value: complaints.filter((c) => c.priority === 'High').length, color: '#e89d67' },
      { name: 'Medium', value: complaints.filter((c) => c.priority === 'Medium').length, color: '#7fa99b' },
      { name: 'Low', value: complaints.filter((c) => c.priority === 'Low').length, color: '#9bb8a5' },
    ];
  }, [complaints]);

  // Drawer update wrapper that shows toast
  const handleDrawerUpdate = (id: string, updates: Partial<Complaint>) => {
    updateComplaint(id, updates);
    showToast(`Updated Work Order ${id}`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Real Municipal Command Center Header */}
      <div className="glass-panel text-slate-900 dark:text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full glass-pill text-[#5e7769] dark:text-[#8ea899] text-xs font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Rewa Municipal Corporation · Live Ops</span>
              </span>
              <span className="text-[11px] font-mono glass-pill text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-lg">
                Command Terminal 01
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              Municipal Command & Dispatch Center
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Unified civic infrastructure monitoring, field dispatching, real-time SLA breach surveillance, and ward intelligence matrix.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setActiveSection('complaints')}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#5e7769] hover:bg-[#506659] dark:bg-[#6c8879] dark:hover:bg-[#5c7668] text-white text-xs font-bold shadow-sm cursor-pointer transition-all border border-emerald-400/20 active:scale-95"
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Complaint Queue ({complaints.length})</span>
            </button>
            <button
              onClick={startDemoJourney}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#6e8a7b] via-[#5e7769] to-[#7f9488] hover:brightness-105 text-white text-xs font-bold shadow-sm cursor-pointer transition-all border border-white/20 backdrop-blur-md active:scale-95"
            >
              <Flame className="w-3.5 h-3.5 text-amber-200" />
              <span>3-Min Autonomous Demo</span>
            </button>
          </div>
        </div>
      </div>

      {/* Modern 8-Section Tab Bar */}
      <div className="flex items-center gap-1.5 glass-panel p-1.5 rounded-2xl overflow-x-auto text-xs font-bold">
        {[
          { id: 'overview', label: 'Overview', icon: <LayoutDashboard className="w-3.5 h-3.5" /> },
          { id: 'complaints', label: `Complaints (${openCount} open)`, icon: <Layers className="w-3.5 h-3.5" /> },
          { id: 'map', label: 'Map GIS', icon: <MapPin className="w-3.5 h-3.5" /> },
          { id: 'sla', label: `SLA Monitoring (${breachedCount} breached)`, icon: <Clock className="w-3.5 h-3.5" /> },
          { id: 'wards', label: 'Ward Intelligence', icon: <Compass className="w-3.5 h-3.5" /> },
          { id: 'predictive', label: 'Predictive Analytics', icon: <BrainCircuit className="w-3.5 h-3.5" /> },
          { id: 'citizens', label: 'Citizens & Feedback', icon: <Users className="w-3.5 h-3.5" /> },
          { id: 'reports', label: 'Reports & Export', icon: <FileSpreadsheet className="w-3.5 h-3.5" /> },
        ].map((sec) => (
          <button
            key={sec.id}
            onClick={() => setActiveSection(sec.id as DashboardSection)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
              activeSection === sec.id
                ? 'bg-[#5e7769] dark:bg-[#4d6657] text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-white/40 dark:hover:bg-white/10'
            }`}
          >
            {sec.icon}
            <span>{sec.label}</span>
          </button>
        ))}
      </div>

      {/* 5 Prominent Overview Cards (Always present or highlighted in Overview) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {/* 1. Open */}
        <div
          onClick={() => {
            setActiveSection('complaints');
            setFilterStatus('Reported');
          }}
          className="glass-card glass-card-hover p-5 rounded-3xl cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Open</span>
            <span className="p-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-900">
              <Layers className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-slate-900 dark:text-white">{openCount}</div>
          <div className="text-[11px] font-bold text-blue-600 dark:text-blue-400">Active municipal work orders</div>
        </div>

        {/* 2. Critical */}
        <div
          onClick={() => {
            setActiveSection('complaints');
            setFilterPriority('Critical');
          }}
          className="glass-card glass-card-hover p-5 rounded-3xl cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Critical</span>
            <span className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
              <AlertTriangle className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400">{criticalCount}</div>
          <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400">Hazardous emergencies</div>
        </div>

        {/* 3. Due Soon */}
        <div
          onClick={() => {
            setActiveSection('complaints');
            setFilterSLA('Due Soon');
          }}
          className="glass-card glass-card-hover p-5 rounded-3xl cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Due Soon</span>
            <span className="p-1.5 rounded-xl bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-900">
              <Clock className="w-4 h-4 animate-spin" />
            </span>
          </div>
          <div className="text-3xl font-black text-amber-600 dark:text-amber-400">{dueSoonCount}</div>
          <div className="text-[11px] font-bold text-amber-600 dark:text-amber-400">&lt; 4 hours to SLA expiry</div>
        </div>

        {/* 4. SLA Breached */}
        <div
          onClick={() => {
            setActiveSection('complaints');
            setFilterSLA('Breached');
          }}
          className="glass-card glass-card-hover p-5 rounded-3xl cursor-pointer space-y-1.5"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>SLA Breached</span>
            <span className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-400 border border-rose-200 dark:border-rose-900">
              <ShieldAlert className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-rose-600 dark:text-rose-400">{breachedCount}</div>
          <div className="text-[11px] font-bold text-rose-600 dark:text-rose-400">Exceeded statutory window</div>
        </div>

        {/* 5. Resolved Today */}
        <div
          onClick={() => {
            setActiveSection('complaints');
            setFilterStatus('Resolved');
          }}
          className="glass-card glass-card-hover p-5 rounded-3xl cursor-pointer space-y-1.5 col-span-2 sm:col-span-1"
        >
          <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Resolved Today</span>
            <span className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-900">
              <CheckCircle2 className="w-4 h-4" />
            </span>
          </div>
          <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{resolvedCount}</div>
          <div className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">Physically closed & verified</div>
        </div>
      </div>

      {/* SECTION 1: OVERVIEW */}
      {activeSection === 'overview' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Quick Critical Banner */}
          {criticalCount > 0 && (
            <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5 text-rose-800 dark:text-rose-300 font-bold">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-600 animate-ping"></span>
                <span>{criticalCount} Critical emergencies require immediate field crew dispatch in Rewa</span>
              </div>
              <button
                onClick={() => {
                  setActiveSection('complaints');
                  setFilterPriority('Critical');
                }}
                className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs self-start sm:self-auto cursor-pointer"
              >
                Inspect Critical Queue
              </button>
            </div>
          )}

          {/* GIS Overview Snapshot */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>Real-Time Spatial Field Deployment (Rewa GIS)</span>
                </h3>
                <p className="text-xs text-slate-500">Live ticket triage and work order hotspots</p>
              </div>
              <button
                onClick={() => setActiveSection('map')}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer self-start sm:self-auto"
              >
                <span>Expand Full Map Control</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
            <LeafletMap complaints={complaints} height="360px" showHotspots={true} />
          </div>

          {/* Department Volumes and Priority Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Work Orders by Municipal Department
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dataByDept}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
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
                    <Bar dataKey="count" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Priority Distribution Matrix
              </h3>
              <div className="h-64 w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dataByPriority}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {dataByPriority.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
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
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: COMPLAINTS (COMPLAINT QUEUE WITH ACTION DRAWER) */}
      {(activeSection === 'complaints' || activeSection === 'overview') && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-5 animate-in fade-in duration-150">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Layers className="w-4 h-4 text-blue-600" />
                <span>Municipal Complaint Queue & Triage Desk</span>
              </h3>
              <p className="text-xs text-slate-500">
                Click any ticket to open the <b>Ticket Action Drawer</b> (Assign officer, change priority, add note, or mark resolved).
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs font-mono bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2.5 py-1 rounded-lg font-bold">
                Showing {filteredQueue.length} of {complaints.length}
              </span>
            </div>
          </div>

          {/* Filter & Sort Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2.5">
            {/* Search */}
            <div className="relative col-span-1 sm:col-span-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search ticket ID, title, or ward..."
                className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="All">All Priorities</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>

            {/* Ward Filter */}
            <select
              value={filterWard}
              onChange={(e) => setFilterWard(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="All">All Wards</option>
              {wards.map((w) => (
                <option key={w.id} value={w.id}>
                  {w.name.split('-')[1]?.trim() || w.name}
                </option>
              ))}
            </select>

            {/* Department Filter */}
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="All">All Departments</option>
              {departmentsList.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* SLA Filter */}
            <select
              value={filterSLA}
              onChange={(e) => setFilterSLA(e.target.value)}
              className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white"
            >
              <option value="All">All SLA States</option>
              <option value="Due Soon">Due Soon (&lt;4h)</option>
              <option value="Breached">SLA Breached</option>
              <option value="Within SLA">Within SLA</option>
            </select>
          </div>

          {/* Queue Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800 text-slate-500 font-bold border-b border-slate-200 dark:border-slate-700">
                <tr>
                  <th className="p-3">Ticket ID</th>
                  <th className="p-3">Title & Category</th>
                  <th className="p-3">Ward</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Department</th>
                  <th className="p-3">Visual SLA Countdown</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredQueue.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-slate-400">
                      No complaints match the current filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredQueue.map((complaint) => (
                    <tr
                      key={complaint.id}
                      onClick={() => setDrawerComplaintId(complaint.id)}
                      className="hover:bg-blue-50/50 dark:hover:bg-slate-800/40 transition-colors cursor-pointer"
                    >
                      <td className="p-3 font-mono font-bold text-blue-600 dark:text-blue-400 whitespace-nowrap">
                        {complaint.id}
                      </td>

                      <td className="p-3 max-w-xs">
                        <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                          {complaint.title}
                        </div>
                        <div className="text-[10px] text-slate-400">{complaint.category}</div>
                      </td>

                      <td className="p-3 text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {complaint.location.wardName.split('-')[1]?.trim() || complaint.location.wardName}
                      </td>

                      <td className="p-3">
                        <span
                          className={`text-[10px] font-extrabold px-2 py-0.5 rounded ${
                            complaint.priority === 'Critical'
                              ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                              : complaint.priority === 'High'
                              ? 'bg-orange-100 text-orange-800 dark:bg-orange-950 dark:text-orange-300'
                              : 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                          }`}
                        >
                          {complaint.priority}
                        </span>
                      </td>

                      <td className="p-3 text-slate-700 dark:text-slate-300 max-w-[140px] truncate">
                        {complaint.department}
                      </td>

                      <td className="p-3 whitespace-nowrap">
                        <SLACountdown
                          deadline={complaint.sla.deadline}
                          status={complaint.status}
                          size="sm"
                        />
                      </td>

                      <td className="p-3">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {complaint.status}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDrawerComplaintId(complaint.id);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 hover:bg-blue-100 text-[11px] font-bold transition-colors cursor-pointer"
                        >
                          Manage
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SECTION 3: MAP (FULL GIS WORK ORDERS) */}
      {activeSection === 'map' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span>Full Municipal Spatial Telemetry & Cluster Heatmap</span>
            </h3>
            <p className="text-xs text-slate-500">
              Interactive GIS viewer. Click pins to view complaint photos, statutory deadlines, or open drawer.
            </p>
          </div>
          <LeafletMap complaints={complaints} height="560px" showHotspots={true} />
        </div>
      )}

      {/* SECTION 4: SLA MONITORING */}
      {activeSection === 'sla' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400">Total Statutory Breaches</span>
              <div className="text-3xl font-black text-rose-600">{breachedCount}</div>
              <div className="text-[11px] text-rose-600 font-semibold">Immediate escalation required</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400">Expiring Within 4 Hours</span>
              <div className="text-3xl font-black text-amber-500">{dueSoonCount}</div>
              <div className="text-[11px] text-amber-600 font-semibold">Priority dispatch zone</div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-1">
              <span className="text-xs font-bold text-slate-400">Average Compliance Rate</span>
              <div className="text-3xl font-black text-emerald-600">88.4%</div>
              <div className="text-[11px] text-emerald-600 font-semibold">Citizen charter standard (Met)</div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Critical & Due Soon SLA Surveillance Table
            </h3>

            <div className="space-y-3">
              {[...dueSoonComplaints, ...breachedComplaints].slice(0, 10).map((c) => (
                <div
                  key={c.id}
                  onClick={() => setDrawerComplaintId(c.id)}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:border-blue-400 cursor-pointer transition-all"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-blue-600">{c.id}</span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        {c.priority}
                      </span>
                      <span className="text-xs text-slate-500">📍 {c.location.wardName}</span>
                    </div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">{c.title}</div>
                    <div className="text-[11px] text-slate-400">Department: {c.department}</div>
                  </div>

                  <div className="flex items-center gap-3">
                    <SLACountdown deadline={c.sla.deadline} status={c.status} showProgress={true} />
                    <button className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold">
                      Action
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 5: WARD INTELLIGENCE */}
      {activeSection === 'wards' && <WardPerformance />}

      {/* SECTION 6: PREDICTIVE ANALYTICS */}
      {activeSection === 'predictive' && <PredictiveAnalytics />}

      {/* SECTION 7: CITIZENS & FEEDBACK */}
      {activeSection === 'citizens' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span>Citizen Engagement & Verification Ledger</span>
            </h3>
            <p className="text-xs text-slate-500">
              Citizens receive civic points and badges for reporting and confirming municipal repairs.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Active Citizen Profile</span>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{citizenProfile.name}</div>
              <div className="text-xs text-slate-500">Phone: {citizenProfile.phone}</div>
              <div className="text-xs font-bold text-amber-600">Points Earned: {citizenProfile.points} pts</div>
              <div className="text-xs text-slate-600 dark:text-slate-300">
                Total Submissions: {citizenProfile.reportsCount}
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase">Unlocked Civic Badges</span>
              <div className="flex flex-wrap gap-2">
                {citizenProfile.badges.map((b) => (
                  <span
                    key={b.id}
                    className={`px-3 py-1 rounded-xl text-xs font-bold flex items-center gap-1.5 ${
                      b.unlocked
                        ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-200 border border-amber-300'
                        : 'bg-slate-200 text-slate-400 opacity-50'
                    }`}
                  >
                    <span>{b.icon}</span>
                    <span>{b.name}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 8: REPORTS & EXPORT */}
      {activeSection === 'reports' && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-xs space-y-4 animate-in fade-in duration-150">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
              <span>Municipal Operations Reporting & Audit Export</span>
            </h3>
            <p className="text-xs text-slate-500">
              Generate standardized municipal audit reports for District Collector and Urban Administration.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Daily SLA Compliance Report</h4>
              <p className="text-[11px] text-slate-500">Summary of all 8 wards with resolution metrics.</p>
              <button
                onClick={() => showToast('Generated Daily SLA CSV Report', 'success')}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Infrastructure Vulnerability Audit</h4>
              <p className="text-[11px] text-slate-500">Monsoon waterlogging & road cavity patterns.</p>
              <button
                onClick={() => showToast('Generated Vulnerability PDF', 'success')}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 text-white text-xs font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export PDF</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">Budget & Contractor Performance</h4>
              <p className="text-[11px] text-slate-500">Contractor dispatch timeline analysis.</p>
              <button
                onClick={() => showToast('Generated Contractor Audit CSV', 'success')}
                className="w-full flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-bold cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export Ledger</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Action Drawer (Persistent state update via StorageService) */}
      <TicketActionDrawer
        complaint={activeComplaint}
        onClose={() => setDrawerComplaintId(null)}
        onUpdate={handleDrawerUpdate}
        onViewFullDetail={viewComplaintDetail}
      />
    </div>
  );
};
