import { useState, useEffect, useCallback } from 'react';

export interface UserPreferences {
  name?: string;
  age?: number;
  gender?: 'female' | 'male' | 'other' | 'prefer-not-to-say';
  cycleLength?: number;
  periodDuration?: number;
  lastPeriodDate?: string;
  healthGoals: string[];
  wellnessInterests: string[];
  reminderPreferences: {
    periodReminders: boolean;
    wellnessReminders: boolean;
    appointmentReminders: boolean;
    medicationReminders: boolean;
  };
  communicationStyle: 'encouraging' | 'direct' | 'detailed' | 'brief';
  privacyLevel: 'high' | 'medium' | 'low';
}

export interface HealthData {
  wellnessScore: number;
  lastHealthScan?: {
    date: string;
    result: string;
    confidence: number;
  };
  recentSymptoms: Array<{
    date: string;
    symptoms: string[];
    severity: 'low' | 'medium' | 'high';
  }>;
  wellnessActivities: Array<{
    date: string;
    activity: string;
    duration: number;
    mood: number; // 1-10 scale
  }>;
  cycleHistory: Array<{
    startDate: string;
    endDate: string;
    symptoms: string[];
    mood: number;
  }>;
}

export interface UserContextType {
  preferences: UserPreferences;
  healthData: HealthData;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  updateHealthData: (updates: Partial<HealthData>) => void;
  addSymptom: (symptoms: string[], severity: 'low' | 'medium' | 'high') => void;
  addWellnessActivity: (activity: string, duration: number, mood: number) => void;
  addCycleEntry: (startDate: string, endDate: string, symptoms: string[], mood: number) => void;
  getPersonalizedGreeting: () => string;
  getPersonalizedSuggestions: () => string[];
  getWellnessInsights: () => string[];
  isFirstTimeUser: boolean;
}

const defaultPreferences: UserPreferences = {
  healthGoals: ['better sleep', 'stress management', 'regular exercise'],
  wellnessInterests: ['meditation', 'nutrition', 'fitness'],
  reminderPreferences: {
    periodReminders: true,
    wellnessReminders: true,
    appointmentReminders: true,
    medicationReminders: false,
  },
  communicationStyle: 'encouraging',
  privacyLevel: 'medium',
};

const defaultHealthData: HealthData = {
  wellnessScore: 75,
  recentSymptoms: [],
  wellnessActivities: [],
  cycleHistory: [],
};

