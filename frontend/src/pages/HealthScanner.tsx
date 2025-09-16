import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Stethoscope, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Send,
  Bot,
  User,
  Shield,
  Heart,
  Sparkles,
  Lightbulb,
  Thermometer,
  Activity,
  Headphones,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  TrendingUp,
  Droplets,
  Zap
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUserContext } from "@/hooks/useUserContext";
import SafetyGuidelines from "@/components/SafetyGuidelines";
import { cn } from "@/lib/utils";

interface ScanResult {
  severity: 'Low' | 'Medium' | 'High' | 'Urgent';
  suggested_action: string;
  confidence: number;
  timestamp: string;
}

interface ChatMessage {
  id: string;
  type: 'user' | 'bot';
  content: string;
  timestamp: string;
}

interface HealthMetrics {
  temperature: number;
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  bloodSugar: number;
  timestamp: string;
}

interface HealthMetricsHistory {
  date: string;
  temperature: number;
  heartRate: number;
  bloodPressure: { systolic: number; diastolic: number };
  bloodSugar: number;
}

export default function HealthScanner() {
  const { addSymptom, preferences, getPersonalizedGreeting } = useUserContext();
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState(preferences.age?.toString() || '');
  const [gender, setGender] = useState(preferences.gender || '');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [personalizedGreeting, setPersonalizedGreeting] = useState('');
  
  // Health Metrics State
  const [healthMetrics, setHealthMetrics] = useState<HealthMetrics>({
    temperature: 98.6,
    heartRate: 72,
    bloodPressure: { systolic: 120, diastolic: 80 },
    bloodSugar: 100,
    timestamp: new Date().toISOString()
  });
  
  const [healthMetricsHistory, setHealthMetricsHistory] = useState<HealthMetricsHistory[]>([
    { date: '2024-01-15', temperature: 98.6, heartRate: 72, bloodPressure: { systolic: 120, diastolic: 80 }, bloodSugar: 100 },
    { date: '2024-01-14', temperature: 98.4, heartRate: 75, bloodPressure: { systolic: 118, diastolic: 78 }, bloodSugar: 95 },
    { date: '2024-01-13', temperature: 98.8, heartRate: 68, bloodPressure: { systolic: 122, diastolic: 82 }, bloodSugar: 105 },
    { date: '2024-01-12', temperature: 98.2, heartRate: 70, bloodPressure: { systolic: 115, diastolic: 75 }, bloodSugar: 90 },
    { date: '2024-01-11', temperature: 98.5, heartRate: 74, bloodPressure: { systolic: 125, diastolic: 85 }, bloodSugar: 110 },
    { date: '2024-01-10', temperature: 98.3, heartRate: 69, bloodPressure: { systolic: 119, diastolic: 79 }, bloodSugar: 98 },
    { date: '2024-01-09', temperature: 98.7, heartRate: 76, bloodPressure: { systolic: 128, diastolic: 88 }, bloodSugar: 115 }
  ]);
  
  // Voice and Language State
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);
  const [synthesis, setSynthesis] = useState<SpeechSynthesis | null>(null);
  
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your WellnessWave AI health assistant! 🌊✨ I\'m here to help you understand your symptoms with care and compassion. Please describe what you\'re experiencing, and I\'ll provide gentle guidance. Remember, I\'m here to support you, but always consult healthcare providers for medical concerns! 💚',
      timestamp: new Date().toISOString()
    }
  ]);

  useEffect(() => {
    setPersonalizedGreeting(getPersonalizedGreeting());
  }, [getPersonalizedGreeting]);

  // Initialize voice recognition and synthesis
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognitionInstance = new SpeechRecognition();
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage === 'hi' ? 'hi-IN' : 'gu-IN';
        
        recognitionInstance.onstart = () => setIsListening(true);
        recognitionInstance.onend = () => setIsListening(false);
        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          setSymptoms(prev => prev + (prev ? ' ' : '') + transcript);
        };
        
        setRecognition(recognitionInstance);
      }
      
      if ('speechSynthesis' in window) {
        setSynthesis(window.speechSynthesis);
      }
    }
  }, [selectedLanguage]);

  // Voice functions
  const startListening = () => {
    if (recognition && !isListening) {
      recognition.start();
    }
  };

  const stopListening = () => {
    if (recognition && isListening) {
      recognition.stop();
    }
  };

  const speakText = (text: string) => {
    if (synthesis && !isSpeaking) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = selectedLanguage === 'en' ? 'en-US' : selectedLanguage === 'hi' ? 'hi-IN' : 'gu-IN';
      utterance.rate = selectedLanguage === 'en' ? 1 : 0.8;
      utterance.pitch = selectedLanguage === 'en' ? 1 : 0.9;
      
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      synthesis.speak(utterance);
    }
  };

  const stopSpeaking = () => {
    if (synthesis && isSpeaking) {
      synthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Health metrics analysis
  const analyzeHealthMetrics = () => {
    const { temperature, heartRate, bloodPressure, bloodSugar } = healthMetrics;
    let riskLevel = '🟢 Normal';
    const suggestions: string[] = [];
    
    // Temperature analysis
    if (temperature > 100.4) {
      riskLevel = '🔴 High';
      suggestions.push('High fever detected. Consider consulting a healthcare provider.');
    } else if (temperature > 99.5) {
      riskLevel = '🟡 Caution';
      suggestions.push('Slightly elevated temperature. Monitor closely.');
    }
    
    // Heart rate analysis
    if (heartRate > 100 || heartRate < 60) {
      if (riskLevel === '🟢 Normal') riskLevel = '🟡 Caution';
      suggestions.push('Heart rate outside normal range. Consider medical evaluation.');
    }
    
    // Blood pressure analysis
    if (bloodPressure.systolic > 140 || bloodPressure.diastolic > 90) {
      riskLevel = '🔴 High';
      suggestions.push('High blood pressure detected. Seek medical attention.');
    } else if (bloodPressure.systolic > 130 || bloodPressure.diastolic > 85) {
      if (riskLevel === '🟢 Normal') riskLevel = '🟡 Caution';
      suggestions.push('Elevated blood pressure. Monitor and consider lifestyle changes.');
    }
    
    // Blood sugar analysis
    if (bloodSugar > 140) {
      riskLevel = '🔴 High';
      suggestions.push('High blood sugar detected. Consult healthcare provider.');
    } else if (bloodSugar > 100) {
      if (riskLevel === '🟢 Normal') riskLevel = '🟡 Caution';
      suggestions.push('Elevated blood sugar. Consider dietary changes.');
    }
    
    return { riskLevel, suggestions };
  };

  // Enhanced AI analysis with multi-language support
  const analyzeSymptoms = async () => {
    setIsLoading(true);
    
    // Add user message to chat
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: `Symptoms: ${symptoms}, Age: ${age}, Gender: ${gender}`,
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, userMessage]);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Enhanced analysis logic with multi-language support
    let severity: ScanResult['severity'] = 'Low';
    let suggested_action = '';
    let confidence = 70;
    let possibleConditions: string[] = [];
    
    const symptomsLower = symptoms.toLowerCase();
    
    // Check for urgent conditions (English, Hindi, Gujarati)
    if (symptomsLower.includes('chest pain') || symptomsLower.includes('heart') || symptomsLower.includes('breathing') ||
        symptomsLower.includes('सीने में दर्द') || symptomsLower.includes('છાતીમાં દુખાવો') || symptomsLower.includes('दिल') || symptomsLower.includes('દિલ')) {
      severity = 'Urgent';
      possibleConditions = ['Cardiac Issue', 'Heart Attack', 'Pulmonary Problem'];
      suggested_action = '🚨 URGENT: Seek immediate medical attention! These symptoms could indicate a serious cardiac or respiratory condition. Call emergency services or go to the nearest hospital immediately.';
      confidence = 95;
    } else if ((symptomsLower.includes('fever') || symptomsLower.includes('बुखार') || symptomsLower.includes('બુખાર')) && 
               (symptomsLower.includes('headache') || symptomsLower.includes('सिरदर्द') || symptomsLower.includes('માથાનો દુખાવો'))) {
      severity = 'High';
      possibleConditions = ['Viral Infection', 'Flu', 'Sinusitis', 'Migraine'];
      suggested_action = 'Monitor your temperature regularly. Rest, stay hydrated, and consider over-the-counter fever reducers. If fever exceeds 103°F or persists >3 days, consult a healthcare provider immediately.';
      confidence = 85;
    } else if (symptomsLower.includes('fever') || symptomsLower.includes('बुखार') || symptomsLower.includes('બુખાર')) {
      severity = 'Medium';
      possibleConditions = ['Viral Infection', 'Common Cold', 'Flu'];
      suggested_action = 'Rest and stay hydrated. Monitor your temperature every 4 hours. Take fever reducers if needed. If fever persists >3 days or exceeds 103°F, seek medical attention.';
      confidence = 80;
    } else if (symptomsLower.includes('headache') || symptomsLower.includes('सिरदर्द') || symptomsLower.includes('માથાનો દુખાવો')) {
      severity = 'Medium';
      possibleConditions = ['Tension Headache', 'Migraine', 'Sinus Headache'];
      suggested_action = 'Rest in a dark, quiet room. Apply cold compress to forehead. Stay hydrated and consider over-the-counter pain relief. If headache is severe or persistent, consult a doctor.';
      confidence = 75;
    } else if (symptomsLower.includes('fatigue') || symptomsLower.includes('थकान') || symptomsLower.includes('થાક') ||
               symptomsLower.includes('tired') || symptomsLower.includes('exhausted')) {
      severity = 'Low';
      possibleConditions = ['Anemia', 'Sleep Deprivation', 'Stress', 'Viral Infection'];
      suggested_action = 'Ensure adequate sleep (7-9 hours), maintain a balanced diet, and stay hydrated. If fatigue persists for weeks or is accompanied by other symptoms, consult a healthcare provider.';
      confidence = 70;
    } else if (symptomsLower.includes('nausea') || symptomsLower.includes('मतली') || symptomsLower.includes('મચકારા') ||
               symptomsLower.includes('vomiting') || symptomsLower.includes('उल्टी') || symptomsLower.includes('ઉલટી')) {
      severity = 'Medium';
      possibleConditions = ['Food Poisoning', 'Gastroenteritis', 'Migraine', 'Pregnancy'];
      suggested_action = 'Stay hydrated with small sips of water. Avoid solid foods initially. Rest and avoid strong smells. If vomiting persists >24 hours or you can\'t keep fluids down, seek medical attention.';
      confidence = 80;
    } else if (symptomsLower.includes('cough') || symptomsLower.includes('खांसी') || symptomsLower.includes('ખાંસી')) {
      severity = 'Low';
      possibleConditions = ['Common Cold', 'Allergies', 'Bronchitis', 'COVID-19'];
      suggested_action = 'Stay hydrated, use a humidifier, and consider cough suppressants. If cough persists >2 weeks, is accompanied by blood, or causes breathing difficulty, consult a doctor.';
      confidence = 75;
    } else if (symptomsLower.includes('dizziness') || symptomsLower.includes('चक्कर') || symptomsLower.includes('ચક્કર')) {
      severity = 'Medium';
      possibleConditions = ['Vertigo', 'Low Blood Pressure', 'Dehydration', 'Inner Ear Problem'];
      suggested_action = 'Sit or lie down immediately to prevent falls. Stay hydrated and avoid sudden movements. If dizziness is severe, persistent, or accompanied by other neurological symptoms, seek medical attention.';
      confidence = 80;
    } else {
      severity = 'Low';
      possibleConditions = ['General Malaise', 'Stress', 'Mild Infection'];
      suggested_action = 'Monitor your symptoms closely. Rest, maintain good hygiene, stay hydrated, and eat nutritious foods. If symptoms worsen or persist, consider consulting a healthcare provider.';
      confidence = 60;
    }
    
    // Add possible conditions to suggested action
    if (possibleConditions.length > 0) {
      suggested_action += `\n\nPossible conditions: ${possibleConditions.join(', ')}`;
    }
    
    const result: ScanResult = {
      severity,
      suggested_action,
      confidence,
      timestamp: new Date().toISOString()
    };
    
    setScanResult(result);
    
    // Add bot response to chat with friendly, encouraging tone
    const friendlyResponse = severity === 'Urgent' 
      ? `I'm concerned about what you're describing. This sounds serious and I want you to be safe! 🚨 Please seek immediate medical attention. ${suggested_action}`
      : severity === 'High'
      ? `I want to make sure you get the care you need! 💚 Based on your symptoms, I recommend: ${suggested_action} Please consider consulting a healthcare provider soon.`
      : severity === 'Medium'
      ? `Thank you for sharing this with me! 🌟 I've analyzed your symptoms and here's what I suggest: ${suggested_action} It's always good to check with a healthcare provider if you're concerned.`
      : `I'm glad you're taking care of yourself! ✨ Here's what I found: ${suggested_action} Keep monitoring how you feel, and don't hesitate to reach out to a healthcare provider if anything changes.`;

    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: friendlyResponse,
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, botMessage]);
    
    // Store symptom data for context awareness
    addSymptom(symptoms.split(',').map(s => s.trim()), severity.toLowerCase() as 'low' | 'medium' | 'high');
    
    setIsLoading(false);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Low': return 'text-success';
      case 'Medium': return 'text-warning';
      case 'High': return 'text-destructive';
      case 'Urgent': return 'text-destructive';
      default: return 'text-muted-foreground';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'Low': return CheckCircle;
      case 'Medium': return Clock;
      case 'High': return AlertTriangle;
      case 'Urgent': return AlertTriangle;
      default: return Brain;
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
          <Stethoscope className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold">Health Scanner</h1>
          <p className="text-muted-foreground">
            {personalizedGreeting || "AI-powered symptom analysis with care and compassion"}
          </p>
        </div>
      </div>

      {/* Safety Guidelines */}
      <SafetyGuidelines variant="compact" />

      {/* Smart Health Scanner */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Stethoscope className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-xl font-bold">Smart Health Scanner</h3>
              <p className="text-sm text-muted-foreground">AI-powered symptom analysis + health metrics tracking</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="symptoms" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="symptoms">Symptom Input (AI Checker)</TabsTrigger>
              <TabsTrigger value="metrics">Common Health Metrics</TabsTrigger>
            </TabsList>
            
            <TabsContent value="symptoms" className="space-y-6">
              {/* Language Selection */}
              <div className="flex items-center gap-4">
                <Label>Language:</Label>
                <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="hi">Hindi</SelectItem>
                    <SelectItem value="gu">Gujarati</SelectItem>
                  </SelectContent>
                </Select>
                
                {/* Voice Controls */}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isListening ? stopListening : startListening}
                    disabled={isSpeaking}
                  >
                    {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={isSpeaking ? stopSpeaking : () => speakText("Hello, I'm your health assistant")}
                  >
                    {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Symptom Input */}
              <div>
                <Label htmlFor="symptoms" className="text-base font-medium">
                  How are you feeling today? {isListening && <span className="text-primary animate-pulse">🎤 Listening...</span>}
                </Label>
                <Textarea
                  id="symptoms"
                  placeholder="Describe your symptoms, pain, discomfort, or any health concerns... (e.g., 'I have a headache and feel tired', 'मुझे सिरदर्द है और थकान लग रही है', 'મને માથાનો દુખાવો છે અને થાક લાગે છે')"
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  className="mt-2 min-h-[100px]"
                  rows={4}
                />
              </div>

              {/* Quick symptom buttons */}
              <div>
                <Label className="text-sm font-medium mb-3 block">Quick Symptoms (Click to add)</Label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[
                    { en: 'Headache', hi: 'सिरदर्द', gu: 'માથાનો દુખાવો', icon: Brain },
                    { en: 'Fever', hi: 'बुखार', gu: 'બુખાર', icon: Thermometer },
                    { en: 'Fatigue', hi: 'थकान', gu: 'થાક', icon: Activity },
                    { en: 'Nausea', hi: 'मतली', gu: 'મચકારા', icon: Stethoscope },
                    { en: 'Chest Pain', hi: 'सीने में दर्द', gu: 'છાતીમાં દુખાવો', icon: Heart },
                    { en: 'Dizziness', hi: 'चक्कर', gu: 'ચક્કર', icon: Brain },
                    { en: 'Cough', hi: 'खांसी', gu: 'ખાંસી', icon: Headphones },
                    { en: 'Body Pain', hi: 'शरीर में दर्द', gu: 'શરીરમાં દુખાવો', icon: Activity }
                  ].map((symptom, index) => {
                    const Icon = symptom.icon;
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          const currentSymptoms = symptoms ? symptoms + ', ' : '';
                          setSymptoms(currentSymptoms + symptom.en);
                        }}
                        className="h-auto p-3 flex flex-col items-center gap-1 text-xs"
                      >
                        <Icon className="w-4 h-4" />
                        <span>{symptom.en}</span>
                        <span className="text-xs text-muted-foreground">{symptom.hi}</span>
                      </Button>
                    );
                  })}
                </div>
              </div>

              {/* Analyze button */}
              <div className="flex justify-center">
                <Button
                  onClick={analyzeSymptoms}
                  disabled={!symptoms.trim() || isLoading}
                  variant="wellness"
                  size="lg"
                  className="px-8"
                >
                  {isLoading ? (
                    <>
                      <Brain className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing your symptoms...
                    </>
                  ) : (
                    <>
                      <Brain className="w-4 h-4 mr-2" />
                      Analyze My Symptoms
                    </>
                  )}
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="metrics" className="space-y-6">
              {/* Health Metrics Input */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="temperature">Temperature (°F)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    step="0.1"
                    value={healthMetrics.temperature}
                    onChange={(e) => setHealthMetrics(prev => ({ ...prev, temperature: parseFloat(e.target.value) || 0 }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="heartRate">Heart Rate (BPM)</Label>
                  <Input
                    id="heartRate"
                    type="number"
                    value={healthMetrics.heartRate}
                    onChange={(e) => setHealthMetrics(prev => ({ ...prev, heartRate: parseInt(e.target.value) || 0 }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="systolic">Blood Pressure - Systolic</Label>
                  <Input
                    id="systolic"
                    type="number"
                    value={healthMetrics.bloodPressure.systolic}
                    onChange={(e) => setHealthMetrics(prev => ({ 
                      ...prev, 
                      bloodPressure: { ...prev.bloodPressure, systolic: parseInt(e.target.value) || 0 }
                    }))}
                    className="mt-2"
                  />
                </div>
                <div>
                  <Label htmlFor="diastolic">Blood Pressure - Diastolic</Label>
                  <Input
                    id="diastolic"
                    type="number"
                    value={healthMetrics.bloodPressure.diastolic}
                    onChange={(e) => setHealthMetrics(prev => ({ 
                      ...prev, 
                      bloodPressure: { ...prev.bloodPressure, diastolic: parseInt(e.target.value) || 0 }
                    }))}
                    className="mt-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="bloodSugar">Blood Sugar (mg/dL)</Label>
                  <Input
                    id="bloodSugar"
                    type="number"
                    value={healthMetrics.bloodSugar}
                    onChange={(e) => setHealthMetrics(prev => ({ ...prev, bloodSugar: parseInt(e.target.value) || 0 }))}
                    className="mt-2"
                  />
                </div>
              </div>

              {/* Health Metrics Analysis */}
              <div className="p-4 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-3">Current Health Status</h4>
                {(() => {
                  const { riskLevel, suggestions } = analyzeHealthMetrics();
                  return (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{riskLevel}</span>
                        <span className="font-medium">Risk Level</span>
                      </div>
                      {suggestions.length > 0 && (
                        <div>
                          <h5 className="font-medium mb-2">Recommendations:</h5>
                          <ul className="space-y-1">
                            {suggestions.map((suggestion, index) => (
                              <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                <span className="text-primary">•</span>
                                {suggestion}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* 7-Day History Chart */}
              <div>
                <h4 className="font-semibold mb-3">Last 7 Days History</h4>
                <div className="space-y-2">
                  {healthMetricsHistory.map((day, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                      <span className="text-sm font-medium">{new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Thermometer className="w-3 h-3" />
                          {day.temperature}°F
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {day.heartRate} BPM
                        </div>
                        <div className="flex items-center gap-1">
                          <Activity className="w-3 h-3" />
                          {day.bloodPressure.systolic}/{day.bloodPressure.diastolic}
                        </div>
                        <div className="flex items-center gap-1">
                          <Droplets className="w-3 h-3" />
                          {day.bloodSugar} mg/dL
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Scan Results */}
      {scanResult && (
        <Card className="shadow-wellness">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5" />
              Analysis Results
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className={`text-3xl font-bold ${getSeverityColor(scanResult.severity)}`}>
                  {scanResult.severity}
                </div>
                <div className="text-sm text-muted-foreground">Risk Level</div>
              </div>
              
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {scanResult.confidence}%
                </div>
                <div className="text-sm text-muted-foreground">Confidence</div>
              </div>
              
              <div className="text-center">
                <Badge variant="outline" className="text-lg px-4 py-2">
                  {new Date(scanResult.timestamp).toLocaleDateString()}
                </Badge>
                <div className="text-sm text-muted-foreground mt-1">Scan Date</div>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-secondary/30 rounded-lg">
              <h4 className="font-semibold mb-2 flex items-center gap-2">
                {(() => {
                  const Icon = getSeverityIcon(scanResult.severity);
                  return <Icon className={`w-5 h-5 ${getSeverityColor(scanResult.severity)}`} />;
                })()}
                Recommended Action
              </h4>
              <p className="text-secondary-foreground">{scanResult.suggested_action}</p>
            </div>
          </CardContent>
        </Card>
      )}

    </div>
  );
}