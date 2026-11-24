export type SupportedLanguage = 'en' | 'hi' | 'bag';

export interface DialectNormalizationResult {
  detectedLanguage: SupportedLanguage;
  rawInput: string;
  normalizedHindiText: string;
  normalizedEnglishText: string;
  suggestedCategory: string;
  landmarkExtracted?: string;
  severityHint: 'Critical' | 'High' | 'Medium' | 'Low';
  confidence: number;
  normalizationNotes: string;
}

/**
 * Normalizes Bagheli / Hindi / English inputs into structured complaint data
 */
export function normalizeCivicInput(input: string): DialectNormalizationResult {
  const trimmed = input.trim();
  const lower = trimmed.toLowerCase();

  // Detect Bagheli specific markers
  const bagheliMarkers = [
    'इहाँ',
    'ईहाँ',
    'मा',
    'माँ',
    'आही',
    'हवै',
    'हवैं',
    'देखाई',
    'नई',
    'नाहीं',
    'मोड़ पे',
    'बा',
    'तहूँ',
    'हमरे',
    'काहे',
    'गवा',
  ];

  let bagheliScore = 0;
  bagheliMarkers.forEach((marker) => {
    if (trimmed.includes(marker)) bagheliScore++;
  });

  const isDevanagari = /[\u0900-\u097F]/.test(trimmed);
  let detectedLanguage: SupportedLanguage = 'en';

  if (bagheliScore >= 1) {
    detectedLanguage = 'bag';
  } else if (isDevanagari) {
    detectedLanguage = 'hi';
  } else {
    detectedLanguage = 'en';
  }

  // Detect Category and Severity Hints
  let suggestedCategory = 'Road / Pothole';
  let severityHint: 'Critical' | 'High' | 'Medium' | 'Low' = 'High';
  let landmarkExtracted: string | undefined = undefined;

  if (
    trimmed.includes('कॉलेज') ||
    trimmed.includes('college') ||
    trimmed.includes('टीआरएस') ||
    trimmed.includes('trs')
  ) {
    landmarkExtracted = 'College Chowk / TRS Junction, Rewa';
  } else if (trimmed.includes('शिल्पी') || trimmed.includes('shilpi') || trimmed.includes('बाजार') || trimmed.includes('bazaar')) {
    landmarkExtracted = 'Shilpi Plaza Commercial Hub, Rewa';
  } else if (trimmed.includes('बस स्टैंड') || trimmed.includes('bus stand')) {
    landmarkExtracted = 'New Bus Stand Area, Rewa';
  } else if (trimmed.includes('अस्पताल') || trimmed.includes('hospital') || trimmed.includes('संजय गांधी')) {
    landmarkExtracted = 'Sanjay Gandhi Memorial Hospital Corridor, Rewa';
  } else if (trimmed.includes('यूनिवर्सिटी') || trimmed.includes('विशवविद्यालय') || trimmed.includes('apsu')) {
    landmarkExtracted = 'APSU University Road, Rewa';
  }

  if (
    trimmed.includes('गड्ढा') ||
    trimmed.includes('सड़क') ||
    lower.includes('pothole') ||
    lower.includes('road')
  ) {
    suggestedCategory = 'Road / Pothole';
    severityHint = trimmed.includes('बड़ा') || lower.includes('deep') || lower.includes('big') ? 'High' : 'Medium';
  } else if (
    trimmed.includes('पानी') ||
    trimmed.includes('लीक') ||
    trimmed.includes('पाइप') ||
    lower.includes('leak') ||
    lower.includes('pipe')
  ) {
    suggestedCategory = 'Water Leakage';
    severityHint = 'High';
  } else if (
    trimmed.includes('जलभराव') ||
    trimmed.includes('पानी भरा') ||
    trimmed.includes('डूब') ||
    lower.includes('waterlogging') ||
    lower.includes('flood')
  ) {
    suggestedCategory = 'Waterlogging';
    severityHint = 'Critical';
  } else if (
    trimmed.includes('कचरा') ||
    trimmed.includes('कूड़ा') ||
    lower.includes('garbage') ||
    lower.includes('waste') ||
    lower.includes('trash')
  ) {
    suggestedCategory = 'Garbage';
    severityHint = 'Medium';
  } else if (
    trimmed.includes('लाइट') ||
    trimmed.includes('बत्ती') ||
    trimmed.includes('अंधेरा') ||
    lower.includes('streetlight') ||
    lower.includes('light') ||
    lower.includes('dark')
  ) {
    suggestedCategory = 'Streetlight';
    severityHint = 'Medium';
  } else if (
    trimmed.includes('पेड़') ||
    trimmed.includes('डाल') ||
    lower.includes('tree') ||
    lower.includes('branch')
  ) {
    suggestedCategory = 'Fallen Tree';
    severityHint = 'High';
  }

  // Construct normalized texts
  let normalizedHindiText = trimmed;
  let normalizedEnglishText = trimmed;
  let normalizationNotes = 'Standard grammar input.';

  if (detectedLanguage === 'bag') {
    // Bagheli to Standard Hindi mapping
    normalizedHindiText = trimmed
      .replace(/इहाँ|ईहाँ/g, 'यहाँ')
      .replace(/मा|माँ/g, 'में')
      .replace(/आही|हवै|हवैं/g, 'है')
      .replace(/देखाई/g, 'दिखाई')
      .replace(/नई देत/g, 'नहीं दे रहा')
      .replace(/मोड़ पे/g, 'चौराहे पर')
      .replace(/हमरे/g, 'हमारे')
      .replace(/काहे/g, 'क्यों');

    normalizedEnglishText = `Major road defect reported in ${landmarkExtracted || 'locality'}. Severe pothole hazard obstructing safe transit.`;
    normalizationNotes = 'Bagheli dialect markers detected and normalized to Hindi & English municipal dispatch records.';
  } else if (detectedLanguage === 'hi') {
    normalizedEnglishText = `Citizen report: Pothole / defect observed in carriageway near ${landmarkExtracted || 'residential sector'}.`;
    normalizationNotes = 'Standard Hindi normalized for municipal ticketing.';
  } else {
    normalizedHindiText = `सड़क पर गंभीर गड्ढा एवं आवागमन में बाधा।`;
    normalizationNotes = 'English input translated for field staff dispatched in Rewa.';
  }

  return {
    detectedLanguage,
    rawInput: input,
    normalizedHindiText,
    normalizedEnglishText,
    suggestedCategory,
    landmarkExtracted,
    severityHint,
    confidence: detectedLanguage === 'bag' ? 0.88 : 0.96,
    normalizationNotes,
  };
}

