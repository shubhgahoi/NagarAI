export type AppLanguage = 'en' | 'hi' | 'bg';

export interface LanguageOption {
  code: AppLanguage;
  label: string;
  subLabel?: string;
  badge?: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', label: 'English' },
  { code: 'hi', label: 'हिन्दी' },
  { code: 'bg', label: 'Bagheli', subLabel: 'बघेली', badge: 'Experimental POC' },
];

export interface CivicReportingTranslations {
  // Stepper
  step1: string;
  step2: string;
  step3: string;
  step4: string;
  step5: string;

  // Step 1: What happened
  step1Heading: string;
  step1Subheading: string;
  selectCategoryLabel: string;
  problemDescLabel: string;
  problemPlaceholder: string;
  voiceInputBtn: string;
  listeningText: string;
  quickSampleLabel: string;
  nextStepBtn: string;

  // Step 2: Photo
  step2Heading: string;
  step2Subheading: string;
  uploadPhotoBtn: string;
  samplePhotosLabel: string;
  runAiInspectionBtn: string;
  inspectingBtn: string;
  aiInspectionHeading: string;
  detectedDefectLabel: string;
  severityLabel: string;
  targetDeptLabel: string;
  physicalObsLabel: string;
  hazardsLabel: string;

  // Step 3: Location
  step3Heading: string;
  step3Subheading: string;
  wardSelectLabel: string;
  landmarkLabel: string;
  landmarkPlaceholder: string;
  addressLabel: string;
  pinHelperText: string;
  proceedToVerificationBtn: string;

  // Step 4: Verification
  step4Heading: string;
  step4Subheading: string;
  duplicateAlertTitle: string;
  duplicateAlertDesc: string;
  joinDuplicateBtn: string;
  submitAnywayBtn: string;
  confirmSubmitBtn: string;

  // Step 5: Submitted
  ticketConfirmedHeading: string;
  ticketAssignedSub: string;
  trackTicketBtn: string;
  fileAnotherBtn: string;

  // Accessibility Banner
  accessibilityMessage: string;
  bagheliNotice: string;

  // Dialect Samples
  hindiSampleText: string;
  bagheliSampleText: string;
  englishSampleText: string;

  // Categories
  categories: Record<string, string>;
}

