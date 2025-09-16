import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Stethoscope, 
  Brain, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  Activity,
  Thermometer,
  Heart,
  Eye,
  Headphones,
  Search,
  TrendingUp,
  Shield,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

interface Symptom {
  id: string;
  name: string;
  severity: 'mild' | 'moderate' | 'severe';
  duration: string;
  description: string;
  category: 'general' | 'respiratory' | 'digestive' | 'neurological' | 'cardiovascular' | 'skin';
}

interface IllnessPrediction {
  condition: string;
  confidence: number;
  probability: number;
  symptoms: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
  recommendations: string[];
  whenToSeekHelp: string;
  emergencyLevel: 'safe' | 'caution' | 'urgent' | 'critical';
}

interface SymptomsTrackerProps {
  className?: string;
}

const symptomCategories = [
  { value: 'general', label: 'General', icon: Activity, color: 'bg-blue-100 text-blue-700' },
  { value: 'respiratory', label: 'Respiratory', icon: Headphones, color: 'bg-green-100 text-green-700' },
  { value: 'digestive', label: 'Digestive', icon: Stethoscope, color: 'bg-orange-100 text-orange-700' },
  { value: 'neurological', label: 'Neurological', icon: Brain, color: 'bg-purple-100 text-purple-700' },
  { value: 'cardiovascular', label: 'Cardiovascular', icon: Heart, color: 'bg-red-100 text-red-700' },
  { value: 'skin', label: 'Skin', icon: Eye, color: 'bg-yellow-100 text-yellow-700' }
];

const commonSymptoms = [
  { name: 'Fever', category: 'general', icon: Thermometer },
  { name: 'Headache', category: 'neurological', icon: Brain },
  { name: 'Cough', category: 'respiratory', icon: Headphones },
  { name: 'Nausea', category: 'digestive', icon: Stethoscope },
  { name: 'Chest Pain', category: 'cardiovascular', icon: Heart },
  { name: 'Rash', category: 'skin', icon: Eye },
  { name: 'Fatigue', category: 'general', icon: Activity },
  { name: 'Dizziness', category: 'neurological', icon: Brain },
  { name: 'Shortness of Breath', category: 'respiratory', icon: Headphones },
  { name: 'Abdominal Pain', category: 'digestive', icon: Stethoscope }
];

