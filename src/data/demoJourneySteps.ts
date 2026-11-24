export interface DemoStepItem {
  id: number;
  phase: 'Citizen' | 'AI' | 'Ward' | 'Officer' | 'Resolution' | 'Public Dashboard';
  title: string;
  headline: string;
  description: string;
  targetView: string;
  icon: string;
  previewData?: Record<string, string | number>;
  images?: {
    before: string;
    after: string;
  };
}

export const COMPETITION_DEMO_STEPS: DemoStepItem[] = [
  {
    id: 1,
    phase: 'Citizen',
    title: 'Citizen spots a severe pothole',
    headline: 'Incident Encounter · Rewa Urban Corridor',
    description: 'A commuter on TRS College Road notices a deep cavity in the asphalt, posing an acute hazard for two-wheelers and night traffic.',
    targetView: 'landing',
    icon: 'eye',
    previewData: {
      Location: 'College Chowk Signal Junction, Rewa',
      Condition: '12cm cavity in direct two-wheeler path',
      Risk: 'Commuter balance loss and night collision',
    },
  },
  {
    id: 2,
    phase: 'Citizen',
    title: 'Clicks "+ Report Issue"',
    headline: 'Mobile Intake Initiation',
    description: 'Citizen opens the NAGAR-AI civic intake wizard to report the municipal defect without bureaucracy or login barriers.',
    targetView: 'report',
    icon: 'camera',
    previewData: {
      Platform: 'NAGAR-AI Mobile PWA',
      Charter: 'Smart Rewa Citizen Grievance Portal',
    },
  },
  {
    id: 3,
    phase: 'Citizen',
    title: 'Uploads incident photo & voice note',
    headline: 'Photographic Evidence Capture',
    description: 'Citizen snaps a clear image of the pothole with optional Bagheli/Hindi voice narration for localized accessibility.',
    targetView: 'report',
    icon: 'camera',
    previewData: {
      ImageFile: 'pothole_college_chowk.jpg (High-Res)',
      VoiceSample: '"सड़क मा बहुत बड़ा गड्ढा है कॉलेज चौराहा के पास"',
    },
  },
  {
    id: 4,
    phase: 'AI',
    title: 'Gemini analyzes image',
    headline: 'Multimodal Vision Intelligence',
    description: 'Gemini 3.8 Flash multimodal inspection processes the pixel data to measure road surface disruption and depth characteristics.',
    targetView: 'report',
    icon: 'bot',
    previewData: {
      Model: 'gemini-3.8-flash (Server-Side @google/genai)',
      Latency: '1.1s Response Time',
      Confidence: '95.4% Accuracy Rating',
    },
  },
  {
    id: 5,
    phase: 'AI',
    title: 'AI detects Pothole defect',
    headline: 'Automated Defect Classification',
    description: 'The vision model classifies the anomaly as a road pothole with exposed aggregate base layer, rejecting false noise.',
    targetView: 'report',
    icon: 'bot',
    previewData: {
      Classification: 'Road / Pothole (Structural Depression)',
      BaseLayer: 'Exposed sub-base aggregate detected',
    },
  },
  {
    id: 6,
    phase: 'AI',
    title: 'AI assigns High priority',
    headline: 'Risk & Hazard Computation',
    description: 'Based on proximity to heavy commuter flows and depth, Gemini elevates the grievance to High priority with life-safety hazard warnings.',
    targetView: 'report',
    icon: 'activity',
    previewData: {
      PriorityAssigned: 'High Priority (Urgent)',
      HazardsIdentified: 'Two-wheeler skidding, axle damage, rainwater ponding',
    },
  },
  {
    id: 7,
    phase: 'AI',
    title: 'AI recommends Roads & Engineering',
    headline: 'Autonomous Departmental Routing',
    description: 'Eliminates citizen confusion by routing the work order directly to Roads & Civil Engineering Division.',
    targetView: 'report',
    icon: 'building',
    previewData: {
      TargetDepartment: 'Roads & Civil Engineering (PWD Sub-Division)',
      DivisionLead: 'Er. Deepak Dwivedi',
    },
  },
  {
    id: 8,
    phase: 'Ward',
    title: 'Location selected & geofenced',
    headline: 'Geospatial Coordinate Verification',
    description: 'The GPS coordinates (24.5422° N, 81.3058° E) are pinned to College Chowk Signal Junction beside TRS College Gate.',
    targetView: 'report',
    icon: 'map-pin',
    previewData: {
      Latitude: '24.5422° N',
      Longitude: '81.3058° E',
      Landmark: 'Opposite TRS College Gate, Rewa',
    },
  },
  {
    id: 9,
    phase: 'Ward',
    title: 'System detects Demo Ward 04',
    headline: 'Municipal Boundary Polygon Match',
    description: 'The spatial engine associates the incident with Demo Ward 04 (College Chowk & TRS) and checks for nearby duplicate reports.',
    targetView: 'report',
    icon: 'layers',
    previewData: {
      WardDetected: 'Demo Ward 04 - College Chowk & TRS',
      Zone: 'Zone 1 (North-Central)',
      DuplicateCheck: 'No duplicate within 50m radius',
    },
  },
  {
    id: 10,
    phase: 'Ward',
    title: 'Statutory SLA is generated',
    headline: 'Citizen Charter Compliance Clock',
    description: 'A binding 72-hour statutory resolution SLA is locked in under the MP Public Services Guarantee Framework.',
    targetView: 'report',
    icon: 'clock',
    previewData: {
      StandardSLA: '72 Hours Resolution Target',
      EscalationNotice: 'Automated alert to Municipal Commissioner at 80% mark',
    },
  },
  {
    id: 11,
    phase: 'Ward',
    title: 'Ticket NGR-2026-XXXXX created',
    headline: 'Immutable Work Order Generation',
    description: 'System commits the ticket to memory and generates an official audit tracking code for public monitoring.',
    targetView: 'report',
    icon: 'check-circle',
    previewData: {
      GeneratedTicket: 'NGR-2026-00124 (or active sequence)',
      CitizenReward: '+10 Civic Engagement Points Awarded',
    },
  },
  {
    id: 12,
    phase: 'Officer',
    title: 'Officer dashboard receives ticket',
    headline: 'Command Center Telemetry Push',
    description: 'The live dispatch console updates immediately with real-time audio/visual alert for the ward engineering supervisor.',
    targetView: 'officer-dashboard',
    icon: 'activity',
    previewData: {
      DispatchQueue: 'Incoming High-Priority Feed',
      UnassignedBacklog: 'Updated instantaneously',
    },
  },
  {
    id: 13,
    phase: 'Officer',
    title: 'Ticket appears on Rewa live map',
    headline: 'Interactive GIS Geospatial Heatmap',
    description: 'A pulsating red radar pin appears over College Chowk on the OpenStreetMap interactive Leaflet canvas.',
    targetView: 'officer-dashboard',
    icon: 'map-pin',
    previewData: {
      MapMarker: 'Pulsing Critical Alert Marker at College Chowk',
      GISZone: 'Ward 04 Sector',
    },
  },
  {
    id: 14,
    phase: 'Officer',
    title: 'Officer assigns ticket to road crew',
    headline: 'Field Crew Dispatch & Material Requisition',
    description: 'Duty engineer assigns the work order to Sub-Division PWD Rapid Patch Crew #3 with bituminous premix materials.',
    targetView: 'complaint-detail',
    icon: 'building',
    previewData: {
      AssignedCrew: 'Sub-Division Rapid Patch Crew #3',
      SupervisingOfficer: 'Er. Deepak Dwivedi (+91 94251 10004)',
    },
  },
  {
    id: 15,
    phase: 'Officer',
    title: 'Status changes to "In Progress"',
    headline: 'Active Field Remediation Underway',
    description: 'The 6-stage lifecycle moves to "In Progress", and the citizen receives a status push notification on their portal.',
    targetView: 'complaint-detail',
    icon: 'clock',
    previewData: {
      StatusTransition: 'Assigned → In Progress',
      SLACountdown: 'Active 71h:45m Remaining',
    },
  },
  {
    id: 16,
    phase: 'Resolution',
    title: 'Officer uploads After-repair image',
    headline: 'Post-Remediation Verification Input',
    description: 'The field crew cleans the cavity, pours and compacts dense bituminous concrete, and uploads a timestamped site photo.',
    targetView: 'complaint-detail',
    icon: 'camera',
    previewData: {
      WorkExecuted: 'Bituminous premix leveling & roller compaction',
      SiteStatus: 'Carriageway reopened for normal traffic',
    },
    images: {
      before: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      after: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f3?auto=format&fit=crop&w=800&q=80',
    },
  },
  {
    id: 17,
    phase: 'Resolution',
    title: 'AI compares Before vs After photos',
    headline: 'Gemini Multimodal Resolution Audit',
    description: 'Gemini compares Before and After photographs to inspect aggregate leveling, surface compaction, and restoration quality.',
    targetView: 'complaint-detail',
    icon: 'bot',
    previewData: {
      QualityScore: '94 / 100 Quality Index',
      VisualInspection: 'Cavity completely leveled and smoothed with roadway',
    },
  },
  {
    id: 18,
    phase: 'Resolution',
    title: 'Issue marked "Likely Resolved"',
    headline: 'Algorithmic Signoff Completed',
    description: 'AI confirms physical resolution with 96% confidence and transitions the ticket to Resolved status.',
    targetView: 'complaint-detail',
    icon: 'check-circle',
    previewData: {
      ResolutionStatus: 'Resolved (Pending Citizen Verification)',
      ResolutionDuration: 'Completed in 2.4 Hours (96.6% within SLA)',
    },
  },
  {
    id: 19,
    phase: 'Citizen',
    title: 'Citizen confirms resolution',
    headline: 'Closed-Loop Citizen Signoff',
    description: 'The citizen receives the repair photo, inspects the completed site at College Chowk, and provides 5-star signoff.',
    targetView: 'complaint-detail',
    icon: 'user-check',
    previewData: {
      CitizenRating: '★★★★★ 5.0 Star Rating',
      BonusAward: '+5 Civic Verification Points Awarded',
      TicketStatus: 'Citizen Verified (Closed Loop Completed)',
    },
  },
  {
    id: 20,
    phase: 'Public Dashboard',
    title: 'Public dashboard updates in real time',
    headline: 'Transparent Municipal Accountability',
    description: 'The public audit portal immediately reflects the closed grievance, updating resolution metrics and download logs.',
    targetView: 'transparency',
    icon: 'bar-chart',
    previewData: {
      PublicAudit: 'Auditable Ticket Log Published',
      ResolvedRatio: 'Increases across Smart Rewa portal',
    },
  },
  {
    id: 21,
    phase: 'Public Dashboard',
    title: 'Ward performance & predictive analytics update',
    headline: 'Data-Driven City Infrastructure Index',
    description: 'Ward 04 Health Index increases (+1.4 points) and historical road stress data updates predictive monsoon forecasts.',
    targetView: 'ward-performance',
    icon: 'activity',
    previewData: {
      Ward04HealthIndex: '81.5 / 100 (+1.4 pts Improvement)',
      PredictivePotholeAlert: 'Monsoon risk recalibrated with fresh repair telemetry',
    },
  },
];
