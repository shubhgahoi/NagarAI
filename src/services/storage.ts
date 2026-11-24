import {
  Complaint,
  Ward,
  CitizenProfile,
  PredictiveInsight,
  ComplaintStatus,
} from '../types';
import {
  INITIAL_COMPLAINTS,
  DEMO_WARDS,
  INITIAL_CITIZEN_PROFILE,
  INITIAL_PREDICTIVE_INSIGHTS,
} from '../data/mockData';

const STORAGE_KEYS = {
  COMPLAINTS: 'nagar_ai_complaints_v1',
  WARDS: 'nagar_ai_wards_v1',
  CITIZEN: 'nagar_ai_citizen_v1',
  INSIGHTS: 'nagar_ai_insights_v1',
  THEME: 'nagar_ai_theme',
  LANG: 'nagar_ai_lang',
};

// Haversine distance calculator in meters
export function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // Earth radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

export const StorageService = {
  getComplaints(): Complaint[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COMPLAINTS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error('Failed reading complaints from storage:', e);
    }
    // Seed initial demo data
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    return INITIAL_COMPLAINTS;
  },

  saveComplaints(complaints: Complaint[]) {
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(complaints));
  },

  createComplaint(data: Partial<Complaint>): Complaint {
    const existing = this.getComplaints();
    const currentYear = new Date().getFullYear();
    const nextSeq = (existing.length + 125).toString().padStart(5, '0');
    const newId = `NGR-${currentYear}-${nextSeq}`;

    const now = new Date().toISOString();
    const slaHours = data.sla?.slaHours || 48;
    const deadline = new Date(Date.now() + slaHours * 3600 * 1000).toISOString();

    const newComplaint: Complaint = {
      id: newId,
      title: data.title || `${data.category || 'Civic'} Issue at ${data.location?.address || 'Rewa'}`,
      category: data.category || 'Road / Pothole',
      description: data.description || '',
      hindiDescription: data.hindiDescription,
      voiceTranscript: data.voiceTranscript,
      location: data.location || {
        address: 'Civil Lines, Rewa',
        landmark: 'Near Collectorate',
        wardId: 'ward-01',
        wardName: 'Demo Ward 01 - Civil Lines',
        lat: 24.5385,
        lng: 81.2990,
      },
      status: (data.status as ComplaintStatus) || 'Reported',
      priority: data.priority || 'Medium',
      severity: data.severity || 'Moderate',
      department: data.department || 'Roads & Civil Engineering',
      assignedOfficer: data.assignedOfficer || {
        name: 'Er. A. K. Shukla',
        phone: '+91 94251 10001',
        role: 'Duty Ward Officer',
      },
      aiAnalysis: data.aiAnalysis || {
        issueType: data.category || 'Civic Issue',
        confidence: 0.94,
        severity: data.severity || 'Moderate',
        description: data.description || 'Civic infrastructure defect',
        possibleHazard: 'General inconvenience and safety hazard',
        recommendedDepartment: data.department || 'Roads & Civil Engineering',
        suggestedSLAHours: slaHours,
        source: 'Gemini AI Visual Inspection',
      },
      sla: {
        slaHours,
        createdAt: now,
        deadline,
        status: 'Within SLA',
      },
      images: data.images || {
        beforeUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
      },
      timeline: data.timeline || [
        {
          stage: 'Reported',
          timestamp: now,
          description: 'Complaint registered by citizen.',
          actor: 'Citizen',
        },
        {
          stage: 'AI Verified',
          timestamp: now,
          description: 'Gemini AI visual verification completed. Prioritized and routed.',
          actor: 'NAGAR-AI Engine',
        },
      ],
      citizen: data.citizen || {
        name: 'Rajesh Sharma',
        phone: '+91 98261 44321',
        pointsAwarded: 10,
      },
      upvotes: 1,
      duplicateOfId: data.duplicateOfId,
      isDemoSeed: false,
    };

    const updated = [newComplaint, ...existing];
    this.saveComplaints(updated);

    // Award citizen points (+10 for report, or +3 if joined duplicate)
    const pointsAwarded = data.duplicateOfId ? 3 : 10;
    this.updateCitizenPoints(pointsAwarded, 'Valid issue report submitted');

    return newComplaint;
  },

  updateComplaint(id: string, updates: Partial<Complaint>): Complaint | null {
    const complaints = this.getComplaints();
    const index = complaints.findIndex((c) => c.id === id);
    if (index === -1) return null;

    const existing = complaints[index];
    const updated: Complaint = {
      ...existing,
      ...updates,
      sla: updates.sla ? { ...existing.sla, ...updates.sla } : existing.sla,
      images: updates.images ? { ...existing.images, ...updates.images } : existing.images,
      timeline: updates.timeline || existing.timeline,
    };

    complaints[index] = updated;
    this.saveComplaints(complaints);
    return updated;
  },

  // Duplicate Detection: checks nearby coordinates (<250m) and matching category
  detectDuplicate(
    category: string,
    lat: number,
    lng: number,
    thresholdMeters: number = 250
  ): { duplicate: Complaint; distanceMeters: number } | null {
    const complaints = this.getComplaints();
    const openComplaints = complaints.filter(
      (c) => c.status !== 'Resolved' && c.status !== 'Citizen Verified'
    );

    for (const c of openComplaints) {
      if (c.category === category || c.aiAnalysis?.issueType?.toLowerCase().includes(category.toLowerCase())) {
        const dist = getDistanceInMeters(lat, lng, c.location.lat, c.location.lng);
        if (dist <= thresholdMeters) {
          return {
            duplicate: c,
            distanceMeters: Math.round(dist),
          };
        }
      }
    }
    return null;
  },

  // Wards with dynamically computed Ward Health Index
  getWards(): Ward[] {
    const complaints = this.getComplaints();
    return DEMO_WARDS.map((w) => {
      const wardComplaints = complaints.filter((c) => c.location.wardId === w.id);
      const openCount = wardComplaints.filter((c) => c.status !== 'Resolved' && c.status !== 'Citizen Verified').length;
      const resolvedCount = wardComplaints.filter((c) => c.status === 'Resolved' || c.status === 'Citizen Verified').length;

      // SLA compliance rate: percentage not breached
      const breachedCount = wardComplaints.filter((c) => c.status === 'SLA Breached' || c.sla.status === 'SLA Breached').length;
      const total = wardComplaints.length || 1;
      const slaCompliance = Math.max(50, Math.min(100, Math.round(((total - breachedCount) / total) * 100)));

      // Formula:
      // Ward Health Index = 35% SLA compliance + 30% resolution speed + 20% open issue density + 15% citizen satisfaction
      const openDensityScore = Math.max(40, 100 - openCount * 6);
      const speedScore = Math.max(40, 100 - (w.avgResolutionHours / 48) * 40);
      const satScore = w.citizenSatisfaction;

      const healthIndex = Math.round(
        slaCompliance * 0.35 +
        speedScore * 0.30 +
        openDensityScore * 0.20 +
        satScore * 0.15
      );

      return {
        ...w,
        openComplaints: openCount,
        resolvedComplaints: resolvedCount,
        slaComplianceRate: slaCompliance,
        healthIndex,
      };
    });
  },

  getCitizenProfile(): CitizenProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CITIZEN);
      if (data) return JSON.parse(data);
    } catch (e) {
      console.error(e);
    }
    localStorage.setItem(STORAGE_KEYS.CITIZEN, JSON.stringify(INITIAL_CITIZEN_PROFILE));
    return INITIAL_CITIZEN_PROFILE;
  },

  updateCitizenPoints(pointsChange: number, _reason?: string): CitizenProfile {
    const profile = this.getCitizenProfile();
    profile.points += pointsChange;
    profile.reportsCount += pointsChange >= 10 ? 1 : 0;

    // Check unlocking badges
    if (profile.reportsCount >= 1 && !profile.badges[0].unlocked) {
      profile.badges[0].unlocked = true;
      profile.badges[0].unlockedAt = new Date().toISOString().split('T')[0];
    }
    if (profile.points >= 50 && !profile.badges[1].unlocked) {
      profile.badges[1].unlocked = true;
      profile.badges[1].unlockedAt = new Date().toISOString().split('T')[0];
    }
    if (profile.points >= 100 && !profile.badges[2].unlocked) {
      profile.badges[2].unlocked = true;
      profile.badges[2].unlockedAt = new Date().toISOString().split('T')[0];
    }

    localStorage.setItem(STORAGE_KEYS.CITIZEN, JSON.stringify(profile));
    return profile;
  },

  getPredictiveInsights(): PredictiveInsight[] {
    return INITIAL_PREDICTIVE_INSIGHTS;
  },

  resetDemoData(): Complaint[] {
    localStorage.removeItem(STORAGE_KEYS.COMPLAINTS);
    localStorage.removeItem(STORAGE_KEYS.CITIZEN);
    localStorage.setItem(STORAGE_KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
    localStorage.setItem(STORAGE_KEYS.CITIZEN, JSON.stringify(INITIAL_CITIZEN_PROFILE));
    return INITIAL_COMPLAINTS;
  },
};
