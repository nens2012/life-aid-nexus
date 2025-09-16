import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Sparkles, 
  Target, 
  Shield, 
  ArrowRight, 
  CheckCircle,
  User,
  Calendar,
  Settings,
  Lightbulb
} from "lucide-react";
import { useUserContext, UserPreferences } from "@/hooks/useUserContext";

interface UserOnboardingProps {
  onComplete?: () => void;
  className?: string;
}

export const UserOnboarding: React.FC<UserOnboardingProps> = ({ 
  onComplete, 
  className 
}) => {
  const { updatePreferences, isFirstTimeUser } = useUserContext();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<UserPreferences>>({
    name: '',
    age: undefined,
    gender: undefined,
    cycleLength: 28,
    periodDuration: 5,
    healthGoals: [],
    wellnessInterests: [],
    communicationStyle: 'encouraging',
    privacyLevel: 'medium',
  });

  const steps = [
    {
      title: "Welcome to WellnessWave! 🌊",
      description: "Let's personalize your health journey",
      icon: Heart,
      content: (
        <div className="space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Welcome to your wellness journey!</h2>
            <p className="text-muted-foreground">
              I'm your friendly AI assistant, and I'm here to support you every step of the way. 
              Let's get to know each other so I can provide the most helpful guidance! ✨
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-primary/5 rounded-lg">
              <Shield className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-semibold">Always Safe</h3>
              <p className="text-sm text-muted-foreground">Your safety is my top priority</p>
            </div>
            <div className="text-center p-4 bg-accent/5 rounded-lg">
              <Target className="w-8 h-8 text-accent mx-auto mb-2" />
              <h3 className="font-semibold">Personalized</h3>
              <p className="text-sm text-muted-foreground">Tailored just for you</p>
            </div>
            <div className="text-center p-4 bg-success/5 rounded-lg">
              <Lightbulb className="w-8 h-8 text-success mx-auto mb-2" />
              <h3 className="font-semibold">Actionable</h3>
              <p className="text-sm text-muted-foreground">Clear, helpful guidance</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Basic Information",
      description: "Tell me a bit about yourself",
      icon: User,
      content: (
        <div className="space-y-4">
          <div>
            <Label htmlFor="name">What should I call you? (Optional)</Label>
            <Input
              id="name"
              placeholder="Your name or nickname"
              value={formData.name || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
            />
            <p className="text-xs text-muted-foreground mt-1">
              I'll use this to make our conversations more personal! 💚
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="age">Age (Optional)</Label>
              <Input
                id="age"
                type="number"
                placeholder="Your age"
                value={formData.age || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, age: parseInt(e.target.value) || undefined }))}
              />
            </div>
            <div>
              <Label htmlFor="gender">Gender (Optional)</Label>
              <Select 
                value={formData.gender || ''} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, gender: value as 'female' | 'male' | 'other' | 'prefer-not-to-say' }))}
              >
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
        </div>
      )
    },
    {
      title: "Health Goals",
      description: "What would you like to focus on?",
      icon: Target,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Select all that apply - I'll tailor my suggestions to help you achieve these goals! 🌟
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { id: 'better sleep', label: 'Better Sleep', description: 'Improve sleep quality and routine' },
              { id: 'stress management', label: 'Stress Management', description: 'Reduce stress and anxiety' },
              { id: 'regular exercise', label: 'Regular Exercise', description: 'Build consistent fitness habits' },
              { id: 'nutrition', label: 'Better Nutrition', description: 'Improve eating habits' },
              { id: 'mental health', label: 'Mental Health', description: 'Support emotional wellbeing' },
              { id: 'period tracking', label: 'Period Tracking', description: 'Track menstrual cycle and symptoms' },
            ].map((goal) => (
              <div key={goal.id} className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-secondary/50 transition-colors">
                <Checkbox
                  id={goal.id}
                  checked={formData.healthGoals?.includes(goal.id) || false}
                  onCheckedChange={(checked) => {
                    setFormData(prev => ({
                      ...prev,
                      healthGoals: checked 
                        ? [...(prev.healthGoals || []), goal.id]
                        : (prev.healthGoals || []).filter(g => g !== goal.id)
                    }));
                  }}
                />
                <div className="flex-1">
                  <Label htmlFor={goal.id} className="font-medium cursor-pointer">
                    {goal.label}
                  </Label>
                  <p className="text-xs text-muted-foreground">{goal.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Wellness Interests",
      description: "What wellness topics interest you?",
      icon: Lightbulb,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            This helps me provide more relevant tips and information! ✨
          </p>
          
          <div className="flex flex-wrap gap-2">
            {[
              'meditation', 'yoga', 'nutrition', 'fitness', 'mindfulness', 
              'sleep hygiene', 'period health', 'mental health', 'self-care'
            ].map((interest) => (
              <Button
                key={interest}
                variant={formData.wellnessInterests?.includes(interest) ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setFormData(prev => ({
                    ...prev,
                    wellnessInterests: prev.wellnessInterests?.includes(interest)
                      ? (prev.wellnessInterests || []).filter(i => i !== interest)
                      : [...(prev.wellnessInterests || []), interest]
                  }));
                }}
                className="capitalize"
              >
                <Sparkles className="w-3 h-3 mr-1" />
                {interest}
              </Button>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Communication Style",
      description: "How would you like me to communicate with you?",
      icon: Settings,
      content: (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Choose the style that makes you feel most comfortable! 💚
          </p>
          
          <div className="space-y-3">
            {[
              { 
                value: 'encouraging', 
                label: 'Encouraging & Supportive', 
                description: 'Warm, positive, and motivating messages',
                example: 'You\'re doing amazing! Let\'s keep this momentum going! 🌟'
              },
              { 
                value: 'direct', 
                label: 'Direct & Clear', 
                description: 'Straightforward, factual information',
                example: 'Here\'s what you need to know about your symptoms.'
              },
              { 
                value: 'detailed', 
                label: 'Detailed & Comprehensive', 
                description: 'Thorough explanations and context',
                example: 'Let me explain this in detail so you understand all the factors...'
              },
              { 
                value: 'brief', 
                label: 'Brief & Concise', 
                description: 'Short, to-the-point responses',
                example: 'Low risk. Monitor symptoms. See doctor if worse.'
              },
            ].map((style) => (
              <div 
                key={style.value}
                className={`p-4 border rounded-lg cursor-pointer transition-all ${
                  formData.communicationStyle === style.value 
                    ? 'border-primary bg-primary/5' 
                    : 'hover:bg-secondary/50'
                }`}
                onClick={() => setFormData(prev => ({ ...prev, communicationStyle: style.value as 'encouraging' | 'direct' | 'detailed' | 'brief' }))}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-4 h-4 rounded-full border-2 mt-1 ${
                    formData.communicationStyle === style.value 
                      ? 'border-primary bg-primary' 
                      : 'border-muted-foreground'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-semibold">{style.label}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{style.description}</p>
                    <p className="text-xs italic text-muted-foreground">"{style.example}"</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "You're All Set! 🎉",
      description: "Ready to start your wellness journey",
      icon: CheckCircle,
      content: (
        <div className="text-center space-y-6">
          <div className="w-20 h-20 bg-gradient-primary rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-2">Perfect! You're ready to go! ✨</h2>
            <p className="text-muted-foreground">
              I now understand your preferences and I'm excited to support your wellness journey. 
              I'll be here whenever you need guidance, encouragement, or just someone to listen! 💚
            </p>
          </div>
          
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <h3 className="font-semibold text-success mb-2">What's Next?</h3>
            <ul className="text-sm text-success-foreground space-y-1 text-left">
              <li>• Explore the Health Scanner for symptom analysis</li>
              <li>• Set up period tracking if applicable</li>
              <li>• Create your first wellness plan</li>
              <li>• Chat with me anytime for support!</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Complete onboarding
      updatePreferences(formData as UserPreferences);
      if (onComplete) {
        onComplete();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    updatePreferences(formData as UserPreferences);
    if (onComplete) {
      onComplete();
    }
  };

  if (!isFirstTimeUser) {
    return null;
  }

  const currentStepData = steps[currentStep];
  const Icon = currentStepData.icon;

  return (
    <div className={`fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 ${className}`}>
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <CardHeader className="text-center">
          <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon className="w-8 h-8 text-white" />
          </div>
          <CardTitle className="text-xl">{currentStepData.title}</CardTitle>
          <p className="text-muted-foreground">{currentStepData.description}</p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {currentStepData.content}
          
          {/* Progress indicator */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <div className="text-sm text-muted-foreground">
              {currentStep + 1} of {steps.length}
            </div>
          </div>
          
          {/* Navigation buttons */}
          <div className="flex justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 0}
            >
              Back
            </Button>
            
            <div className="flex gap-2">
              {currentStep < steps.length - 1 && (
                <Button variant="ghost" onClick={handleSkip}>
                  Skip Setup
                </Button>
              )}
              <Button onClick={handleNext} variant="wellness">
                {currentStep === steps.length - 1 ? 'Get Started!' : 'Next'}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserOnboarding;

