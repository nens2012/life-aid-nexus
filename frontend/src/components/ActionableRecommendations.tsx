import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle, 
  Clock, 
  Target, 
  Heart, 
  Lightbulb, 
  ArrowRight,
  Calendar,
  BookOpen,
  ExternalLink,
  Play,
  Timer,
  Star
} from "lucide-react";

interface Recommendation {
  id: string;
  title: string;
  description: string;
  category: 'immediate' | 'daily' | 'weekly' | 'long-term';
  priority: 'high' | 'medium' | 'low';
  estimatedTime: string;
  difficulty: 'easy' | 'moderate' | 'challenging';
  steps: string[];
  resources?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'app' | 'tool';
  }[];
  relatedGoals: string[];
}

interface ActionableRecommendationsProps {
  recommendations: Recommendation[];
  onActionClick?: (action: string) => void;
  className?: string;
}

export const ActionableRecommendations: React.FC<ActionableRecommendationsProps> = ({
  recommendations,
  onActionClick,
  className
}) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'immediate': return <Play className="w-4 h-4" />;
      case 'daily': return <Calendar className="w-4 h-4" />;
      case 'weekly': return <Clock className="w-4 h-4" />;
      case 'long-term': return <Target className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'immediate': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'daily': return 'bg-primary/10 text-primary border-primary/20';
      case 'weekly': return 'bg-accent/10 text-accent border-accent/20';
      case 'long-term': return 'bg-success/10 text-success border-success/20';
      default: return 'bg-muted/10 text-muted-foreground border-muted/20';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-destructive/10 text-destructive';
      case 'medium': return 'bg-warning/10 text-warning';
      case 'low': return 'bg-success/10 text-success';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-success/10 text-success';
      case 'moderate': return 'bg-warning/10 text-warning';
      case 'challenging': return 'bg-destructive/10 text-destructive';
      default: return 'bg-muted/10 text-muted-foreground';
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'article': return <BookOpen className="w-3 h-3" />;
      case 'video': return <Play className="w-3 h-3" />;
      case 'app': return <ExternalLink className="w-3 h-3" />;
      case 'tool': return <Target className="w-3 h-3" />;
      default: return <ExternalLink className="w-3 h-3" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold mb-2">Your Personalized Action Plan ✨</h2>
        <p className="text-muted-foreground">
          Here are specific, actionable steps tailored just for you. Each recommendation includes 
          clear instructions and helpful resources to support your wellness journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {recommendations.map((rec) => (
          <Card key={rec.id} className="shadow-soft hover:shadow-wellness transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between mb-2">
                <CardTitle className="text-lg">{rec.title}</CardTitle>
                <Badge 
                  variant="outline" 
                  className={`${getCategoryColor(rec.category)} text-xs`}
                >
                  {getCategoryIcon(rec.category)}
                  <span className="ml-1 capitalize">{rec.category}</span>
                </Badge>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className={`${getPriorityColor(rec.priority)} text-xs`}>
                  <Star className="w-3 h-3 mr-1" />
                  {rec.priority} priority
                </Badge>
                <Badge variant="outline" className={`${getDifficultyColor(rec.difficulty)} text-xs`}>
                  <Timer className="w-3 h-3 mr-1" />
                  {rec.difficulty}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <Clock className="w-3 h-3 mr-1" />
                  {rec.estimatedTime}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">{rec.description}</p>
              
              {/* Action Steps */}
              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-success" />
                  Action Steps
                </h4>
                <ol className="space-y-2">
                  {rec.steps.map((step, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="w-5 h-5 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xs font-semibold flex-shrink-0 mt-0.5">
                        {index + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              {/* Resources */}
              {rec.resources && rec.resources.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Lightbulb className="w-4 h-4 text-accent" />
                    Helpful Resources
                  </h4>
                  <div className="space-y-2">
                    {rec.resources.map((resource, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="w-full justify-start text-xs h-8"
                        onClick={() => {
                          if (onActionClick) {
                            onActionClick(`Open resource: ${resource.title}`);
                          }
                          window.open(resource.url, '_blank', 'noopener,noreferrer');
                        }}
                      >
                        {getResourceIcon(resource.type)}
                        <span className="ml-2 truncate">{resource.title}</span>
                        <ExternalLink className="w-3 h-3 ml-auto" />
                      </Button>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Goals */}
              {rec.relatedGoals && rec.relatedGoals.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-primary" />
                    Related Goals
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {rec.relatedGoals.map((goal, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {goal}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Button 
                className="w-full" 
                variant="wellness"
                onClick={() => {
                  if (onActionClick) {
                    onActionClick(`Start: ${rec.title}`);
                  }
                }}
              >
                <Play className="w-4 h-4 mr-2" />
                Start This Action
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Summary */}
      <Card className="bg-gradient-to-r from-primary/5 to-accent/5 border-primary/20">
        <CardContent className="p-6">
          <div className="text-center">
            <h3 className="text-lg font-semibold mb-2">Ready to Take Action? 💪</h3>
            <p className="text-muted-foreground mb-4">
              Remember, every small step counts! Start with what feels most comfortable and build from there. 
              I'm here to support you every step of the way! 🌟
            </p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Actions
              </Button>
              <Button variant="outline" size="sm">
                <Heart className="w-4 h-4 mr-2" />
                Track Progress
              </Button>
              <Button variant="outline" size="sm">
                <Lightbulb className="w-4 h-4 mr-2" />
                Get More Tips
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Sample recommendations data
export const sampleRecommendations: Recommendation[] = [
  {
    id: '1',
    title: 'Morning Hydration Routine',
    description: 'Start your day with proper hydration to boost energy and support overall health.',
    category: 'daily',
    priority: 'high',
    estimatedTime: '5 minutes',
    difficulty: 'easy',
    steps: [
      'Drink a full glass of water as soon as you wake up',
      'Keep a water bottle by your bedside',
      'Set a reminder for every 2 hours to drink water',
      'Track your daily water intake'
    ],
    resources: [
      {
        title: 'Hydration Calculator',
        url: 'https://www.healthline.com/health/how-much-water-should-I-drink',
        type: 'tool'
      }
    ],
    relatedGoals: ['better sleep', 'nutrition']
  },
  {
    id: '2',
    title: '5-Minute Breathing Exercise',
    description: 'Practice deep breathing to reduce stress and improve mental clarity.',
    category: 'immediate',
    priority: 'high',
    estimatedTime: '5 minutes',
    difficulty: 'easy',
    steps: [
      'Find a quiet, comfortable space',
      'Sit or lie down with your back straight',
      'Inhale slowly for 4 counts',
      'Hold your breath for 4 counts',
      'Exhale slowly for 6 counts',
      'Repeat for 5 minutes'
    ],
    resources: [
      {
        title: 'Guided Breathing Video',
        url: 'https://www.youtube.com/watch?v=example',
        type: 'video'
      }
    ],
    relatedGoals: ['stress management', 'mental health']
  },
  {
    id: '3',
    title: 'Evening Gratitude Practice',
    description: 'End your day with gratitude to improve mood and sleep quality.',
    category: 'daily',
    priority: 'medium',
    estimatedTime: '10 minutes',
    difficulty: 'easy',
    steps: [
      'Set aside 10 minutes before bed',
      'Write down 3 things you\'re grateful for today',
      'Reflect on one positive moment from your day',
      'Set an intention for tomorrow'
    ],
    relatedGoals: ['better sleep', 'mental health', 'stress management']
  }
];

export default ActionableRecommendations;

