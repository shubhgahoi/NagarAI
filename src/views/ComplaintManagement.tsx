import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Complaint, ComplaintStatus } from '../types';
import {
  Layers,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  UserCheck,
  Eye,
  Send,
  Building,
} from 'lucide-react';

export const ComplaintManagement: React.FC = () => {
  const { complaints, updateComplaint, viewComplaintDetail, showToast, wards } = useApp();

  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [priorityFilter, setPriorityFilter] = useState<string>('All');
  const [wardFilter, setWardFilter] = useState<string>('All');
  const [search, setSearch] = useState<string>('');

  const filtered = complaints.filter((c) => {
    if (statusFilter !== 'All' && c.status !== statusFilter) return false;
    if (priorityFilter !== 'All' && c.priority !== priorityFilter) return false;
    if (wardFilter !== 'All' && c.location.wardId !== wardFilter) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      if (!c.id.toLowerCase().includes(q) && !c.title.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const handleQuickStatusChange = (id: string, newStatus: ComplaintStatus) => {
    updateComplaint(id, { status: newStatus });
    showToast(`Updated ticket ${id} to ${newStatus}`, 'success');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Municipal Work Order Dispatch & Management
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Assign field crews, update maintenance progress, and monitor operational SLA compliance.
          </p>
        </div>
      </div>

      {/* Filter Controls */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 sm:grid-cols-4 gap-3">
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search ID or description..."
            className="w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 pl-8 pr-3 py-2 text-xs"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold"
        >
          <option value="All">All Statuses</option>
          <option value="Reported">Reported</option>
          <option value="AI Verified">AI Verified</option>
          <option value="Assigned">Assigned</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
          <option value="SLA Breached">SLA Breached</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold"
        >
          <option value="All">All Priorities</option>
          <option value="Critical">Critical</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>

        <select
          value={wardFilter}
          onChange={(e) => setWardFilter(e.target.value)}
          className="rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-2 text-xs font-semibold"
        >
          <option value="All">All Wards</option>
          {wards.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {/* Complaints Management Cards */}
      <div className="space-y-3">
        {filtered.length > 0 ? (
          filtered.map((c) => (
            <div
              key={c.id}
              className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 shadow-xs hover:border-blue-300 dark:hover:border-blue-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="space-y-2 flex-1">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                    {c.id}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="font-medium text-slate-700 dark:text-slate-300">
                    {c.category}
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="flex items-center gap-1.5 font-semibold">
                    <span className={`w-2 h-2 rounded-full ${
                      c.priority === 'Critical' ? 'bg-rose-500' : c.priority === 'High' ? 'bg-orange-500' : 'bg-blue-500'
                    }`} />
                    <span className={c.priority === 'Critical' ? 'text-rose-600 font-bold' : 'text-slate-700 dark:text-slate-300'}>
                      {c.priority}
                    </span>
                  </span>
                  <span className="text-slate-300 dark:text-slate-700">·</span>
                  <span className="font-mono text-[11px] text-slate-400">
                    SLA: {c.sla.slaHours}h ({c.sla.status})
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{c.description}</p>

                <div className="text-[11.5px] text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 pt-1 border-t border-slate-100 dark:border-slate-800">
                  <span>📍 {c.location.landmark || c.location.address}</span>
                  <span>·</span>
                  <span>🏛️ {c.location.wardName}</span>
                  <span>·</span>
                  <span>👷 {c.department}</span>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                <select
                  value={c.status}
                  onChange={(e) => handleQuickStatusChange(c.id, e.target.value as ComplaintStatus)}
                  className="rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-800 dark:text-slate-200 cursor-pointer focus:ring-2 focus:ring-blue-500"
                >
                  <option value="Reported">Reported</option>
                  <option value="AI Verified">AI Verified</option>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                  <option value="Citizen Verified">Citizen Verified</option>
                  <option value="SLA Breached">SLA Breached</option>
                </select>

                <button
                  onClick={() => viewComplaintDetail(c.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs shadow-xs transition-all cursor-pointer"
                >
                  View Details →
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-200 dark:border-slate-800 space-y-3">
            <Layers className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
              No matching work orders found
            </h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              Try adjusting your filter settings or search query.
            </p>
            <button
              onClick={() => {
                setStatusFilter('All');
                setPriorityFilter('All');
                setWardFilter('All');
                setSearch('');
              }}
              className="px-4 py-2 text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 rounded-xl cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