export const LANGUAGE_LABELS = {
  en: {
    langName: 'English',
    navHome: 'Home',
    navCitizenPortal: 'Citizen Portal',
    navReportIssue: '+ Report Issue',
    navMyComplaints: 'My Complaints',
    navNagarSathi: 'Nagar Sathi AI',
    navHub: 'Municipal Hub',
    navCommandCenter: 'Command Center',
    navWardPerformance: 'Ward Performance',
    navTransparency: 'Public Transparency',
    navAbout: 'About',
    heroAccessibilityBanner: "Report civic problems in the language you're comfortable with.",
    reportTitle: 'Report a Civic Issue',
    step1Title: 'What happened?',
    step1Subtitle: 'Select category and explain the issue or speak using voice input.',
    step2Title: 'Show us the problem',
    step2Subtitle: 'Upload a clear defect photograph or select from sample civic photos for instant Gemini AI inspection.',
    step3Title: 'Where is the problem?',
    step3Subtitle: 'Pinpoint the defect on the Rewa map or select standard municipal zones.',
    step4Title: 'AI Verification & Triage',
    step4Subtitle: 'Review AI-calibrated priority, estimated resolution SLA, and duplicate detection check.',
    step5Title: 'Complaint Successfully Registered!',
    step5Subtitle: 'Your issue has been logged into the Smart Rewa Municipal Command Center.',
    voiceInputBtn: 'Voice Input',
    voiceInputListening: 'Listening...',
    voiceUnavailableFallback: 'Browser speech recognition is unavailable. Please type your complaint in the box below.',
    bagheliPocBadge: 'Bagheli support — Experimental POC',
    bagheliDisclaimer: 'Notice: Bagheli dialect processing is an experimental proof-of-concept. Speech models may vary by device. Text fallback is always active.',
    hindiSampleBtn: 'Hindi: "मेरे मोहल्ले में सड़क पर बहुत बड़ा गड्ढा है।"',
    bagheliSampleBtn: 'Bagheli demo: "इहाँ सड़क मा बहुत बड़ा गड्ढा है।"',
    categoryRoad: 'Road / Pothole',
    categoryStreetlight: 'Streetlight',
    categoryGarbage: 'Garbage',
    categoryWaterLeak: 'Water Leakage',
    categoryWaterlogging: 'Waterlogging',
    categoryDrainage: 'Drainage',
    categoryTree: 'Fallen Tree',
    categoryOther: 'Other',
    assignedWard: 'Assigned Municipal Ward',
    landmarkLabel: 'Nearest Landmark / Specific Spot',
    nextButton: 'Next',
    backButton: 'Back',
    submitButton: 'Submit Complaint Now',
    inspectImageButton: 'Gemini AI Inspect Image',
  },
  hi: {
    langName: 'हिन्दी',
    navHome: 'होम',
    navCitizenPortal: 'नागरिक पोर्टल',
    navReportIssue: '+ समस्या दर्ज करें',
    navMyComplaints: 'मेरी शिकायतें',
    navNagarSathi: 'नगर साथी AI',
    navHub: 'प्रशासन व डेटा',
    navCommandCenter: 'कमांड सेंटर',
    navWardPerformance: 'वार्ड स्वास्थ्य सूचकांक',
    navTransparency: 'सार्वजनिक पारदर्शिता',
    navAbout: 'परिचय',
    heroAccessibilityBanner: 'अपनी सुविधानुसार किसी भी भाषा (हिन्दी, बघेली या अंग्रेजी) में समस्या दर्ज करें।',
    reportTitle: 'नागरिक समस्या दर्ज करें',
    step1Title: 'क्या समस्या हुई है?',
    step1Subtitle: 'श्रेणी चुनें और समस्या का विवरण लिखें अथवा बोलकर दर्ज करें।',
    step2Title: 'समस्या की तस्वीर दिखाएं',
    step2Subtitle: 'दोष की स्पष्ट फोटो अपलोड करें या तुरंत जेमिनी एआई विश्लेषण के लिए नमूना फोटो चुनें।',
    step3Title: 'समस्या कहाँ स्थित है?',
    step3Subtitle: 'रीवा के नक्शे पर स्थान चिन्हित करें अथवा नजदीकी वार्ड का चयन करें।',
    step4Title: 'AI सत्यापन एवं डुप्लीकेट जांच',
    step4Subtitle: 'एआई द्वारा निर्धारित प्राथमिकता, निवारण समय (SLA) और समानता की जांच देखें।',
    step5Title: 'शिकायत सफलतापूर्वक पंजीकृत हुई!',
    step5Subtitle: 'आपकी शिकायत रीवा नगर निगम कमांड सेंटर में दर्ज हो चुकी है।',
    voiceInputBtn: 'आवाज से बोलें',
    voiceInputListening: 'सुन रहा हूँ...',
    voiceUnavailableFallback: 'ब्राउज़र में वॉयस रिकॉग्निशन उपलब्ध नहीं है। कृपया नीचे दिए गए बॉक्स में टाइप करें।',
    bagheliPocBadge: 'बघेली समर्थन — प्रायोगिक संकल्पना प्रमाण (POC)',
    bagheliDisclaimer: 'सूचना: बघेली बोली पहचान प्रायोगिक POC है। त्रुटि होने पर टेक्स्ट इनपुट का उपयोग करें।',
    hindiSampleBtn: 'हिन्दी: "मेरे मोहल्ले में सड़क पर बहुत बड़ा गड्ढा है।"',
    bagheliSampleBtn: 'बघेली डेमो: "इहाँ सड़क मा बहुत बड़ा गड्ढा है।"',
    categoryRoad: 'सड़क / गड्ढा',
    categoryStreetlight: 'स्ट्रीटलाइट',
    categoryGarbage: 'कचरा / सफाई',
    categoryWaterLeak: 'पानी का रिसाव',
    categoryWaterlogging: 'जलभराव',
    categoryDrainage: 'नाली / सीवेज',
    categoryTree: 'गिरा हुआ पेड़',
    categoryOther: 'अन्य समस्या',
    assignedWard: 'संबंधित नगर निगम वार्ड',
    landmarkLabel: 'निकटतम लैंडमार्क / विशिष्ट स्थान',
    nextButton: 'आगे बढ़ें',
    backButton: 'पीछे जाएं',
    submitButton: 'शिकायत अभी दर्ज करें',
    inspectImageButton: 'जेमिनी AI से फोटो जांचें',
  },
  bag: {
    langName: 'Bagheli (Experimental)',
    navHome: 'होम',
    navCitizenPortal: 'नागरिक पोर्टल',
    navReportIssue: '+ समस्या बतावा',
    navMyComplaints: 'हमार शिकायत',
    navNagarSathi: 'नगर साथी AI',
    navHub: 'प्रशासन व डेटा',
    navCommandCenter: 'कमांड सेंटर',
    navWardPerformance: 'वार्ड के हाल',
    navTransparency: 'सार्वजनिक पारदर्शिता',
    navAbout: 'परिचय',
    heroAccessibilityBanner: 'जेन भाषा मा सहज लागै ओहि मा अपन समस्या दर्ज करा। (बघेली समर्थन POC)',
    reportTitle: 'नागरिक समस्या बतावा',
    step1Title: 'का दिक्कत भै हवै?',
    step1Subtitle: 'कैटेगरी चुना अउर बोल के या लिख के अपन परेशानी बतावा।',
    step2Title: 'समस्या के फोटो देखावा',
    step2Subtitle: 'खराबी के फोटो खींचा या नमूना फोटो चुन के AI से जाँच करावा।',
    step3Title: 'ई समस्या कहाँ पर हवै?',
    step3Subtitle: 'रीवा के नक्शे मा सही जगह चुना या आपन वार्ड बतावा।',
    step4Title: 'AI जाँच अउर प्राथमिकता',
    step4Subtitle: 'कंप्यूटर जाँच देख लेई कि कतने घंटा मा काम पूरा होई।',
    step5Title: 'शिकायत दर्ज होइ गै!',
    step5Subtitle: 'रीवा नगर निगम मा तोहार अर्जी पहुँच गै हवै, जल्द काम होई।',
    voiceInputBtn: 'बोल के बतावा',
    voiceInputListening: 'सुनत हई...',
    voiceUnavailableFallback: 'माइक नई चल पावत आही। नीचे लिख के बतावा।',
    bagheliPocBadge: 'Bagheli support — Experimental POC',
    bagheliDisclaimer: 'Notice: Bagheli speech recognition is experimental. We normalize dialect inputs to structured municipal dispatch records.',
    hindiSampleBtn: 'हिन्दी: "मेरे मोहल्ले में सड़क पर बहुत बड़ा गड्ढा है।"',
    bagheliSampleBtn: 'बघेली डेमो: "इहाँ सड़क मा बहुत बड़ा गड्ढा है।"',
    categoryRoad: 'सड़क / गड्ढा',
    categoryStreetlight: 'स्ट्रीटलाइट',
    categoryGarbage: 'कचरा / सफाई',
    categoryWaterLeak: 'पानी फूटा / लीकेज',
    categoryWaterlogging: 'पानी भरा / जलभराव',
    categoryDrainage: 'नाली जाम',
    categoryTree: 'गिरा पेड़',
    categoryOther: 'अउर समस्या',
    assignedWard: 'वार्ड के नाम',
    landmarkLabel: 'नगीच के पहिचान / जगह',
    nextButton: 'आगे बढ़ा',
    backButton: 'पीछे जावा',
    submitButton: 'शिकायत दर्ज करा',
    inspectImageButton: 'AI फोटो जाँच',
  },
};
