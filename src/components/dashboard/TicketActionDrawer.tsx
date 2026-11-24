import React, { useState } from 'react';
import { Complaint, ComplaintStatus, PriorityLevel } from '../../types';
import { SLACountdown } from '../common/SLACountdown';
import {
  X,
  UserCheck,
  Flag,
  Activity,
  MessageSquare,
  MapPin,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building,
  ExternalLink,
  ChevronRight,
  ShieldCheck,
  Send,
  Calendar,
} from 'lucide-react';

interface TicketActionDrawerProps {
  complaint: Complaint | null;
  onClose: () => void;
  onUpdate: (id: string, updates: Partial<Complaint>) => void;
  onViewFullDetail: (id: string) => void;
}

export const TicketActionDrawer: React.FC<TicketActionDrawerProps> = ({
  complaint,
  onClose,
  onUpdate,
  onViewFullDetail,
}) => {
  if (!complaint) return null;

  const [officerName, setOfficerName] = useState(complaint.assignedOfficer?.name || '');
  const [officerPhone, setOfficerPhone] = useState(complaint.assignedOfficer?.phone || '');
  const [officerRole, setOfficerRole] = useState(complaint.assignedOfficer?.role || 'Field Engineer');
  const [priority, setPriority] = useState<PriorityLevel>(complaint.priority);
  const [status, setStatus] = useState<ComplaintStatus>(complaint.status);
  const [department, setDepartment] = useState(complaint.department || 'Roads & Civil Engineering');
  const [noteText, setNoteText] = useState('');
  const [activeTab, setActiveTab] = useState<'actions' | 'images' | 'location' | 'timeline'>('actions');

  // Assign Officer Action
  const handleAssignOfficer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!officerName.trim()) return;

    const timelineItem = {
      stage: 'Assigned' as const,
      timestamp: new Date().toISOString(),
      description: `Dispatched to ${officerName} (${officerRole}).`,
      actor: 'Municipal Command Center',
    };

    onUpdate(complaint.id, {
      assignedOfficer: {
        name: officerName,
        phone: officerPhone || '+91 94251 00000',
        role: officerRole,
      },
      status: complaint.status === 'Reported' || complaint.status === 'AI Verified' ? 'Assigned' : complaint.status,
      timeline: [...complaint.timeline, timelineItem],
    });
  };

  // Change Priority Action
  const handleChangePriority = (newPriority: PriorityLevel) => {
    setPriority(newPriority);
    const timelineItem = {
      stage: 'In Progress' as const,
      timestamp: new Date().toISOString(),
      description: `Priority re-calibrated from ${complaint.priority} to ${newPriority}.`,
      actor: 'Operations Officer',
    };

    onUpdate(complaint.id, {
      priority: newPriority,
      timeline: [...complaint.timeline, timelineItem],
    });
  };

  // Change Status Action
  const handleChangeStatus = (newStatus: ComplaintStatus) => {
    setStatus(newStatus);
    const updates: Partial<Complaint> = { status: newStatus };

    if (newStatus === 'Resolved') {
      updates.sla = {
        ...complaint.sla,
        resolvedAt: new Date().toISOString(),
        status: complaint.sla.status === 'SLA Breached' ? 'SLA Breached' : 'Met',
      };
    }

    const timelineItem = {
      stage: (newStatus === 'Resolved' ? 'Resolved' : newStatus === 'In Progress' ? 'In Progress' : 'Assigned') as any,
      timestamp: new Date().toISOString(),
      description: `Status changed to ${newStatus}.`,
      actor: 'Municipal Command Center',
    };

    updates.timeline = [...complaint.timeline, timelineItem];
    onUpdate(complaint.id, updates);
  };

  // Add Official Note Action
  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;

    const timelineItem = {
      stage: (complaint.status === 'Resolved' ? 'Resolved' : 'In Progress') as any,
      timestamp: new Date().toISOString(),
      description: `Official Note: ${noteText.trim()}`,
      actor: 'Dispatch Officer',
    };

    onUpdate(complaint.id, {
      timeline: [...complaint.timeline, timelineItem],
    });
    setNoteText('');
  };

  // Mark Resolved Action
  const handleMarkResolved = () => {
    handleChangeStatus('Resolved');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950/70 backdrop-blur-md flex justify-end animate-in fade-in duration-200">
      <div className="w-full max-w-xl glass-panel bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl h-full shadow-2xl flex flex-col border-l border-white/20 dark:border-white/10 animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-5 border-b border-white/20 dark:border-white/10 flex items-center justify-between glass-card rounded-none">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-black text-blue-600 dark:text-blue-400">
                {complaint.id}
              </span>
              <span
                className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${
                  complaint.priority === 'Critical'
                    ? 'bg-rose-500/20 text-rose-800 dark:text-rose-300 border-rose-400/30'
                    : complaint.priority === 'High'
                    ? 'bg-orange-500/20 text-orange-800 dark:text-orange-300 border-orange-400/30'
                    : 'bg-blue-500/20 text-blue-800 dark:text-blue-300 border-blue-400/30'
                }`}
              >
                {complaint.priority}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded glass-card text-slate-700 dark:text-slate-300">
                {complaint.status}
              </span>
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
              {complaint.title}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewFullDetail(complaint.id)}
              className="p-2 rounded-xl text-slate-500 hover:text-blue-600 hover:bg-white/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
              title="View full complaint details"
            >
              <ExternalLink className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-white/10 dark:hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Visual SLA Header Card */}
        <div className="px-5 py-3 glass-card rounded-none border-b border-white/20 dark:border-white/10 flex items-center justify-between">
          <div className="text-xs">
            <span className="text-slate-400 block text-[10px] font-bold">Statutory SLA Window</span>
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {complaint.sla.slaHours}h target window
            </span>
          </div>
          <SLACountdown
            deadline={complaint.sla.deadline}
            status={complaint.status}
            createdAt={complaint.sla.createdAt}
            showProgress={true}
          />
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-5 text-xs font-bold gap-4">
          <button
            onClick={() => setActiveTab('actions')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'actions'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Management Actions
          </button>
          <button
            onClick={() => setActiveTab('images')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'images'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Images ({complaint.images.afterUrl ? '2' : '1'})
          </button>
          <button
            onClick={() => setActiveTab('location')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'location'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Location & Ward
          </button>
          <button
            onClick={() => setActiveTab('timeline')}
            className={`py-3 border-b-2 transition-all cursor-pointer ${
              activeTab === 'timeline'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Audit Log ({complaint.timeline.length})
          </button>
        </div>

        {/* Drawer Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          {/* TAB 1: ACTIONS */}
          {activeTab === 'actions' && (
            <div className="space-y-6">
              {/* Quick Action: Mark Resolved */}
              <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                    Resolution Status
                  </h4>
                  <p className="text-[11px] text-emerald-700 dark:text-emerald-300">
                    Mark work order physically verified and ready for citizen closure.
                  </p>
                </div>
                <button
                  onClick={handleMarkResolved}
                  disabled={complaint.status === 'Resolved' || complaint.status === 'Citizen Verified'}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold disabled:opacity-50 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>
                    {complaint.status === 'Resolved' || complaint.status === 'Citizen Verified'
                      ? 'Already Resolved'
                      : 'Mark Resolved'}
                  </span>
                </button>
              </div>

              {/* Action 1: Assign Officer */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>Assign Field Officer / Crew</span>
                  </span>
                  {complaint.assignedOfficer && (
                    <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                      Assigned to {complaint.assignedOfficer.name}
                    </span>
                  )}
                </div>

                <form onSubmit={handleAssignOfficer} className="space-y-2.5">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block">Officer Name</label>
                      <input
                        type="text"
                        value={officerName}
                        onChange={(e) => setOfficerName(e.target.value)}
                        placeholder="Er. Manish Tiwari"
                        className="w-full mt-0.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-400 block">Designation / Role</label>
                      <input
                        type="text"
                        value={officerRole}
                        onChange={(e) => setOfficerRole(e.target.value)}
                        placeholder="Roads Sub-Division 1"
                        className="w-full mt-0.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-slate-400 block">Contact Number</label>
                    <input
                      type="text"
                      value={officerPhone}
                      onChange={(e) => setOfficerPhone(e.target.value)}
                      placeholder="+91 94251 10003"
                      className="w-full mt-0.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-xs text-slate-900 dark:text-white"
                    />
                  </div>

                  <div className="pt-1 flex justify-end">
                    <button
                      type="submit"
                      className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all cursor-pointer"
                    >
                      Dispatch & Save Assignment
                    </button>
                  </div>
                </form>
              </div>

              {/* Action 2: Change Priority */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Flag className="w-4 h-4 text-orange-600" />
                    <span>Change Priority Level</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Current: {complaint.priority}</span>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {(['Critical', 'High', 'Medium', 'Low'] as PriorityLevel[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handleChangePriority(p)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        priority === p
                          ? p === 'Critical'
                            ? 'bg-rose-600 text-white'
                            : p === 'High'
                            ? 'bg-orange-500 text-white'
                            : 'bg-blue-600 text-white'
                          : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Action 3: Change Status */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <Activity className="w-4 h-4 text-indigo-600" />
                    <span>Change Operational Status</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">Current: {complaint.status}</span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  {(['Assigned', 'In Progress', 'Resolved', 'SLA Breached', 'Reported', 'AI Verified'] as ComplaintStatus[]).map(
                    (s) => (
                      <button
                        key={s}
                        onClick={() => handleChangeStatus(s)}
                        className={`py-2 px-2 rounded-xl text-xs font-bold truncate transition-all cursor-pointer ${
                          status === s
                            ? 'bg-indigo-600 text-white shadow-xs'
                            : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-100'
                        }`}
                      >
                        {s}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Action 4: Add Official Dispatch Note */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-teal-600" />
                  <span>Append Operational Note</span>
                </span>

                <form onSubmit={handleAddNote} className="space-y-2">
                  <textarea
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="e.g. Cold-mix patch mobilized. Traffic diversion set up at College Chowk..."
                    className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5 text-xs text-slate-900 dark:text-white"
                  />
                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={!noteText.trim()}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold transition-all disabled:opacity-50 cursor-pointer"
                    >
                      <Send className="w-3 h-3" />
                      <span>Post Note</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* TAB 2: IMAGES */}
          {activeTab === 'images' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Defect Photo (Reported by Citizen)
                </h4>
                <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                  <img
                    src={complaint.images.beforeUrl}
                    alt="Before Repair"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {complaint.images.afterUrl && (
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Repair Verification Photo (Post-Work)
                  </h4>
                  <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={complaint.images.afterUrl}
                      alt="After Repair"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}

              {complaint.aiAnalysis && (
                <div className="p-3.5 bg-slate-50 dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                  <span className="font-bold text-slate-400 block text-[10px]">Gemini Vision Notes</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                    {complaint.aiAnalysis.description}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: LOCATION */}
          {activeTab === 'location' && (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span>{complaint.location.wardName}</span>
                </div>
                <div className="text-slate-600 dark:text-slate-300">
                  <b>Address:</b> {complaint.location.address}
                </div>
                {complaint.location.landmark && (
                  <div className="text-slate-600 dark:text-slate-300">
                    <b>Landmark:</b> {complaint.location.landmark}
                  </div>
                )}
                <div className="font-mono text-[11px] text-slate-400">
                  Coordinates: {complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 space-y-1">
                <span className="font-bold text-blue-800 dark:text-blue-300 block">Responsible Department</span>
                <p className="text-blue-900 dark:text-blue-200">{complaint.department}</p>
              </div>
            </div>
          )}

          {/* TAB 4: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                Statutory Audit Trail
              </h4>
              <div className="space-y-3 relative pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                {complaint.timeline.map((item, idx) => (
                  <div key={idx} className="relative space-y-0.5 text-xs">
                    <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 dark:text-white">{item.stage}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-slate-600 dark:text-slate-300 text-[11.5px]">{item.description}</p>
                    <span className="text-[10px] font-mono text-slate-400 block">By: {item.actor}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between">
          <button
            onClick={() => onViewFullDetail(complaint.id)}
            className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
          >
            <span>Open Comprehensive Audit File</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-bold text-xs hover:bg-slate-300 transition-colors cursor-pointer"
          >
            Close Drawer
          </button>
        </div>
      </div>
    </div>
  );
};