export const TRANSLATIONS: Record<AppLanguage, CivicReportingTranslations> = {
  en: {
    step1: '1. Details',
    step2: '2. Photo & AI',
    step3: '3. Location',
    step4: '4. AI Verification',
    step5: '5. Registered',

    step1Heading: 'What happened?',
    step1Subheading: 'Select a category and explain the issue or speak using voice input.',
    selectCategoryLabel: 'Select Category',
    problemDescLabel: 'Problem Description',
    problemPlaceholder: 'e.g. Deep road cavity near TRS College signal, hazardous for two-wheelers...',
    voiceInputBtn: 'Voice Input',
    listeningText: 'Listening... speak clearly',
    quickSampleLabel: 'Quick Dialect Examples:',
    nextStepBtn: 'Next: Show us the Problem',

    step2Heading: 'Show us the problem',
    step2Subheading: 'Upload a clear defect photograph or select from sample civic photos for instant Gemini AI inspection.',
    uploadPhotoBtn: 'Upload Local Photo',
    samplePhotosLabel: 'Or choose a verified Rewa sample image:',
    runAiInspectionBtn: 'Gemini AI Inspect Image',
    inspectingBtn: 'Analyzing Defect...',
    aiInspectionHeading: 'Gemini AI Multimodal Inspection',
    detectedDefectLabel: 'Detected Defect Type',
    severityLabel: 'Calculated Severity',
    targetDeptLabel: 'Target Department',
    physicalObsLabel: 'Physical Observation',
    hazardsLabel: 'Identified Hazards',

    step3Heading: 'Pinpoint the Location in Rewa',
    step3Subheading: 'Select your municipal ward and click on the map to pin exact defect coordinates.',
    wardSelectLabel: 'Municipal Ward',
    landmarkLabel: 'Prominent Landmark',
    landmarkPlaceholder: 'e.g. Near State Bank ATM, College Chowk',
    addressLabel: 'Road or Street Name',
    pinHelperText: 'Click anywhere on the Rewa map to relocate the defect pin.',
    proceedToVerificationBtn: 'Next: Verify & Check Duplicates',

    step4Heading: 'AI Review & Statutory SLA Assignment',
    step4Subheading: 'Review automated defect classification and proximity duplicate detection before final ticket creation.',
    duplicateAlertTitle: 'Potential Duplicate Civic Report Nearby!',
    duplicateAlertDesc: 'A matching issue was registered in the same 250m vicinity. You can upvote the existing ticket or proceed with a new registration.',
    joinDuplicateBtn: 'Upvote & Track Existing Ticket (+3 pts)',
    submitAnywayBtn: 'Register as New Separate Ticket',
    confirmSubmitBtn: 'Confirm & Register Ticket (+10 pts)',

    ticketConfirmedHeading: 'Civic Complaint Registered Successfully!',
    ticketAssignedSub: 'Your ticket has been dispatched to the responsible municipal engineer.',
    trackTicketBtn: 'View Audit Trail & SLA Timeline',
    fileAnotherBtn: 'Report Another Civic Issue',

    accessibilityMessage: "Report civic problems in the language you're comfortable with.",
    bagheliNotice: 'Bagheli support — Experimental POC. Speech recognition uses dialect acoustic modeling; text fallback is always available.',

    hindiSampleText: 'मेरे मोहल्ले में सड़क पर बहुत बड़ा गड्ढा है।',
    bagheliSampleText: 'इहाँ सड़क मा बहुत बड़ा गड्ढा है।',
    englishSampleText: 'There is a severe deep pothole on the main road.',

    categories: {
      'Road / Pothole': 'Road / Pothole',
      'Streetlight': 'Streetlight',
      'Garbage': 'Garbage',
      'Water Leakage': 'Water Leakage',
      'Waterlogging': 'Waterlogging',
      'Drainage': 'Drainage',
      'Fallen Tree': 'Fallen Tree',
      'Other': 'Other',
    },
  },

  hi: {
    step1: '1. विवरण',
    step2: '2. फोटो व AI',
    step3: '3. स्थान',
    step4: '4. AI सत्यापन',
    step5: '5. दर्ज',

    step1Heading: 'क्या समस्या हुई है?',
    step1Subheading: 'समस्या की श्रेणी चुनें और विवरण लिखें या बोलकर दर्ज करें।',
    selectCategoryLabel: 'समस्या की श्रेणी चुनें',
    problemDescLabel: 'समस्या का विवरण',
    problemPlaceholder: 'जैसे: टीआरएस कॉलेज चौराहे के पास सड़क पर गहरा गड्ढा है, दोपहिया वाहनों के लिए खतरनाक...',
    voiceInputBtn: 'बोलकर दर्ज करें (वॉयस इनपुट)',
    listeningText: 'सुन रहा हूँ... कृपया बोलें',
    quickSampleLabel: 'त्वरित भाषा उदाहरण:',
    nextStepBtn: 'अगला: समस्या की फोटो दिखाएं',

    step2Heading: 'समस्या की तस्वीर दिखाएं',
    step2Subheading: 'स्पष्ट फोटो अपलोड करें या तुरंत AI विश्लेषण के लिए रीवा का नमूना चित्र चुनें।',
    uploadPhotoBtn: 'गैलरी / कैमरा से फोटो चुनें',
    samplePhotosLabel: 'या रीवा के सत्यापित नमूने से चुनें:',
    runAiInspectionBtn: 'Gemini AI विजन से जांचें',
    inspectingBtn: 'AI विश्लेषण जारी है...',
    aiInspectionHeading: 'Gemini AI मल्टीमॉडल दृश्य निरीक्षण',
    detectedDefectLabel: 'पहचाना गया दोष',
    severityLabel: 'गंभीरता स्तर',
    targetDeptLabel: 'संबंधित विभाग',
    physicalObsLabel: 'दोष का भौतिक विवरण',
    hazardsLabel: 'संभावित खतरे व जोखिम',

    step3Heading: 'रीवा में समस्या का स्थान चुनें',
    step3Subheading: 'अपना नगर निगम वार्ड चुनें और मानचित्र पर क्लिक करके सटीक स्थान पिन करें।',
    wardSelectLabel: 'नगर निगम वार्ड',
    landmarkLabel: 'प्रमुख लैंडमार्क (पहचान स्थल)',
    landmarkPlaceholder: 'जैसे: एसबीआई एटीएम के पास, कॉलेज चौराहा',
    addressLabel: 'सड़क या मोहल्ले का नाम',
    pinHelperText: 'मानचित्र पर किसी भी स्थान पर क्लिक करके पिन बदल सकते हैं।',
    proceedToVerificationBtn: 'अगला: AI सत्यापन व डुप्लीकेट जांच',

    step4Heading: 'AI समीक्षा एवं SLA समय आवंटन',
    step4Subheading: 'अंतिम टिकट दर्ज करने से पहले स्वतः श्रेणीकरण और नजदीकी डुप्लीकेट रिपोर्ट की जांच करें।',
    duplicateAlertTitle: 'नजदीक में मिलती-जुलती शिकायत पहले से दर्ज है!',
    duplicateAlertDesc: 'इसी 250 मीटर दायरे में समान समस्या पहले से मौजूद है। आप पुरानी शिकायत का समर्थन कर सकते हैं या नया टिकट बना सकते हैं।',
    joinDuplicateBtn: 'मौजूदा शिकायत का समर्थन करें (+3 अंक)',
    submitAnywayBtn: 'नया अलग टिकट दर्ज करें',
    confirmSubmitBtn: 'पुष्टि करें और टिकट दर्ज करें (+10 अंक)',

    ticketConfirmedHeading: 'नागरिक शिकायत सफलतापूर्वक दर्ज हो गई!',
    ticketAssignedSub: 'आपका टिकट संबंधित नगर निगम इंजीनियर को भेज दिया गया है।',
    trackTicketBtn: 'ऑडिट ट्रेल और SLA समय देखें',
    fileAnotherBtn: 'एक और शिकायत दर्ज करें',

    accessibilityMessage: 'अपनी सुविधानुसार किसी भी भाषा में नागरिक समस्या दर्ज करें।',
    bagheliNotice: 'बघेली समर्थन — प्रायोगिक POC। स्थानीय बोली के सामान्य शब्दों का स्वतः सामान्यीकरण किया जाता है।',

    hindiSampleText: 'मेरे मोहल्ले में सड़क पर बहुत बड़ा गड्ढा है।',
    bagheliSampleText: 'इहाँ सड़क मा बहुत बड़ा गड्ढा है।',
    englishSampleText: 'There is a severe deep pothole on the main road.',

    categories: {
      'Road / Pothole': 'सड़क / गड्ढा',
      'Streetlight': 'स्ट्रीटलाइट / अंधेरा',
      'Garbage': 'कचरा / गंदगी',
      'Water Leakage': 'पानी लीकेज / पाइप फूटना',
      'Waterlogging': 'जलभराव',
      'Drainage': 'नाली / सीवर जाम',
      'Fallen Tree': 'गिरा हुआ पेड़ / डाली',
      'Other': 'अन्य समस्या',
    },
  },

  bg: {
    step1: '1. ब्यौरा',
    step2: '2. फोटो अउर AI',
    step3: '3. जगह',
    step4: '4. AI जांच',
    step5: '5. दर्ज भा',

    step1Heading: 'का दिक्कत भै है?',
    step1Subheading: 'दिक्कत के किसिम चुना अउर बताई या बोल के दर्ज करा।',
    selectCategoryLabel: 'दिक्कत के किसिम चुना',
    problemDescLabel: 'समस्या के ब्यौरा (बघेली बोली)',
    problemPlaceholder: 'जैसे: इहाँ सड़क मा बहुत बड़ा गड्ढा है, पानी भरे से देखाई नई देत आही...',
    voiceInputBtn: 'बोल के बतावा (वॉयस इनपुट)',
    listeningText: 'सुनत अहन... बोली',
    quickSampleLabel: 'बघेली / हिन्दी बोल के देखि:',
    nextStepBtn: 'आगे: फोटो देखावा',

    step2Heading: 'दिक्कत के फोटो देखावा',
    step2Subheading: 'खराबी के साफ फोटो डारा या तुरते AI जांच खातिर रीवा के फोटो चुना।',
    uploadPhotoBtn: 'फोन से फोटो डारा',
    samplePhotosLabel: 'या रीवा के नमूना फोटो चुना:',
    runAiInspectionBtn: 'Gemini AI से फोटो जांचा',
    inspectingBtn: 'AI फोटो देखत है...',
    aiInspectionHeading: 'Gemini AI दृष्टि जांच',
    detectedDefectLabel: 'पहचाना गा दोष',
    severityLabel: 'गंभीरता के नाप',
    targetDeptLabel: 'नगर निगम विभाग',
    physicalObsLabel: 'दोष के ब्यौरा',
    hazardsLabel: 'खतरा अउर जोखिम',

    step3Heading: 'रीवा मा जगह चुना',
    step3Subheading: 'अपन वार्ड चुना अउर नक्शा मा सही जगह दबावा।',
    wardSelectLabel: 'नगर निगम वार्ड',
    landmarkLabel: 'आस-पास के जानी-मानी जगह',
    landmarkPlaceholder: 'जैसे: एसबीआई एटीएम लग, कॉलेज चौराहा',
    addressLabel: 'सड़क या मोहल्ला के नाम',
    pinHelperText: 'नक्शा मा कहूँ भी छुई के जगह बदला जाई सकत है।',
    proceedToVerificationBtn: 'आगे: AI जांच अउर डुप्लीकेट देखा',

    step4Heading: 'AI जांच अउर समय (SLA) तय करना',
    step4Subheading: 'टिकट काटे से पहिले AI से विभाग अउर पहिले से दर्ज शिकायत जांचि ल्या।',
    duplicateAlertTitle: 'इहे जगह मा अइसने शिकायत पहिले से दर्ज है!',
    duplicateAlertDesc: '250 मीटर के भीतर अइसने शिकायत दर्ज मिली है। आप उहै मा सहमति देई सकत हव या नवा टिकट कटा सकत हव।',
    joinDuplicateBtn: 'पुरानी शिकायत मा सहमति द्या (+3 अंक)',
    submitAnywayBtn: 'नवा अलग टिकट काटा',
    confirmSubmitBtn: 'पक्का करा अउर टिकट काटा (+10 अंक)',

    ticketConfirmedHeading: 'शिकायत पक्का दर्ज होइ गय!',
    ticketAssignedSub: 'राउर टिकट नगर निगम के इंजीनियर लग भेजी दीहिन गा है।',
    trackTicketBtn: 'टिकट के हाल-चाल देखा',
    fileAnotherBtn: 'अउर शिकायत दर्ज करा',

    accessibilityMessage: 'जेहने भाषा मा आराम लागै, ओहने मा अपन शिकायत दर्ज करा।',
    bagheliNotice: 'Bagheli support — Experimental POC. बघेली बोली से मानक हिन्दी/अंग्रेजी मा स्वतः सामान्यीकरण कीन जात है।',

    hindiSampleText: 'मेरे मोहल्ले में सड़क पर बहुत बड़ा गड्ढा है।',
    bagheliSampleText: 'इहाँ सड़क मा बहुत बड़ा गड्ढा है।',
    englishSampleText: 'There is a severe deep pothole on the main road.',

    categories: {
      'Road / Pothole': 'सड़क / गड्ढा',
      'Streetlight': 'बत्ती / स्ट्रीटलाइट खराब',
      'Garbage': 'कचरा / कूड़ा फैलावा',
      'Water Leakage': 'पानी के पाइप फूटब',
      'Waterlogging': 'पानी भरब (जलभराव)',
      'Drainage': 'नाली चोक',
      'Fallen Tree': 'पेड़ के डार गिरब',
      'Other': 'अउर कोनो समस्या',
    },
  },
};