export const useUserContext = (): UserContextType => {
  const [preferences, setPreferences] = useState<UserPreferences>(defaultPreferences);
  const [healthData, setHealthData] = useState<HealthData>(defaultHealthData);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedPreferences = localStorage.getItem('wellnesswave-preferences');
    const savedHealthData = localStorage.getItem('wellnesswave-health-data');
    const hasUsedApp = localStorage.getItem('wellnesswave-has-used');

    if (savedPreferences) {
      setPreferences(JSON.parse(savedPreferences));
    }
    if (savedHealthData) {
      setHealthData(JSON.parse(savedHealthData));
    }
    if (hasUsedApp) {
      setIsFirstTimeUser(false);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('wellnesswave-preferences', JSON.stringify(preferences));
  }, [preferences]);

  useEffect(() => {
    localStorage.setItem('wellnesswave-health-data', JSON.stringify(healthData));
  }, [healthData]);

  useEffect(() => {
    if (!isFirstTimeUser) {
      localStorage.setItem('wellnesswave-has-used', 'true');
    }
  }, [isFirstTimeUser]);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({ ...prev, ...updates }));
    if (isFirstTimeUser) {
      setIsFirstTimeUser(false);
    }
  }, [isFirstTimeUser]);

  const updateHealthData = useCallback((updates: Partial<HealthData>) => {
    setHealthData(prev => ({ ...prev, ...updates }));
  }, []);

  const addSymptom = useCallback((symptoms: string[], severity: 'low' | 'medium' | 'high') => {
    const newSymptom = {
      date: new Date().toISOString(),
      symptoms,
      severity,
    };
    setHealthData(prev => ({
      ...prev,
      recentSymptoms: [newSymptom, ...prev.recentSymptoms.slice(0, 9)], // Keep last 10
    }));
  }, []);

  const addWellnessActivity = useCallback((activity: string, duration: number, mood: number) => {
    const newActivity = {
      date: new Date().toISOString(),
      activity,
      duration,
      mood,
    };
    setHealthData(prev => ({
      ...prev,
      wellnessActivities: [newActivity, ...prev.wellnessActivities.slice(0, 19)], // Keep last 20
    }));
    
    // Update wellness score based on activity
    const scoreIncrease = Math.min(5, Math.floor(duration / 10) + Math.floor(mood / 2));
    setHealthData(prev => ({
      ...prev,
      wellnessScore: Math.min(100, prev.wellnessScore + scoreIncrease),
    }));
  }, []);

  const addCycleEntry = useCallback((startDate: string, endDate: string, symptoms: string[], mood: number) => {
    const newCycle = {
      startDate,
      endDate,
      symptoms,
      mood,
    };
    setHealthData(prev => ({
      ...prev,
      cycleHistory: [newCycle, ...prev.cycleHistory.slice(0, 11)], // Keep last 12 cycles
    }));
  }, []);

  const getPersonalizedGreeting = useCallback(() => {
    const hour = new Date().getHours();
    const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
    const name = preferences.name || 'there';
    
    const greetings = {
      encouraging: [
        `Good ${timeOfDay}, ${name}! Ready to make today amazing? 🌟`,
        `Hey ${name}! What wonderful thing will you do for your wellness today? ✨`,
        `Good ${timeOfDay}! I'm here to support your health journey, ${name}! 💚`,
      ],
      direct: [
        `Good ${timeOfDay}, ${name}. How can I help with your health today?`,
        `Hello ${name}. What's your wellness focus today?`,
      ],
      detailed: [
        `Good ${timeOfDay}, ${name}! I hope you're feeling well today. I'm here to help you with any health tracking, wellness planning, or questions you might have. What would you like to work on?`,
      ],
      brief: [
        `Hi ${name}! Ready to focus on your health?`,
        `Good ${timeOfDay}! How can I help?`,
      ],
    };

    const styleGreetings = greetings[preferences.communicationStyle] || greetings.encouraging;
    return styleGreetings[Math.floor(Math.random() * styleGreetings.length)];
  }, [preferences.name, preferences.communicationStyle]);

  const getPersonalizedSuggestions = useCallback(() => {
    const suggestions: string[] = [];
    
    // Based on health goals
    if (preferences.healthGoals.includes('better sleep')) {
      suggestions.push('Track your sleep patterns', 'Try a bedtime routine');
    }
    if (preferences.healthGoals.includes('stress management')) {
      suggestions.push('Practice meditation', 'Try breathing exercises');
    }
    if (preferences.healthGoals.includes('regular exercise')) {
      suggestions.push('Log your workout', 'Plan your exercise routine');
    }

    // Based on wellness interests
    if (preferences.wellnessInterests.includes('meditation')) {
      suggestions.push('Start a meditation session', 'Set meditation reminders');
    }
    if (preferences.wellnessInterests.includes('nutrition')) {
      suggestions.push('Log your meals', 'Get nutrition tips');
    }
    if (preferences.wellnessInterests.includes('fitness')) {
      suggestions.push('Plan your workout', 'Track your fitness progress');
    }

    // Based on recent activity
    const recentActivities = healthData.wellnessActivities.slice(0, 3);
    if (recentActivities.length === 0) {
      suggestions.push('Start your wellness journey', 'Log your first activity');
    } else {
      suggestions.push('Continue your wellness streak', 'Try something new today');
    }

    return suggestions.slice(0, 4); // Return top 4 suggestions
  }, [preferences.healthGoals, preferences.wellnessInterests, healthData.wellnessActivities]);

  const getWellnessInsights = useCallback(() => {
    const insights: string[] = [];
    
    // Wellness score insights
    if (healthData.wellnessScore >= 90) {
      insights.push("You're doing amazing with your wellness goals! 🌟");
    } else if (healthData.wellnessScore >= 75) {
      insights.push("Great job maintaining your wellness routine! 💪");
    } else if (healthData.wellnessScore >= 60) {
      insights.push("You're making good progress! Keep it up! 💚");
    } else {
      insights.push("Every small step counts! You've got this! 🌱");
    }

    // Activity insights
    const recentActivities = healthData.wellnessActivities.slice(0, 7);
    if (recentActivities.length >= 5) {
      insights.push("You've been very active this week! 🎉");
    } else if (recentActivities.length >= 3) {
      insights.push("Nice consistency with your wellness activities! ✨");
    }

    // Cycle insights
    if (preferences.cycleLength && preferences.lastPeriodDate) {
      const lastPeriod = new Date(preferences.lastPeriodDate);
      const daysSince = Math.floor((Date.now() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24));
      const cycleDay = daysSince % (preferences.cycleLength || 28);
      
      if (cycleDay <= 5) {
        insights.push("You're in your menstrual phase - take extra care of yourself! 💜");
      } else if (cycleDay <= 13) {
        insights.push("You're in your follicular phase - great time for new activities! 🌸");
      } else if (cycleDay <= 16) {
        insights.push("You're likely ovulating - energy levels might be high! ⚡");
      } else {
        insights.push("You're in your luteal phase - focus on self-care! 🌙");
      }
    }

    return insights;
  }, [healthData.wellnessScore, healthData.wellnessActivities, preferences.cycleLength, preferences.lastPeriodDate]);

  return {
    preferences,
    healthData,
    updatePreferences,
    updateHealthData,
    addSymptom,
    addWellnessActivity,
    addCycleEntry,
    getPersonalizedGreeting,
    getPersonalizedSuggestions,
    getWellnessInsights,
    isFirstTimeUser,
  };
};

export default useUserContext;

