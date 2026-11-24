export type IssueCategory =
  | 'Road / Pothole'
  | 'Streetlight'
  | 'Garbage'
  | 'Water Leakage'
  | 'Waterlogging'
  | 'Drainage'
  | 'Fallen Tree'
  | 'Other';

export type PriorityLevel = 'Low' | 'Medium' | 'High' | 'Critical';

export type ComplaintStatus =
  | 'Reported'
  | 'AI Verified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved'
  | 'Citizen Verified'
  | 'SLA Breached';

export interface AIAnalysis {
  issueType: string;
  confidence: number;
  severity: string;
  description: string;
  possibleHazard: string;
  recommendedDepartment: string;
  suggestedSLAHours?: number;
  reason?: string;
  source?: string;
}

export interface ComplaintTimelineItem {
  stage: 'Reported' | 'AI Verified' | 'Assigned' | 'In Progress' | 'Resolved' | 'Citizen Verified';
  timestamp: string;
  description: string;
  actor: string;
}

export interface ComplaintLocation {
  address: string;
  landmark: string;
  wardId: string;
  wardName: string;
  lat: number;
  lng: number;
}

export interface ComplaintSLA {
  slaHours: number;
  createdAt: string;
  deadline: string;
  resolvedAt?: string;
  status: 'Within SLA' | 'Approaching SLA' | 'SLA Breached' | 'Met';
}

export interface AIResolutionVerification {
  visualChange: string;
  likelyResolved: boolean;
  confidence: number;
  notes: string;
  verifiedAt: string;
  source?: string;
  qualityScore?: number;
}

export interface Complaint {
  id: string; // e.g. NGR-2026-00124
  title: string;
  category: IssueCategory;
  description: string;
  hindiDescription?: string;
  voiceTranscript?: string;
  location: ComplaintLocation;
  status: ComplaintStatus;
  priority: PriorityLevel;
  severity: 'Low' | 'Medium' | 'Moderate' | 'High' | 'Severe' | 'Critical';
  department: string;
  assignedOfficer?: {
    name: string;
    phone: string;
    role: string;
  };
  aiAnalysis: AIAnalysis;
  sla: ComplaintSLA;
  images: {
    beforeUrl: string;
    afterUrl?: string;
  };
  aiResolutionVerification?: AIResolutionVerification;
  citizenConfirmation?: {
    status: 'confirmed_resolved' | 'reopened';
    comment?: string;
    confirmedAt: string;
  };
  timeline: ComplaintTimelineItem[];
  citizen: {
    name: string;
    phone: string;
    pointsAwarded: number;
  };
  upvotes: number;
  duplicateOfId?: string;
  isDemoSeed?: boolean;
}

export interface Ward {
  id: string;
  name: string;
  zone: string;
  officerName: string;
  contact: string;
  openComplaints: number;
  resolvedComplaints: number;
  slaComplianceRate: number; // 0 to 100
  avgResolutionHours: number;
  citizenSatisfaction: number; // 0 to 100
  healthIndex: number; // 0 to 100 calculated POC score
  center: [number, number];
}

export interface CivicBadge {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export interface CitizenProfile {
  name: string;
  phone: string;
  wardId: string;
  points: number;
  badges: CivicBadge[];
  reportsCount: number;
}

export interface PredictiveInsight {
  id: string;
  title: string;
  category: IssueCategory;
  wardName: string;
  riskLevel: 'Low' | 'Medium' | 'High' | 'Critical';
  recurrenceCount: number;
  observation: string;
  preventiveAction: string;
  targetTimeline: string;
  recommendedDepartment: string;
  impactScore: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  timestamp: string;
  source?: string;
  suggestedActions?: string[];
  relatedCategory?: string;
}