export const SymptomsTracker: React.FC<SymptomsTrackerProps> = ({ className }) => {
  const [symptoms, setSymptoms] = useState<Symptom[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<IllnessPrediction | null>(null);
  const [showPrediction, setShowPrediction] = useState(false);

  // Mock API call for illness prediction
  const predictIllness = async (symptoms: Symptom[]): Promise<IllnessPrediction> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Mock prediction logic based on symptoms
    const symptomNames = symptoms.map(s => s.name.toLowerCase());
    
    // Simple rule-based prediction (in real app, this would be an AI/ML API)
    if (symptomNames.includes('fever') && symptomNames.includes('cough') && symptomNames.includes('fatigue')) {
      return {
        condition: 'Viral Infection (Common Cold/Flu)',
        confidence: 0.85,
        probability: 0.78,
        symptoms: ['Fever', 'Cough', 'Fatigue'],
        severity: 'medium',
        recommendations: [
          'Rest and stay hydrated',
          'Take over-the-counter fever reducers',
          'Use a humidifier for cough relief',
          'Monitor temperature regularly'
        ],
        whenToSeekHelp: 'If fever persists >3 days or exceeds 103°F',
        emergencyLevel: 'caution'
      };
    } else if (symptomNames.includes('chest pain') && symptomNames.includes('shortness of breath')) {
      return {
        condition: 'Possible Cardiac Issue',
        confidence: 0.92,
        probability: 0.65,
        symptoms: ['Chest Pain', 'Shortness of Breath'],
        severity: 'high',
        recommendations: [
          'Seek immediate medical attention',
          'Do not ignore chest pain',
          'Call emergency services if severe'
        ],
        whenToSeekHelp: 'Immediately - this could be a medical emergency',
        emergencyLevel: 'urgent'
      };
    } else if (symptomNames.includes('headache') && symptomNames.includes('dizziness')) {
      return {
        condition: 'Possible Migraine or Tension Headache',
        confidence: 0.75,
        probability: 0.60,
        symptoms: ['Headache', 'Dizziness'],
        severity: 'low',
        recommendations: [
          'Rest in a dark, quiet room',
          'Apply cold compress to forehead',
          'Stay hydrated',
          'Consider over-the-counter pain relief'
        ],
        whenToSeekHelp: 'If headache is severe or persistent',
        emergencyLevel: 'safe'
      };
    } else {
      return {
        condition: 'General Symptoms - Monitor Closely',
        confidence: 0.60,
        probability: 0.45,
        symptoms: symptomNames,
        severity: 'low',
        recommendations: [
          'Monitor symptoms closely',
          'Rest and maintain good hygiene',
          'Stay hydrated',
          'Consider consulting a healthcare provider'
        ],
        whenToSeekHelp: 'If symptoms worsen or persist',
        emergencyLevel: 'safe'
      };
    }
  };

  const addSymptom = (symptomName: string, category: string) => {
    const newSymptom: Symptom = {
      id: Date.now().toString(),
      name: symptomName,
      severity: 'mild',
      duration: '1-2 days',
      description: '',
      category: category as Symptom['category']
    };
    setSymptoms(prev => [...prev, newSymptom]);
  };

  const removeSymptom = (id: string) => {
    setSymptoms(prev => prev.filter(s => s.id !== id));
  };

  const updateSymptom = (id: string, updates: Partial<Symptom>) => {
    setSymptoms(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const analyzeSymptoms = async () => {
    if (symptoms.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const result = await predictIllness(symptoms);
      setPrediction(result);
      setShowPrediction(true);
    } catch (error) {
      console.error('Error analyzing symptoms:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getEmergencyColor = (level: string) => {
    switch (level) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'urgent': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'caution': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600';
      case 'high': return 'text-orange-600';
      case 'medium': return 'text-yellow-600';
      default: return 'text-green-600';
    }
  };

  const filteredSymptoms = commonSymptoms.filter(symptom => {
    const matchesCategory = selectedCategory === 'all' || symptom.category === selectedCategory;
    const matchesSearch = symptom.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className={cn("space-y-6", className)}>
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Stethoscope className="w-6 h-6 text-primary" />
            <div>
              <h3 className="text-xl font-bold">Symptoms Tracker</h3>
              <p className="text-sm text-muted-foreground">Track your symptoms and get AI-powered health insights</p>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search symptoms..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="all">All Categories</option>
              {symptomCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Common Symptoms */}
          <div>
            <h4 className="font-medium mb-3">Common Symptoms</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2">
              {filteredSymptoms.map((symptom, index) => {
                const Icon = symptom.icon;
                const categoryInfo = symptomCategories.find(cat => cat.value === symptom.category);
                return (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => addSymptom(symptom.name, symptom.category)}
                    className="h-auto p-3 flex flex-col items-center gap-1"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{symptom.name}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Current Symptoms */}
          {symptoms.length > 0 && (
            <div>
              <h4 className="font-medium mb-3">Current Symptoms ({symptoms.length})</h4>
              <div className="space-y-2">
                {symptoms.map((symptom) => {
                  const categoryInfo = symptomCategories.find(cat => cat.value === symptom.category);
                  return (
                    <div key={symptom.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className={`p-2 rounded ${categoryInfo?.color}`}>
                        {categoryInfo && <categoryInfo.icon className="w-4 h-4" />}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium">{symptom.name}</div>
                        <div className="text-sm text-muted-foreground">{categoryInfo?.label}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <select
                          value={symptom.severity}
                          onChange={(e) => updateSymptom(symptom.id, { severity: e.target.value as Symptom['severity'] })}
                          className="text-xs border rounded px-2 py-1"
                        >
                          <option value="mild">Mild</option>
                          <option value="moderate">Moderate</option>
                          <option value="severe">Severe</option>
                        </select>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeSymptom(symptom.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Analyze Button */}
          {symptoms.length > 0 && (
            <div className="flex justify-center">
              <Button
                onClick={analyzeSymptoms}
                disabled={isAnalyzing}
                variant="wellness"
                size="lg"
                className="px-8"
              >
                {isAnalyzing ? (
                  <>
                    <Zap className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing Symptoms...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Symptoms
                  </>
                )}
              </Button>
            </div>
          )}

          {/* Prediction Results */}
          {showPrediction && prediction && (
            <Alert className={cn("border-2", getEmergencyColor(prediction.emergencyLevel))}>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-bold text-lg">{prediction.condition}</h4>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline">
                        Confidence: {Math.round(prediction.confidence * 100)}%
                      </Badge>
                      <Badge variant="outline">
                        Probability: {Math.round(prediction.probability * 100)}%
                      </Badge>
                      <span className={cn("font-medium", getSeverityColor(prediction.severity))}>
                        Severity: {prediction.severity.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Matching Symptoms:</h5>
                    <div className="flex flex-wrap gap-2">
                      {prediction.symptoms.map((symptom, index) => (
                        <Badge key={index} variant="secondary">{symptom}</Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-medium mb-2">Recommendations:</h5>
                    <ul className="list-disc list-inside space-y-1">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm">{rec}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 bg-muted/50 rounded-lg">
                    <h5 className="font-medium mb-1">When to Seek Help:</h5>
                    <p className="text-sm">{prediction.whenToSeekHelp}</p>
                  </div>

                  {prediction.emergencyLevel === 'urgent' || prediction.emergencyLevel === 'critical' ? (
                    <div className="p-3 bg-red-100 border border-red-300 rounded-lg">
                      <div className="flex items-center gap-2 text-red-800">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="font-bold">URGENT: Seek immediate medical attention!</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SymptomsTracker;

