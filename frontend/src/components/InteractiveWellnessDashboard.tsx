import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Moon, 
  Sun, 
  Battery, 
  Heart, 
  Dumbbell, 
  Apple, 
  Brain, 
  Calendar,
  Zap,
  Coffee,
  Activity,
  Clock,
  Target,
  Sparkles,
  TrendingUp,
  AlertCircle,
  CheckCircle
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SleepData {
  duration: number;
  quality: 'poor' | 'fair' | 'good' | 'excellent';
  bedtime: string;
  wakeTime: string;
}

interface PeriodData {
  lastPeriod: string;
  cycleLength: number;
  currentPhase: 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
  nextPeriod: string;
  fertileWindow: { start: string; end: string };
}

interface WellnessDashboardProps {
  className?: string;
}

const energyLevels = [
  { range: [0, 3], emoji: '😵‍💫', battery: 0, label: 'Very Low Energy', color: 'text-red-500', bgColor: 'bg-red-100' },
  { range: [4, 5], emoji: '😴', battery: 20, label: 'Low Energy', color: 'text-orange-500', bgColor: 'bg-orange-100' },
  { range: [6, 7], emoji: '🙂', battery: 50, label: 'Moderate Energy', color: 'text-yellow-500', bgColor: 'bg-yellow-100' },
  { range: [7, 8], emoji: '😃', battery: 80, label: 'Optimal Energy', color: 'text-green-500', bgColor: 'bg-green-100' },
  { range: [8, 9], emoji: '🔥', battery: 100, label: 'High Energy', color: 'text-blue-500', bgColor: 'bg-blue-100' },
  { range: [9, 24], emoji: '🥱', battery: 90, label: 'Over-sleepy', color: 'text-purple-500', bgColor: 'bg-purple-100' }
];

const meditationPractices = [
  { name: 'Breathing Exercise', duration: '5 min', type: 'breathing', emoji: '🫁' },
  { name: 'Mindfulness Meditation', duration: '10 min', type: 'mindfulness', emoji: '🧘' },
  { name: 'Yoga Nidra', duration: '15 min', type: 'relaxation', emoji: '🛌' },
  { name: 'Body Scan', duration: '8 min', type: 'body-awareness', emoji: '👁️' },
  { name: 'Loving Kindness', duration: '12 min', type: 'compassion', emoji: '💝' }
];

const breakfastOptions = [
  { name: 'Oats with Banana & Almonds', emoji: '🥣', type: 'western', energy: 'high' },
  { name: 'Poha with Peanuts', emoji: '🍛', type: 'indian', energy: 'moderate' },
  { name: 'Greek Yogurt Parfait', emoji: '🍓', type: 'western', energy: 'high' },
  { name: 'Upma with Vegetables', emoji: '🥘', type: 'indian', energy: 'moderate' },
  { name: 'Smoothie Bowl', emoji: '🥤', type: 'vegan', energy: 'high' },
  { name: 'Idli with Sambar', emoji: '🍽️', type: 'indian', energy: 'moderate' }
];

const quickWorkouts = [
  { name: 'HIIT Blast', duration: '15 min', exercises: ['Jumping Jacks', 'Squats', 'Push-ups', 'Plank'], emoji: '⚡' },
  { name: 'Yoga Flow', duration: '15 min', exercises: ['Sun Salutations', 'Warrior Poses', 'Tree Pose', 'Savasana'], emoji: '🧘' },
  { name: 'Cardio Boost', duration: '15 min', exercises: ['High Knees', 'Burpees', 'Mountain Climbers', 'Jump Squats'], emoji: '💪' },
  { name: 'Stretching', duration: '15 min', exercises: ['Neck Rolls', 'Shoulder Stretches', 'Hip Openers', 'Leg Stretches'], emoji: '🤸' }
];

