import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Bot, 
  Send, 
  Heart, 
  Shield, 
  Sparkles, 
  MessageCircle,
  AlertTriangle,
  CheckCircle,
  Clock,
  User,
  Star,
  Lightbulb,
  Target,
  Apple,
  Dumbbell,
  Stethoscope,
  Calendar,
  Activity,
  Camera,
  Utensils,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Languages,
  Brain
} from "lucide-react";
import { cn } from "@/lib/utils";
import { WellnessResponseGenerator } from "@/lib/wellnessResponseGenerator";
import { WellnessResponse, ResponseComponent } from "@/types/WellnessResponse";

interface AssistantMessage {
  id: string;
  type: 'assistant' | 'user';
  content: string;
  timestamp: string;
  suggestions?: string[];
  safetyLevel?: 'safe' | 'caution' | 'urgent';
  actionable?: boolean;
  structuredResponse?: WellnessResponse;
}

interface UserInfo {
  age: number | null;
  gender: string | null;
  hasHealthInfo: boolean;
}

interface UserProfile {
  name?: string;
  preferences: string[];
  healthGoals: string[];
  lastInteraction: string;
  wellnessScore: number;
}

interface WellnessAssistantProps {
  className?: string;
  onActionClick?: (action: string) => void;
}

export const WellnessAssistant: React.FC<WellnessAssistantProps> = ({ 
  className, 
  onActionClick 
}) => {
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState<'en' | 'hi' | 'gu'>('en');
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  const [userProfile] = useState<UserProfile>({
    preferences: ['period tracking', 'wellness planning'],
    healthGoals: ['better sleep', 'stress management'],
    lastInteraction: new Date().toISOString(),
    wellnessScore: 85
  });

  // Track user's health information for personalized responses
  const [userHealthInfo, setUserHealthInfo] = useState({
    age: null as number | null,
    gender: null as string | null,
    medicalHistory: [] as string[],
    hasProvidedInfo: false
  });

  // Initialize messages with professional Virtual Doctor welcome message
  const [messages, setMessages] = useState<AssistantMessage[]>(() => {
    const getWelcomeMessage = () => {
      const welcomeMessages = {
        en: "Hello! I'm WellnessWave Virtual Doctor AI Assistant 🩺✨\n\nI'm here to provide you with professional, structured health guidance tailored to your specific needs. To give you the most accurate and personalized advice, I'll need some important information about you.\n\n**Please share the following details with me:**\n\n1. **Age:** How old are you?\n2. **Gender:** What is your gender?\n3. **Current symptoms:** What specific symptoms are you experiencing?\n4. **Medical history:** Do you have any existing medical conditions, allergies, or take any medications?\n\nOnce you provide this information, I'll give you 2-3 possible conditions and step-by-step personalized advice.",
        hi: "नमस्ते! मैं वेलनेसवेव वर्चुअल डॉक्टर AI असिस्टेंट हूं 🩺✨\n\nमैं आपको व्यावसायिक, संरचित स्वास्थ्य मार्गदर्शन प्रदान करने के लिए यहां हूं। सबसे सटीक और व्यक्तिगत सलाह देने के लिए, मुझे आपके बारे में कुछ महत्वपूर्ण जानकारी चाहिए।\n\n**कृपया निम्नलिखित विवरण साझा करें:**\n\n1. **आयु:** आपकी उम्र क्या है?\n2. **लिंग:** आपका लिंग क्या है?\n3. **वर्तमान लक्षण:** आप कौन से लक्षणों का अनुभव कर रहे हैं?\n4. **चिकित्सा इतिहास:** क्या आपकी कोई मौजूदा बीमारी, एलर्जी है या कोई दवा लेते हैं?",
        gu: "નમસ્તે! હું વેલનેસવેવ વર્ચુઅલ ડૉક્ટર AI સહાયક છું 🩺✨\n\nહું તમને વ્યાવસાયિક, સંરચિત આરોગ્ય માર્ગદર્શન પ્રદાન કરવા માટે અહીં છું. સૌથી સચોટ અને વ્યક્તિગત સલાહ આપવા માટે, મને તમારા વિશે કેટલીક મહત્વપૂર્ણ માહિતીની જરૂર છે.\n\n**કૃપા કરીને નીચેની વિગતો શેર કરો:**\n\n1. **ઉંમર:** તમારી ઉંમર કેટલી છે?\n2. **લિંગ:** તમારું લિંગ શું છે?\n3. **હાલના લક્ષણો:** તમે કયા લક્ષણોનો અનુભવ કરી રહ્યા છો?\n4. **તબીબી ઇતિહાસ:** શું તમને કોઈ હાલની તબીબી સમસ્યા, એલર્જી છે અથવા કોઈ દવા લો છો?"
      };
      return welcomeMessages[selectedLanguage];
    };

    const getSuggestions = () => {
      const suggestions = {
        en: [
          "I'm a 28-year-old male with fever and cough for 3 days",
          "25-year-old female, headache and nausea, no medical history",
          "I'm 45, male, diabetic, experiencing chest discomfort",
          "32-year-old female, pregnant, having morning sickness",
          "I'm 60, female, hypertensive, feeling dizzy"
        ],
        hi: [
          "मैं 28 साल का पुरुष हूं, 3 दिन से बुखार और खांसी है",
          "25 साल की महिला, सिरदर्द और मतली, कोई चिकित्सा इतिहास नहीं",
          "मैं 45 साल का, पुरुष, मधुमेह रोगी, सीने में दर्द हो रहा है",
          "32 साल की महिला, गर्भवती, सुबह की मतली हो रही है",
          "मैं 60 साल की, महिला, उच्च रक्तचाप, चक्कर आ रहे हैं"
        ],
        gu: [
          "હું 28 વર્ષનો પુરુષ છું, 3 દિવસથી બુખાર અને ખાંસી છે",
          "25 વર્ષની મહિલા, માથાનો દુખાવો અને ઉબકા, કોઈ તબીબી ઇતિહાસ નથી",
          "હું 45 વર્ષનો, પુરુષ, ડાયાબિટિક, છાતીમાં અસ્વસ્થતા અનુભવું છું",
          "32 વર્ષની મહિલા, ગર્ભવતી, સવારની બીમારી છે",
          "હું 60 વર્ષની, મહિલા, હાઈ બ્લડ પ્રેશર, ચક્કર આવે છે"
        ]
      };
      return suggestions[selectedLanguage];
    };

    return [{
      id: '1',
      type: 'assistant',
      content: getWelcomeMessage(),
      timestamp: new Date().toISOString(),
      suggestions: getSuggestions(),
      safetyLevel: 'safe',
      actionable: true
    }];
  });

  // Initialize voice recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Initialize Speech Recognition
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'gu' ? 'gu-IN' : 'en-US';
        
        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setInputMessage(transcript);
          setIsListening(false);
        };
        
        recognitionInstance.onerror = () => {
          setIsListening(false);
        };
        
        setRecognition(recognitionInstance);
      }

      // Initialize Speech Synthesis
      if ('speechSynthesis' in window) {
        setSynthesis(window.speechSynthesis);
        
        // Load voices when they become available
        const loadVoices = () => {
          const voices = window.speechSynthesis.getVoices();
          if (voices.length > 0) {
            console.log('Available voices:', voices.map(v => ({ name: v.name, lang: v.lang })));
            
            // Log specific language voices
            const hindiVoices = voices.filter(v => v.lang.includes('hi'));
            const gujaratiVoices = voices.filter(v => v.lang.includes('gu'));
            const englishVoices = voices.filter(v => v.lang.includes('en'));
            
            console.log('Hindi voices:', hindiVoices.map(v => v.name));
            console.log('Gujarati voices:', gujaratiVoices.map(v => v.name));
            console.log('English voices:', englishVoices.map(v => v.name));
          }
        };
        
        // Load voices immediately if available
        loadVoices();
        
        // Also load when voices change
        window.speechSynthesis.onvoiceschanged = loadVoices;
        
        // Force load voices by speaking a silent utterance
        const silentUtterance = new SpeechSynthesisUtterance('');
        silentUtterance.volume = 0;
        window.speechSynthesis.speak(silentUtterance);
      }
    }
  }, [selectedLanguage]);

  // Update recognition language when language changes
  useEffect(() => {
    if (recognition) {
      recognition.lang = selectedLanguage === 'hi' ? 'hi-IN' : selectedLanguage === 'gu' ? 'gu-IN' : 'en-US';
    }
  }, [selectedLanguage, recognition]);

  // Update welcome message when language changes
  useEffect(() => {
    const getWelcomeMessage = () => {
      const welcomeMessages = {
        en: "Hello! I'm your WellnessWave AI assistant 🌊✨ I'm here to support your health and wellness journey with personalized, safe, and actionable guidance. I can help with diet & nutrition, fitness & exercise, medical assistance, doctor appointments, and wellness tracking. I support English, Hindi (हिन्दी), and Gujarati (ગુજરાતી) languages. How can I help you feel your best today?",
        hi: "नमस्ते! मैं आपका वेलनेसवेव AI असिस्टेंट हूं 🌊✨ मैं आपकी स्वास्थ्य और कल्याण यात्रा में व्यक्तिगत, सुरक्षित और कार्रवाई योग्य मार्गदर्शन के साथ सहायता के लिए यहां हूं। मैं आहार और पोषण, फिटनेस और व्यायाम, चिकित्सा सहायता, डॉक्टर की नियुक्ति और कल्याण ट्रैकिंग में मदद कर सकता हूं। मैं अंग्रेजी, हिन्दी और गुजराती भाषाओं का समर्थन करता हूं। आज आपको सबसे अच्छा महसूस कराने में मैं कैसे मदद कर सकता हूं?",
        gu: "નમસ્તે! હું તમારો વેલનેસવેવ AI સહાયક છું 🌊✨ હું તમારી આરોગ્ય અને કલ્યાણની યાત્રામાં વ્યક્તિગત, સુરક્ષિત અને ક્રિયાશીલ માર્ગદર્શન સાથે સહાય માટે અહીં છું। હું આહાર અને પોષણ, ફિટનેસ અને વ્યાયામ, તબીબી સહાય, ડૉક્ટરની નિમણૂક અને કલ્યાણ ટ્રેકિંગમાં મદદ કરી શકું છું। હું અંગ્રેજી, હિન્દી અને ગુજરાતી ભાષાઓનો સમર્થન કરું છું। આજે તમને શ્રેષ્ઠ લાગવામાં હું કેવી રીતે મદદ કરી શકું?"
      };
      return welcomeMessages[selectedLanguage];
    };

    const getSuggestions = () => {
      const suggestions = {
        en: [
          "I have a mild fever, want a low-carb lunch, and a home workout",
          "Scan this food barcode and tell me if it's healthy",
          "I want a 15-min morning workout and a breakfast for energy",
          "Track my period",
          "Plan my wellness routine", 
          "Get health insights",
          "Schedule an appointment"
        ],
        hi: [
          "मुझे बुखार है, कम कार्ब वाला लंच चाहिए, और घर पर वर्कआउट",
          "इस खाद्य बारकोड को स्कैन करें और बताएं कि यह स्वस्थ है",
          "मुझे 15 मिनट का सुबह का वर्कआउट और ऊर्जा के लिए नाश्ता चाहिए",
          "मेरा पीरियड ट्रैक करें",
          "मेरी कल्याण दिनचर्या की योजना बनाएं",
          "स्वास्थ्य अंतर्दृष्टि प्राप्त करें",
          "अपॉइंटमेंट शेड्यूल करें"
        ],
        gu: [
          "મને થોડો બુખાર છે, ઓછા કાર્બની લંચ જોઈએ, અને ઘરે વર્કઆઉટ",
          "આ ખોરાક બારકોડ સ્કેન કરો અને કહો કે તે આરોગ્યકર છે",
          "મને 15 મિનિટનો સવારનો વર્કઆઉટ અને ઊર્જા માટે નાસ્તો જોઈએ",
          "મારો પીરિયડ ટ્રેક કરો",
          "મારી કલ્યાણ દિનચર્યાની યોજના બનાવો",
          "આરોગ્ય અંતર્દૃષ્ટિ મેળવો",
          "અપોઇન્ટમેન્ટ શેડ્યૂલ કરો"
        ]
      };
      return suggestions[selectedLanguage];
    };

    // Update the first message (welcome message) when language changes
    setMessages(prev => {
      if (prev.length > 0) {
        const updatedMessages = [...prev];
        updatedMessages[0] = {
          ...updatedMessages[0],
          content: getWelcomeMessage(),
          suggestions: getSuggestions()
        };
        return updatedMessages;
      }
      return prev;
    });
  }, [selectedLanguage]);

  // Parse user information from input
  const parseUserInfo = (input: string) => {
    const ageMatch = input.match(/(\d{1,2})[-\s]*(year|yr|साल|વર્ષ)/i);
    const genderMatch = input.match(/(male|female|man|woman|boy|girl|पुरुष|महिला|પુરુષ|મહિલા)/i);
    
    return {
      age: ageMatch ? parseInt(ageMatch[1]) : null,
      gender: genderMatch ? genderMatch[1].toLowerCase() : null,
      hasHealthInfo: !!(ageMatch || genderMatch)
    };
  };

  // Generate Virtual Doctor AI responses with structured format
  const generateVirtualDoctorResponse = (userInput: string): AssistantMessage => {
    const input = userInput.toLowerCase();
    const now = new Date().toISOString();
    const userInfo = parseUserInfo(input);
    
    // Check if user has provided required information
    const hasBasicInfo = userInfo.age && userInfo.gender;
    
    if (!hasBasicInfo && !userHealthInfo.hasProvidedInfo) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: selectedLanguage === 'en' ? 
          "I need some important information to provide you with accurate medical guidance. Please share:\n\n1. **Your age**\n2. **Your gender**\n3. **Your current symptoms** (describe in detail)\n4. **Any medical history** (diabetes, hypertension, allergies, medications)\n\nFor example: 'I'm a 32-year-old female experiencing headache and nausea for 2 days. I have no medical history.'" :
          selectedLanguage === 'hi' ?
          "सटीक चिकित्सा मार्गदर्शन देने के लिए मुझे कुछ महत्वपूर्ण जानकारी चाहिए। कृपया बताएं:\n\n1. **आपकी उम्र**\n2. **आपका लिंग**\n3. **आपके वर्तमान लक्षण** (विस्तार से बताएं)\n4. **कोई चिकित्सा इतिहास** (मधुमेह, उच्च रक्तचाप, एलर्जी, दवाएं)\n\nउदाहरण: 'मैं 32 वर्षीय महिला हूं, 2 दिनों से सिरदर्द और मतली है। मेरा कोई चिकित्सा इतिहास नहीं है।'" :
          "સચોટ તબીબી માર્ગદર્શન આપવા માટે મને કેટલીક મહત્વપૂર્ણ માહિતીની જરૂર છે. કૃપા કરીને જણાવો:\n\n1. **તમારી ઉંમર**\n2. **તમારું લિંગ**\n3. **તમારા વર્તમાન લક્ષણો** (વિગતથી જણાવો)\n4. **કોઈ તબીબી ઇતિહાસ** (ડાયાબિટીસ, હાઈ બ્લડ પ્રેશર, એલર્જી, દવાઓ)\n\nઉદાહરણ: 'હું 32 વર્ષની મહિલા છું, 2 દિવસથી માથાનો દુખાવો અને ઉબકા છે. મારો કોઈ તબીબી ઇતિહાસ નથી।'",
        timestamp: now,
        safetyLevel: 'safe',
        suggestions: selectedLanguage === 'en' ? [
          'I need to share my age, gender, and symptoms',
          'Tell me what information you need'
        ] : selectedLanguage === 'hi' ? [
          'मुझे अपनी उम्र, लिंग और लक्षण बताने चाहिए',
          'बताएं आपको कौन सी जानकारी चाहिए'
        ] : [
          'મારે મારી ઉંમર, લિંગ અને લક્ષણો જણાવવા જોઈએ',
          'કહો તમને કઈ માહિતી જોઈએ'
        ]
      };
    }
    
    // Update user health info if provided
    if (userInfo.hasHealthInfo) {
      setUserHealthInfo(prev => ({
        ...prev,
        age: userInfo.age || prev.age,
        gender: userInfo.gender || prev.gender,
        hasProvidedInfo: true
      }));
    }
    
    // Emergency conditions
    if (input.includes('chest pain') || input.includes('heart attack') || input.includes('can\'t breathe') || 
        input.includes('severe pain') || input.includes('bleeding heavily') || input.includes('unconscious') ||
        input.includes('सीने में दर्द') || input.includes('दिल का दौरा') || input.includes('सांस नहीं आ रही') ||
        input.includes('છાતીમાં દુખાવો') || input.includes('હાર્ટ એટેક') || input.includes('શ્વાસ લેવામાં તકલીફ')) {
      return {
        id: Date.now().toString(),
        type: 'assistant',
        content: selectedLanguage === 'en' ? 
          "🚨 **URGENT MEDICAL EMERGENCY** 🚨\n\nBased on your symptoms, this requires **immediate medical attention**. Please:\n\n**Immediate Actions:**\n1. Call emergency services (911) RIGHT NOW\n2. Go to the nearest emergency room immediately\n3. Do not drive yourself - call an ambulance or have someone drive you\n\n⚠ This is AI-based wellness guidance. Please consult a certified doctor for confirmation." :
          selectedLanguage === 'hi' ?
          "🚨 **तत्काल चिकित्सा आपातकाल** 🚨\n\nआपके लक्षणों के आधार पर, इसके लिए **तुरंत चिकित्सा सहायता** की आवश्यकता है। कृपया:\n\n**तत्काल कार्य:**\n1. आपातकालीन सेवाओं (102) को अभी कॉल करें\n2. तुरंत निकटतम आपातकालीन कक्ष में जाएं\n3. खुद गाड़ी न चलाएं - एम्बुलेंस बुलाएं या किसी को चलाने को कहें\n\n⚠ यह AI-आधारित कल्याण मार्गदर्शन है। कृपया पुष्टि के लिए प्रमाणित डॉक्टर से सलाह लें।" :
          "🚨 **તાત્કાલિક તબીબી આપત્કાલ** 🚨\n\nતમારા લક્ષણોના આધારે, આને **તાત્કાલિક તબીબી મદદ**ની જરૂર છે. કૃપા કરીને:\n\n**તાત્કાલિક પગલાં:**\n1. આપત્તિ સેવાઓ (108) ને હમણાં જ કૉલ કરો\n2. તાત્કાલિક નજીકના આપત્તિ વિભાગમાં જાઓ\n3. પોતે ગાડી ન ચલાવો - એમ્બ્યુલન્સ બોલાવો અથવા કોઈને ચલાવવા કહો\n\n⚠ આ AI-આધારિત કલ્યાણ માર્ગદર્શન છે. કૃપા કરીને પુષ્ટિ માટે પ્રમાણિત ડૉક્ટર સાથે સલાહ લો।",
        timestamp: now,
        safetyLevel: 'urgent',
        actionable: true
      };
    }
    
    // Analyze common conditions based on symptoms
    return generateStructuredDiagnosis(input, userInfo, now);
  };
  
  // Generate structured diagnosis with format: Possible Conditions, Advice, Disclaimer
  const generateStructuredDiagnosis = (input: string, userInfo: UserInfo, timestamp: string): AssistantMessage => {
    let possibleConditions: string[] = [];
    let advice: string[] = [];
    let safetyLevel: 'safe' | 'caution' | 'urgent' = 'safe';
    
    // Fever and cough analysis
    if ((input.includes('fever') || input.includes('बुखार') || input.includes('બુખાર')) && 
        (input.includes('cough') || input.includes('खांसी') || input.includes('ખાંસી'))) {
      possibleConditions = selectedLanguage === 'en' ? 
        ['Common Cold', 'Flu (Influenza)', 'Viral Upper Respiratory Infection'] :
        selectedLanguage === 'hi' ?
        ['सामान्य सर्दी', 'फ्लू (इन्फ्लूएंजा)', 'वायरल श्वसन संक्रमण'] :
        ['સામાન્ય શરદી', 'ફ્લૂ (ઇન્ફ્લુએન્ઝા)', 'વાયરલ શ્વસન ચેપ'];
      
      advice = selectedLanguage === 'en' ? [
        'Rest for at least 7-8 hours daily and avoid strenuous activities',
        'Drink warm fluids like herbal tea, warm water with honey and lemon (8-10 glasses daily)',
        'Take paracetamol 500mg every 6 hours for fever (if no allergies)',
        'Use steam inhalation 2-3 times daily for congestion relief',
        'Gargle with warm salt water (1 tsp salt in 1 cup water) 3 times daily',
        'If fever exceeds 102°F (38.9°C) for more than 3 days or breathing difficulty occurs, consult a doctor immediately',
        userInfo.age && userInfo.age > 65 ? 'Due to your age (65+), monitor symptoms closely and consider early medical consultation' : '',
        'Maintain isolation to prevent spreading infection to others'
      ].filter(Boolean) :
      selectedLanguage === 'hi' ? [
        'दैनिक 7-8 घंटे आराम करें और कठिन गतिविधियों से बचें',
        'गर्म तरल पदार्थ जैसे हर्बल चाय, शहद-नींबू के साथ गर्म पानी पिएं (दैनिक 8-10 गिलास)',
        'बुखार के लिए पेरासिटामोल 500mg हर 6 घंटे में लें (यदि कोई एलर्जी नहीं है)',
        'कफ से राहत के लिए दिन में 2-3 बार भाप लें',
        'दिन में 3 बार गर्म नमक के पानी से गरारे करें (1 चम्मच नमक 1 कप पानी में)',
        'यदि बुखार 3 दिनों से अधिक 102°F (38.9°C) से ऊपर रहे या सांस लेने में तकलीफ हो तो तुरंत डॉक्टर से मिलें',
        userInfo.age && userInfo.age > 65 ? 'आपकी उम्र (65+) के कारण, लक्षणों पर बारीकी से नजर रखें और जल्दी चिकित्सा सलाह लें' : '',
        'संक्रमण फैलने से रोकने के लिए अलगाव बनाए रखें'
      ].filter(Boolean) : [
        'દૈનિક 7-8 કલાક આરામ કરો અને કઠિન પ્રવૃત્તિઓ ટાળો',
        'હર્બલ ટી, મધ-લીંબુ સાથે ગરમ પાણી જેવા ગરમ પ્રવાહી પીઓ (દૈનિક 8-10 ગ્લાસ)',
        'તાવ માટે પેરાસિટામોલ 500mg દર 6 કલાકે લો (જો કોઈ એલર્જી નથી)',
        'કફથી રાહત માટે દિવસમાં 2-3 વાર વરાળ લો',
        'દિવસમાં 3 વાર ગરમ મીઠાના પાણીથી ગગરા કરો (1 ચમચો મીઠું 1 કપ પાણીમાં)',
        'જો તાવ 3 દિવસથી વધુ 102°F (38.9°C)થી વધુ રહે અથવા શ્વાસ લેવામાં તકલીફ થાય તો તાત્કાલિક ડૉક્ટરને મળો',
        userInfo.age && userInfo.age > 65 ? 'તમારી ઉંમર (65+)ના કારણે, લક્ષણો પર નજીકથી ધ્યાન રાખો અને લવારે તબીબી સલાહ લો' : '',
        'ચેપ ફેલાવવાથી રોકવા માટે એકલતા જાળવો'
      ].filter(Boolean);
      safetyLevel = 'caution';
    }
    
    // Headache and nausea analysis  
    else if ((input.includes('headache') || input.includes('सिरदर्द') || input.includes('માથાનો દુખાવો')) &&
             (input.includes('nausea') || input.includes('vomit') || input.includes('मतली') || input.includes('उल्टी') || input.includes('ઉબકા') || input.includes('ઉલટી'))) {
      possibleConditions = selectedLanguage === 'en' ? 
        ['Tension Headache', 'Migraine', 'Dehydration'] :
        selectedLanguage === 'hi' ?
        ['तनाव सिरदर्द', 'माइग्रेन', 'निर्जलीकरण'] :
        ['તણાવ માથાનો દુખાવો', 'માઇગ્રેન', 'ડિહાઇડ્રેશન'];
      
      advice = selectedLanguage === 'en' ? [
        'Rest in a dark, quiet room for 30-60 minutes',
        'Apply cold compress on forehead for 15-20 minutes',
        'Drink plenty of water (at least 8-10 glasses daily) to prevent dehydration', 
        'Take paracetamol 500mg or ibuprofen 400mg (if no allergies or stomach issues)',
        'Avoid bright lights, loud noises, and strong smells',
        'If headache is severe, persistent (>24 hours), or accompanied by vision changes, seek medical attention',
        userInfo.gender === 'female' ? 'For women: headaches can be related to hormonal changes - track patterns with your menstrual cycle' : '',
        'Avoid skipping meals and maintain regular sleep schedule'
      ].filter(Boolean) :
      selectedLanguage === 'hi' ? [
        '30-60 मिनट के लिए अंधेरे, शांत कमरे में आराम करें',
        'माथे पर 15-20 मिनट के लिए ठंडी सिकाई करें',
        'निर्जलीकरण से बचने के लिए भरपूर पानी पिएं (दैनिक कम से कम 8-10 गिलास)',
        'पेरासिटामोल 500mg या इबुप्रोफेन 400mg लें (यदि कोई एलर्जी या पेट की समस्या नहीं है)',
        'तेज रोशनी, तेज आवाज और तेज गंध से बचें',
        'यदि सिरदर्द गंभीर है, लगातार (>24 घंटे) है, या आंखों की रोशनी में बदलाव के साथ है, तो चिकित्सा सहायता लें',
        userInfo.gender === 'female' ? 'महिलाओं के लिए: सिरदर्द हार्मोनल बदलाव से संबंधित हो सकता है - मासिक धर्म चक्र के साथ पैटर्न ट्रैक करें' : '',
        'भोजन न छोड़ें और नियमित नींद का समय बनाए रखें'
      ].filter(Boolean) : [
        '30-60 મિનિટ માટે અંધારા, શાંત રૂમમાં આરામ કરો',
        'કપાળ પર 15-20 મિનિટ માટે ઠંડી સિકાઈ કરો',
        'ડિહાઇડ્રેશન ટાળવા માટે ભરપૂર પાણી પીઓ (દૈનિક ઓછામાં ઓછા 8-10 ગ્લાસ)',
        'પેરાસિટામોલ 500mg અથવા આઇબુપ્રોફેન 400mg લો (જો કોઈ એલર્જી અથવા પેટની સમસ્યા નથી)',
        'તીવ્ર પ્રકાશ, મોટો અવાજ અને તીવ્ર ગંધ ટાળો',
        'જો માથાનો દુખાવો ગંભીર છે, સતત છે (>24 કલાક), અથવા દ્રષ્ટિ બદલાવ સાથે છે, તો તબીબી મદદ લો',
        userInfo.gender === 'female' ? 'સ્ત્રીઓ માટે: માથાનો દુખાવો હોર્મોનલ ફેરફારો સાથે સંબંધિત હોઈ શકે છે - માસિક ધર્મ સાથે પેટર્ન ટ્રેક કરો' : '',
        'ભોજન ન છોડો અને નિયમિત ઊંઘનું સમયપત્રક જાળવો'
      ].filter(Boolean);
      safetyLevel = 'caution';
    }
    
    // Default response if no specific condition matched
    if (possibleConditions.length === 0) {
      possibleConditions = selectedLanguage === 'en' ? 
        ['General Wellness Concern', 'Stress-related Symptoms', 'Lifestyle-related Issue'] :
        selectedLanguage === 'hi' ?
        ['सामान्य स्वास्थ्य चिंता', 'तनाव संबंधी लक्षण', 'जीवनशैली संबंधी समस्या'] :
        ['સામાન્ય કલ્યાણ ચિંતા', 'તણાવ સંબંધિત લક્ષણો', 'જીવનશૈલી સંબંધિત સમસ્યા'];
      
      advice = selectedLanguage === 'en' ? [
        'Maintain regular sleep schedule (7-8 hours daily)',
        'Follow a balanced diet with fresh fruits and vegetables',
        'Stay hydrated with 8-10 glasses of water daily',
        'Practice stress management techniques like deep breathing or meditation',
        'Monitor your symptoms and keep a health diary',
        'If symptoms persist or worsen, consult a healthcare professional',
        'Regular exercise (30 minutes daily) can improve overall health'
      ] :
      selectedLanguage === 'hi' ? [
        'नियमित नींद का समय बनाए रखें (दैनिक 7-8 घंटे)',
        'ताजे फल और सब्जियों के साथ संतुलित आहार लें',
        'दैनिक 8-10 गिलास पानी के साथ हाइड्रेटेड रहें',
        'गहरी सांस या ध्यान जैसी तनाव प्रबंधन तकनीकों का अभ्यास करें',
        'अपने लक्षणों पर नजर रखें और स्वास्थ्य डायरी रखें',
        'यदि लक्षण बने रहते हैं या बिगड़ते हैं, तो स्वास्थ्य पेशेवर से सलाह लें',
        'नियमित व्यायाम (दैनिक 30 मिनट) समग्र स्वास्थ्य में सुधार कर सकता है'
      ] : [
        'નિયમિત ઊંઘનું સમયપત્રક જાળવો (દૈનિક 7-8 કલાક)',
        'તાજા ફળો અને શાકભાજી સાથે સંતુલિત આહાર લો',
        'દૈનિક 8-10 ગ્લાસ પાણી સાથે હાઇડ્રેટેડ રહો',
        'ઊંડા શ્વાસ અથવા ધ્યાન જેવી તણાવ વ્યવસ્થાપન તકનીકોનો અભ્યાસ કરો',
        'તમારા લક્ષણો પર નજર રાખો અને આરોગ્ય ડાયરી રાખો',
        'જો લક્ષણો ચાલુ રહે અથવા બગડે, તો આરોગ્ય વ્યાવસાયિકની સલાહ લો',
        'નિયમિત કસરત (દૈનિક 30 મિનિટ) એકંદર આરોગ્યમાં સુધારો કરી શકે છે'
      ];
    }
    
    // Format the structured response
    const conditionsText = selectedLanguage === 'en' ? 
      `*Possible Conditions*\n${possibleConditions.map(c => `- ${c}`).join('\n')}` :
      selectedLanguage === 'hi' ?
      `*संभावित स्थितियां*\n${possibleConditions.map(c => `- ${c}`).join('\n')}` :
      `*સંભવિત સ્થિતિઓ*\n${possibleConditions.map(c => `- ${c}`).join('\n')}`;
    
    const adviceText = selectedLanguage === 'en' ? 
      `*Advice*\n${advice.map((a, i) => `${i + 1}. ${a}`).join('\n')}` :
      selectedLanguage === 'hi' ?
      `*सलाह*\n${advice.map((a, i) => `${i + 1}. ${a}`).join('\n')}` :
      `*સલાહ*\n${advice.map((a, i) => `${i + 1}. ${a}`).join('\n')}`;
    
    const disclaimer = selectedLanguage === 'en' ?
      '*Disclaimer*\n⚠ This is AI-based wellness guidance. Please consult a certified doctor for confirmation.' :
      selectedLanguage === 'hi' ?
      '*अस्वीकरण*\n⚠ यह AI-आधारित कल्याण मार्गदर्शन है। कृपया पुष्टि के लिए प्रमाणित डॉक्टर से सलाह लें।' :
      '*અસ્વીકરણ*\n⚠ આ AI-આધારિત કલ્યાણ માર્ગદર્શન છે. કૃપા કરીને પુષ્ટિ માટે પ્રમાણિત ડૉક્ટર સાથે સલાહ લો.';
    
    return {
      id: Date.now().toString(),
      type: 'assistant',
      content: `${conditionsText}\n\n${adviceText}\n\n${disclaimer}`,
      timestamp,
      safetyLevel,
      actionable: true,
      suggestions: selectedLanguage === 'en' ? [
        'Monitor symptoms closely',
        'Follow the advice given',
        'Consult doctor if symptoms worsen',
        'Ask for clarification'
      ] : selectedLanguage === 'hi' ? [
        'लक्षणों पर बारीकी से नजर रखें',
        'दी गई सलाह का पालन करें', 
        'यदि लक्षण बिगड़ें तो डॉक्टर से मिलें',
        'स्पष्टीकरण मांगें'
      ] : [
        'લક્ષણો પર નજીકથી ધ્યાન રાખો',
        'આપેલ સલાહનું પાલન કરો',
        'જો લક્ષણો બગડે તો ડૉક્ટરને મળો',
        'સ્પષ્ટીકરણ માંગો'
      ]
    };
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: AssistantMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate thinking time for more natural interaction
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000));

    const assistantResponse = generateVirtualDoctorResponse(inputMessage);
    setMessages(prev => [...prev, assistantResponse]);
    setIsTyping(false);
    
    // Auto-speak the response
    setTimeout(() => {
      speakText(assistantResponse.content);
    }, 1000);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInputMessage(suggestion);
    if (onActionClick) {
      onActionClick(suggestion);
    }
  };

  // Voice control functions
  const startListening = () => {
    if (recognition && !isListening) {
      setIsListening(true);
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
      setIsListening(false);
    }
  };

  const getBestVoice = (language: string) => {
    const voices = synthesis?.getVoices() || [];
    
    if (language === 'hi') {
      // Priority order for Hindi voices
      return voices.find(voice => voice.lang === 'hi-IN') ||
             voices.find(voice => voice.lang.includes('hi')) ||
             voices.find(voice => voice.name.includes('Hindi')) ||
             voices.find(voice => voice.name.includes('India')) ||
             voices.find(voice => voice.name.includes('Google')) ||
             voices[0]; // Fallback to first available voice
    } else if (language === 'gu') {
      // Priority order for Gujarati voices
      return voices.find(voice => voice.lang === 'gu-IN') ||
             voices.find(voice => voice.lang.includes('gu')) ||
             voices.find(voice => voice.name.includes('Gujarati')) ||
             voices.find(voice => voice.name.includes('India')) ||
             voices.find(voice => voice.name.includes('Google')) ||
             voices[0]; // Fallback to first available voice
    } else {
      // Priority order for English voices
      return voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Google')) ||
             voices.find(voice => voice.lang === 'en-US' && voice.name.includes('Microsoft')) ||
             voices.find(voice => voice.lang === 'en-US') ||
             voices.find(voice => voice.lang.includes('en')) ||
             voices[0]; // Fallback to first available voice
    }
  };

  const speakText = (text: string) => {
    if (synthesis && !isSpeaking) {
      setIsSpeaking(true);
      synthesis.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      const selectedVoice = getBestVoice(selectedLanguage);
      
      // Set voice if found
      if (selectedVoice) {
        utterance.voice = selectedVoice;
        console.log('Using voice:', selectedVoice.name, 'for language:', selectedLanguage);
      }
      
      // Set language and voice properties
      if (selectedLanguage === 'hi') {
        utterance.lang = 'hi-IN';
        utterance.rate = 0.7; // Slower for better Hindi pronunciation
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
      } else if (selectedLanguage === 'gu') {
        utterance.lang = 'gu-IN';
        utterance.rate = 0.7; // Slower for better Gujarati pronunciation
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
      } else {
        utterance.lang = 'en-US';
        utterance.rate = 0.9;
        utterance.pitch = 1.0;
        utterance.volume = 1.0;
      }
      
      utterance.onend = () => {
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
      };
      
      // Add a small delay to ensure voice is loaded
      setTimeout(() => {
        synthesis.speak(utterance);
      }, 100);
    }
  };

  const stopSpeaking = () => {
    if (synthesis) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Language translations
  const getTranslatedText = (key: string) => {
    const translations = {
      en: {
        welcome: "Hello! I'm your WellnessWave AI assistant 🌊✨ I'm here to support your health and wellness journey with personalized, safe, and actionable guidance. I can help with diet & nutrition, fitness & exercise, medical assistance, doctor appointments, and wellness tracking. How can I help you feel your best today?",
        placeholder: "Ask me anything about your health and wellness...",
        listening: "Listening...",
        speaking: "Speaking...",
        voice: "Voice",
        language: "Language"
      },
      hi: {
        welcome: "नमस्ते! मैं आपका वेलनेसवेव AI असिस्टेंट हूं 🌊✨ मैं आपकी स्वास्थ्य और कल्याण यात्रा में व्यक्तिगत, सुरक्षित और कार्रवाई योग्य मार्गदर्शन के साथ सहायता के लिए यहां हूं। मैं आहार और पोषण, फिटनेस और व्यायाम, चिकित्सा सहायता, डॉक्टर की नियुक्ति और कल्याण ट्रैकिंग में मदद कर सकता हूं। आज आपको सबसे अच्छा महसूस कराने में मैं कैसे मदद कर सकता हूं?",
        placeholder: "अपने स्वास्थ्य और कल्याण के बारे में कुछ भी पूछें...",
        listening: "सुन रहा हूं...",
        speaking: "बोल रहा हूं...",
        voice: "आवाज",
        language: "भाषा"
      },
      gu: {
        welcome: "નમસ્તે! હું તમારો વેલનેસવેવ AI સહાયક છું 🌊✨ હું તમારી આરોગ્ય અને કલ્યાણની યાત્રામાં વ્યક્તિગત, સુરક્ષિત અને ક્રિયાશીલ માર્ગદર્શન સાથે સહાય માટે અહીં છું। હું આહાર અને પોષણ, ફિટનેસ અને વ્યાયામ, તબીબી સહાય, ડૉક્ટરની નિમણૂક અને કલ્યાણ ટ્રેકિંગમાં મદદ કરી શકું છું। આજે તમને શ્રેષ્ઠ લાગવામાં હું કેવી રીતે મદદ કરી શકું?",
        placeholder: "તમારા આરોગ્ય અને કલ્યાણ વિશે કંઈપણ પૂછો...",
        listening: "સાંભળી રહ્યો છું...",
        speaking: "બોલી રહ્યો છું...",
        voice: "અવાજ",
        language: "ભાષા"
      }
    };
    return translations[selectedLanguage][key] || translations.en[key];
  };

  const getSafetyIcon = (level?: string) => {
    switch (level) {
      case 'urgent': return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'caution': return <Clock className="w-4 h-4 text-warning" />;
      default: return <CheckCircle className="w-4 h-4 text-success" />;
    }
  };

  const getSafetyColor = (level?: string) => {
    switch (level) {
      case 'urgent': return 'border-destructive/50 bg-destructive/5';
      case 'caution': return 'border-warning/50 bg-warning/5';
      default: return 'border-success/50 bg-success/5';
    }
  };

  // Component rendering functions
  const getComponentIcon = (type: string) => {
    switch (type) {
      case 'meal_suggestion': return <Apple className="w-4 h-4" />;
      case 'workout_plan': return <Dumbbell className="w-4 h-4" />;
      case 'medical_advice': return <Stethoscope className="w-4 h-4" />;
      case 'appointment_booking': return <Calendar className="w-4 h-4" />;
      case 'wellness_tracking': return <Activity className="w-4 h-4" />;
      case 'barcode_scan': return <Camera className="w-4 h-4" />;
      case 'nutrition_info': return <Utensils className="w-4 h-4" />;
      default: return <Target className="w-4 h-4" />;
    }
  };

  const getComponentColor = (type: string) => {
    switch (type) {
      case 'meal_suggestion': return 'bg-orange-100 text-orange-700 border-orange-200';
      case 'workout_plan': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'medical_advice': return 'bg-red-100 text-red-700 border-red-200';
      case 'appointment_booking': return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'wellness_tracking': return 'bg-green-100 text-green-700 border-green-200';
      case 'barcode_scan': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      case 'nutrition_info': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const renderStructuredComponent = (component: ResponseComponent) => {
    return (
      <div key={component.type} className="mt-3 p-3 rounded-lg border bg-card">
        <div className="flex items-center gap-2 mb-2">
          <div className={`p-1 rounded ${getComponentColor(component.type)}`}>
            {getComponentIcon(component.type)}
          </div>
          <h4 className="font-medium text-sm">{component.title}</h4>
          <Badge variant="outline" className="text-xs">
            {component.priority}
          </Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{component.description}</p>
        
        {/* Render component-specific content */}
        {component.type === 'meal_suggestion' && component.data.meals && (
          <div className="space-y-2">
            {component.data.meals.map((meal: { name: string; calories: string; prepTime: string; difficulty: string; ingredients: string[] }, index: number) => (
              <div key={index} className="p-2 bg-muted/30 rounded text-xs">
                <div className="font-medium">{meal.name}</div>
                <div className="text-muted-foreground">
                  {meal.calories} cal • {meal.prepTime} • {meal.difficulty}
                </div>
                <div className="mt-1">
                  <strong>Ingredients:</strong> {meal.ingredients.join(', ')}
                </div>
              </div>
            ))}
          </div>
        )}

        {component.type === 'workout_plan' && component.data.exercises && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              Duration: {component.data.duration} • Difficulty: {component.data.difficulty}
            </div>
            {component.data.exercises.map((exercise: { name: string; reps: string }, index: number) => (
              <div key={index} className="p-2 bg-muted/30 rounded text-xs">
                <div className="font-medium">{exercise.name}</div>
                <div className="text-muted-foreground">{exercise.reps}</div>
              </div>
            ))}
          </div>
        )}

        {component.type === 'medical_advice' && component.data.recommendations && (
          <div className="space-y-2">
            <div className="text-xs">
              <strong>Condition:</strong> {component.data.condition}
            </div>
            <div className="text-xs">
              <strong>Recommendations:</strong>
              <ul className="list-disc list-inside mt-1 space-y-1">
                {component.data.recommendations.map((rec: string, index: number) => (
                  <li key={index}>{rec}</li>
                ))}
              </ul>
            </div>
            {component.data.whenToSeekHelp && (
              <div className="text-xs text-red-600">
                <strong>Seek help if:</strong> {component.data.whenToSeekHelp}
              </div>
            )}
          </div>
        )}

        {component.type === 'barcode_scan' && component.data.product && (
          <div className="space-y-2">
            <div className="text-xs">
              <strong>Product:</strong> {component.data.product.name}
            </div>
            <div className="text-xs">
              <strong>Brand:</strong> {component.data.product.brand}
            </div>
            {component.data.product.nutritionInfo && (
              <div className="text-xs">
                <strong>Health Score:</strong> {component.data.product.nutritionInfo.healthScore}/10
              </div>
            )}
          </div>
        )}

        {component.actionable && (
          <Button size="sm" variant="outline" className="mt-2 text-xs">
            Take Action
          </Button>
        )}
      </div>
    );
  };

  return (
    <Card className={cn("shadow-soft", className)}>
      <CardHeader className="bg-gradient-to-r from-primary/5 to-accent/5">
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">WellnessWave Virtual Doctor AI</h3>
            <p className="text-sm text-muted-foreground">Professional health guidance & diagnosis</p>
          </div>
          <Badge variant="outline" className="ml-auto bg-blue/10 text-blue border-blue/20">
            <Stethoscope className="w-3 h-3 mr-1" />
            Medical AI
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="p-0">
        {/* Chat Messages */}
        <div className="h-80 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[85%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gradient-primary text-white'
                }`}>
                  {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>
                
                <div className={`p-3 rounded-2xl ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-secondary text-secondary-foreground'
                }`}>
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  
                  {/* Safety indicator for assistant messages */}
                  {message.type === 'assistant' && message.safetyLevel && (
                    <div className={cn("flex items-center gap-2 mt-2 p-2 rounded-lg text-xs", getSafetyColor(message.safetyLevel))}>
                      {getSafetyIcon(message.safetyLevel)}
                      <span className="font-medium">
                        {message.safetyLevel === 'urgent' ? 'Urgent - Seek immediate help' :
                         message.safetyLevel === 'caution' ? 'General guidance - Consult healthcare provider' :
                         'Safe for general wellness guidance'}
                      </span>
                    </div>
                  )}
                  
                  {/* Structured Response Components */}
                  {message.structuredResponse && message.structuredResponse.components && (
                    <div className="mt-3 space-y-2">
                      {message.structuredResponse.components.map((component, index) => 
                        renderStructuredComponent(component)
                      )}
                    </div>
                  )}

                  {/* Next Steps */}
                  {message.structuredResponse && message.structuredResponse.nextSteps && (
                    <div className="mt-3 p-2 bg-blue-50 rounded-lg">
                      <div className="text-xs font-medium text-blue-800 mb-1">Next Steps:</div>
                      <ul className="text-xs text-blue-700 space-y-1">
                        {message.structuredResponse.nextSteps.map((step, index) => (
                          <li key={index} className="flex items-center gap-1">
                            <span className="w-1 h-1 bg-blue-500 rounded-full"></span>
                            {step}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Suggestions */}
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {message.suggestions.map((suggestion, index) => (
                        <Button
                          key={index}
                          variant="outline"
                          size="sm"
                          className="text-xs h-7"
                          onClick={() => handleSuggestionClick(suggestion)}
                        >
                          <Sparkles className="w-3 h-3 mr-1" />
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-xs opacity-70 mt-2">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
          
          {/* Typing indicator */}
          {isTyping && (
            <div className="flex gap-2 justify-start">
              <div className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center">
                <Bot className="w-4 h-4 text-white" />
              </div>
              <div className="bg-secondary text-secondary-foreground p-3 rounded-2xl">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t p-4">
          {/* Language and Voice Controls */}
          <div className="flex items-center gap-2 mb-3">
            <div className="flex items-center gap-1">
              <Languages className="w-4 h-4" />
              <select 
                value={selectedLanguage} 
                onChange={(e) => setSelectedLanguage(e.target.value as 'en' | 'hi' | 'gu')}
                className="text-xs border rounded px-2 py-1"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="gu">ગુજરાતી</option>
              </select>
            </div>
            
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                variant={isListening ? "destructive" : "outline"}
                onClick={isListening ? stopListening : startListening}
                disabled={!recognition}
                className="text-xs"
              >
                {isListening ? <MicOff className="w-3 h-3" /> : <Mic className="w-3 h-3" />}
                {isListening ? getTranslatedText('listening') : getTranslatedText('voice')}
              </Button>
              
              {isSpeaking && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={stopSpeaking}
                  className="text-xs"
                >
                  <VolumeX className="w-3 h-3" />
                  {getTranslatedText('speaking')}
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  const testText = selectedLanguage === 'hi' ? 
                    'नमस्ते, मैं आपका स्वास्थ्य सहायक हूं' :
                    selectedLanguage === 'gu' ? 
                    'નમસ્તે, હું તમારો આરોગ્ય સહાયક છું' :
                    'Hello, I am your health assistant';
                  speakText(testText);
                }}
                className="text-xs"
                title="Test voice in selected language"
              >
                <Volume2 className="w-3 h-3" />
                Test
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder={getTranslatedText('placeholder')}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isTyping}
              variant="wellness"
              size="icon"
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
          
          {/* Safety reminder */}
          <div className="mt-3 p-2 bg-muted/30 rounded-lg">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>Remember: I provide wellness guidance only. Always consult healthcare providers for medical concerns.</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WellnessAssistant;

