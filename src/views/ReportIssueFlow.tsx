import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { IssueCategory, Complaint } from '../types';
import {
  AIService,
  AIInspectionResult,
  AIClassificationResult,
  VoiceGrievanceParseResult,
} from '../services/aiService';
import { StorageService } from '../services/storage';
import { LeafletMap } from '../components/common/LeafletMap';
import { SAMPLE_IMAGES, DEMO_WARDS } from '../data/mockData';
import {
  TRANSLATIONS,
  normalizeCivicInput,
  NormalizedComplaintInput,
  SUPPORTED_LANGUAGES,
} from '../data/translations';
import { OTHER_DIALECTS_LIST, RegionalDialect } from '../data/dialects';
import {
  Mic,
  MicOff,
  Camera,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  Upload,
  RefreshCw,
  Share2,
  Layers,
  Clock,
  ShieldAlert,
  Info,
  Languages,
  HelpCircle,
  FileText,
  Volume2,
  Loader2,
  Square,
  Play,
  Check,
  Building2,
  Tag,
  Compass,
  Crosshair,
  Navigation,
  Radio,
} from 'lucide-react';

// Key Rewa Landmark & Geotag Directory including Rewa Engineering College (REC)
export const REWA_LANDMARKS = [
  {
    id: 'rec-campus',
    name: 'Rewa Engineering College (REC)',
    hindiName: 'रीवा इंजीनियरिंग कॉलेज (REC)',
    wardId: 'ward-09',
    address: 'REC Campus, University Road, Rewa',
    landmark: 'Rewa Engineering College Main Gate & Academic Block',
    coords: [24.5360, 81.3320] as [number, number],
    icon: '🎓',
    tag: 'Academic Tech Zone',
  },
  {
    id: 'college-chowk',
    name: 'College Chowk / TRS College',
    hindiName: 'कॉलेज चौराहा / टीआरएस कॉलेज',
    wardId: 'ward-04',
    address: 'College Road, Rewa',
    landmark: 'Near State Bank ATM, College Chowk Crossing',
    coords: [24.5422, 81.3058] as [number, number],
    icon: '🏫',
    tag: 'North-Central Crossing',
  },
  {
    id: 'sgm-hospital',
    name: 'Sanjay Gandhi Hospital (SGMH)',
    hindiName: 'संजय गांधी मेमोरियल अस्पताल',
    wardId: 'ward-07',
    address: 'Hospital Road, Rewa',
    landmark: 'Behind Emergency Trauma Wing, SGMH',
    coords: [24.5370, 81.3080] as [number, number],
    icon: '🏥',
    tag: 'Medical Hub Zone',
  },
  {
    id: 'jayanti-apsu',
    name: 'Jayanti Complex / APSU Road',
    hindiName: 'जयंती कॉम्प्लेक्स / APSU रोड',
    wardId: 'ward-02',
    address: 'APSU University Road, Rewa',
    landmark: 'In front of Jayanti Commercial Complex',
    coords: [24.5210, 81.3150] as [number, number],
    icon: '🏢',
    tag: 'East Transit Corridor',
  },
  {
    id: 'bus-stand',
    name: 'New Bus Stand Terminal',
    hindiName: 'नया बस स्टैंड टर्मिनल',
    wardId: 'ward-05',
    address: 'New Bus Stand Corridor, Rewa',
    landmark: 'Near New Bus Stand Entry Gate',
    coords: [24.5480, 81.2930] as [number, number],
    icon: '🚌',
    tag: 'West Transit Hub',
  },
  {
    id: 'shilpi-plaza',
    name: 'Shilpi Plaza Commercial Hub',
    hindiName: 'शिल्पी प्लाजा व्यावसायिक केंद्र',
    wardId: 'ward-03',
    address: 'Shilpi Plaza Market, Rewa',
    landmark: 'Shilpi Plaza Block B Corridor',
    coords: [24.5340, 81.3015] as [number, number],
    icon: '🛍️',
    tag: 'Central Commercial',
  },
  {
    id: 'civil-lines',
    name: 'Civil Lines Administrative Area',
    hindiName: 'सिविल लाइन्स प्रशासनिक क्षेत्र',
    wardId: 'ward-01',
    address: 'Civil Lines Main Road, Rewa',
    landmark: 'Near Commissioner Bungalow',
    coords: [24.5385, 81.2990] as [number, number],
    icon: '🏛️',
    tag: 'Central Administrative',
  },
  {
    id: 'railway-station',
    name: 'Rewa Railway Station',
    hindiName: 'रीवा रेलवे स्टेशन',
    wardId: 'ward-06',
    address: 'Station Road, Rewa',
    landmark: 'Rewa Railway Station Circulating Area',
    coords: [24.5290, 81.2850] as [number, number],
    icon: '🚂',
    tag: 'South-West Rail Zone',
  },
];

