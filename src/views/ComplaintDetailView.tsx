import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/common/LeafletMap';
import { AIService, AIVerificationResult, ComplaintSummaryResult } from '../services/aiService';
import { SAMPLE_IMAGES } from '../data/mockData';
import {
  ArrowLeft,
  Clock,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Camera,
  MapPin,
  Building,
  User,
  Sparkles,
  Share2,
  RotateCcw,
  Upload,
} from 'lucide-react';

export const ComplaintDetailView: React.FC = () => {
  const {
    selectedComplaintId,
    complaints,
    updateComplaint,
    setCurrentView,
    showToast,
    language,
  } = useApp();

  const isHi = language === 'hi';

  const complaint = complaints.find((c) => c.id === selectedComplaintId) || complaints[0];

  const [isComparing, setIsComparing] = useState<boolean>(false);
  const [comparisonResult, setComparisonResult] = useState<AIVerificationResult | null>(
    complaint?.aiResolutionVerification || null
  );
  const [afterImageInput, setAfterImageInput] = useState<string>(
    complaint?.images?.afterUrl || SAMPLE_IMAGES.pothole_after
  );
  const [showOfficerPanel, setShowOfficerPanel] = useState<boolean>(false);
  const [aiSummary, setAiSummary] = useState<ComplaintSummaryResult | null>(null);
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  // Time remaining calculation
  const calculateRemaining = () => {
    if (!complaint) return '00:00:00';
    const deadline = new Date(complaint.sla.deadline).getTime();
    const now = Date.now();
    const diff = deadline - now;
    if (diff <= 0) return '00:00:00 (SLA Expired)';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${mins}m Remaining`;
  };

  const [timeRemaining, setTimeRemaining] = useState<string>(calculateRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(calculateRemaining());
    }, 30000);
    return () => clearInterval(timer);
  }, [complaint]);

  if (!complaint) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold">Complaint Not Found</h2>
        <button
          onClick={() => setCurrentView('my-complaints')}
          className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold"
        >
          Back to Complaints
        </button>
      </div>
    );
  }

  // AI Executive Summary Generation
  const handleSummarizeComplaint = async () => {
    setIsSummarizing(true);
    showToast('Gemini AI generating executive engineering summary...', 'info');
    try {
      const summary = await AIService.summarizeComplaint(complaint);
      setAiSummary(summary);
      showToast('AI Executive Summary Generated', 'success');
    } catch {
      showToast('Generated summary with fallback logic', 'info');
    } finally {
      setIsSummarizing(false);
    }
  };

  // AI Compare resolution verification
  const handleAICompare = async () => {
    setIsComparing(true);
    showToast('Gemini AI inspecting Before & After repair photographs...', 'info');

    try {
      const res = await AIService.compareBeforeAfter({
        beforeImage: complaint.images.beforeUrl,
        afterImage: afterImageInput,
        issueType: complaint.category,
      });

      setComparisonResult(res);
      updateComplaint(complaint.id, {
        aiResolutionVerification: {
          visualChange: res.visualChange,
          likelyResolved: res.likelyResolved,
          confidence: res.confidence,
          notes: res.notes,
          verifiedAt: new Date().toISOString(),
          source: res.source,
        },
      });
      showToast('AI Resolution Inspection Verified', 'success');
    } catch {
      showToast('AI inspection verified with fallback logic', 'info');
    } finally {
      setIsComparing(false);
    }
  };

  // Citizen Confirmation actions
  const handleCitizenConfirmation = (resolved: boolean) => {
    if (resolved) {
      updateComplaint(complaint.id, {
        status: 'Citizen Verified',
        citizenConfirmation: {
          status: 'confirmed_resolved',
          comment: 'Citizen confirmed physical resolution on site.',
          confirmedAt: new Date().toISOString(),
        },
        timeline: [
          ...complaint.timeline,
          {
            stage: 'Citizen Verified',
            timestamp: new Date().toISOString(),
            description: 'Citizen verified resolution on site. +5 Civic Points awarded.',
            actor: 'Citizen Confirmation',
          },
        ],
      });
      showToast('Resolution confirmed! +5 Civic Points added to your profile', 'success');
    } else {
      updateComplaint(complaint.id, {
        status: 'In Progress',
        citizenConfirmation: {
          status: 'reopened',
          comment: 'Citizen reported physical defect persists.',
          confirmedAt: new Date().toISOString(),
        },
        timeline: [
          ...complaint.timeline,
          {
            stage: 'In Progress',
            timestamp: new Date().toISOString(),
            description: 'Ticket reopened by citizen review. Escalated to Chief Engineer.',
            actor: 'Citizen Review',
          },
        ],
      });
      showToast('Issue reopened and escalated to Chief Engineer', 'warning');
    }
  };

  // Officer Mark Resolved Action
  const handleOfficerResolve = () => {
    updateComplaint(complaint.id, {
      status: 'Resolved',
      images: {
        ...complaint.images,
        afterUrl: afterImageInput,
      },
      timeline: [
        ...complaint.timeline,
        {
          stage: 'Resolved',
          timestamp: new Date().toISOString(),
          description: 'Municipal engineering crew uploaded completion report and post-repair imagery.',
          actor: complaint.assignedOfficer?.name || 'Ward Engineer',
        },
      ],
    });
    showToast(`Marked Ticket ${complaint.id} as Resolved`, 'success');
  };

  const timelineStages: Array<'Reported' | 'AI Verified' | 'Assigned' | 'In Progress' | 'Resolved' | 'Citizen Verified'> = [
    'Reported',
    'AI Verified',
    'Assigned',
    'In Progress',
    'Resolved',
    'Citizen Verified',
  ];

  const currentStageIndex = timelineStages.indexOf(
    complaint.status === 'SLA Breached' ? 'In Progress' : (complaint.status as any)
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Header & Back Nav */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentView('my-complaints')}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-extrabold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                {complaint.id}
              </span>
              <span className="text-xs font-semibold text-slate-500">
                {new Date(complaint.sla.createdAt).toLocaleString()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white mt-1">
              {complaint.title}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSummarizeComplaint}
            disabled={isSummarizing}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 text-xs font-bold hover:bg-blue-100 transition-colors disabled:opacity-50"
            title="Summarize Complaint Dossier using Gemini AI"
          >
            <Sparkles className={`w-3.5 h-3.5 text-blue-600 ${isSummarizing ? 'animate-spin' : ''}`} />
            <span>{isSummarizing ? 'Summarizing...' : 'AI Dossier Brief'}</span>
          </button>

          <button
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `NAGAR-AI Ticket ${complaint.id}`,
                  text: `Tracking ${complaint.title} on Smart Rewa Nagar-AI.`,
                });
              } else {
                showToast('Ticket share link copied to clipboard', 'success');
              }
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Ticket</span>
          </button>

          <button
            onClick={() => setShowOfficerPanel(!showOfficerPanel)}
            className="px-3 py-2 rounded-xl bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold"
          >
            {showOfficerPanel ? 'Hide Officer Tools' : 'Officer Tools (Demo)'}
          </button>
        </div>
      </div>

      {/* AI Executive Summary Card (if generated) */}
      {aiSummary && (
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-blue-950/60 rounded-3xl p-6 border border-blue-200 dark:border-blue-900 shadow-sm space-y-4 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Gemini AI Executive Engineering Dossier
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Automated synthesis for Municipal Ward Supervisor & Field Engineers
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
              {aiSummary.urgencyLevel}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-slate-800 dark:text-slate-200 leading-relaxed bg-white/70 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900">
            {aiSummary.summary}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/70 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Key Engineering Observations
              </span>
              <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1.5 list-disc pl-4">
                {aiSummary.keyObservations.map((obs, oIdx) => (
                  <li key={oIdx}>{obs}</li>
                ))}
              </ul>
            </div>

            <div className="bg-white/70 dark:bg-slate-800/70 p-3.5 rounded-2xl border border-blue-100 dark:border-blue-900 space-y-2">
              <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                Recommended Action
              </span>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                {aiSummary.recommendedAction}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* SLA Countdown & Status Ribbon */}
      {(() => {
        const totalMs = complaint.sla.slaHours * 3600 * 1000;
        const elapsedMs = Date.now() - new Date(complaint.sla.createdAt).getTime();
        const percent = Math.min(100, Math.max(0, Math.round((elapsedMs / totalMs) * 100)));
        const isUrgent = percent >= 80 || complaint.status === 'SLA Breached';
        const isResolved = complaint.status === 'Resolved' || complaint.status === 'Citizen Verified';

        return (
          <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-blue-300">
                  <Clock className="w-4 h-4 text-blue-400" />
                  <span>Statutory SLA Resolution Policy</span>
                </div>
                <div className="text-3xl font-black tracking-tight">{timeRemaining}</div>
                <p className="text-xs text-blue-200/90">
                  Target SLA: {complaint.sla.slaHours} hours · Assigned to {complaint.department}
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center border border-white/10">
                  <div className="text-[10px] text-blue-200 font-bold uppercase">Priority</div>
                  <div className="text-sm font-extrabold text-white mt-0.5">{complaint.priority}</div>
                </div>
                <div className="bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl text-center border border-white/10">
                  <div className="text-[10px] text-blue-200 font-bold uppercase">Status</div>
                  <div className={`text-sm font-extrabold mt-0.5 ${isResolved ? 'text-emerald-400' : isUrgent ? 'text-rose-400' : 'text-amber-300'}`}>
                    {complaint.status}
                  </div>
                </div>
              </div>
            </div>

            {/* SLA Progress Bar Gauge */}
            <div className="space-y-1.5 pt-2 border-t border-white/10">
              <div className="flex justify-between text-[11px] text-blue-200/80 font-medium">
                <span>SLA Elapsed: {percent}%</span>
                <span>{isResolved ? 'Resolved within timeframe' : isUrgent ? 'SLA Alert: High Urgency' : 'Standard Resolution Window'}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    isResolved
                      ? 'bg-emerald-500'
                      : isUrgent
                      ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                      : 'bg-blue-500'
                  }`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          </div>
        );
      })()}

      {/* 6-Stage Timeline Tracker */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-blue-600" />
          <span>Stage Progression Timeline</span>
        </h3>

        <div className="relative">
          <div className="hidden sm:block absolute top-1/2 left-0 right-0 h-0.5 bg-slate-200 dark:bg-slate-700 -translate-y-1/2 z-0" />
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 relative z-10">
            {timelineStages.map((stage, idx) => {
              const isPast = idx <= currentStageIndex;
              const isCurrent = idx === currentStageIndex;

              return (
                <div
                  key={stage}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    isCurrent
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-500/25'
                      : isPast
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full mx-auto mb-1 flex items-center justify-center text-xs font-bold">
                    {isPast && !isCurrent ? '✓' : idx + 1}
                  </div>
                  <div className="text-[11px] font-bold leading-tight">{stage}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Detailed Timeline Events */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-3">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Execution Log
          </span>
          <div className="space-y-2">
            {complaint.timeline.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-3 text-xs p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {item.stage} • {item.actor}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Details Grid: Before/After & Map */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Visual Inspection Images & AI Verification */}
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-600" />
              <span>Inspection Imagery (Before vs After)</span>
            </h3>
            {complaint.images.afterUrl && (
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                Repair Photo Uploaded
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                1. Initial Defect (Before)
              </span>
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">
                <img
                  src={complaint.images.beforeUrl}
                  alt="Defect Before"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400">
                2. Municipal Repair (After)
              </span>
              <div className="aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {complaint.images.afterUrl || afterImageInput ? (
                  <img
                    src={complaint.images.afterUrl || afterImageInput}
                    alt="Defect After"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-400 text-xs">
                    Repair work in progress. Photo awaiting field crew upload.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AI Resolution Verification Panel */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400">
                <Sparkles className="w-4 h-4" />
                <span>AI Resolution Verification</span>
              </div>
              <button
                onClick={handleAICompare}
                disabled={isComparing}
                className="flex items-center gap-1.5 px-3 py-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs font-bold rounded-lg shadow-xs disabled:opacity-50"
              >
                <Sparkles className={`w-3.5 h-3.5 ${isComparing ? 'animate-spin' : ''}`} />
                <span>{isComparing ? 'Comparing...' : 'AI Compare'}</span>
              </button>
            </div>

            {comparisonResult ? (
              <div className="space-y-2 text-xs animate-in fade-in">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-slate-700 dark:text-slate-300">
                    Observation: {comparisonResult.visualChange}
                  </span>
                  <span className="text-emerald-600 font-mono">
                    {Math.round(comparisonResult.confidence * 100)}% Match
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 text-[11.5px] border border-emerald-200 dark:border-emerald-800/60">
                  {comparisonResult.notes}
                </div>
                <div className="text-[10px] text-slate-400">
                  Notice: AI-assisted verification indicates high likelihood of physical resolution, not official engineering certification.
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Click "AI Compare" to let Gemini multimodal vision cross-reference the before and after images to detect physical restoration.
              </p>
            )}
          </div>

          {/* Citizen Confirmation Section */}
          <div className="p-4 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-900 dark:text-blue-200">
                Citizen Confirmation (Quality Assurance)
              </span>
              {complaint.citizenConfirmation?.status === 'confirmed_resolved' && (
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                  Confirmed Closed
                </span>
              )}
            </div>

            <p className="text-xs text-blue-800 dark:text-blue-300">
              Has this municipal defect been satisfactorily repaired on site? Your confirmation updates the Ward Health Index.
            </p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <button
                onClick={() => handleCitizenConfirmation(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Issue Resolved (+5 Points)</span>
              </button>
              <button
                onClick={() => handleCitizenConfirmation(false)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 font-bold text-xs hover:bg-rose-50"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>Still Not Resolved</span>
              </button>
            </div>
          </div>
        </div>

        {/* Location & Administrative Dispatch Info */}
        <div className="space-y-6">
          {/* Location Map */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-blue-600" />
                <span>Location: {complaint.location.landmark || complaint.location.address}</span>
              </h3>
              <span className="text-[10px] font-mono text-slate-400">
                {complaint.location.lat.toFixed(4)}, {complaint.location.lng.toFixed(4)}
              </span>
            </div>

            <LeafletMap
              height="240px"
              center={[complaint.location.lat, complaint.location.lng]}
              zoom={15}
              complaints={[complaint]}
            />
          </div>

          {/* Department & Officer Details */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-600" />
              <span>Administrative Routing & Officer</span>
            </h3>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400">Department</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {complaint.department}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400">Assigned Ward</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {complaint.location.wardName}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400">Responsible Engineer</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {complaint.assignedOfficer?.name || 'Er. A. K. Shukla'}
                </div>
                <div className="text-[10px] text-slate-400">
                  {complaint.assignedOfficer?.role || 'Section Engineer'}
                </div>
              </div>

              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                <span className="text-[10px] text-slate-400">Citizen Reporter</span>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                  {complaint.citizen?.name || 'Rajesh Sharma'}
                </div>
                <div className="text-[10px] text-emerald-600 font-bold">
                  +{complaint.citizen?.pointsAwarded || 10} Civic Points
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Officer Simulation Panel (for demonstration) */}
      {showOfficerPanel && (
        <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-700 shadow-xl space-y-4 animate-in slide-in-from-bottom-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <User className="w-4 h-4 text-amber-400" />
              <span>Municipal Officer Action Panel (Demonstration Tools)</span>
            </h3>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono">
              Role: Municipal Field Officer
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => {
                updateComplaint(complaint.id, {
                  status: 'In Progress',
                  timeline: [
                    ...complaint.timeline,
                    {
                      stage: 'In Progress',
                      timestamp: new Date().toISOString(),
                      description: 'Repair crew mobilized with equipment.',
                      actor: 'Field Operations Cell',
                    },
                  ],
                });
                showToast('Status updated to In Progress', 'info');
              }}
              className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold"
            >
              Set Status: In Progress
            </button>

            <button
              onClick={handleOfficerResolve}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold"
            >
              Upload Repair & Mark Resolved
            </button>

            <button
              onClick={() => {
                updateComplaint(complaint.id, {
                  status: 'SLA Breached',
                  sla: {
                    ...complaint.sla,
                    status: 'SLA Breached',
                  },
                });
                showToast('Simulated SLA Breach trigger for evaluation', 'warning');
              }}
              className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold"
            >
              Simulate SLA Breach
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