/**
 * Normalizes Bagheli / Hindi dialect inputs into clean structured civic information
 */
export interface NormalizedComplaintInput {
  normalizedText: string;
  detectedDialect: 'bagheli' | 'hindi' | 'english';
  normalizedCategory: string;
  normalizedLocationHint?: string;
  suggestedDepartment: string;
  suggestedSeverity: 'Critical' | 'High' | 'Medium' | 'Low';
  confidenceScore: number;
}

export function normalizeCivicInput(rawText: string): NormalizedComplaintInput {
  const text = rawText.trim();
  const lower = text.toLowerCase();

  // Bagheli dialect tokens: इहाँ, उहाँ, मा, आही, अहइ, नई, होत, देखाई, लाग, गा, दीहिन, भै, अहन
  const bagheliTokens = ['इहाँ', 'उहाँ', 'मा', 'आही', 'अहइ', 'अहन', 'नई देत', 'होत', 'देखाई', 'भै', 'दीहिन', 'बघेली'];
  const isBagheli = bagheliTokens.some((tok) => text.includes(tok));

  let detectedDialect: 'bagheli' | 'hindi' | 'english' = 'english';
  if (isBagheli) {
    detectedDialect = 'bagheli';
  } else if (/[\u0900-\u097F]/.test(text)) {
    detectedDialect = 'hindi';
  }

  let normalizedCategory = 'Road / Pothole';
  let suggestedDepartment = 'Roads & Civil Engineering';
  let suggestedSeverity: 'Critical' | 'High' | 'Medium' | 'Low' = 'High';
  let normalizedText = text;

  // Road / Pothole normalization
  if (
    text.includes('गड्ढा') ||
    text.includes('सड़क') ||
    lower.includes('pothole') ||
    lower.includes('road') ||
    lower.includes('cavity')
  ) {
    normalizedCategory = 'Road / Pothole';
    suggestedDepartment = 'Roads & Civil Engineering';
    suggestedSeverity = 'High';
    normalizedText = text
      .replace(/इहाँ सड़क मा बहुत बड़ा गड्ढा है।?/g, 'सड़क पर अत्यधिक गहरा गड्ढा मौजूद है, जिससे वाहन दुर्घटना का गंभीर खतरा है।')
      .replace(/इहाँ सड़क मा बहुत बड़ा गड्ढा है/g, 'सड़क पर गहरा गड्ढा मौजूद है');
  }
  // Garbage / Waste normalization
  else if (
    text.includes('कचरा') ||
    text.includes('कूड़ा') ||
    text.includes('बजबजा') ||
    lower.includes('garbage') ||
    lower.includes('trash') ||
    lower.includes('waste')
  ) {
    normalizedCategory = 'Garbage';
    suggestedDepartment = 'Solid Waste Management';
    suggestedSeverity = 'Medium';
    normalizedText = text.replace(/कचरा फैल आही/g, 'कचरा सड़क पर फैल रहा है');
  }
  // Streetlight / Power normalization
  else if (
    text.includes('बत्ती') ||
    text.includes('अंधेरा') ||
    text.includes('स्ट्रीटलाइट') ||
    text.includes('लाइट') ||
    lower.includes('light') ||
    lower.includes('dark')
  ) {
    normalizedCategory = 'Streetlight';
    suggestedDepartment = 'Electrical & Street Lighting';
    suggestedSeverity = 'Medium';
  }
  // Water Leakage / Pipe normalization
  else if (
    text.includes('पाइप') ||
    text.includes('पानी बहत') ||
    text.includes('लीक') ||
    lower.includes('leak') ||
    lower.includes('water supply')
  ) {
    normalizedCategory = 'Water Leakage';
    suggestedDepartment = 'Water Supply & Sewerage';
    suggestedSeverity = 'High';
  }
  // Waterlogging / Drainage
  else if (
    text.includes('जलभराव') ||
    text.includes('पानी भरे से') ||
    text.includes('नाली') ||
    lower.includes('drain') ||
    lower.includes('waterlog')
  ) {
    normalizedCategory = 'Waterlogging';
    suggestedDepartment = 'Water Supply & Sewerage';
    suggestedSeverity = 'Critical';
  }

  // Extract location hint if mentioned
  let normalizedLocationHint = '';
  if (text.includes('इंजीनियरिंग') || text.includes('आरईसी') || lower.includes('rec') || lower.includes('engineering college')) {
    normalizedLocationHint = 'Rewa Engineering College (REC Campus)';
  } else if (text.includes('कॉलेज') || text.includes('टीआरएस') || lower.includes('trs') || lower.includes('college')) {
    normalizedLocationHint = 'College Chowk / TRS Crossing';
  } else if (text.includes('अस्पताल') || text.includes('संजय गांधी') || lower.includes('hospital')) {
    normalizedLocationHint = 'Sanjay Gandhi Hospital Zone';
  } else if (text.includes('बस स्टैंड') || lower.includes('bus stand')) {
    normalizedLocationHint = 'New Bus Stand Corridor';
  } else if (text.includes('शिल्पी') || lower.includes('shilpi')) {
    normalizedLocationHint = 'Shilpi Plaza Commercial Hub';
  } else if (text.includes('सिविल लाइन्स') || lower.includes('civil lines')) {
    normalizedLocationHint = 'Civil Lines Area';
  }

  return {
    normalizedText,
    detectedDialect,
    normalizedCategory,
    normalizedLocationHint,
    suggestedDepartment,
    suggestedSeverity,
    confidenceScore: isBagheli ? 0.92 : 0.96,
  };
}
