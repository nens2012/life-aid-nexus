import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Stethoscope, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Send,
  Bot,
  User,
  Shield
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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

export default function HealthScanner() {
  const [symptoms, setSymptoms] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'bot',
      content: 'Hello! I\'m your AI health assistant. Please describe your symptoms, and I\'ll provide an assessment. Remember, this is not a substitute for professional medical advice.',
      timestamp: new Date().toISOString()
    }
  ]);

  // Mock AI analysis - in real app would call Flask microservice
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
    
    // Mock analysis logic
    let severity: ScanResult['severity'] = 'Low';
    let suggested_action = '';
    let confidence = 70;
    
    const symptomsLower = symptoms.toLowerCase();
    
    if (symptomsLower.includes('chest pain') || symptomsLower.includes('heart') || symptomsLower.includes('breathing')) {
      severity = 'Urgent';
      suggested_action = 'Seek immediate medical attention. Go to the emergency room or call emergency services.';
      confidence = 90;
    } else if (symptomsLower.includes('fever') && (symptomsLower.includes('cough') || symptomsLower.includes('cold'))) {
      severity = 'Medium';
      suggested_action = 'Monitor symptoms and consider consulting a healthcare provider if they worsen or persist.';
      confidence = 85;
    } else if (symptomsLower.includes('headache') || symptomsLower.includes('tired') || symptomsLower.includes('fatigue')) {
      severity = 'Low';
      suggested_action = 'Rest, stay hydrated, and monitor symptoms. Consider over-the-counter pain relief if needed.';
      confidence = 75;
    } else {
      severity = 'Low';
      suggested_action = 'Monitor symptoms and consult a healthcare provider if they persist or worsen.';
      confidence = 60;
    }
    
    const result: ScanResult = {
      severity,
      suggested_action,
      confidence,
      timestamp: new Date().toISOString()
    };
    
    setScanResult(result);
    
    // Add bot response to chat
    const botMessage: ChatMessage = {
      id: (Date.now() + 1).toString(),
      type: 'bot',
      content: `Based on your symptoms, I've completed the analysis. Severity: ${severity} (${confidence}% confidence). ${suggested_action}`,
      timestamp: new Date().toISOString()
    };
    setChatMessages(prev => [...prev, botMessage]);
    
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
        <Stethoscope className="w-8 h-8 text-primary" />
        <div>
          <h1 className="text-3xl font-bold">Health Scanner</h1>
          <p className="text-muted-foreground">AI-powered symptom analysis and health guidance</p>
        </div>
      </div>

      {/* Disclaimer */}
      <Alert className="border-warning/50 bg-warning/5">
        <Shield className="h-4 w-4 text-warning" />
        <AlertDescription className="text-warning-foreground">
          <strong>Important:</strong> This AI tool is for informational purposes only and does not replace professional medical advice, diagnosis, or treatment. Always consult qualified healthcare providers for medical concerns.
        </AlertDescription>
      </Alert>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Symptom Input */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="w-5 h-5" />
              Describe Your Symptoms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="symptoms">Symptoms & Description</Label>
              <Textarea
                id="symptoms"
                placeholder="Describe your symptoms in detail... (e.g., headache, fever, fatigue, etc.)"
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                rows={4}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Your age"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select value={gender} onValueChange={setGender}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Button 
              onClick={analyzeSymptoms} 
              disabled={!symptoms || !age || !gender || isLoading}
              className="w-full"
              variant="wellness"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Analyze Symptoms
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* AI Chat Interface */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              AI Health Assistant
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 h-80 overflow-y-auto border rounded-lg p-4 bg-muted/20">
              {chatMessages.map((message) => (
                <div key={message.id} className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      message.type === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary'
                    }`}>
                      {message.type === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                    </div>
                    <div className={`p-3 rounded-lg ${
                      message.type === 'user' 
                        ? 'bg-primary text-primary-foreground' 
                        : 'bg-secondary text-secondary-foreground'
                    }`}>
                      <p className="text-sm">{message.content}</p>
                      <p className="text-xs opacity-70 mt-1">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

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