export const InteractiveWellnessDashboard: React.FC<WellnessDashboardProps> = ({ className }) => {
  const [sleepData, setSleepData] = useState<SleepData>({
    duration: 7.5,
    quality: 'good',
    bedtime: '22:30',
    wakeTime: '06:00'
  });
  
  const [periodData, setPeriodData] = useState<PeriodData>({
    lastPeriod: '2024-01-01',
    cycleLength: 28,
    currentPhase: 'follicular',
    nextPeriod: '2024-01-29',
    fertileWindow: { start: '2024-01-15', end: '2024-01-17' }
  });

  const [selectedMeditation, setSelectedMeditation] = useState<string | null>(null);
  const [selectedBreakfast, setSelectedBreakfast] = useState<string | null>(null);
  const [selectedWorkout, setSelectedWorkout] = useState<string | null>(null);

  // Calculate energy level based on sleep duration
  const getEnergyLevel = (duration: number) => {
    return energyLevels.find(level => 
      duration >= level.range[0] && duration <= level.range[1]
    ) || energyLevels[2]; // Default to moderate
  };

  // Get wellness tip based on energy level
  const getWellnessTip = (duration: number) => {
    if (duration < 6) {
      return "Try to add 30 min extra tonight for sharper focus tomorrow! 💡";
    } else if (duration >= 6 && duration < 8) {
      return "Good sleep! Consider adding 15-30 min for optimal energy. 🌟";
    } else if (duration >= 8 && duration < 9) {
      return "Perfect sleep duration! You're well-rested and ready to conquer the day! 🚀";
    } else {
      return "You might be oversleeping. Try setting an alarm 30 min earlier. ⏰";
    }
  };

  // Calculate period phase
  const calculatePeriodPhase = (lastPeriod: string, cycleLength: number) => {
    const today = new Date();
    const lastPeriodDate = new Date(lastPeriod);
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceLastPeriod <= 5) return 'menstrual';
    if (daysSinceLastPeriod <= 13) return 'follicular';
    if (daysSinceLastPeriod <= 16) return 'ovulation';
    return 'luteal';
  };

  // Get phase-based wellness tip
  const getPhaseWellnessTip = (phase: string) => {
    const tips = {
      menstrual: "Take it easy ❤ Try warm tea, gentle yoga, and iron-rich foods.",
      follicular: "Energy rising 💪 Best time for workouts & new projects.",
      ovulation: "Peak energy ✨ Try high-intensity workouts, stay hydrated.",
      luteal: "Possible mood changes 🌙 Do calming meditation & magnesium-rich snacks."
    };
    return tips[phase as keyof typeof tips];
  };

  const currentEnergyLevel = getEnergyLevel(sleepData.duration);
  const wellnessTip = getWellnessTip(sleepData.duration);
  const phaseTip = getPhaseWellnessTip(periodData.currentPhase);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">🌊 WellnessWave Dashboard</h2>
        <p className="text-muted-foreground">Your personalized health & wellness companion</p>
      </div>

      {/* Sleep Tracking & Energy Meter */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-blue-500" />
            Sleep Tracking & Energy Meter
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{currentEnergyLevel.emoji}</span>
              <div>
                <div className="flex items-center gap-2">
                  <Battery className="w-5 h-5" />
                  <span className="text-2xl font-bold">{currentEnergyLevel.battery}%</span>
                </div>
                <p className={cn("font-medium", currentEnergyLevel.color)}>
                  {currentEnergyLevel.label}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold">{sleepData.duration}h</p>
              <p className="text-sm text-muted-foreground">Sleep Duration</p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Energy Level</span>
              <span>{currentEnergyLevel.battery}%</span>
            </div>
            <Progress value={currentEnergyLevel.battery} className="h-2" />
          </div>

          <div className="p-3 bg-muted/30 rounded-lg">
            <p className="text-sm font-medium">💡 Wellness Tip:</p>
            <p className="text-sm">{wellnessTip}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Sleep Duration (hours)</label>
              <Input
                type="number"
                value={sleepData.duration}
                onChange={(e) => setSleepData({...sleepData, duration: parseFloat(e.target.value)})}
                min="0"
                max="12"
                step="0.5"
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Sleep Quality</label>
              <select
                value={sleepData.quality}
                onChange={(e) => setSleepData({...sleepData, quality: e.target.value as SleepData['quality']})}
                className="w-full mt-1 p-2 border rounded-md"
              >
                <option value="poor">Poor</option>
                <option value="fair">Fair</option>
                <option value="good">Good</option>
                <option value="excellent">Excellent</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Meditation & Relaxation */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-purple-500" />
            Meditation & Relaxation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {meditationPractices.map((practice, index) => (
              <Button
                key={index}
                variant={selectedMeditation === practice.name ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setSelectedMeditation(
                  selectedMeditation === practice.name ? null : practice.name
                )}
              >
                <span className="text-2xl">{practice.emoji}</span>
                <div className="text-center">
                  <p className="font-medium text-sm">{practice.name}</p>
                  <p className="text-xs text-muted-foreground">{practice.duration}</p>
                </div>
              </Button>
            ))}
          </div>
          
          {selectedMeditation && (
            <div className="mt-4 p-3 bg-purple-50 rounded-lg">
              <p className="text-sm font-medium">Selected: {selectedMeditation}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Find a quiet space, sit comfortably, and follow the guided practice.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Nutrition & Breakfast */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Apple className="w-5 h-5 text-green-500" />
            Nutrition & Breakfast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {breakfastOptions.map((option, index) => (
              <Button
                key={index}
                variant={selectedBreakfast === option.name ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setSelectedBreakfast(
                  selectedBreakfast === option.name ? null : option.name
                )}
              >
                <span className="text-2xl">{option.emoji}</span>
                <div className="text-center">
                  <p className="font-medium text-sm">{option.name}</p>
                  <Badge variant="outline" className="text-xs mt-1">
                    {option.type}
                  </Badge>
                </div>
              </Button>
            ))}
          </div>
          
          {selectedBreakfast && (
            <div className="mt-4 p-3 bg-green-50 rounded-lg">
              <p className="text-sm font-medium">Selected: {selectedBreakfast}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Perfect choice for your energy level! Enjoy your nutritious breakfast.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Workout */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Dumbbell className="w-5 h-5 text-orange-500" />
            Quick Workout (15 min)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickWorkouts.map((workout, index) => (
              <Button
                key={index}
                variant={selectedWorkout === workout.name ? "default" : "outline"}
                className="h-auto p-4 flex flex-col items-center gap-2"
                onClick={() => setSelectedWorkout(
                  selectedWorkout === workout.name ? null : workout.name
                )}
              >
                <span className="text-2xl">{workout.emoji}</span>
                <div className="text-center">
                  <p className="font-medium text-sm">{workout.name}</p>
                  <p className="text-xs text-muted-foreground">{workout.duration}</p>
                </div>
              </Button>
            ))}
          </div>
          
          {selectedWorkout && (
            <div className="mt-4 p-3 bg-orange-50 rounded-lg">
              <p className="text-sm font-medium">Selected: {selectedWorkout}</p>
              <div className="text-xs text-muted-foreground mt-1">
                <p>Exercises included:</p>
                <ul className="list-disc list-inside mt-1">
                  {quickWorkouts.find(w => w.name === selectedWorkout)?.exercises.map((exercise, idx) => (
                    <li key={idx}>{exercise}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Period Tracker */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5 text-pink-500" />
            Period Tracker & Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-3 bg-pink-50 rounded-lg">
              <Calendar className="w-6 h-6 mx-auto mb-2 text-pink-500" />
              <p className="text-sm font-medium">Next Period</p>
              <p className="text-xs text-muted-foreground">{periodData.nextPeriod}</p>
            </div>
            
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <Target className="w-6 h-6 mx-auto mb-2 text-green-500" />
              <p className="text-sm font-medium">Fertile Window</p>
              <p className="text-xs text-muted-foreground">
                {periodData.fertileWindow.start} - {periodData.fertileWindow.end}
              </p>
            </div>
            
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <Activity className="w-6 h-6 mx-auto mb-2 text-blue-500" />
              <p className="text-sm font-medium">Current Phase</p>
              <p className="text-xs text-muted-foreground capitalize">{periodData.currentPhase}</p>
            </div>
            
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-purple-500" />
              <p className="text-sm font-medium">Cycle Length</p>
              <p className="text-xs text-muted-foreground">{periodData.cycleLength} days</p>
            </div>
          </div>

          <div className="p-3 bg-pink-50 rounded-lg">
            <p className="text-sm font-medium">🌸 Phase-based Wellness Tip:</p>
            <p className="text-sm">{phaseTip}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Last Period Date</label>
              <Input
                type="date"
                value={periodData.lastPeriod}
                onChange={(e) => setPeriodData({...periodData, lastPeriod: e.target.value})}
                className="mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Cycle Length (days)</label>
              <Input
                type="number"
                value={periodData.cycleLength}
                onChange={(e) => setPeriodData({...periodData, cycleLength: parseInt(e.target.value)})}
                min="21"
                max="35"
                className="mt-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractiveWellnessDashboard;

