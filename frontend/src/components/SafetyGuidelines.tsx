import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Phone, 
  Heart,
  Info,
  ExternalLink,
  Stethoscope,
  Clock,
  Users
} from "lucide-react";

interface SafetyGuidelinesProps {
  variant?: 'compact' | 'detailed' | 'emergency';
  showActions?: boolean;
  className?: string;
}

export const SafetyGuidelines: React.FC<SafetyGuidelinesProps> = ({ 
  variant = 'compact', 
  showActions = true,
  className 
}) => {
  const emergencyContacts = [
    { name: 'Emergency Services', number: '911', description: 'Life-threatening emergencies' },
    { name: 'National Suicide Prevention', number: '988', description: 'Crisis support' },
    { name: 'Poison Control', number: '1-800-222-1222', description: 'Poison emergencies' },
  ];

  const warningSigns = [
    'Severe chest pain or pressure',
    'Difficulty breathing or shortness of breath',
    'Severe abdominal pain',
    'Signs of stroke (facial drooping, arm weakness, speech difficulty)',
    'Heavy bleeding that won\'t stop',
    'Severe headache with vision changes',
    'High fever with rash',
    'Thoughts of self-harm',
  ];

  const safeGuidance = [
    'General wellness and lifestyle advice',
    'Period tracking and cycle information',
    'Stress management techniques',
    'Nutrition and exercise guidance',
    'Sleep hygiene tips',
    'Meditation and mindfulness practices',
  ];

  if (variant === 'emergency') {
    return (
      <Alert className="border-destructive bg-destructive/10 animate-pulse">
        <AlertTriangle className="h-6 w-6 text-destructive" />
        <AlertDescription className="text-destructive">
          <div className="space-y-4">
            <div>
              <strong className="text-lg">MEDICAL EMERGENCY DETECTED</strong>
              <p className="mt-2">Please seek immediate medical attention. This AI assistant cannot provide emergency medical care.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {emergencyContacts.map((contact, index) => (
                <Card key={index} className="border-destructive/50 bg-destructive/5">
                  <CardContent className="p-4 text-center">
                    <Phone className="w-8 h-8 text-destructive mx-auto mb-2" />
                    <div className="font-bold text-lg">{contact.number}</div>
                    <div className="text-sm font-medium">{contact.name}</div>
                    <div className="text-xs text-muted-foreground">{contact.description}</div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="flex gap-2 flex-wrap">
              <Button variant="destructive" size="lg" asChild>
                <a href="tel:911">
                  <Phone className="w-4 h-4 mr-2" />
                  Call 911 Now
                </a>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <a href="https://www.healthline.com/health/emergency-contacts" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  More Emergency Resources
                </a>
              </Button>
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (variant === 'detailed') {
    return (
      <div className={`space-y-6 ${className}`}>
        {/* Main Safety Notice */}
        <Alert className="border-warning/50 bg-warning/5">
          <Shield className="h-5 w-5 text-warning" />
          <AlertDescription>
            <div className="space-y-3">
              <div>
                <strong className="text-base">Important Safety Information</strong>
                <p className="mt-1 text-sm">
                  WellnessWave AI is designed to provide general wellness guidance and health information. 
                  It is NOT a substitute for professional medical advice, diagnosis, or treatment.
                </p>
              </div>
              
              {showActions && (
                <div className="flex gap-2 flex-wrap">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.cdc.gov/healthcommunication/toolstemplates/entertainmented/tips/GeneralHealth.html" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Health Guidelines
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://www.fda.gov/consumers/consumer-updates/health-fraud-scams" target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-3 h-3 mr-1" />
                      Health Fraud Info
                    </a>
                  </Button>
                </div>
              )}
            </div>
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* When to Seek Emergency Care */}
          <Card className="border-destructive/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="w-5 h-5" />
                Seek Immediate Medical Care
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  If you experience any of these symptoms, call 911 or go to the emergency room immediately:
                </p>
                <ul className="space-y-2 text-sm">
                  {warningSigns.map((sign, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-destructive rounded-full mt-2 flex-shrink-0" />
                      <span>{sign}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t">
                  <Button variant="destructive" size="sm" asChild>
                    <a href="tel:911">
                      <Phone className="w-3 h-3 mr-1" />
                      Call 911
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* What We Can Help With */}
          <Card className="border-success/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle className="w-5 h-5" />
                Safe Wellness Guidance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  We can safely help you with:
                </p>
                <ul className="space-y-2 text-sm">
                  {safeGuidance.map((guidance, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0" />
                      <span>{guidance}</span>
                    </li>
                  ))}
                </ul>
                <div className="pt-3 border-t">
                  <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                    <Heart className="w-3 h-3 mr-1" />
                    Always Safe
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Professional Healthcare */}
        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              When to Consult Healthcare Providers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <Clock className="w-8 h-8 text-warning mx-auto mb-2" />
                <div className="font-semibold text-sm">Persistent Symptoms</div>
                <div className="text-xs text-muted-foreground">Symptoms lasting more than a few days</div>
              </div>
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <Users className="w-8 h-8 text-primary mx-auto mb-2" />
                <div className="font-semibold text-sm">Regular Checkups</div>
                <div className="text-xs text-muted-foreground">Annual physicals and preventive care</div>
              </div>
              <div className="text-center p-4 bg-secondary/30 rounded-lg">
                <Info className="w-8 h-8 text-accent mx-auto mb-2" />
                <div className="font-semibold text-sm">Health Questions</div>
                <div className="text-xs text-muted-foreground">Specific medical concerns or conditions</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Compact variant (default)
  return (
    <Alert className={`border-warning/50 bg-warning/5 ${className}`}>
      <Shield className="h-4 w-4 text-warning" />
      <AlertDescription className="text-warning-foreground">
        <div className="flex items-center justify-between">
          <div>
            <strong>Important:</strong> This AI provides wellness guidance only. 
            Always consult healthcare providers for medical concerns.
          </div>
          {showActions && (
            <div className="flex gap-2 ml-4">
              <Button variant="outline" size="sm" asChild>
                <a href="tel:911">
                  <Phone className="w-3 h-3 mr-1" />
                  Emergency
                </a>
              </Button>
            </div>
          )}
        </div>
      </AlertDescription>
    </Alert>
  );
};

export default SafetyGuidelines;

