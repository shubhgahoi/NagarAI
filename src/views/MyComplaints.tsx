import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Search,
  Filter,
  Layers,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  MapPin,
  Calendar,
  Building,
} from 'lucide-react';

export const MyComplaints: React.FC = () => {
  const { complaints, viewComplaintDetail, language, setCurrentView } = useApp();
  const isHi = language === 'hi';

  const [activeFilter, setActiveFilter] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('All');

  const filtered = complaints.filter((c) => {
    // Status filter
    if (activeFilter === 'Open') {
      if (c.status !== 'Reported' && c.status !== 'AI Verified' && c.status !== 'Assigned') return false;
    } else if (activeFilter === 'In Progress') {
      if (c.status !== 'In Progress') return false;
    } else if (activeFilter === 'Resolved') {
      if (c.status !== 'Resolved' && c.status !== 'Citizen Verified') return false;
    } else if (activeFilter === 'SLA Breached') {
      if (c.status !== 'SLA Breached' && c.sla.status !== 'SLA Breached') return false;
    }

    // Category filter
    if (categoryFilter !== 'All' && c.category !== categoryFilter) return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchId = c.id.toLowerCase().includes(q);
      const matchTitle = c.title.toLowerCase().includes(q);
      const matchAddress = c.location.address.toLowerCase().includes(q);
      const matchLandmark = c.location.landmark.toLowerCase().includes(q);
      const matchWard = c.location.wardName.toLowerCase().includes(q);
      if (!matchId && !matchTitle && !matchAddress && !matchLandmark && !matchWard) return false;
    }

    return true;
  });

  const getPriorityDot = (p: string) => {
    switch (p) {
      case 'Critical':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-500"></span> Critical
          </span>
        );
      case 'High':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-orange-600 dark:text-orange-400">
            <span className="w-2 h-2 rounded-full bg-orange-500"></span> High
          </span>
        );
      case 'Medium':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400">
            <span className="w-2 h-2 rounded-full bg-blue-500"></span> Medium
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

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isHi ? 'शिकायत रजिस्ट्री एवं ट्रैकिंग' : 'My Grievances & Ticket History'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitor real-time repair progress, officer assignment, and SLA statutory deadlines.
          </p>
        </div>

        <button
          onClick={() => setCurrentView('report')}
          className="px-5 py-2.5 rounded-xl bg-[#5e7769] hover:bg-[#506659] text-white font-bold text-xs sm:text-sm shadow-md self-start sm:self-auto cursor-pointer transition-all"
        >
          + Report New Issue
        </button>
      </div>

      {/* Filter Tabs & Search Controls */}
      <div className="glass-panel rounded-2xl p-4 shadow-lg backdrop-blur-2xl border border-white/20 dark:border-white/10 space-y-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {['All', 'Open', 'In Progress', 'Resolved', 'SLA Breached'].map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeFilter === f
                  ? 'bg-[#5e7769] text-white shadow-md shadow-[#5e7769]/25 border border-[#8da598]/50'
                  : 'glass-card text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/20'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Search & Category */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by ticket ID (e.g. NGR-2026-00124), landmark, or keyword..."
              className="glass-input w-full rounded-xl pl-9 pr-4 py-2 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
            />
          </div>

          <div className="relative">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="glass-input w-full rounded-xl px-3 py-2 text-xs font-semibold text-slate-900 dark:text-white cursor-pointer"
            >
              <option value="All" className="bg-slate-900 text-white">All Categories</option>
              <option value="Road / Pothole" className="bg-slate-900 text-white">Road / Pothole</option>
              <option value="Streetlight" className="bg-slate-900 text-white">Streetlight</option>
              <option value="Garbage" className="bg-slate-900 text-white">Garbage</option>
              <option value="Water Leakage" className="bg-slate-900 text-white">Water Leakage</option>
              <option value="Waterlogging" className="bg-slate-900 text-white">Waterlogging</option>
              <option value="Drainage" className="bg-slate-900 text-white">Drainage</option>
              <option value="Fallen Tree" className="bg-slate-900 text-white">Fallen Tree</option>
            </select>
          </div>
        </div>
      </div>

      {/* Complaint Cards Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((c) => (
            <div
              key={c.id}
              onClick={() => viewComplaintDetail(c.id)}
              className="glass-card-hover rounded-2xl p-5 shadow-md cursor-pointer transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-extrabold text-[#5e7769] dark:text-[#8ea899]">
                    {c.id}
                  </span>
                  <div className="flex items-center gap-2">
                    {getPriorityDot(c.priority)}
                    <span className="text-slate-300 dark:text-slate-700">·</span>
                    {getStatusBadge(c.status)}
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-2">
                    {c.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {c.description}
                  </p>
                </div>

                <div className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/50 dark:border-white/10">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{c.location.landmark || c.location.address}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5 truncate">
                      <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{c.department}</span>
                    </span>
                    <span className="flex items-center gap-1 font-mono text-[11px] text-slate-400 shrink-0">
                      <Calendar className="w-3 h-3" />
                      {new Date(c.sla.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* SLA & Action */}
              <div className="pt-2 border-t border-slate-200/50 dark:border-white/10 flex items-center justify-between text-xs">
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                  SLA: <span className="font-bold text-blue-600 dark:text-blue-400">{c.sla.status}</span>
                </span>
                <span className="font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5">
                  View Detail <ChevronRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-3xl p-12 text-center space-y-3 shadow-lg">
          <Layers className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
          <h3 className="text-base font-bold text-slate-700 dark:text-slate-200">
            No complaints found matching this filter
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto">
            Try adjusting your search criteria or report a new civic issue.
          </p>
          <button
            onClick={() => {
              setActiveFilter('All');
              setCategoryFilter('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 text-xs font-bold text-blue-600 dark:text-blue-400 glass-card hover:bg-blue-500/10 rounded-xl cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
};
