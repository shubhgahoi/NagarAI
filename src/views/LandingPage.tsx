import React from 'react';
import { useApp } from '../context/AppContext';
import { LeafletMap } from '../components/common/LeafletMap';
import {
  Mic,
  Camera,
  MapPin,
  Clock,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Bot,
  Layers,
  Activity,
  Flame,
  CheckCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setCurrentView, complaints, language, startDemoJourney, setIsDemoModalOpen } = useApp();
  const isHi = language === 'hi' || language === 'bg';

  const stats = [
    { label: isHi ? 'कुल रिपोर्ट की गई समस्याएं' : 'Reported Issues', value: '2,847', sub: isHi ? 'रीवा शहर डेमो डेटा' : 'Rewa simulated baseline' },
    { label: isHi ? 'AI स्वतः वर्गीकृत' : 'Auto-Categorized', value: '91%', sub: isHi ? 'जेमिनी विजन व एनएलपी' : 'Gemini Vision & NLP triage' },
    { label: isHi ? 'SLA समयसीमा में हल' : 'Resolved Within SLA', value: '86%', sub: isHi ? 'मानक नागरिक चार्टर' : 'Citizen Charter compliance' },
    { label: isHi ? 'सक्रिय समस्या हॉटस्पॉट' : 'Active Hotspots', value: '23', sub: isHi ? 'पूर्वानुमानित क्लस्टर' : 'Monsoon & transit zones' },
  ];

  const features = [
    {
      icon: <Mic className="w-6 h-6 text-[#5e7769] dark:text-[#8ea899]" />,
      title: isHi ? 'AI वॉयस रिपोर्टिंग' : 'AI Voice Reporting',
      desc: isHi
        ? 'हिन्दी एवं बघेली बोली में सहज बोलकर शिकायत दर्ज करें। वॉयस-टू-टेक्स्ट ट्रांसक्रिप्शन।'
        : 'Report issues by speaking naturally in Hindi, English, or Bagheli dialect prompts.',
    },
    {
      icon: <Camera className="w-6 h-6 text-[#b67352] dark:text-[#d49170]" />,
      title: isHi ? 'AI विज़ुअल इंस्पेक्शन' : 'AI Visual Inspection',
      desc: isHi
        ? 'सड़क गड्ढे, कचरा या जलभराव की तस्वीर से AI स्वतः गंभीरता और सुरक्षा जोखिम का आकलन करता है।'
        : 'Gemini AI Vision inspects defect severity, collision hazards, and required repair tools.',
    },
    {
      icon: <MapPin className="w-6 h-6 text-[#4d7c67] dark:text-[#7ab099]" />,
      title: isHi ? 'स्मार्ट वार्ड रूटिंग' : 'Smart Ward Routing',
      desc: isHi
        ? 'शिकायत को तुरंत रीवा के संबंधित वार्ड इंजीनियर और विभाग को स्वतः असाइन किया जाता है।'
        : 'Zero bureaucratic delays. Automated routing to responsible ward engineers in Rewa.',
    },
    {
      icon: <Clock className="w-6 h-6 text-[#c4883b] dark:text-[#e0a964]" />,
      title: isHi ? 'SLA मॉनिटरिंग' : 'SLA Monitoring',
      desc: isHi
        ? '12 से 72 घंटे का सख्त काउंटडाउन। समयसीमा समाप्त होने से पहले स्वतः अलर्ट व एस्केलेशन।'
        : 'Strict statutory resolution countdowns with automated escalation before breaches.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#4a7872] dark:text-[#7bb0aa]" />,
      title: isHi ? 'सार्वजनिक पारदर्शिता' : 'Public Transparency',
      desc: isHi
        ? 'हर वार्ड का वास्तविक प्रदर्शन, बजट उपयोग और समाधान समय जनता के लिए खुला।'
        : 'Live open data dashboard showcasing ward-level resolution times and public accountability.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#8b6b94] dark:text-[#bda2c4]" />,
      title: isHi ? 'पूर्वानुमानित रखरखाव' : 'Predictive Maintenance',
      desc: isHi
        ? 'बारिश से पहले जलभराव और सड़कों के बार-बार गड्ढों की पहचान कर पूर्व निवारक कार्रवाई।'
        : 'Forecast infrastructure fatigue and schedule pre-monsoon desilting before floods occur.',
    },
  ];

  return (
    <div className="space-y-16 pb-16 relative">
      {/* Hero Section */}
      <section className="relative pt-10 pb-14 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center space-y-6 px-4">
          <div className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1 rounded-full glass-pill text-[11px] sm:text-xs font-bold text-[#445b50] dark:text-[#a2beaf] tracking-wider uppercase">
            <Sparkles className="w-3.5 h-3.5 text-[#5e7769] shrink-0" />
            <span className="text-center">Smart Rewa Municipal Corporation · AI Governance POC</span>
          </div>

          <h1 className="text-2xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 dark:text-white leading-[1.18]">
            {isHi ? (
              <>
                रीवा के नागरिक बुनियादी ढांचे को <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#3e564a] via-[#5c7768] to-[#2f4239] dark:from-[#b0c8bb] dark:via-[#d3e3db] dark:to-[#9cb5a8] bg-clip-text text-transparent">
                  अधिक स्मार्ट, त्वरित और जवाबदेह
                </span>{' '}
                बनाना
              </>
            ) : (
              <>
                Making Rewa's civic infrastructure <br className="hidden sm:inline" />
                <span className="bg-gradient-to-r from-[#3e564a] via-[#5c7768] to-[#2f4239] dark:from-[#b0c8bb] dark:via-[#d3e3db] dark:to-[#9cb5a8] bg-clip-text text-transparent">
                  smarter, faster & accountable.
                </span>
              </>
            )}
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 font-normal leading-relaxed">
            {isHi
              ? 'सेकंडों में समस्या दर्ज करें। AI द्वारा वर्गीकरण, ऑटो-रूटिंग और नागरिक पुष्टि के साथ समाधान की लाइव ट्रैकिंग।'
              : 'Report a problem in seconds. Let AI classify it, route it, monitor the resolution SLA, and predict recurring failures before they disrupt citizens.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setCurrentView('report')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl bg-[#5e7769] hover:bg-[#506659] dark:bg-[#6c8879] dark:hover:bg-[#5c7668] text-white font-bold text-sm sm:text-base border border-emerald-400/25 shadow-md active:scale-95 transition-all duration-150 cursor-pointer backdrop-blur-md"
            >
              <span>{isHi ? '+ समस्या रिपोर्ट करें' : '+ Report an Issue'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('officer-dashboard')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-2xl glass-button text-slate-800 dark:text-slate-100 font-bold text-sm sm:text-base active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <Activity className="w-4 h-4 text-[#5e7769] dark:text-[#8ea899]" />
              <span>{isHi ? 'लाइव कमांड सेंटर देखें' : 'Explore Live Dashboard'}</span>
            </button>

            <button
              onClick={startDemoJourney}
              className="flex items-center gap-1.5 px-5 py-3.5 rounded-2xl bg-gradient-to-r from-[#6e8a7b] via-[#5e7769] to-[#7f9488] hover:brightness-105 text-white font-bold text-sm border border-white/20 shadow-sm active:scale-95 transition-all duration-150 cursor-pointer backdrop-blur-md"
            >
              <Flame className="w-4 h-4 text-amber-200" />
              <span>{isHi ? '3-मिनट लाइव जज डेमो' : 'Run 3-Min Competition Demo'}</span>
            </button>
          </div>

          {/* Interactive Closed-Loop Pipeline Flow Visualizer */}
          <div className="pt-6 max-w-4xl mx-auto">
            <div className="glass-panel rounded-3xl p-5 shadow-sm space-y-3.5 text-left">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  Autonomous Closed-Loop Data Pipeline:
                </span>
                <button
                  onClick={() => setIsDemoModalOpen(true)}
                  className="font-semibold text-[#5e7769] dark:text-[#8ea899] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <span>Launch Walkthrough Console</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5 text-center text-xs">
                {[
                  { label: 'Citizen', desc: 'Spots Pothole & Snaps Photo' },
                  { label: 'Gemini AI', desc: 'Detects Severity & Safety Hazards' },
                  { label: 'Ward Engine', desc: 'Boundary Match & 72h SLA' },
                  { label: 'Field Officer', desc: 'Dispatches Road Repair Crew' },
                  { label: 'Resolution', desc: 'AI Compares Before/After' },
                  { label: 'Public Portal', desc: 'Real-Time Audit Updates' },
                ].map((item, idx) => (
                  <div key={idx} className="glass-card glass-card-hover p-3 rounded-2xl space-y-1">
                    <div className="text-[10px] font-mono font-bold uppercase text-[#5e7769] dark:text-[#8ea899]">
                      Step {idx + 1}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white text-xs">{item.label}</div>
                    <div className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">{item.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Live Recent Reports Ticker */}
          <div className="pt-4 max-w-3xl mx-auto">
            <div className="inline-flex flex-wrap items-center justify-center gap-2 text-xs text-slate-600 dark:text-slate-300 glass-pill px-4 py-1.5 rounded-full">
              <span className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Active Triage in Rewa:
              </span>
              <span>College Chowk Pothole</span>
              <span>·</span>
              <span>Shilpi Plaza Waste Cleared</span>
              <span>·</span>
              <span>Bus Stand Drainage Desilted</span>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section with Clear DEMO DATA Disclaimer */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#2f3933] via-[#242c27] to-[#1c221e] text-stone-100 rounded-3xl p-6 sm:p-8 shadow-xl border border-stone-700/40 relative overflow-hidden">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold tracking-wider text-amber-300 bg-amber-500/20 border border-amber-400/40 px-2.5 py-0.5 rounded-full">
                  DEMO DATA
                </span>
                <h3 className="text-base sm:text-lg font-bold text-stone-100">
                  {isHi ? 'स्मार्ट रीवा म्युनिसिपल इंटेलिजेंस मैट्रिक्स' : 'Smart Rewa Municipal Intelligence Metrics'}
                </h3>
              </div>
              <p className="text-xs text-stone-300/80 mt-1">
                Calibrated simulation baseline for Rewa Municipal Corporation Proof of Concept.
              </p>
            </div>
            <button
              onClick={() => setCurrentView('transparency')}
              className="text-xs font-bold text-[#e4c49d] hover:text-[#f2d8b8] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>{isHi ? 'पारदर्शिता रिपोर्ट देखें' : 'View Public Audit Report'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
            {stats.map((s, idx) => (
              <div key={idx} className={`space-y-1 ${idx > 0 ? 'sm:pl-6' : ''}`}>
                <div className="text-3xl sm:text-4xl font-black text-stone-100 tracking-tight">
                  {s.value}
                </div>
                <div className="text-sm font-semibold text-stone-200">{s.label}</div>
                <div className="text-xs text-stone-400">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Rewa Live Civic Map Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="glass-panel rounded-3xl p-6 shadow-md space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#5e7769] dark:text-[#8ea899] uppercase tracking-wider">
                <MapPin className="w-3.5 h-3.5" />
                <span>Geospatial Intelligence</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                {isHi ? 'रीवा शहर लाइव समस्या मानचित्र' : 'Rewa Civic Infrastructure Issue Map'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Visualizing active grievances across Civil Lines, Shilpi Plaza, College Chowk, Bus Stand, and Hospital wards.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentView('predictive')}
                className="px-3.5 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/60 text-purple-800 dark:text-purple-300 border border-purple-200 dark:border-purple-800/60 text-xs font-bold cursor-pointer hover:bg-purple-100/80 transition-all active:scale-95"
              >
                View Hotspot Analytics
              </button>
              <button
                onClick={() => setCurrentView('complaint-management')}
                className="px-3.5 py-2 rounded-xl bg-stone-100 dark:bg-stone-800/80 text-stone-700 dark:text-stone-300 border border-stone-300 dark:border-stone-700 text-xs font-bold cursor-pointer hover:bg-stone-200/80 dark:hover:bg-stone-700 transition-all active:scale-95"
              >
                All Complaints Table
              </button>
            </div>
          </div>

          <LeafletMap complaints={complaints} height="440px" zoom={13} showHotspots={true} />
        </div>
      </section>

      {/* Core Innovation Features */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {isHi ? 'भविष्यवादी नागरिक शासन तकनीक' : 'Engineered for Responsive Urban Governance'}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-300">
            NAGAR-AI connects citizens directly with municipal execution teams through autonomous AI verification and predictive intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="glass-card glass-card-hover p-6 rounded-3xl space-y-3"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {f.icon}
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{f.title}</h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 6-Step Closed Loop Lifecycle Preview */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-gradient-to-br from-[#262d29] via-[#1d2320] to-[#161b18] text-stone-100 rounded-3xl p-6 sm:p-10 shadow-xl border border-stone-700/50 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#98b8a7]">
              The Closed Loop Lifecycle
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-100">
              How NAGAR-AI Solves Problems End-to-End
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Every reported issue passes through strict automated validation, field assignment, and citizen verification.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-center">
            {[
              { num: '01', title: 'Citizen Report', desc: 'Voice, photo & geo-pin' },
              { num: '02', title: 'Gemini AI Vision', desc: 'Auto-triage & hazard check' },
              { num: '03', title: 'Smart Routing', desc: 'Direct to ward engineer' },
              { num: '04', title: 'SLA Countdown', desc: 'Strict municipal timer' },
              { num: '05', title: 'AI Resolution Audit', desc: 'Before vs After photo inspection' },
              { num: '06', title: 'Citizen Closure', desc: 'Citizen confirmed & points given' },
            ].map((step, idx) => (
              <div key={idx} className="bg-white/10 hover:bg-white/15 border border-white/15 rounded-2xl p-4 flex flex-col items-center transition-all hover:-translate-y-0.5">
                <span className="text-xs font-mono font-extrabold text-[#b8d6c7] bg-[#5e7769]/30 border border-[#8ea899]/30 px-2.5 py-0.5 rounded-full mb-2">
                  {step.num}
                </span>
                <div className="text-xs sm:text-sm font-bold text-stone-100 mb-1">{step.title}</div>
                <div className="text-[11px] text-stone-300 leading-tight">{step.desc}</div>
              </div>
            ))}
          </div>

          <div className="pt-2 flex justify-center">
            <button
              onClick={() => setCurrentView('report')}
              className="px-6 py-3 rounded-2xl bg-[#5e7769] hover:bg-[#506659] text-white font-bold text-sm shadow-md transition-all cursor-pointer active:scale-95"
            >
              Try Submitting a Test Report Now
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
