import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Cpu,
  Database,
  Smartphone,
  Server,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  Mic,
  MapPin,
  Bot,
  Activity,
  CheckCircle2,
  FileCode2,
  Download,
  Share2,
  Maximize2,
  RefreshCw,
  Eye,
  Radio,
  Clock,
  Compass,
  Building2,
  Workflow,
  Network,
  Award,
} from 'lucide-react';

export const RuntimeArchitectureView: React.FC = () => {
  const { setCurrentView, language } = useApp();
  const isHi = language === 'hi' || language === 'bg';

  const [activeTab, setActiveTab] = useState<'diagram' | 'pipeline' | 'sequence' | 'security'>('diagram');
  const [selectedNode, setSelectedNode] = useState<string | null>('node-voice');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [simulationStep, setSimulationStep] = useState<number>(0);

  // Nodes for the interactive architecture map
  const ARCH_TIERS = [
    {
      id: 'tier-client',
      title: 'Tier 1: Client & Citizen Intake (PWA / React 18)',
      subtitle: 'Responsive Web & Mobile Applet with Offline Service Worker',
      color: 'from-blue-600/20 to-indigo-600/20 border-blue-500/40 text-blue-400',
      badge: 'Frontend SPA',
      nodes: [
        {
          id: 'node-voice',
          title: 'Voice & Speech Engine',
          icon: <Mic className="w-5 h-5 text-amber-400" />,
          desc: 'Web Speech API + MediaRecorder capturing Bagheli, Hindi, and English voice streams with live waveforms.',
          tech: 'Web Speech API / AudioContext',
          endpoint: 'Local Browser Stream',
        },
        {
          id: 'node-gps',
          title: 'High-Precision GPS & GIS',
          icon: <Compass className="w-5 h-5 text-emerald-400" />,
          desc: 'HTML5 Geolocation + Leaflet.js with 9 Rewa Municipal Wards (including REC Campus).',
          tech: 'HTML5 Geolocation / Leaflet',
          endpoint: '24.5360° N, 81.3320° E',
        },
        {
          id: 'node-vision-ui',
          title: 'Photo Upload & Camera',
          icon: <Eye className="w-5 h-5 text-purple-400" />,
          desc: 'Citizen and field officer image capture with client-side compression and instant preview.',
          tech: 'FileReader / Canvas API',
          endpoint: 'Image Base64 Enc',
        },
        {
          id: 'node-officer-ui',
          title: 'Command Center & Portals',
          icon: <Smartphone className="w-5 h-5 text-cyan-400" />,
          desc: 'Officer SLA Dispatch, Ward Health Index, Public Open Data Transparency, and 24/7 Nagar-Sathi AI.',
          tech: 'React 18 / Tailwind CSS',
          endpoint: 'SPA Navigation',
        },
      ],
    },
    {
      id: 'tier-server',
      title: 'Tier 2: Backend API Proxy & Edge Controller (Node.js / Express)',
      subtitle: 'Secure Proxy Isolating Gemini Credentials & Telemetry Compliance',
      color: 'from-indigo-600/20 to-purple-600/20 border-indigo-500/40 text-indigo-400',
      badge: 'Express Server.ts',
      nodes: [
        {
          id: 'node-voice-api',
          title: 'Voice Dialect Parser API',
          icon: <Server className="w-5 h-5 text-amber-400" />,
          desc: 'Transcribes raw audio / text, detects Bagheli dialect, extracts Rewa landmarks, and routes to exact ward.',
          tech: 'Express / REST Route',
          endpoint: 'POST /api/gemini/parse-voice-grievance',
        },
        {
          id: 'node-image-api',
          title: 'Visual Inspection API',
          icon: <Zap className="w-5 h-5 text-purple-400" />,
          desc: 'Detects pothole depth, obstruction, garbage volume, and statutory triage SLA.',
          tech: 'Express / Multi-Part Buffer',
          endpoint: 'POST /api/gemini/analyze-image',
        },
        {
          id: 'node-verification-api',
          title: 'Before/After Verifier API',
          icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
          desc: 'Dual-image comparison validating municipal crew repair quality before citizen signoff.',
          tech: 'Dual Image Vision Pipeline',
          endpoint: 'POST /api/gemini/compare-resolution',
        },
        {
          id: 'node-predictive-api',
          title: 'Predictive Hotspot API',
          icon: <Activity className="w-5 h-5 text-pink-400" />,
          desc: 'Aggregates ward historical defect patterns to forecast monsoon waterlogging and road wear.',
          tech: 'Time-Series Aggregation',
          endpoint: 'POST /api/gemini/predictive-briefing',
        },
      ],
    },
    {
      id: 'tier-ai',
      title: 'Tier 3: AI Cognitive Engine (Google Gemini 2.5 Flash)',
      subtitle: 'Multimodal Foundation Model with Structured JSON Schema Output',
      color: 'from-amber-600/20 to-orange-600/20 border-amber-500/40 text-amber-400',
      badge: '@google/genai SDK',
      nodes: [
        {
          id: 'node-gemini-nlu',
          title: 'Devanagari & Dialect NLU',
          icon: <Sparkles className="w-5 h-5 text-amber-300" />,
          desc: 'Linguistic normalization for local Bagheli (e.g. "सड़क मा बड़ गड्ढा है") into structured civic defects.',
          tech: 'Gemini 2.5 Flash Text/Audio',
          endpoint: 'models/gemini-2.5-flash',
        },
        {
          id: 'node-gemini-vision',
          title: 'Multimodal Computer Vision',
          icon: <Cpu className="w-5 h-5 text-indigo-300" />,
          desc: 'Analyzes asphalt degradation, water pipe breaches, overflow garbage, and nocturnal streetlights.',
          tech: 'Multimodal Image Analysis',
          endpoint: 'models/gemini-2.5-flash',
        },
        {
          id: 'node-gemini-schema',
          title: 'Strict JSON Schema Engine',
          icon: <FileCode2 className="w-5 h-5 text-emerald-300" />,
          desc: 'Guarantees deterministic JSON types (Type.OBJECT, Type.STRING) with zero-shot hallucination prevention.',
          tech: 'responseSchema / JSON Mime',
          endpoint: 'Structured Output Engine',
        },
        {
          id: 'node-gemini-telemetry',
          title: 'Telemetry & Auth Gateway',
          icon: <ShieldCheck className="w-5 h-5 text-cyan-300" />,
          desc: 'Enforces User-Agent: aistudio-build telemetry headers and server-side secret protection.',
          tech: 'HttpOptions / Headers',
          endpoint: 'AI Studio Runtime',
        },
      ],
    },
    {
      id: 'tier-data',
      title: 'Tier 4: Rewa Geospatial & Civic Operations Datastore',
      subtitle: 'Ward Geometry, Haversine Duplication Geofence, and SLA Matrix',
      color: 'from-emerald-600/20 to-teal-600/20 border-emerald-500/40 text-emerald-400',
      badge: 'Data & Dispatch',
      nodes: [
        {
          id: 'node-ward-db',
          title: '9 Rewa Municipal Wards',
          icon: <Building2 className="w-5 h-5 text-blue-400" />,
          desc: 'Full spatial polygon & center directory: REC Campus (Ward 09), TRS (04), SGMH (07), Shilpi Plaza (03), etc.',
          tech: 'DEMO_WARDS Geospatial Index',
          endpoint: 'In-Memory / Storage',
        },
        {
          id: 'node-sla-matrix',
          title: 'Statutory SLA Dispatcher',
          icon: <Clock className="w-5 h-5 text-amber-400" />,
          desc: 'Enforces statutory resolution windows: Garbage (12h), Streetlights (24h), Water Leaks (24h), Potholes (72h).',
          tech: 'Rule Engine / SLA Clock',
          endpoint: 'SLA Status Tracker',
        },
        {
          id: 'node-duplicate-engine',
          title: '250m Haversine Clustering',
          icon: <Radio className="w-5 h-5 text-purple-400" />,
          desc: 'Detects duplicate complaints reported within 250m to merge reports and prevent crew redundancy.',
          tech: 'Haversine Great-Circle Math',
          endpoint: 'StorageService.detectDuplicate',
        },
        {
          id: 'node-gamification',
          title: 'Citizen Civic Gamification',
          icon: <Award className="w-5 h-5 text-emerald-400" />,
          desc: 'Awards reward points, badges (First Reporter, Clean Ward Hero), and updates citizen ledger.',
          tech: 'CitizenProfile Datastore',
          endpoint: 'Local Storage State',
        },
      ],
    },
  ];

  // Simulation flow triggers
  const handleRunSimulation = () => {
    setIsSimulating(true);
    setSimulationStep(1);

    const steps = [
      { step: 1, node: 'node-voice' },
      { step: 2, node: 'node-voice-api' },
      { step: 3, node: 'node-gemini-nlu' },
      { step: 4, node: 'node-ward-db' },
      { step: 5, node: 'node-sla-matrix' },
      { step: 6, node: 'node-officer-ui' },
    ];

    steps.forEach((s, idx) => {
      setTimeout(() => {
        setSimulationStep(s.step);
        setSelectedNode(s.node);
        if (idx === steps.length - 1) {
          setTimeout(() => setIsSimulating(false), 1200);
        }
      }, (idx + 1) * 1100);
    });
  };

  const selectedNodeData = ARCH_TIERS.flatMap((t) => t.nodes).find((n) => n.id === selectedNode);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 animate-in fade-in duration-200">
      {/* Header Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 sm:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold">
              <Network className="w-3.5 h-3.5" />
              <span>NAGAR-AI · High-Level Runtime Architecture</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white">
              System Architecture & AI Pipeline
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Complete end-to-end topological blueprint illustrating citizen multilingual voice intake, secure Express server proxy, Google Gemini 2.5 Flash cognitive engine, and Rewa spatial municipal dispatch.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunSimulation}
              disabled={isSimulating}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-lg transition-all cursor-pointer select-none active:scale-95 ${
                isSimulating
                  ? 'bg-amber-500 text-slate-950 animate-pulse ring-4 ring-amber-400/40'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
              }`}
            >
              <Zap className={`w-4 h-4 ${isSimulating ? 'animate-spin text-slate-950' : 'text-amber-300'}`} />
              <span>{isSimulating ? `Simulating Flow (Step ${simulationStep}/6)...` : 'Simulate Live Request Flow'}</span>
            </button>

            <button
              onClick={() => setCurrentView('report')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white font-bold text-xs border border-slate-700 transition-all cursor-pointer active:scale-95"
            >
              <span>Try In App Flow</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Live Runtime Diagnostic Bar */}
        <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping"></div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">AI Cognitive Model</div>
              <div className="font-mono font-bold text-white text-xs">gemini-2.5-flash</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-blue-400"></div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Geocoded Wards</div>
              <div className="font-bold text-white text-xs">9 Wards (incl. REC Campus)</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Average AI Latency</div>
              <div className="font-mono font-bold text-amber-300 text-xs">~380ms - 620ms</div>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 flex items-center gap-2.5">
            <div className="w-2.5 h-2.5 rounded-full bg-purple-400"></div>
            <div>
              <div className="text-[10px] text-slate-400 font-bold uppercase">Dialect Recognition</div>
              <div className="font-bold text-white text-xs">Bagheli / Hindi / English</div>
            </div>
          </div>
        </div>
      </div>

      {/* Perspectives Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-3 overflow-x-auto">
        {[
          { id: 'diagram', label: 'Interactive Architecture Flowchart', icon: <Layers className="w-4 h-4" /> },
          { id: 'pipeline', label: 'Gemini AI Intelligence & Vision Pipeline', icon: <Cpu className="w-4 h-4" /> },
          { id: 'sequence', label: 'Request & SLA Lifecycle Sequence', icon: <Workflow className="w-4 h-4" /> },
          { id: 'security', label: 'Security, Privacy & Offline PWA Topology', icon: <ShieldCheck className="w-4 h-4" /> },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: INTERACTIVE ARCHITECTURE DIAGRAM */}
      {activeTab === 'diagram' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* 4 Tiers Container */}
            <div className="lg:col-span-3 space-y-6">
              {ARCH_TIERS.map((tier, tierIdx) => (
                <div
                  key={tier.id}
                  className={`rounded-3xl p-5 sm:p-6 border bg-gradient-to-r ${tier.color} space-y-4 relative`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono uppercase bg-slate-900/80 text-white px-2 py-0.5 rounded font-bold">
                          {tier.badge}
                        </span>
                        <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                          {tier.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {tier.subtitle}
                      </p>
                    </div>

                    <span className="text-xs font-mono font-bold text-slate-400 dark:text-slate-500 hidden sm:inline">
                      Tier 0{tierIdx + 1}
                    </span>
                  </div>

                  {/* Nodes Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {tier.nodes.map((node) => {
                      const isSelected = selectedNode === node.id;
                      const isSimActive =
                        (simulationStep === 1 && node.id === 'node-voice') ||
                        (simulationStep === 2 && node.id === 'node-voice-api') ||
                        (simulationStep === 3 && node.id === 'node-gemini-nlu') ||
                        (simulationStep === 4 && node.id === 'node-ward-db') ||
                        (simulationStep === 5 && node.id === 'node-sla-matrix') ||
                        (simulationStep === 6 && node.id === 'node-officer-ui');

                      return (
                        <div
                          key={node.id}
                          onClick={() => setSelectedNode(node.id)}
                          className={`p-3.5 rounded-2xl border transition-all duration-200 cursor-pointer text-left space-y-2 select-none relative ${
                            isSimActive
                              ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xl shadow-amber-500/40 ring-4 ring-amber-300 scale-105 z-20'
                              : isSelected
                              ? 'bg-white dark:bg-slate-900 border-blue-500 dark:border-blue-400 shadow-lg ring-2 ring-blue-500/40 z-10'
                              : 'bg-white/80 dark:bg-slate-900/80 border-slate-200 dark:border-slate-800/80 hover:border-slate-400 hover:bg-white dark:hover:bg-slate-900'
                          }`}
                        >
                          {isSimActive && (
                            <span className="absolute -top-2 -right-2 px-1.5 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-black animate-ping">
                              ACTIVE
                            </span>
                          )}

                          <div className="flex items-center justify-between">
                            <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0">
                              {node.icon}
                            </div>
                            <span className="text-[10px] font-mono opacity-70 truncate max-w-[90px]">
                              {node.tech.split(' ')[0]}
                            </span>
                          </div>

                          <div>
                            <div className="font-extrabold text-xs sm:text-sm text-slate-900 dark:text-white truncate">
                              {node.title}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                              {node.desc}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Flow Arrow Connector between tiers */}
                  {tierIdx < ARCH_TIERS.length - 1 && (
                    <div className="flex justify-center -mb-9 pt-1">
                      <div className="w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-300 flex items-center justify-center shadow-lg z-20">
                        <ArrowRight className="w-4 h-4 rotate-90" />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Right Node Inspector Panel */}
            <div className="lg:col-span-1 space-y-4">
              <div className="sticky top-20 rounded-3xl bg-slate-900 border border-slate-800 p-5 space-y-4 shadow-xl text-white">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-slate-300">
                      Component Inspector
                    </span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 bg-blue-950 px-2 py-0.5 rounded border border-blue-800">
                    Live Telemetry
                  </span>
                </div>

                {selectedNodeData ? (
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="p-2.5 rounded-2xl bg-slate-800 border border-slate-700 shrink-0">
                        {selectedNodeData.icon}
                      </div>
                      <div>
                        <h4 className="text-base font-black text-white">
                          {selectedNodeData.title}
                        </h4>
                        <span className="text-xs font-mono text-amber-400">
                          {selectedNodeData.tech}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-1.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Component Description
                      </div>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedNodeData.desc}
                      </p>
                    </div>

                    <div className="space-y-1.5 bg-slate-950/80 p-3 rounded-2xl border border-slate-800">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">
                        Endpoint / Interface
                      </div>
                      <div className="text-xs font-mono text-emerald-400 break-all">
                        {selectedNodeData.endpoint}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="text-[11px] font-bold text-slate-400">Runtime Responsibilities:</div>
                      <ul className="text-xs text-slate-300 space-y-1">
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Strict latency budget (&lt;800ms)</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>No client-exposed API secrets</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>Full fallback to local intelligence</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-xs text-slate-400">
                    Click any block on the flowchart to inspect its runtime architecture specs.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: AI PIPELINE & MODEL SPECS */}
      {activeTab === 'pipeline' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in">
          {/* Pipeline 1: Voice & Dialect Parser */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500 shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  1. Voice Dialect Normalizer & Landmark Geocoder
                </h3>
                <span className="text-xs font-mono text-amber-500 font-bold">
                  /api/gemini/parse-voice-grievance
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Accepts spoken Bagheli / Hindi input (e.g. <i>"रीवा इंजीनियरिंग कॉलेज के सामने सड़क मा बहुत बड़ गड्ढा है"</i>) or raw audio stream. Uses Gemini 2.5 Flash with structured JSON schema to extract:
            </p>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-emerald-400 font-mono text-[11px] overflow-x-auto">
              <pre>{`{
  "detectedDialect": "Bagheli (Rewa Dialect)",
  "category": "Road / Pothole",
  "department": "Roads & Civil Engineering",
  "suggestedSLAHours": 72,
  "location": {
    "landmark": "Rewa Engineering College (REC) Main Gate",
    "suggestedWardId": "ward-09",
    "suggestedWardName": "Demo Ward 09 - Rewa Engineering College (REC)"
  }
}`}</pre>
            </div>
          </div>

          {/* Pipeline 2: Computer Vision Surface Triage */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-500 shrink-0">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  2. Computer Vision Inspection & Hazard Triage
                </h3>
                <span className="text-xs font-mono text-purple-500 font-bold">
                  /api/gemini/analyze-image
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Processes before-repair citizen photos via multimodal Gemini 2.5 Flash. Quantifies physical pothole dimensions, carriageway obstruction, and vector breeding hazards to assign statutory priority:
            </p>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-purple-300 font-mono text-[11px] overflow-x-auto">
              <pre>{`{
  "issueType": "Severe Asphalt Depression",
  "severity": "High",
  "dimensions": "1.2m x 0.8m x 15cm depth",
  "carriagewayObstruction": "40% lane blocked",
  "hazards": ["Two-wheeler skidding", "Monsoon ponding"],
  "recommendedDepartment": "Roads & Civil Engineering",
  "suggestedSLAHours": 72
}`}</pre>
            </div>
          </div>

          {/* Pipeline 3: AI Resolution Verification */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  3. Dual-Image Before/After Resolution Verification
                </h3>
                <span className="text-xs font-mono text-emerald-500 font-bold">
                  /api/gemini/compare-resolution
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Compares initial defect photo against municipal crew repair photo. Validates asphalt hot-mix compaction, surface smoothness, and debris clearance before ticket is marked ready for citizen confirmation:
            </p>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-cyan-300 font-mono text-[11px] overflow-x-auto">
              <pre>{`{
  "likelyResolved": true,
  "confidence": 0.96,
  "qualityScore": 94,
  "visualChange": "Depression filled with cold-mix asphalt, leveled with road surface.",
  "status": "Ready for Citizen Verification"
}`}</pre>
            </div>
          </div>

          {/* Pipeline 4: Predictive Seasonal Intelligence */}
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-500 shrink-0">
                <Activity className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">
                  4. Predictive Hotspots & Monsoon Preparedness
                </h3>
                <span className="text-xs font-mono text-blue-500 font-bold">
                  /api/gemini/predictive-briefing
                </span>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Synthesizes historical grievance density and seasonal monsoon patterns across all 9 Rewa wards to generate executive preventive maintenance directives for municipal engineers:
            </p>

            <div className="p-3 bg-slate-950 rounded-2xl border border-slate-800 text-blue-300 font-mono text-[11px] overflow-x-auto">
              <pre>{`{
  "executiveHeadline": "Pre-Monsoon Drainage Desilting Mandate",
  "criticalHotspotsBrief": "High recurrence detected along REC & Hospital road corridor",
  "topPreventiveActions": [
    "Desilt arterial drains along Ward 09 (REC) before July 15",
    "Pre-deploy suction pumps at New Bus Stand underpass"
  ]
}`}</pre>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SEQUENCE & LIFECYCLE */}
      {activeTab === 'sequence' && (
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="space-y-1">
            <h3 className="text-xl font-black text-slate-900 dark:text-white">
              Civic Ticket Lifecycle Sequence
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              Deterministic sequence from citizen intake to municipal officer resolution and civic gamification reward.
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                step: '01',
                title: 'Citizen Voice Intake & GPS Geotag',
                actor: 'Citizen (PWA Applet)',
                desc: 'Citizen speaks in Bagheli or Hindi or drops high-accuracy GPS pin (±4m) at Rewa Engineering College (REC).',
                tag: 'Web Speech / Geolocation',
                color: 'border-amber-500 bg-amber-50/50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-300',
              },
              {
                step: '02',
                title: 'Gemini 2.5 Flash Triage & 250m Haversine Check',
                actor: 'Node.js Proxy + Gemini API',
                desc: 'Server passes voice & image to Gemini for classification. StorageService checks for duplicates within 250 meters.',
                tag: 'Gemini 2.5 Flash',
                color: 'border-blue-500 bg-blue-50/50 dark:bg-blue-950/20 text-blue-700 dark:text-blue-300',
              },
              {
                step: '03',
                title: 'Ward Assignment & Statutory SLA Clock Start',
                actor: 'Municipal Dispatch Engine',
                desc: 'Ticket NGR-2026-XXXX is generated. Assigned to Ward Officer (e.g. Er. Rakesh Dwivedi, Ward 09). SLA countdown begins (72h).',
                tag: 'SLA Engine',
                color: 'border-purple-500 bg-purple-50/50 dark:bg-purple-950/20 text-purple-700 dark:text-purple-300',
              },
              {
                step: '04',
                title: 'Field Crew Repair & After-Photo Upload',
                actor: 'Ward Field Crew',
                desc: 'Crew fixes pothole/street light on-site. Uploads high-resolution after-repair photo from mobile device.',
                tag: 'Mobile Web Portal',
                color: 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20 text-cyan-700 dark:text-cyan-300',
              },
              {
                step: '05',
                title: 'AI Resolution Verification & Quality Score',
                actor: 'Gemini Computer Vision',
                desc: 'Gemini compares before and after photos. Confirms pothole is sealed and assigns a 95% quality verification score.',
                tag: 'AI Verification',
                color: 'border-emerald-500 bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-300',
              },
              {
                step: '06',
                title: 'Citizen Confirmation & Civic Reward Points',
                actor: 'Citizen + Leaderboard Ledger',
                desc: 'Citizen approves resolution in 1-tap. Citizen earns +25 civic engagement points and unlocks community badges.',
                tag: 'Gamification Ledger',
                color: 'border-teal-500 bg-teal-50/50 dark:bg-teal-950/20 text-teal-700 dark:text-teal-300',
              },
            ].map((item) => (
              <div
                key={item.step}
                className={`p-4 rounded-2xl border-l-4 border ${item.color} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}
              >
                <div className="flex items-start gap-3.5">
                  <span className="font-mono text-sm font-black px-2 py-1 rounded bg-black/10 dark:bg-white/10 shrink-0">
                    {item.step}
                  </span>
                  <div>
                    <div className="font-extrabold text-sm sm:text-base text-slate-900 dark:text-white">
                      {item.title}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400 mt-0.5 max-w-2xl">
                      {item.desc}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                  <span className="text-[10.5px] font-mono font-bold px-2.5 py-1 rounded-xl bg-black/10 dark:bg-white/10">
                    {item.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: SECURITY & OFFLINE PWA */}
      {activeTab === 'security' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-in fade-in">
          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-black text-slate-900 dark:text-white text-base">
              Server-Side API Key Isolation
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              No Gemini API keys or credentials are ever transmitted to or stored inside the browser. All multimodal calls pass through dedicated Node.js Express proxy routes with strict request validation.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="font-black text-slate-900 dark:text-white text-base">
              Offline PWA Service Worker
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Equipped with a standalone Web App Manifest and Service Worker caching. Citizens can launch the app instantly without network access, drafting reports to be synced once connectivity returns.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <h4 className="font-black text-slate-900 dark:text-white text-base">
              Deterministic Fallbacks
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              In case of upstream rate-limits or offline field conditions, the client seamlessly falls back to deterministic Rewa dialect normalizers and spatial ward geocoding with zero system disruption.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