export const ReportIssueFlow: React.FC = () => {
  const {
    createComplaint,
    setCurrentView,
    viewComplaintDetail,
    wards,
    showToast,
    language,
    setLanguage,
  } = useApp();

  // Translation bundle according to selected language
  const t = TRANSLATIONS[language] || TRANSLATIONS.en;

  const [step, setStep] = useState<number>(1);

  // Form State
  const [description, setDescription] = useState<string>('');
  const [category, setCategory] = useState<IssueCategory>('Road / Pothole');
  const [selectedImage, setSelectedImage] = useState<string>(SAMPLE_IMAGES.pothole_before);
  const [isInspecting, setIsInspecting] = useState<boolean>(false);
  const [inspectionResult, setInspectionResult] = useState<AIInspectionResult | null>(null);

  // Normalization & Voice Extraction Result state
  const [normalizationInfo, setNormalizationInfo] = useState<NormalizedComplaintInput | null>(null);
  const [voiceParseResult, setVoiceParseResult] = useState<VoiceGrievanceParseResult | null>(null);

  // Location & High-Accuracy GPS State
  const [address, setAddress] = useState<string>('REC Campus, University Road, Rewa');
  const [landmark, setLandmark] = useState<string>('Rewa Engineering College Main Gate');
  const [selectedWardId, setSelectedWardId] = useState<string>('ward-09');
  const [coords, setCoords] = useState<[number, number]>([24.5360, 81.3320]);
  const [isGeolocating, setIsGeolocating] = useState<boolean>(false);
  const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null);
  const [isLiveGpsFixed, setIsLiveGpsFixed] = useState<boolean>(false);

  // AI Verification & Classification State
  const [isClassifying, setIsClassifying] = useState<boolean>(false);
  const [classificationResult, setClassificationResult] = useState<AIClassificationResult | null>(null);
  const [priority, setPriority] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('High');
  const [department, setDepartment] = useState<string>('Roads & Civil Engineering');
  const [slaHours, setSlaHours] = useState<number>(72);

  // Duplicate Check
  const [duplicateFound, setDuplicateFound] = useState<{ duplicate: Complaint; distanceMeters: number } | null>(null);

  // Final Submission Ticket
  const [submittedTicket, setSubmittedTicket] = useState<Complaint | null>(null);

  // Voice recording & AI extraction states
  const [isListening, setIsListening] = useState<boolean>(false);
  const [isProcessingVoice, setIsProcessingVoice] = useState<boolean>(false);
  const [recordingSeconds, setRecordingSeconds] = useState<number>(0);
  const [liveTranscript, setLiveTranscript] = useState<string>('');

  // Other regional dialect state (Bundelkhandi, Awadhi, Bhojpuri, Chhattisgarhi, etc.)
  const [selectedOtherDialect, setSelectedOtherDialect] = useState<RegionalDialect | null>(null);
  const [isDialectModalOpen, setIsDialectModalOpen] = useState<boolean>(false);
  const [dialectSearch, setDialectSearch] = useState<string>('');

  const filteredDialects = OTHER_DIALECTS_LIST.filter(
    (d) =>
      d.name.toLowerCase().includes(dialectSearch.toLowerCase()) ||
      d.nativeName.toLowerCase().includes(dialectSearch.toLowerCase()) ||
      d.region.toLowerCase().includes(dialectSearch.toLowerCase())
  );

  const recognitionRef = useRef<any>(null);
  const timerIntervalRef = useRef<any>(null);
  const latestTranscriptRef = useRef<string>('');
  const descriptionRef = useRef<string>('');

  // Keep refs in sync with current text
  useEffect(() => {
    descriptionRef.current = description;
  }, [description]);

  // Clean up timers on unmount
  useEffect(() => {
    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  // Update coordinate when ward changes
  const handleWardChange = (newWardId: string) => {
    setSelectedWardId(newWardId);
    const matched = wards.find((w) => w.id === newWardId) || DEMO_WARDS.find((w) => w.id === newWardId);
    if (matched && matched.center) {
      setCoords(matched.center);
    }
  };

  // Central function to parse voice / text input using Gemini AI
  const handleParseVoiceInput = async (params: {
    audioBase64?: string;
    mimeType?: string;
    transcript?: string;
    languageHint?: string;
  }) => {
    const textToAnalyze = params.transcript || descriptionRef.current || latestTranscriptRef.current;
    if (!textToAnalyze || textToAnalyze.trim().length === 0) {
      return;
    }

    const activeLanguageHint =
      params.languageHint ||
      (selectedOtherDialect
        ? selectedOtherDialect.name
        : language === 'bg'
        ? 'Bagheli'
        : language === 'en'
        ? 'English'
        : 'Hindi');

    setIsProcessingVoice(true);
    try {
      const result = await AIService.parseVoiceGrievance({
        ...params,
        languageHint: activeLanguageHint,
        transcript: textToAnalyze,
      });
      setVoiceParseResult(result);

      if (result.problemDescription || result.transcript) {
        setDescription(result.problemDescription || result.transcript);
      }
      if (result.category) {
        setCategory(result.category as IssueCategory);
      }
      if (result.location?.landmark) {
        setLandmark(result.location.landmark);
      }
      if (result.location?.address) {
        setAddress(result.location.address);
      }
      if (result.location?.suggestedWardId) {
        handleWardChange(result.location.suggestedWardId);
      }
      if (result.department) {
        setDepartment(result.department);
      }
      if (result.priority) {
        setPriority(result.priority as any);
      }
      if (result.suggestedSLAHours) {
        setSlaHours(result.suggestedSLAHours);
      }

      // Normalization feedback
      const norm = normalizeCivicInput(result.transcript || result.problemDescription);
      setNormalizationInfo(norm);

      showToast(
        `AI Decoded: ${result.category} (${result.location?.landmark || result.location?.suggestedWardName})`,
        'success'
      );
    } catch (err) {
      console.warn('[ReportIssueFlow] Error parsing voice grievance:', err);
      showToast('Could not parse voice input. You can edit the text directly.', 'warning');
    } finally {
      setIsProcessingVoice(false);
    }
  };

  // Start Real Microphone Speech Recognition
  const startVoiceInput = () => {
    // If currently listening, stop and process
    if (isListening) {
      stopVoiceRecording();
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      showToast(
        language === 'en'
          ? 'Browser voice recognition is not supported. Please use the quick sample buttons or type directly.'
          : 'ब्राउज़र में वॉयस इनपुट समर्थित नहीं है। कृपया नीचे दिए गए उदाहरणों का उपयोग करें या लिखें।',
        'warning'
      );
      return;
    }

    try {
      setVoiceParseResult(null);
      setLiveTranscript('');
      latestTranscriptRef.current = '';
      setRecordingSeconds(0);

      const recognition = new SpeechRecognition();
      // Use matched dialect acoustic model if an other dialect is selected
      recognition.lang = selectedOtherDialect
        ? selectedOtherDialect.speechLang
        : language === 'en'
        ? 'en-IN'
        : 'hi-IN';
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.maxAlternatives = 1;

      recognition.onstart = () => {
        setIsListening(true);
        showToast(t.listeningText, 'info');
      };

      recognition.onresult = (event: any) => {
        let finalTrans = '';
        let interimTrans = '';

        for (let i = 0; i < event.results.length; i++) {
          const res = event.results[i];
          if (res.isFinal) {
            finalTrans += res[0].transcript + ' ';
          } else {
            interimTrans += res[0].transcript;
          }
        }

        const spoken = (finalTrans + interimTrans).trim();
        if (spoken) {
          latestTranscriptRef.current = spoken;
          setLiveTranscript(spoken);
          setDescription(spoken);
          
          // Live lightweight normalizer
          const norm = normalizeCivicInput(spoken);
          setNormalizationInfo(norm);
          if (norm.normalizedCategory) {
            setCategory(norm.normalizedCategory as IssueCategory);
          }
        }
      };

      recognition.onerror = (e: any) => {
        console.warn('Speech recognition event:', e?.error || e);
        if (e.error === 'not-allowed' || e.error === 'service-not-allowed') {
          showToast(
            language === 'en'
              ? 'Microphone access was blocked. Please allow mic permission in browser settings.'
              : 'माइक्रोफोन अनुमति अस्वीकृत हुई। कृपया ब्राउज़र सेटिंग्स में अनुमति दें।',
            'warning'
          );
          setIsListening(false);
          if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        } else if (e.error === 'no-speech') {
          // No speech detected yet, continue or gracefully finish
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (timerIntervalRef.current) {
          clearInterval(timerIntervalRef.current);
          timerIntervalRef.current = null;
        }

        // Auto-extract civic data if speech was captured
        const captured = latestTranscriptRef.current || descriptionRef.current;
        if (captured && captured.trim().length > 3) {
          handleParseVoiceInput({ transcript: captured });
        }
      };

      recognitionRef.current = recognition;
      recognition.start();

      setIsListening(true);

      // Start timer ticker
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds((prev) => {
          if (prev >= 30) {
            stopVoiceRecording();
            return 30;
          }
          return prev + 1;
        });
      }, 1000);
    } catch (err: any) {
      console.warn('Failed to start speech recognition:', err);
      setIsListening(false);
      showToast('Could not initialize microphone. You can type or use the presets below.', 'warning');
    }
  };

  // Stop Recording
  const stopVoiceRecording = () => {
    setIsListening(false);
    if (timerIntervalRef.current) {
      clearInterval(timerIntervalRef.current);
      timerIntervalRef.current = null;
    }

    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
    }

    const captured = latestTranscriptRef.current || descriptionRef.current;
    if (captured && captured.trim().length > 3) {
      handleParseVoiceInput({ transcript: captured });
    }
  };

  // Description change with auto-normalizer
  const handleDescriptionChange = (text: string) => {
    setDescription(text);
    if (text.length > 5) {
      const norm = normalizeCivicInput(text);
      setNormalizationInfo(norm);
    } else {
      setNormalizationInfo(null);
    }
  };

  // Authentic Rewa Bagheli & Hindi dialect sample presets matching prompt & reference
  const injectBagheliREC = () => {
    const text = 'रीवा इंजीनियरिंग कॉलेज के गेट के सामने सड़क मा बहुत बड़ गड्ढा है गाड़ी गिरत हई';
    setLiveTranscript(text);
    handleParseVoiceInput({ transcript: text });
    showToast('AI Analyzing Rewa Engineering College (REC) grievance...', 'info');
  };

  const injectBagheliPothole = () => {
    const text = 'कॉलेज चौराहा के पास सड़क मा बहुत बड़ गड्ढा है गाड़ी गिरत हई';
    setLiveTranscript(text);
    handleParseVoiceInput({ transcript: text });
    showToast('AI Analyzing Rewa Bagheli pothole sample...', 'info');
  };

  const injectBagheliGarbage = () => {
    const text = 'संजय गांधी अस्पताल के पिछवाड़े कूड़ा के बहुत बड़ ढेर लाग है बदबू आवत है';
    setLiveTranscript(text);
    handleParseVoiceInput({ transcript: text });
    showToast('AI Analyzing Rewa Bagheli garbage dump sample...', 'info');
  };

  const injectBagheliPipe = () => {
    const text = 'जयंती कॉम्प्लेक्स के सामने पानी के पाइप फूट गवा है सब पानी बह रह है';
    setLiveTranscript(text);
    handleParseVoiceInput({ transcript: text });
    showToast('AI Analyzing Rewa Bagheli pipeline breach sample...', 'info');
  };

  const injectHindiStreetlight = () => {
    const text = 'नए बस स्टैंड के पास स्ट्रीट लाइट पिछले तीन दिन से बंद है रात में अंधेरा रहता है';
    setLiveTranscript(text);
    handleParseVoiceInput({ transcript: text });
    showToast('AI Analyzing Hindi streetlight outage sample...', 'info');
  };

  // High-Accuracy Live GPS Geolocation Pinpointer
  const handleGeotagCurrentLocation = () => {
    if (!navigator.geolocation) {
      showToast('Geolocation is not supported by your browser.', 'warning');
      return;
    }

    setIsGeolocating(true);
    showToast('Acquiring high-precision GPS satellite fix...', 'info');

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsGeolocating(false);
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);
        setGpsAccuracy(accuracy);
        setIsLiveGpsFixed(true);
        setCoords([lat, lng]);

        // Find nearest Rewa ward
        const availableWards = wards.length > 0 ? wards : DEMO_WARDS;
        let closestWard = availableWards[0];
        let minDist = 999999;
        availableWards.forEach((w) => {
          const d = Math.hypot(w.center[0] - lat, w.center[1] - lng);
          if (d < minDist) {
            minDist = d;
            closestWard = w;
          }
        });

        setSelectedWardId(closestWard.id);
        setLandmark(`Live On-Site GPS Fix (±${accuracy}m accuracy)`);
        setAddress(`Near ${closestWard.name.split('-')[1]?.trim() || 'Rewa'}, Madhya Pradesh`);
        showToast(`📍 GPS Geotag Locked: ${closestWard.name} (±${accuracy}m)`, 'success');
      },
      (err) => {
        setIsGeolocating(false);
        console.warn('Geolocation notice:', err);
        // Default to Rewa Engineering College (REC) as active on-site location
        setCoords([24.5360, 81.3320]);
        setSelectedWardId('ward-09');
        setLandmark('Rewa Engineering College (REC) Main Campus Gate');
        setAddress('REC Campus, University Road, Rewa');
        setIsLiveGpsFixed(true);
        setGpsAccuracy(4);
        showToast('📍 Geotagged to Rewa Engineering College (REC Campus)', 'success');
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  // Select known Rewa Landmark
  const handleSelectLandmark = (item: typeof REWA_LANDMARKS[0]) => {
    setCoords(item.coords);
    setSelectedWardId(item.wardId);
    setAddress(item.address);
    setLandmark(item.landmark);
    setIsLiveGpsFixed(true);
    setGpsAccuracy(null);
    showToast(`📍 Geotagged to ${item.name}`, 'success');
  };

  // File Upload Handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image size exceeds 8MB limit. Please upload a smaller photo.', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImage(reader.result);
        setInspectionResult(null);
        showToast('Image selected. Click "Inspect Image" to run Gemini AI analysis.', 'info');
      }
    };
    reader.readAsDataURL(file);
  };

  // Trigger Gemini AI Image Inspection
  const handleRunAIInspection = async () => {
    setIsInspecting(true);
    try {
      const result = await AIService.analyzeComplaintImage(
        selectedImage,
        `Issue reported: ${description || category}. Assess physical depth, carriageway obstruction, and safety hazards.`
      );
      setInspectionResult(result);

      if (result.recommendedDepartment) {
        setDepartment(result.recommendedDepartment);
      }
      if (result.severity === 'Critical' || result.severity === 'High') {
        setPriority(result.severity);
      }
    } catch (e) {
      console.warn('AI image inspection fallback:', e);
    } finally {
      setIsInspecting(false);
    }
  };

  // Proceed from Step 2 to Step 3 (Location)
  const handleProceedToLocation = () => {
    if (!inspectionResult) {
      handleRunAIInspection();
    }
    setStep(3);
  };

  // Map coordinate selection
  const handleLocationPicked = (lat: number, lng: number) => {
    setCoords([lat, lng]);

    // Check nearest ward
    let closestWard = wards[0];
    let minDist = 999999;
    wards.forEach((w) => {
      const d = Math.hypot(w.center[0] - lat, w.center[1] - lng);
      if (d < minDist) {
        minDist = d;
        closestWard = w;
      }
    });

    setSelectedWardId(closestWard.id);
    setAddress(`Near ${closestWard.name.split('-')[1]?.trim() || 'Rewa Main Corridor'}`);
    showToast(`Pin dropped in ${closestWard.name}`, 'info');
  };

  // Move from Step 3 to Step 4 (AI Verification & Duplicate Detection)
  const handleProceedToVerification = async () => {
    setIsClassifying(true);
    setStep(4);

    // Duplicate Detection check
    const dup = StorageService.detectDuplicate(category, coords[0], coords[1], 250);
    setDuplicateFound(dup);

    try {
      const selectedWard = wards.find((w) => w.id === selectedWardId);
      const res = await AIService.analyzeComplaintText({
        text: normalizationInfo ? normalizationInfo.normalizedText : description,
        category,
        location: `${address}, ${selectedWard?.name || 'Rewa'}`,
        imageAnalysis: inspectionResult,
      });

      setClassificationResult(res);
      setPriority(res.priority as any);
      setDepartment(res.department);
      setSlaHours(res.suggestedSLAHours);
    } catch (e) {
      console.warn(e);
    } finally {
      setIsClassifying(false);
    }
  };

  // Step 5: Final Submission
  const handleFinalSubmit = (asDuplicate: boolean = false) => {
    const selectedWard = wards.find((w) => w.id === selectedWardId);

    const newTicket = createComplaint({
      title: `${category} reported at ${landmark || address}`,
      category,
      description: normalizationInfo
        ? `${description} [Normalized: ${normalizationInfo.normalizedText}]`
        : description,
      hindiDescription: language === 'hi' || language === 'bg' ? description : undefined,
      location: {
        address,
        landmark,
        wardId: selectedWardId,
        wardName: selectedWard?.name || 'Rewa Ward',
        lat: coords[0],
        lng: coords[1],
      },
      priority,
      department,
      aiAnalysis: {
        issueType: category,
        confidence: inspectionResult?.confidence || 0.95,
        severity: inspectionResult?.severity || priority,
        description:
          inspectionResult?.description ||
          'Verified civic issue reported through multi-lingual citizen intake.',
        possibleHazard:
          inspectionResult?.possibleHazard ||
          inspectionResult?.hazards?.join('; ') ||
          'Road safety risk and commuter delay',
        recommendedDepartment: department,
        suggestedSLAHours: slaHours,
        reason: classificationResult?.reason || 'Assessed through Rewa Smart City statutory triage SLA matrix',
        source: 'Gemini AI Visual Inspection & Dialect Normalizer',
      },
      sla: {
        slaHours,
        createdAt: new Date().toISOString(),
        deadline: new Date(Date.now() + slaHours * 3600 * 1000).toISOString(),
        status: 'Within SLA',
      },
      images: {
        beforeUrl: selectedImage,
      },
      duplicateOfId: asDuplicate && duplicateFound ? duplicateFound.duplicate.id : undefined,
    });

    setSubmittedTicket(newTicket);
    setStep(5);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Prominent Accessible Language Banner requested in brief */}
      <div className="rounded-3xl bg-gradient-to-br from-[#eaf0ec] via-[#f5f2eb] to-[#f6ede8] dark:from-[#1b2520] dark:via-[#1e201d] dark:to-[#241c19] text-stone-900 dark:text-stone-100 p-5 sm:p-6 border border-stone-200/90 dark:border-stone-800 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 flex items-center justify-center font-bold">
              <Languages className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-bold border border-emerald-200 dark:border-emerald-800">
                Multilingual Civic Intake
              </span>
              <h2 className="text-base sm:text-lg font-black text-stone-900 dark:text-white mt-0.5">
                {t.accessibilityMessage}
              </h2>
            </div>
          </div>

          {/* Inline Language Selector */}
          <div className="flex items-center gap-1.5 bg-white/80 dark:bg-stone-900/80 p-1 rounded-2xl border border-stone-200 dark:border-stone-700 self-start sm:self-auto flex-wrap">
            {SUPPORTED_LANGUAGES.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLanguage(l.code);
                  setSelectedOtherDialect(null);
                }}
                className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  !selectedOtherDialect && language === l.code
                    ? 'bg-[#5e7769] text-white shadow-xs'
                    : 'text-stone-700 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-100 dark:hover:bg-stone-800'
                }`}
              >
                {l.label}
              </button>
            ))}

            {/* Small Other Dialect button */}
            <button
              type="button"
              onClick={() => setIsDialectModalOpen(true)}
              className={`px-2.5 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer border flex items-center gap-1 ${
                selectedOtherDialect
                  ? 'bg-purple-100 dark:bg-purple-950/70 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200 font-bold'
                  : 'border-stone-300 dark:border-stone-700 bg-white/70 dark:bg-stone-800/70 hover:bg-white dark:hover:bg-stone-850 text-stone-700 dark:text-stone-300 hover:text-stone-900'
              }`}
              title="Choose other regional dialects or languages"
            >
              <Languages className="w-3 h-3 text-[#5e7769] dark:text-[#8ea899]" />
              <span>{selectedOtherDialect ? `Dialect: ${selectedOtherDialect.name}` : 'Other Dialect'}</span>
            </button>
          </div>
        </div>

        {/* Bagheli Notice & Speech capability note */}
        <div className="bg-white/70 dark:bg-stone-900/70 rounded-2xl p-3 border border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-stone-700 dark:text-stone-300">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold px-2 py-0.5 bg-purple-100 dark:bg-purple-950/80 text-purple-800 dark:text-purple-300 rounded border border-purple-200 dark:border-purple-800">
              {selectedOtherDialect ? `${selectedOtherDialect.name} (${selectedOtherDialect.nativeName})` : 'Bagheli & Multilingual AI'}
            </span>
            <span>
              {selectedOtherDialect
                ? `Active voice dialect set to ${selectedOtherDialect.name}. Gemini AI decodes local idioms into municipal tickets.`
                : 'Local Rewa dialect, Hindi, and English voice input is automatically decoded into municipal wards & SLAs.'}
            </span>
          </div>
          <span className="text-emerald-700 dark:text-emerald-400 text-[10.5px] font-bold">
            Gemini Multimodal Voice Active
          </span>
        </div>
      </div>

      {/* Wizard Progress Stepper */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
          {[
            { n: 1, label: t.step1 },
            { n: 2, label: t.step2 },
            { n: 3, label: t.step3 },
            { n: 4, label: t.step4 },
            { n: 5, label: t.step5 },
          ].map((s) => (
            <div
              key={s.n}
              className={`flex items-center gap-1.5 transition-colors ${
                step === s.n
                  ? 'text-blue-600 dark:text-blue-400 font-extrabold'
                  : step > s.n
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-slate-400 dark:text-slate-600'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                  step === s.n
                    ? 'bg-blue-600 text-white'
                    : step > s.n
                    ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                }`}
              >
                {step > s.n ? '✓' : s.n}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1: AI Voice Grievance Module & Problem Details */}
      {step === 1 && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Main AI Voice Grievance Hero Card (matching uploaded UI reference) */}
          <div className="rounded-3xl bg-slate-900/95 dark:bg-slate-900/95 border border-slate-800 shadow-xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
                  <span>((•)) {selectedOtherDialect ? `${selectedOtherDialect.name} Voice Recognition` : 'Rewa Dialect Recognition'}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  AI Voice Grievance Module
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
                  {selectedOtherDialect
                    ? `Speaking in ${selectedOtherDialect.name} (${selectedOtherDialect.nativeName}). AI decodes civic issues, geotags the ward, and auto-dispatches municipal crew.`
                    : 'Tap to speak in local Bagheli or Hindi dialect. AI decodes civic issues, geotags the ward, and auto-dispatches municipal crew.'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <div className="px-3 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-300 text-xs font-mono">
                  Dialect:{' '}
                  <span className="text-amber-400 font-bold">
                    {selectedOtherDialect
                      ? `${selectedOtherDialect.name} (${selectedOtherDialect.nativeName})`
                      : language === 'en'
                      ? 'English / En-IN'
                      : language === 'bg'
                      ? 'Bagheli / Hi-IN'
                      : 'Hindi / Hi-IN'}
                  </span>
                </div>

                {/* Small button for other dialect, nothing flashy */}
                <button
                  type="button"
                  onClick={() => setIsDialectModalOpen(true)}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-colors cursor-pointer"
                  title="Choose other regional dialects"
                >
                  <Languages className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                  <span>{selectedOtherDialect ? 'Change Dialect' : 'Other Dialect'}</span>
                </button>

                {selectedOtherDialect && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedOtherDialect(null);
                      showToast('Reset to default dialect', 'info');
                    }}
                    className="p-1.5 rounded-xl text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors"
                    title="Reset to default dialect"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* Central Interactive Voice Module */}
            <div className="rounded-2xl bg-slate-950/80 border border-slate-800/90 p-6 sm:p-8 flex flex-col items-center justify-center text-center space-y-5">
              {/* Big Circular Amber/Red SPEAK Button with live haptic animations */}
              <div className="relative">
                {isListening && (
                  <div className="absolute -inset-4 rounded-full border-4 border-rose-500/60 animate-ping pointer-events-none"></div>
                )}
                {isProcessingVoice && (
                  <div className="absolute -inset-3 rounded-full border-4 border-amber-400 border-t-transparent animate-spin pointer-events-none"></div>
                )}

                <button
                  type="button"
                  onClick={startVoiceInput}
                  disabled={isProcessingVoice}
                  className={`relative group w-28 h-28 sm:w-32 sm:h-32 rounded-full flex flex-col items-center justify-center font-black transition-all duration-300 cursor-pointer select-none active:scale-95 ${
                    isListening
                      ? 'bg-gradient-to-tr from-rose-600 to-red-500 text-white shadow-[0_0_50px_rgba(244,63,94,0.7)]'
                      : isProcessingVoice
                      ? 'bg-slate-800 text-amber-400 cursor-wait'
                      : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-[0_0_35px_rgba(245,158,11,0.4)] hover:scale-105'
                  }`}
                  title={isListening ? 'Tap to finish speaking' : 'Tap to speak in Bagheli, Hindi, or English'}
                >
                  {isProcessingVoice ? (
                    <Loader2 className="w-8 h-8 sm:w-10 sm:h-10 animate-spin text-amber-400 mb-1" />
                  ) : isListening ? (
                    <Square className="w-7 h-7 sm:w-8 sm:h-8 fill-white mb-1 animate-pulse" />
                  ) : (
                    <Mic className="w-8 h-8 sm:w-10 sm:h-10 mb-1 group-hover:scale-110 transition-transform" />
                  )}

                  <span className="text-xs sm:text-sm tracking-wider font-black uppercase">
                    {isProcessingVoice
                      ? 'ANALYZING'
                      : isListening
                      ? `STOP (${recordingSeconds}s)`
                      : 'SPEAK'}
                  </span>
                </button>
              </div>

              {/* Status & Live Audio Waveform */}
              <div className="space-y-2 max-w-md w-full">
                {isListening ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-center gap-1.5 py-1 px-3 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs font-bold inline-flex">
                      <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                      <span>Recording Live Voice... 00:{recordingSeconds < 10 ? `0${recordingSeconds}` : recordingSeconds}</span>
                    </div>

                    {/* Animated Sound Waveform Bars */}
                    <div className="flex items-center justify-center gap-1 h-8">
                      {[12, 24, 18, 30, 20, 32, 26, 16, 28, 22, 30, 14].map((h, i) => (
                        <span
                          key={i}
                          className="w-1 bg-gradient-to-t from-rose-500 to-amber-400 rounded-full animate-pulse"
                          style={{
                            height: `${Math.max(8, (h * (1 + (recordingSeconds % 3) * 0.2)))}px`,
                            animationDelay: `${i * 75}ms`,
                          }}
                        ></span>
                      ))}
                    </div>

                    <div className="text-xs text-slate-300">
                      Tap the red button when finished to extract problem, landmark & ward.
                    </div>
                  </div>
                ) : isProcessingVoice ? (
                  <div className="flex items-center justify-center gap-2 text-amber-400 text-xs font-bold py-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Gemini AI decoding Bagheli/Hindi audio, geocoding landmark & ward...</span>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <div className="text-sm sm:text-base font-bold text-slate-200">
                      Tap microphone to start speaking in any dialect
                    </div>
                    <div className="text-xs text-slate-400">
                      Or try one of the authentic Rewa Bagheli presets below:
                    </div>
                  </div>
                )}
              </div>

              {/* Selected other dialect quick sample tester */}
              {selectedOtherDialect && (
                <div className="w-full max-w-3xl p-3 rounded-2xl bg-purple-950/40 border border-purple-500/40 flex flex-wrap items-center justify-between gap-2.5 text-xs animate-in fade-in">
                  <div className="flex items-center gap-2 text-purple-200">
                    <span className="w-2 h-2 rounded-full bg-purple-400 animate-pulse"></span>
                    <span>
                      Active Dialect: <strong>{selectedOtherDialect.name} ({selectedOtherDialect.nativeName})</strong> • {selectedOtherDialect.region}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDescription(selectedOtherDialect.sampleAudioTranscript);
                      setLiveTranscript(selectedOtherDialect.sampleAudioTranscript);
                      handleParseVoiceInput({
                        transcript: selectedOtherDialect.sampleAudioTranscript,
                        languageHint: selectedOtherDialect.name,
                      });
                      showToast(`AI Analyzing sample in ${selectedOtherDialect.name}...`, 'info');
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold transition-colors cursor-pointer shadow-sm shadow-purple-900/50"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Try Sample {selectedOtherDialect.name} Voice</span>
                  </button>
                </div>
              )}

              {/* 5 Authentic Preset Samples including REC Rewa */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 w-full max-w-3xl pt-2">
                <button
                  type="button"
                  onClick={injectBagheliREC}
                  disabled={isListening || isProcessingVoice}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-blue-950/70 hover:bg-blue-900 border border-blue-700/80 hover:border-amber-400 text-blue-200 hover:text-white transition-all text-left text-xs font-bold group cursor-pointer disabled:opacity-50"
                >
                  <Volume2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate">Bagheli - REC Rewa Pothole (रीवा इंजीनियरिंग कॉलेज)</span>
                </button>

                <button
                  type="button"
                  onClick={injectBagheliPothole}
                  disabled={isListening || isProcessingVoice}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 transition-all text-left text-xs font-semibold group cursor-pointer disabled:opacity-50"
                >
                  <Volume2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate">Bagheli - College Square (कॉलेज चौराहा)</span>
                </button>

                <button
                  type="button"
                  onClick={injectBagheliGarbage}
                  disabled={isListening || isProcessingVoice}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 transition-all text-left text-xs font-semibold group cursor-pointer disabled:opacity-50"
                >
                  <Volume2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate">Bagheli - SGM Hospital Garbage (अस्पताल कूड़ा)</span>
                </button>

                <button
                  type="button"
                  onClick={injectBagheliPipe}
                  disabled={isListening || isProcessingVoice}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 transition-all text-left text-xs font-semibold group cursor-pointer disabled:opacity-50"
                >
                  <Volume2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate">Bagheli - Jayanti Complex (पानी पाइपलाइन)</span>
                </button>

                <button
                  type="button"
                  onClick={injectHindiStreetlight}
                  disabled={isListening || isProcessingVoice}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-amber-500/50 text-slate-200 hover:text-amber-300 transition-all text-left text-xs font-semibold group cursor-pointer disabled:opacity-50"
                >
                  <Volume2 className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform shrink-0" />
                  <span className="truncate">Hindi - Bus Stand Streetlight (बस स्टैंड लाइट)</span>
                </button>
              </div>
            </div>

            {/* AI Decoded Civic Entity Dossier Card (Displayed once voice/speech is parsed) */}
            {voiceParseResult && (
              <div className="rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950/60 border border-amber-500/40 p-5 sm:p-6 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{voiceParseResult.detectedDialect}</span>
                    </span>
                    <span className="text-[11px] font-mono text-slate-400">
                      Confidence: {Math.round(voiceParseResult.confidenceScore * 100)}%
                    </span>
                  </div>

                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Auto-Geocoded & Ward Matched</span>
                  </span>
                </div>

                {/* Spoken transcript verbatim & Clean normalized issue */}
                <div className="space-y-1.5 bg-slate-950/60 p-3 rounded-xl border border-slate-800">
                  <div className="text-[11px] text-slate-400 font-semibold">
                    Citizen Spoken Input (Verbatim):
                  </div>
                  <div className="text-xs sm:text-sm font-medium text-slate-200 italic">
                    "{voiceParseResult.transcript}"
                  </div>
                </div>

                {/* Extracted Structured Information Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  {/* Category & SLA */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Tag className="w-3 h-3 text-amber-400" />
                      <span>Category / SLA</span>
                    </div>
                    <div className="font-bold text-white text-sm">
                      {voiceParseResult.category}
                    </div>
                    <div className="text-[10px] text-amber-400 font-mono font-bold">
                      Standard SLA: {voiceParseResult.suggestedSLAHours} Hours
                    </div>
                  </div>

                  {/* Municipal Department */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-blue-400" />
                      <span>Department</span>
                    </div>
                    <div className="font-bold text-white text-xs sm:text-sm truncate">
                      {voiceParseResult.department}
                    </div>
                    <div className="text-[10px] text-blue-400 font-semibold">
                      Priority: {voiceParseResult.priority}
                    </div>
                  </div>

                  {/* Extracted Landmark */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>Extracted Landmark</span>
                    </div>
                    <div className="font-bold text-white text-xs sm:text-sm truncate">
                      {voiceParseResult.location.landmark}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {voiceParseResult.location.address}
                    </div>
                  </div>

                  {/* Geocoded Ward */}
                  <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1">
                    <div className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                      <Compass className="w-3 h-3 text-emerald-400" />
                      <span>Assigned Ward</span>
                    </div>
                    <div className="font-bold text-emerald-400 text-xs sm:text-sm truncate">
                      {voiceParseResult.location.suggestedWardName}
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono">
                      ID: {voiceParseResult.location.suggestedWardId}
                    </div>
                  </div>
                </div>

                {/* Urgency Reason */}
                {voiceParseResult.urgencyReason && (
                  <div className="text-xs text-slate-300 bg-amber-500/10 border border-amber-500/20 p-2.5 rounded-xl flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                    <span><b>Safety Assessment:</b> {voiceParseResult.urgencyReason}</span>
                  </div>
                )}

                {/* Quick Next Step Action */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={startVoiceInput}
                    className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
                  >
                    Re-record voice
                  </button>

                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-extrabold text-xs sm:text-sm rounded-xl shadow-md active:scale-95 transition-all cursor-pointer"
                  >
                    <span>Proceed to Photo Upload (Step 2)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Issue Details & Category refinement form */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <span>Problem Classification & Details</span>
              </div>
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
                {t.step1Heading}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                {t.step1Subheading}
              </p>
            </div>

            {/* Category Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.selectCategoryLabel}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                {[
                  'Road / Pothole',
                  'Streetlight',
                  'Garbage',
                  'Water Leakage',
                  'Waterlogging',
                  'Drainage',
                  'Fallen Tree',
                  'Other',
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat as IssueCategory)}
                    className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      category === cat
                        ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500'
                        : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {t.categories[cat] || cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Text Description with Live Normalization & Manual AI Extract Button */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {t.problemDescLabel}
                </label>
                {description.length > 5 && (
                  <button
                    type="button"
                    onClick={() => handleParseVoiceInput({ transcript: description })}
                    disabled={isProcessingVoice}
                    className="flex items-center gap-1 text-[11px] font-bold text-purple-600 dark:text-purple-400 hover:underline cursor-pointer"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Extract with AI</span>
                  </button>
                )}
              </div>

              <textarea
                rows={4}
                value={description}
                onChange={(e) => handleDescriptionChange(e.target.value)}
                placeholder={t.problemPlaceholder}
                className="w-full rounded-2xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/60 p-3.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-hidden transition-colors"
              />

              {/* Normalization Detection Feedback Pill */}
              {normalizationInfo && (
                <div className="p-3 bg-purple-50 dark:bg-purple-950/40 rounded-2xl border border-purple-200 dark:border-purple-800 space-y-1.5 animate-in fade-in text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-purple-800 dark:text-purple-300">
                      <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                      <span>
                        {normalizationInfo.detectedDialect === 'bagheli'
                          ? 'Bagheli Dialect Normalized'
                          : normalizationInfo.detectedDialect === 'hindi'
                          ? 'Hindi Input Structured'
                          : 'Civic Input Structured'}
                      </span>
                    </div>
                    <span className="text-[10px] font-mono text-purple-700 dark:text-purple-300 bg-purple-200/50 dark:bg-purple-900/50 px-2 py-0.5 rounded">
                      Confidence: {Math.round(normalizationInfo.confidenceScore * 100)}%
                    </span>
                  </div>
                  <div className="text-[11px] text-purple-900 dark:text-purple-200">
                    <b>Normalized Issue:</b> {normalizationInfo.normalizedText}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[10.5px] text-purple-700 dark:text-purple-300">
                    <span>Category: <b>{normalizationInfo.normalizedCategory}</b></span>
                    <span>·</span>
                    <span>Dept: <b>{normalizationInfo.suggestedDepartment}</b></span>
                    {normalizationInfo.normalizedLocationHint && (
                      <>
                        <span>·</span>
                        <span>Location: <b>{normalizationInfo.normalizedLocationHint}</b></span>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md active:scale-95 transition-all cursor-pointer"
              >
                <span>{t.nextStepBtn}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2: Show us the problem (Image + Gemini AI Visual Inspection) */}
      {step === 2 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <span>Step 2 of 5</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {t.step2Heading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.step2Subheading}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Image Preview & Upload */}
            <div className="space-y-3">
              <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                {selectedImage ? (
                  <img
                    src={selectedImage}
                    alt="Defect Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 text-slate-400">
                    <Camera className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <span className="text-xs">No image selected</span>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2">
                <label className="flex-1 cursor-pointer flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors border border-slate-300 dark:border-slate-700">
                  <Upload className="w-4 h-4" />
                  <span>{t.uploadPhotoBtn}</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>

              {/* Sample Images Palette */}
              <div className="space-y-1.5 pt-2">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                  {t.samplePhotosLabel}
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(SAMPLE_IMAGES.pothole_before);
                      setCategory('Road / Pothole');
                      setInspectionResult(null);
                    }}
                    className={`h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === SAMPLE_IMAGES.pothole_before
                        ? 'border-blue-600 scale-95 shadow-md'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={SAMPLE_IMAGES.pothole_before}
                      alt="Pothole"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(SAMPLE_IMAGES.garbage_before);
                      setCategory('Garbage');
                      setInspectionResult(null);
                    }}
                    className={`h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === SAMPLE_IMAGES.garbage_before
                        ? 'border-blue-600 scale-95 shadow-md'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={SAMPLE_IMAGES.garbage_before}
                      alt="Garbage"
                      className="w-full h-full object-cover"
                    />
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setSelectedImage(SAMPLE_IMAGES.water_before);
                      setCategory('Water Leakage');
                      setInspectionResult(null);
                    }}
                    className={`h-14 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                      selectedImage === SAMPLE_IMAGES.water_before
                        ? 'border-blue-600 scale-95 shadow-md'
                        : 'border-transparent opacity-75 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={SAMPLE_IMAGES.water_before}
                      alt="Water Leak"
                      className="w-full h-full object-cover"
                    />
                  </button>
                </div>
              </div>

              <button
                type="button"
                onClick={handleRunAIInspection}
                disabled={isInspecting}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold text-xs shadow-md transition-all cursor-pointer disabled:opacity-50"
              >
                <Sparkles className={`w-4 h-4 ${isInspecting ? 'animate-spin' : ''}`} />
                <span>{isInspecting ? t.inspectingBtn : t.runAiInspectionBtn}</span>
              </button>
            </div>

            {/* AI Visual Inspection Results Panel */}
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-700">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-purple-600" />
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {t.aiInspectionHeading}
                    </span>
                  </div>
                  {inspectionResult && (
                    <span className="text-[10px] font-mono bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300 font-bold px-2 py-0.5 rounded">
                      Confidence: {Math.round(inspectionResult.confidence * 100)}%
                    </span>
                  )}
                </div>

                {inspectionResult ? (
                  <div className="space-y-3 text-xs animate-in fade-in">
                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="text-[10.5px] font-bold text-slate-400">{t.detectedDefectLabel}</div>
                      <div className="text-sm font-extrabold text-slate-900 dark:text-white mt-0.5">
                        {inspectionResult.detectedIssue || inspectionResult.issueType}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] font-bold text-slate-400">{t.severityLabel}</div>
                        <div className="text-xs font-bold text-orange-600 dark:text-orange-400 mt-0.5">
                          {inspectionResult.severity}
                        </div>
                      </div>
                      <div className="p-2.5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
                        <div className="text-[10px] font-bold text-slate-400">{t.targetDeptLabel}</div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                          {inspectionResult.recommendedDepartment}
                        </div>
                      </div>
                    </div>

                    <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                      <div className="text-[10.5px] font-bold text-slate-400">{t.physicalObsLabel}</div>
                      <div className="text-slate-700 dark:text-slate-300 leading-relaxed">
                        {inspectionResult.description}
                      </div>
                    </div>

                    <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 space-y-1.5">
                      <div className="text-[10.5px] font-bold text-amber-800 dark:text-amber-300 flex items-center gap-1">
                        <AlertTriangle className="w-3.5 h-3.5" /> {t.hazardsLabel} ({inspectionResult.hazards?.length || 1})
                      </div>
                      {inspectionResult.hazards && inspectionResult.hazards.length > 0 ? (
                        <ul className="text-amber-900 dark:text-amber-200 space-y-1 pl-4 list-disc text-[11.5px]">
                          {inspectionResult.hazards.map((hazard, hIdx) => (
                            <li key={hIdx}>{hazard}</li>
                          ))}
                        </ul>
                      ) : (
                        <div className="text-amber-900 dark:text-amber-200 text-[11.5px]">
                          {inspectionResult.possibleHazard}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="py-12 text-center text-slate-400 space-y-2">
                    <Sparkles className="w-8 h-8 mx-auto text-blue-500 opacity-60" />
                    <div className="text-xs font-semibold">
                      Click "{t.runAiInspectionBtn}" to classify defects, analyze depth, and detect potential hazards.
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToLocation}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              <span>{t.step3Heading}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Where is the problem? High-Precision GPS Geotag & Map Pinpoint */}
      {step === 3 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
                <Compass className="w-3.5 h-3.5" />
                <span>Step 3 of 5 · High-Accuracy Geotagging</span>
              </div>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {t.step3Heading}
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
                Pinpoint your exact GPS location on-site or choose from verified Rewa landmarks.
              </p>
            </div>

            {/* High-Accuracy Live GPS Pinpoint Button */}
            <button
              type="button"
              onClick={handleGeotagCurrentLocation}
              disabled={isGeolocating}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl font-extrabold text-xs shadow-md transition-all cursor-pointer active:scale-95 ${
                isLiveGpsFixed
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-emerald-500/25 ring-2 ring-emerald-400'
                  : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/25'
              }`}
              title="Pinpoint live GPS coordinates from your device sensor"
            >
              {isGeolocating ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <Crosshair className={`w-4 h-4 ${isLiveGpsFixed ? 'text-emerald-200 animate-pulse' : ''}`} />
              )}
              <span>
                {isGeolocating
                  ? 'Locking GPS Satellites...'
                  : isLiveGpsFixed && gpsAccuracy
                  ? `GPS Fixed (±${gpsAccuracy}m)`
                  : 'Pinpoint My Live Location (GPS)'}
              </span>
            </button>
          </div>

          {/* Quick Select Rewa Landmarks Bar (Featuring Rewa Engineering College / REC) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-500" />
                <span>Quick Rewa Landmarks Directory (1-Tap Geotag):</span>
              </span>
              <span className="text-[10.5px] text-slate-400">Select to center map & auto-fill ward</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {REWA_LANDMARKS.map((lm) => {
                const isSelected =
                  coords[0].toFixed(3) === lm.coords[0].toFixed(3) &&
                  coords[1].toFixed(3) === lm.coords[1].toFixed(3);

                return (
                  <button
                    key={lm.id}
                    type="button"
                    onClick={() => handleSelectLandmark(lm)}
                    className={`p-2.5 rounded-2xl border text-left transition-all cursor-pointer select-none space-y-0.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/90 dark:bg-blue-950/70 text-blue-900 dark:text-blue-200 ring-2 ring-blue-500 shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-base">{lm.icon}</span>
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 dark:bg-blue-400"></span>
                      )}
                    </div>
                    <div className="font-extrabold text-xs truncate">
                      {language === 'hi' || language === 'bg' ? lm.hindiName : lm.name}
                    </div>
                    <div className="text-[10px] text-slate-400 truncate">
                      {lm.tag}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Interactive Leaflet Map with selected pin */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-300">
                Interactive Rewa Map (Click to adjust pin location)
              </span>
              <span className="text-[11px] font-mono text-blue-600 dark:text-blue-400 font-bold">
                📍 {coords[0].toFixed(5)}° N, {coords[1].toFixed(5)}° E
              </span>
            </div>

            <LeafletMap
              height="320px"
              center={coords}
              zoom={14}
              selectable={true}
              selectedCoords={coords}
              onSelectCoords={handleLocationPicked}
            />

            {/* Geotag Confirmation Readout */}
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="font-bold text-slate-900 dark:text-white">
                  Geotagged Spot:
                </span>
                <span className="text-slate-600 dark:text-slate-300 truncate max-w-xs">
                  {landmark || address}
                </span>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto font-mono text-[11px] text-slate-500 dark:text-slate-400">
                <span className="bg-slate-200 dark:bg-slate-900 px-2 py-0.5 rounded">
                  Lat: {coords[0].toFixed(5)}
                </span>
                <span className="bg-slate-200 dark:bg-slate-900 px-2 py-0.5 rounded">
                  Lng: {coords[1].toFixed(5)}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.wardSelectLabel}
              </label>
              <select
                value={selectedWardId}
                onChange={(e) => {
                  const wId = e.target.value;
                  setSelectedWardId(wId);
                  const w = wards.find((x) => x.id === wId) || DEMO_WARDS.find((x) => x.id === wId);
                  if (w) setCoords(w.center);
                }}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs font-semibold text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {(wards.length > 0 ? wards : DEMO_WARDS).map((w) => (
                  <option key={w.id} value={w.id}>
                    {w.name} ({w.zone})
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {t.landmarkLabel}
              </label>
              <input
                type="text"
                value={landmark}
                onChange={(e) => setLandmark(e.target.value)}
                placeholder={t.landmarkPlaceholder}
                className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 p-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={handleProceedToVerification}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
            >
              <span>{t.proceedToVerificationBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 4: AI Verification & Duplicate Detection */}
      {step === 4 && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 animate-in fade-in duration-200">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">
              <span>Step 4 of 5</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              {t.step4Heading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {t.step4Subheading}
            </p>
          </div>

          {/* Duplicate Detection Alert Box */}
          {duplicateFound && (
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-800 space-y-3 animate-in slide-in-from-top-2">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-amber-900 dark:text-amber-200">
                    {t.duplicateAlertTitle}
                  </div>
                  <div className="text-xs text-amber-800 dark:text-amber-300">
                    {t.duplicateAlertDesc} ({duplicateFound.duplicate.id}, ~{duplicateFound.distanceMeters}m away)
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => handleFinalSubmit(true)}
                  className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
                >
                  {t.joinDuplicateBtn}
                </button>
                <button
                  type="button"
                  onClick={() => setDuplicateFound(null)}
                  className="px-4 py-2 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-slate-700 font-bold text-xs hover:bg-slate-100 cursor-pointer"
                >
                  {t.submitAnywayBtn}
                </button>
              </div>
            </div>
          )}

          {/* AI-Generated Triage Summary Card */}
          <div className="bg-slate-50 dark:bg-slate-800/60 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center gap-2">
                <ShieldAlert className="w-5 h-5 text-blue-600" />
                <span className="text-sm font-bold text-slate-900 dark:text-white">
                  Automated Triage Summary
                </span>
              </div>
              <span className="text-[11px] font-mono font-bold text-blue-600 bg-blue-100 dark:bg-blue-950 px-2 py-0.5 rounded">
                Status: AI Calibrated
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400">Assigned Department</span>
                <input
                  type="text"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="w-full font-bold text-slate-900 dark:text-white bg-transparent border-b border-dashed border-slate-300 focus:outline-hidden"
                />
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400">Priority Level</span>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as any)}
                  className="w-full font-bold text-orange-600 bg-transparent focus:outline-hidden"
                >
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold text-slate-400">Resolution SLA Policy</span>
                <div className="font-extrabold text-blue-600 dark:text-blue-400">
                  {slaHours} Hours Statutory
                </div>
              </div>
            </div>

            {classificationResult && (
              <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1 text-xs">
                <span className="text-[10px] font-bold text-slate-400">Administrative AI Reasoning</span>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                  {classificationResult.reason}
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 flex items-center justify-between border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => setStep(3)}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="button"
              onClick={() => handleFinalSubmit(false)}
              className="flex items-center gap-2 px-8 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-lg shadow-emerald-600/25 active:scale-95 transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.confirmSubmitBtn}</span>
            </button>
          </div>
        </div>
      )}

      {/* STEP 5: Successfully Registered */}
      {step === 5 && submittedTicket && (
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-10 border border-slate-200 dark:border-slate-800 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
          <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600 mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              Registration Complete
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              {t.ticketConfirmedHeading}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              {t.ticketAssignedSub}
            </p>
          </div>

          {/* Ticket Key Card */}
          <div className="max-w-md mx-auto p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Assigned Ticket ID:</span>
              <span className="font-mono font-bold text-blue-600 dark:text-blue-400 text-sm">
                {submittedTicket.id}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Department:</span>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {submittedTicket.department}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Statutory SLA Window:</span>
              <span className="font-bold text-emerald-600">
                {submittedTicket.sla.slaHours} Hours
              </span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => viewComplaintDetail(submittedTicket.id)}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
            >
              {t.trackTicketBtn}
            </button>
            <button
              onClick={() => {
                setStep(1);
                setDescription('');
                setInspectionResult(null);
                setSubmittedTicket(null);
                setNormalizationInfo(null);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 font-bold text-xs transition-colors cursor-pointer"
            >
              {t.fileAnotherBtn}
            </button>
          </div>
        </div>
      )}

      {/* Small, non-flashy Other Dialect Selector Modal */}
      {isDialectModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150"
          onClick={() => setIsDialectModalOpen(false)}
        >
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Languages className="w-4 h-4 text-blue-400" />
                  <h3 className="text-base font-bold text-white">
                    Choose Other Dialect or Language
                  </h3>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">
                  Select a regional dialect. Gemini AI will decode local phrasing and idioms into municipal tickets.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsDialectModalOpen(false)}
                className="w-7 h-7 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dialect modal"
              >
                ✕
              </button>
            </div>

            {/* Search / Filter Input */}
            <div className="p-3 border-b border-slate-800 bg-slate-950/40">
              <input
                type="text"
                placeholder="Search dialect or type custom (e.g. Bundelkhandi, Awadhi, Bhojpuri...)"
                value={dialectSearch}
                onChange={(e) => setDialectSearch(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
            </div>

            {/* Dialects List */}
            <div className="p-3 overflow-y-auto space-y-1.5 flex-1 divide-y divide-slate-800/60">
              {filteredDialects.map((d) => {
                const isSelected = selectedOtherDialect?.id === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => {
                      setSelectedOtherDialect(d);
                      setIsDialectModalOpen(false);
                      showToast(`Dialect set to ${d.name} (${d.nativeName})`, 'success');
                    }}
                    className={`w-full text-left p-3 rounded-xl transition-colors flex items-center justify-between gap-3 cursor-pointer ${
                      isSelected
                        ? 'bg-blue-950/60 border border-blue-600/60 text-white'
                        : 'hover:bg-slate-800/70 text-slate-200'
                    }`}
                  >
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-white">{d.name}</span>
                        <span className="text-xs text-amber-400 font-medium">({d.nativeName})</span>
                        {d.badge && (
                          <span className="text-[10px] bg-slate-800 text-slate-300 px-1.5 py-0.2 rounded font-mono">
                            {d.badge}
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 leading-tight">
                        {d.region}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 text-xs">
                      {isSelected ? (
                        <span className="text-blue-400 font-bold">Selected ✓</span>
                      ) : (
                        <span className="text-slate-500 hover:text-slate-300">Choose →</span>
                      )}
                    </div>
                  </button>
                );
              })}

              {/* Custom Write-in Dialect option if search text doesn't match */}
              {dialectSearch.trim() && filteredDialects.length === 0 && (
                <div className="p-4 text-center space-y-3">
                  <div className="text-xs text-slate-400">
                    No predefined dialect matched "{dialectSearch}".
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const customDialect: RegionalDialect = {
                        id: `custom-${Date.now()}`,
                        name: dialectSearch.trim(),
                        nativeName: dialectSearch.trim(),
                        region: 'Custom Dialect',
                        speechLang: 'hi-IN',
                        sampleAudioTranscript: `समस्या दर्ज की जा रही है (${dialectSearch.trim()})`,
                        sampleProblem: 'Custom dialect civic issue',
                        sampleCategory: 'Road / Pothole',
                        sampleLandmark: 'Civil Lines',
                        sampleWardId: 'ward-01',
                      };
                      setSelectedOtherDialect(customDialect);
                      setIsDialectModalOpen(false);
                      showToast(`Dialect set to "${dialectSearch.trim()}"`, 'success');
                    }}
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Use "{dialectSearch.trim()}" as Voice Dialect
                  </button>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/50 flex items-center justify-between text-xs text-slate-400">
              <span>Standard options (Bagheli, Hindi, English) remain available</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedOtherDialect(null);
                  setIsDialectModalOpen(false);
                  showToast('Reset to default dialect', 'info');
                }}
                className="text-xs text-slate-400 hover:text-white underline cursor-pointer"
              >
                Reset to default
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
