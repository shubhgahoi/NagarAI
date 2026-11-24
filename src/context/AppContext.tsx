import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { Complaint, Ward, CitizenProfile } from '../types';
import { StorageService } from '../services/storage';
import { COMPETITION_DEMO_STEPS, DemoStepItem } from '../data/demoJourneySteps';
import { AppLanguage } from '../data/translations';

export type AppView =
  | 'landing'
  | 'citizen-portal'
  | 'report'
  | 'my-complaints'
  | 'complaint-detail'
  | 'officer-dashboard'
  | 'complaint-management'
  | 'predictive'
  | 'transparency'
  | 'ward-performance'
  | 'nagar-sathi'
  | 'architecture'
  | 'whitepaper-pdf'
  | 'about';

interface ToastInfo {
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

export interface DemoJourneyState {
  isRunning: boolean;
  currentStepIndex: number;
  autoPlay: boolean;
  speedMs: number;
  ticketId: string | null;
  steps: DemoStepItem[];
}

interface AppContextType {
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  selectedComplaintId: string | null;
  setSelectedComplaintId: (id: string | null) => void;
  complaints: Complaint[];
  wards: Ward[];
  citizenProfile: CitizenProfile;
  refreshComplaints: () => void;
  createComplaint: (data: Partial<Complaint>) => Complaint;
  updateComplaint: (id: string, updates: Partial<Complaint>) => void;
  darkMode: boolean;
  toggleDarkMode: () => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  toast: ToastInfo | null;
  showToast: (message: string, type?: 'success' | 'info' | 'warning' | 'error') => void;
  resetAllData: () => void;
  viewComplaintDetail: (id: string) => void;
  // Legacy banner support
  isDemoRunnerActive: boolean;
  demoStep: number;
  runCompetitionDemoFlow: () => void;
  // Enhanced 3-Minute Demo Journey System
  isDemoModalOpen: boolean;
  setIsDemoModalOpen: (open: boolean) => void;
  demoJourneyState: DemoJourneyState;
  startDemoJourney: () => void;
  stopDemoJourney: () => void;
  nextDemoStep: () => void;
  prevDemoStep: () => void;
  jumpToDemoStep: (index: number) => void;
  toggleDemoAutoPlay: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentView] = useState<AppView>('landing');
  const [selectedComplaintId, setSelectedComplaintId] = useState<string | null>(null);
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [wards, setWards] = useState<Ward[]>([]);
  const [citizenProfile, setCitizenProfile] = useState<CitizenProfile>(StorageService.getCitizenProfile());
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('nagar_ai_dark') === 'true';
  });
  const [language, setLanguageState] = useState<AppLanguage>('en');
  const [toast, setToast] = useState<ToastInfo | null>(null);

  // Legacy demo support
  const [isDemoRunnerActive, setIsDemoRunnerActive] = useState<boolean>(false);
  const [demoStep, setDemoStep] = useState<number>(0);

  // New Demo Journey state
  const [isDemoModalOpen, setIsDemoModalOpen] = useState<boolean>(false);
  const [demoJourneyState, setDemoJourneyState] = useState<DemoJourneyState>({
    isRunning: false,
    currentStepIndex: 0,
    autoPlay: true,
    speedMs: 4000,
    ticketId: null,
    steps: COMPETITION_DEMO_STEPS,
  });

  const activeTicketRef = useRef<string | null>(null);

  const refreshComplaints = useCallback(() => {
    const list = StorageService.getComplaints();
    setComplaints([...list]);
    setWards(StorageService.getWards());
    setCitizenProfile(StorageService.getCitizenProfile());
  }, []);

  useEffect(() => {
    refreshComplaints();
  }, [refreshComplaints]);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nagar_ai_dark', 'true');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nagar_ai_dark', 'false');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const setLanguage = (lang: AppLanguage) => {
    setLanguageState(lang);
  };

  const showToast = (message: string, type: 'success' | 'info' | 'warning' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const createComplaint = (data: Partial<Complaint>) => {
    const created = StorageService.createComplaint(data);
    refreshComplaints();
    showToast(`Registered Ticket ${created.id}`, 'success');
    return created;
  };

  const updateComplaint = (id: string, updates: Partial<Complaint>) => {
    StorageService.updateComplaint(id, updates);
    refreshComplaints();
  };

  const resetAllData = () => {
    StorageService.resetDemoData();
    refreshComplaints();
    activeTicketRef.current = null;
    setDemoJourneyState((prev) => ({
      ...prev,
      currentStepIndex: 0,
      isRunning: false,
      ticketId: null,
    }));
    showToast('Demo dataset reset to initial state', 'info');
  };

  const viewComplaintDetail = (id: string) => {
    setSelectedComplaintId(id);
    setCurrentView('complaint-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Execution actions for each step in the 21-step closed loop
  const executeStepActions = useCallback((stepIdx: number) => {
    const steps = COMPETITION_DEMO_STEPS;
    const step = steps[stepIdx];
    if (!step) return;

    // View Routing
    if (step.targetView) {
      setCurrentView(step.targetView as AppView);
    }

    // Step 10 & 11: Create ticket in data store if not yet created
    if (stepIdx === 10 || (stepIdx > 10 && !activeTicketRef.current)) {
      // Find or create the demo pothole ticket
      const existing = StorageService.getComplaints();
      let collegeChowk = existing.find((c) => c.title.includes('College Chowk Signal') || c.id === 'NGR-2026-00124');

      if (!collegeChowk) {
        collegeChowk = StorageService.createComplaint({
          title: 'Deep Hazardous Pothole at College Chowk Signal',
          category: 'Road / Pothole',
          description: 'Large 12cm crater in direct two-wheeler path right beside signal post. Rainwater obscures depth, causing serious skid accidents.',
          hindiDescription: 'कॉलेज चौराहा सिग्नल के पास सड़क में बहुत गहरा गड्ढा है।',
          location: {
            address: 'College Chowk Signal Junction',
            landmark: 'Near TRS College Gate',
            wardId: 'ward-04',
            wardName: 'Demo Ward 04 - College Chowk & TRS',
            lat: 24.5422,
            lng: 81.3058,
          },
          priority: 'High',
          severity: 'Severe',
          department: 'Roads & Civil Engineering',
          images: {
            beforeUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
          },
          sla: {
            slaHours: 72,
            createdAt: new Date().toISOString(),
            deadline: new Date(Date.now() + 72 * 3600 * 1000).toISOString(),
            status: 'Within SLA',
          },
        });
        refreshComplaints();
      }

      activeTicketRef.current = collegeChowk.id;
      setSelectedComplaintId(collegeChowk.id);
      setDemoJourneyState((prev) => ({ ...prev, ticketId: collegeChowk!.id }));
    }

    // Step 14: Assign Ticket to PWD Crew
    if (stepIdx === 13 && activeTicketRef.current) {
      StorageService.updateComplaint(activeTicketRef.current, {
        status: 'Assigned',
        assignedOfficer: {
          name: 'Er. Deepak Dwivedi',
          phone: '+91 94251 10004',
          role: 'Sub-Division Rapid Patch Crew #3',
        },
      });
      refreshComplaints();
    }

    // Step 15: Move to In Progress
    if (stepIdx === 14 && activeTicketRef.current) {
      StorageService.updateComplaint(activeTicketRef.current, {
        status: 'In Progress',
      });
      refreshComplaints();
    }

    // Step 16 & 17: Upload After image & AI Compare
    if ((stepIdx === 15 || stepIdx === 16) && activeTicketRef.current) {
      StorageService.updateComplaint(activeTicketRef.current, {
        images: {
          beforeUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80',
          afterUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb186c5f3?auto=format&fit=crop&w=800&q=80',
        },
        aiResolutionVerification: {
          visualChange: 'Road surface patched and compacted with dense bituminous premix. Surface is even and flush.',
          likelyResolved: true,
          confidence: 0.96,
          qualityScore: 94,
          notes: 'Multimodal vision audit confirms physical defect rectification. Ready for citizen verification.',
          verifiedAt: new Date().toISOString(),
          source: 'Gemini AI Vision Audit',
        },
      });
      refreshComplaints();
    }

    // Step 18: Issue Marked Resolved
    if (stepIdx === 17 && activeTicketRef.current) {
      StorageService.updateComplaint(activeTicketRef.current, {
        status: 'Resolved',
      });
      refreshComplaints();
    }

    // Step 19: Citizen Confirms Resolution
    if (stepIdx === 18 && activeTicketRef.current) {
      StorageService.updateComplaint(activeTicketRef.current, {
        status: 'Citizen Verified',
        citizenConfirmation: {
          status: 'confirmed_resolved',
          comment: 'Outstanding response by Rewa Nagar Nigam! Fixed cleanly before sunset.',
          confirmedAt: new Date().toISOString(),
        },
      });
      refreshComplaints();
    }

    showToast(`Step ${stepIdx + 1}: ${step.title}`, 'info');
  }, [refreshComplaints, setCurrentView]);

  // Next Step
  const nextDemoStep = useCallback(() => {
    setDemoJourneyState((prev) => {
      const nextIdx = Math.min(prev.steps.length - 1, prev.currentStepIndex + 1);
      executeStepActions(nextIdx);
      return {
        ...prev,
        currentStepIndex: nextIdx,
        isRunning: nextIdx < prev.steps.length - 1 ? prev.isRunning : false,
      };
    });
  }, [executeStepActions]);

  // Prev Step
  const prevDemoStep = useCallback(() => {
    setDemoJourneyState((prev) => {
      const prevIdx = Math.max(0, prev.currentStepIndex - 1);
      executeStepActions(prevIdx);
      return { ...prev, currentStepIndex: prevIdx };
    });
  }, [executeStepActions]);

  // Jump to specific step
  const jumpToDemoStep = useCallback((index: number) => {
    setDemoJourneyState((prev) => {
      executeStepActions(index);
      return { ...prev, currentStepIndex: index };
    });
  }, [executeStepActions]);

  // Start Autonomous Demo Journey
  const startDemoJourney = useCallback(() => {
    setIsDemoModalOpen(true);
    setDemoJourneyState((prev) => ({
      ...prev,
      isRunning: true,
      autoPlay: true,
    }));
    executeStepActions(demoJourneyState.currentStepIndex);
    showToast('Autonomous 3-minute Competition Demo Started', 'info');
  }, [demoJourneyState.currentStepIndex, executeStepActions]);

  // Stop Demo Journey
  const stopDemoJourney = useCallback(() => {
    setDemoJourneyState((prev) => ({
      ...prev,
      isRunning: false,
    }));
    showToast('Autonomous Demo Paused', 'info');
  }, []);

  const toggleDemoAutoPlay = useCallback(() => {
    setDemoJourneyState((prev) => ({
      ...prev,
      autoPlay: !prev.autoPlay,
    }));
  }, []);

  // Backwards compatibility legacy run
  const runCompetitionDemoFlow = useCallback(() => {
    startDemoJourney();
  }, [startDemoJourney]);

  return (
    <AppContext.Provider
      value={{
        currentView,
        setCurrentView,
        selectedComplaintId,
        setSelectedComplaintId,
        complaints,
        wards,
        citizenProfile,
        refreshComplaints,
        createComplaint,
        updateComplaint,
        darkMode,
        toggleDarkMode,
        language,
        setLanguage,
        toast,
        showToast,
        resetAllData,
        viewComplaintDetail,
        isDemoRunnerActive,
        demoStep,
        runCompetitionDemoFlow,
        isDemoModalOpen,
        setIsDemoModalOpen,
        demoJourneyState,
        startDemoJourney,
        stopDemoJourney,
        nextDemoStep,
        prevDemoStep,
        jumpToDemoStep,
        toggleDemoAutoPlay,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
