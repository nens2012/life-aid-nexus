import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar, 
  Bell, 
  Stethoscope, 
  Clock, 
  TrendingUp,
  Heart,
  Activity,
  Calendar as CalendarIcon,
  Sparkles,
  Target,
  Lightbulb,
  MessageCircle,
  Moon,
  Bed,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Brain,
  Thermometer,
  Headphones,
  Zap,
  CheckCircle,
  AlertTriangle,
  Droplets
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import heroImage from "@/assets/wellness-hero.jpg";
import { useUserContext } from "@/hooks/useUserContext";
import WellnessAssistant from "@/components/WellnessAssistant";
import SafetyGuidelines from "@/components/SafetyGuidelines";
import healthIssuesData from "@/data/health-issues.json";

export default function Dashboard() {
  const { 
    preferences, 
    healthData, 
    getPersonalizedGreeting, 
    getPersonalizedSuggestions, 
    getWellnessInsights,
    isFirstTimeUser 
  } = useUserContext();
  
  const [personalizedGreeting, setPersonalizedGreeting] = useState('');
  const [personalizedSuggestions, setPersonalizedSuggestions] = useState<string[]>([]);
  const [wellnessInsights, setWellnessInsights] = useState<string[]>([]);
  
  // Interactive Dashboard States
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  
  // Enhanced Sleep Tracking
  const [sleepData, setSleepData] = useState({
    bedtime: '',
    wakeTime: '',
    sleepDuration: 0,
    energyLevel: '😴',
    recommendedHours: 8,
    last7Days: []
  });
  
  // Health Problem Selection - Simplified
  const [selectedProblem, setSelectedProblem] = useState<string>('');
  
  // Available Health Problems - From JSON data
  const healthProblems = [
    { value: 'PCOD/PCOS', label: '🌸 PCOD/PCOS', emoji: '🌸' },
    { value: 'Back Pain', label: '🦴 Back Pain', emoji: '🦴' },
    { value: 'Neck Pain', label: '🦴 Neck Pain', emoji: '🦴' },
    { value: 'Stress & Anxiety', label: '🧘‍♀️ Stress & Anxiety', emoji: '🧘‍♀️' },
    { value: 'Obesity/Weight Gain', label: '⚖️ Obesity/Weight Gain', emoji: '⚖️' },
    { value: 'Diabetes (Type-2 Early Stage)', label: '🩸 Diabetes (Type-2 Early Stage)', emoji: '🩸' },
    { value: 'Headache/Migraine', label: '🤕 Headache/Migraine', emoji: '🤕' },
    { value: 'Menstrual Cramps', label: '🌸 Menstrual Cramps', emoji: '🌸' }
  ];

  // Daily Exercise/Yoga Tracking - Simplified
  const [exerciseData, setExerciseData] = useState({
    todayCompleted: false,
    currentStreak: 0,
    totalSessions: 0,
    currentExercise: null,
    currentStep: 0,
    isTimerRunning: false,
    timerDuration: 0,
    currentTime: 0,
    exerciseHistory: []
  });

  // Exercise Plans are now loaded from JSON data
  
  // Enhanced Meditation
  const [meditationData, setMeditationData] = useState({
    currentStreak: 0,
    totalSessions: 0,
    totalTime: 0, // minutes
    selectedDuration: 5,
    isPlaying: false,
    isTimerRunning: false,
    currentTime: 0,
    currentInstruction: 0,
    isVoiceGuided: true,
    selectedType: 'breathing',
    meditationHistory: [],
    audioContext: null as AudioContext | null,
    audioSource: null as AudioBufferSourceNode | null,
    backgroundSounds: [
      { name: 'Nature Sounds', url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav' },
      { name: 'Rain', url: 'https://www.soundjay.com/misc/sounds/rain-01.wav' },
      { name: 'Ocean Waves', url: 'https://www.soundjay.com/misc/sounds/ocean-waves.wav' },
      { name: 'Forest', url: 'https://www.soundjay.com/misc/sounds/forest.wav' },
      { name: 'Silence', url: null }
    ],
    selectedSound: 'Nature Sounds',
    meditationTypes: [
      { 
        key: 'breathing', 
        name: 'Breathing Meditation', 
        duration: 5,
        description: 'Focus on your breath with guided instructions',
        instructions: [
          'Sit comfortably with your back straight',
          'Place your hands on your knees, palms up',
          'Close your eyes gently',
          'Breathe in slowly through your nose (4 counts)',
          'Hold your breath (4 counts)',
          'Exhale slowly through your mouth (6 counts)',
          'Repeat this breathing pattern',
          'Focus only on your breath',
          'If thoughts come, gently return to breathing',
          'Feel your body relaxing with each breath'
        ],
        handMovements: [
          'Place hands on knees, palms facing up',
          'As you inhale, slowly lift your hands to chest level',
          'Hold your breath, keep hands at chest level',
          'As you exhale, slowly lower hands back to knees',
          'Repeat this gentle hand movement with each breath cycle'
        ]
      },
      { 
        key: 'mindfulness', 
        name: 'Mindfulness Meditation', 
        duration: 10,
        description: 'Present moment awareness and body scanning',
        instructions: [
          'Sit in a comfortable position',
          'Close your eyes and take 3 deep breaths',
          'Notice the sounds around you without judgment',
          'Feel the weight of your body on the chair/floor',
          'Scan your body from head to toe',
          'Notice any tension and breathe into it',
          'Observe your thoughts like clouds passing by',
          'Return to your breath when distracted',
          'Feel gratitude for this moment',
          'Slowly open your eyes when ready'
        ],
        handMovements: [
          'Start with hands in prayer position at heart center',
          'Slowly separate hands and place on thighs',
          'Gently touch each finger to thumb (finger meditation)',
          'Return hands to prayer position',
          'End with hands at heart center'
        ]
      },
      { 
        key: 'body_scan', 
        name: 'Body Scan Meditation', 
        duration: 15,
        description: 'Progressive relaxation through body awareness',
        instructions: [
          'Lie down or sit comfortably',
          'Close your eyes and take deep breaths',
          'Start at the top of your head',
          'Notice any sensations in your scalp',
          'Move down to your forehead and face',
          'Feel your jaw and neck muscles relax',
          'Continue down to your shoulders and arms',
          'Notice your chest and back',
          'Feel your abdomen and lower back',
          'Move to your hips and legs',
          'End at your feet and toes',
          'Feel your entire body relaxed',
          'Take 3 deep breaths and slowly open your eyes'
        ],
        handMovements: [
          'Start with hands at sides, palms down',
          'As you scan each body part, gently touch that area',
          'Use light, healing touch as you move down',
          'End with hands resting on your abdomen',
          'Feel the gentle rise and fall with each breath'
        ]
      }
    ]
  });
  
  // Water Intake Tracking
  const [waterIntake, setWaterIntake] = useState({
    todayGlasses: 0,
    targetGlasses: 8,
    lastUpdated: new Date().toISOString(),
    history: []
  });
  
  // Wellness Score Calculation
  const calculateWellnessScore = () => {
    try {
      let score = 0;
      const maxScore = 100;
      
      // Sleep quality (25 points)
      const avgSleepDuration = sleepData.last7Days.reduce((sum, day) => sum + day.duration, 0) / 7;
      const sleepScore = Math.min(25, (avgSleepDuration / 8) * 25);
      score += sleepScore;
      
      // Exercise consistency (25 points)
      const exerciseScore = (exerciseData.currentStreak / 7) * 25;
      score += Math.min(25, exerciseScore);
      
      // Meditation streak (25 points)
      const meditationScore = (meditationData.currentStreak / 7) * 25;
      score += Math.min(25, meditationScore);
      
      // Water intake (25 points)
      const avgWaterIntake = waterIntake.history.reduce((sum, day) => sum + day.glasses, 0) / 7;
      const waterScore = (avgWaterIntake / waterIntake.targetGlasses) * 25;
      score += Math.min(25, waterScore);
      
      return Math.round(Math.max(0, Math.min(100, score)));
    } catch (error) {
      console.error('Error calculating wellness score:', error);
      return 0;
    }
  };
  
  const wellnessScore = calculateWellnessScore();

  // Function to save today's sleep data
  const saveTodaysSleep = () => {
    if (!sleepData.bedtime || !sleepData.wakeTime) {
      alert('Please enter both bedtime and wake time');
      return;
    }

    try {
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format
      
      // Calculate sleep duration
      const bedtime = new Date(`2000-01-01T${sleepData.bedtime}`);
      const wakeTime = new Date(`2000-01-01T${sleepData.wakeTime}`);
      if (wakeTime < bedtime) wakeTime.setDate(wakeTime.getDate() + 1);
      const duration = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
      
      // Determine sleep quality based on duration
      let quality = 'poor';
      if (duration >= 8) quality = 'excellent';
      else if (duration >= 7) quality = 'good';
      else if (duration >= 6) quality = 'fair';
      
      const newSleepEntry = {
        date: today,
        duration: Math.max(0, duration),
        quality: quality,
        bedtime: sleepData.bedtime,
        wakeTime: sleepData.wakeTime,
        energyLevel: sleepData.energyLevel
      };
      
      // Update sleep data with new entry
      setSleepData(prev => {
        const updatedHistory = [...prev.last7Days];
        
        // Check if today's entry already exists
        const existingIndex = updatedHistory.findIndex(entry => entry.date === today);
        
        if (existingIndex >= 0) {
          // Update existing entry
          updatedHistory[existingIndex] = newSleepEntry;
        } else {
          // Add new entry
          updatedHistory.push(newSleepEntry);
        }
        
        // Keep only last 7 days, sorted by date (newest first)
        const sortedHistory = updatedHistory
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 7);
        
        return {
          ...prev,
          last7Days: sortedHistory,
          sleepDuration: duration
        };
      });
      
      alert('Sleep data saved successfully!');
    } catch (error) {
      console.error('Error saving sleep data:', error);
      alert('Error saving sleep data. Please try again.');
    }
  };

  // Function to save water intake data
  const saveWaterIntake = (glasses: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      setWaterIntake(prev => {
        const updatedHistory = [...prev.history];
        
        // Check if today's entry already exists
        const existingIndex = updatedHistory.findIndex(entry => entry.date === today);
        
        if (existingIndex >= 0) {
          // Update existing entry
          updatedHistory[existingIndex] = { date: today, glasses };
        } else {
          // Add new entry
          updatedHistory.push({ date: today, glasses });
        }
        
        // Keep only last 7 days, sorted by date (newest first)
        const sortedHistory = updatedHistory
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 7);
        
        return {
          ...prev,
          todayGlasses: glasses,
          history: sortedHistory,
          lastUpdated: new Date().toISOString()
        };
      });
    } catch (error) {
      console.error('Error saving water intake:', error);
    }
  };

  // Timer functionality for exercises
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (exerciseData.isTimerRunning && exerciseData.currentTime < exerciseData.timerDuration) {
      interval = setInterval(() => {
        setExerciseData(prev => {
          const newTime = prev.currentTime + 1;
          
          if (newTime >= prev.timerDuration) {
            // Timer completed
            return {
              ...prev,
              currentTime: prev.timerDuration,
              isTimerRunning: false
            };
          }
          
          // Update current step based on time
          if (prev.currentExercise && prev.currentExercise.steps) {
            let totalStepTime = 0;
            let newStep = 0;
            
            for (let i = 0; i < prev.currentExercise.steps.length; i++) {
              totalStepTime += prev.currentExercise.steps[i].duration;
              if (newTime <= totalStepTime) {
                newStep = i;
                break;
              }
            }
            
            return {
              ...prev,
              currentTime: newTime,
              currentStep: newStep
            };
          }
          
          return {
            ...prev,
            currentTime: newTime
          };
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [exerciseData.isTimerRunning, exerciseData.currentTime, exerciseData.timerDuration]);

  // Timer functionality for meditation
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (meditationData.isTimerRunning && meditationData.currentTime < meditationData.selectedDuration * 60) {
      interval = setInterval(() => {
        setMeditationData(prev => {
          const newTime = prev.currentTime + 1;
          const totalDuration = prev.selectedDuration * 60;
          
          // Update instruction based on progress
          const currentType = prev.meditationTypes.find(t => t.key === prev.selectedType);
          const instructionInterval = totalDuration / (currentType?.instructions.length || 1);
          const newInstruction = Math.floor(newTime / instructionInterval);
          
          if (newTime >= totalDuration) {
            // Timer completed
            return {
              ...prev,
              currentTime: totalDuration,
              isTimerRunning: false,
              isPlaying: false
            };
          }
          return {
            ...prev,
            currentTime: newTime,
            currentInstruction: Math.min(newInstruction, (currentType?.instructions.length || 1) - 1)
          };
        });
      }, 1000);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [meditationData.isTimerRunning, meditationData.currentTime, meditationData.selectedDuration, meditationData.selectedType]);

  // Function to save exercise completion
  const saveExerciseCompletion = (exerciseName: string, duration: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      setExerciseData(prev => {
        const updatedHistory = [...prev.exerciseHistory];
        
        // Check if today's entry already exists
        const existingIndex = updatedHistory.findIndex(entry => entry.date === today);
        
        const newExerciseEntry = {
          date: today,
          exerciseName,
          duration,
          completed: true
        };
        
        if (existingIndex >= 0) {
          // Update existing entry
          updatedHistory[existingIndex] = newExerciseEntry;
        } else {
          // Add new entry
          updatedHistory.push(newExerciseEntry);
        }
        
        // Keep only last 7 days, sorted by date (newest first)
        const sortedHistory = updatedHistory
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 7);
        
        // Calculate streak
        let streak = 0;
        const todayDate = new Date(today);
        for (let i = 0; i < sortedHistory.length; i++) {
          const entryDate = new Date(sortedHistory[i].date);
          const daysDiff = Math.floor((todayDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff === i && sortedHistory[i].completed) {
            streak++;
          } else {
            break;
          }
        }
        
        return {
          ...prev,
          exerciseHistory: sortedHistory,
          currentStreak: streak,
          totalSessions: prev.totalSessions + 1,
          todayCompleted: true
        };
      });
      
      alert(`Great job! You completed ${exerciseName} for ${duration} minutes!`);
    } catch (error) {
      console.error('Error saving exercise completion:', error);
    }
  };

  // Function to get exercises based on selected problem from JSON data
  const getExercisesForSelectedProblem = () => {
    if (!selectedProblem) {
      // Return default exercises from first health issue
      const defaultHealthIssue = healthIssuesData.health_issues[0];
      return defaultHealthIssue.yoga_exercises.map(exercise => ({
        id: 1,
        name: exercise.name,
        duration: Math.floor(exercise.timer / 60),
        description: exercise.description,
        steps: exercise.steps.map((step, index) => ({
          step: `Step ${index + 1}`,
          duration: Math.floor(exercise.timer / exercise.steps.length),
          instruction: step
        })),
        image_url: exercise.image_url,
        timer: exercise.timer
      }));
    }
    
    // Find the health issue from JSON data
    const healthIssue = healthIssuesData.health_issues.find(issue => issue.name === selectedProblem);
    if (healthIssue) {
      return healthIssue.yoga_exercises.map(exercise => ({
        id: Math.random(),
        name: exercise.name,
        duration: Math.floor(exercise.timer / 60),
        description: exercise.description,
        steps: exercise.steps.map((step, index) => ({
          step: `Step ${index + 1}`,
          duration: Math.floor(exercise.timer / exercise.steps.length),
          instruction: step
        })),
        image_url: exercise.image_url,
        timer: exercise.timer
      }));
    }
    
    // Fallback to default exercises
    const defaultHealthIssue = healthIssuesData.health_issues[0];
    return defaultHealthIssue.yoga_exercises.map(exercise => ({
      id: 1,
      name: exercise.name,
      duration: Math.floor(exercise.timer / 60),
      description: exercise.description,
      steps: exercise.steps.map((step, index) => ({
        step: `Step ${index + 1}`,
        duration: Math.floor(exercise.timer / exercise.steps.length),
        instruction: step
      })),
      image_url: exercise.image_url,
      timer: exercise.timer
    }));
  };

  // Function to get exercise suggestions based on health problems
  const getExerciseSuggestions = () => {
    // This would typically come from an API based on user's health data
    // For now, we'll use the healthData from context to suggest exercises
    const suggestions = [];
    
    if (healthData.recentSymptoms.some(s => s.toLowerCase().includes('back'))) {
      suggestions.push('back_pain');
    }
    if (healthData.recentSymptoms.some(s => s.toLowerCase().includes('weight') || s.toLowerCase().includes('fat'))) {
      suggestions.push('weight_loss');
    }
    if (healthData.recentSymptoms.some(s => s.toLowerCase().includes('diabetes') || s.toLowerCase().includes('sugar'))) {
      suggestions.push('diabetes');
    }
    if (healthData.recentSymptoms.some(s => s.toLowerCase().includes('heart') || s.toLowerCase().includes('cardiac'))) {
      suggestions.push('heart_health');
    }
    if (healthData.recentSymptoms.some(s => s.toLowerCase().includes('joint') || s.toLowerCase().includes('arthritis'))) {
      suggestions.push('arthritis');
    }
    
    return suggestions.length > 0 ? suggestions[0] : 'normal';
  };

  // Meditation audio functions
  const initializeAudio = async () => {
    try {
      if (!meditationData.audioContext) {
        const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const audioContext = new AudioContextClass();
        setMeditationData(prev => ({ ...prev, audioContext }));
      }
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  };

  const playBackgroundSound = async () => {
    try {
      const selectedSoundData = meditationData.backgroundSounds.find(s => s.name === meditationData.selectedSound);
      if (!selectedSoundData || !selectedSoundData.url) return;

      await initializeAudio();
      
      if (meditationData.audioContext) {
        const response = await fetch(selectedSoundData.url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await meditationData.audioContext.decodeAudioData(arrayBuffer);
        
        const source = meditationData.audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(meditationData.audioContext.destination);
        source.start();
        
        setMeditationData(prev => ({ ...prev, audioSource: source, isPlaying: true }));
      }
    } catch (error) {
      console.error('Error playing background sound:', error);
      // Fallback to simple audio element
      const audio = new Audio(selectedSoundData?.url);
      audio.loop = true;
      audio.play();
    }
  };

  const stopBackgroundSound = () => {
    try {
      if (meditationData.audioSource) {
        meditationData.audioSource.stop();
        setMeditationData(prev => ({ ...prev, audioSource: null, isPlaying: false }));
      }
    } catch (error) {
      console.error('Error stopping background sound:', error);
    }
  };

  // Function to save meditation completion
  const saveMeditationCompletion = (meditationType: string, duration: number) => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      setMeditationData(prev => {
        const updatedHistory = [...prev.meditationHistory];
        
        // Check if today's entry already exists
        const existingIndex = updatedHistory.findIndex(entry => entry.date === today);
        
        const newMeditationEntry = {
          date: today,
          type: meditationType,
          duration,
          completed: true
        };
        
        if (existingIndex >= 0) {
          // Update existing entry
          updatedHistory[existingIndex] = newMeditationEntry;
        } else {
          // Add new entry
          updatedHistory.push(newMeditationEntry);
        }
        
        // Keep only last 7 days, sorted by date (newest first)
        const sortedHistory = updatedHistory
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .slice(0, 7);
        
        // Calculate streak
        let streak = 0;
        const todayDate = new Date(today);
        for (let i = 0; i < sortedHistory.length; i++) {
          const entryDate = new Date(sortedHistory[i].date);
          const daysDiff = Math.floor((todayDate.getTime() - entryDate.getTime()) / (1000 * 60 * 60 * 24));
          if (daysDiff === i && sortedHistory[i].completed) {
            streak++;
          } else {
            break;
          }
        }
        
        return {
          ...prev,
          meditationHistory: sortedHistory,
          currentStreak: streak,
          totalSessions: prev.totalSessions + 1,
          totalTime: prev.totalTime + duration
        };
      });
      
      alert(`Great job! You completed ${meditationType} meditation for ${duration} minutes!`);
    } catch (error) {
      console.error('Error saving meditation completion:', error);
    }
  };

  // Load data from localStorage on component mount
  useEffect(() => {
    try {
      const savedSleepData = localStorage.getItem('wellnesswave-sleep-data');
      if (savedSleepData) {
        const parsed = JSON.parse(savedSleepData);
        setSleepData(parsed);
      }
      
      const savedWaterData = localStorage.getItem('wellnesswave-water-data');
      if (savedWaterData) {
        const parsed = JSON.parse(savedWaterData);
        setWaterIntake(parsed);
      }
      
      const savedExerciseData = localStorage.getItem('wellnesswave-exercise-data');
      if (savedExerciseData) {
        const parsed = JSON.parse(savedExerciseData);
        setExerciseData(parsed);
      }
      
      const savedMeditationData = localStorage.getItem('wellnesswave-meditation-data');
      if (savedMeditationData) {
        const parsed = JSON.parse(savedMeditationData);
        setMeditationData(parsed);
      }
      
      const savedSelectedProblem = localStorage.getItem('wellnesswave-selected-problem');
      if (savedSelectedProblem) {
        const parsed = JSON.parse(savedSelectedProblem);
        setSelectedProblem(parsed);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    }
    
    // Separate useEffect for water intake history loading
  }, []);
  
  // Load today's water intake from history if available
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayEntry = waterIntake.history.find(entry => entry.date === today);
    if (todayEntry && waterIntake.todayGlasses === 0) {
      setWaterIntake(prev => ({ ...prev, todayGlasses: todayEntry.glasses }));
    }
  }, [waterIntake.history, waterIntake.todayGlasses]);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wellnesswave-sleep-data', JSON.stringify(sleepData));
    } catch (error) {
      console.error('Error saving sleep data:', error);
    }
  }, [sleepData]);

  useEffect(() => {
    try {
      localStorage.setItem('wellnesswave-water-data', JSON.stringify(waterIntake));
    } catch (error) {
      console.error('Error saving water data:', error);
    }
  }, [waterIntake]);

  useEffect(() => {
    try {
      localStorage.setItem('wellnesswave-exercise-data', JSON.stringify(exerciseData));
    } catch (error) {
      console.error('Error saving exercise data:', error);
    }
  }, [exerciseData]);

  useEffect(() => {
    try {
      localStorage.setItem('wellnesswave-meditation-data', JSON.stringify(meditationData));
    } catch (error) {
      console.error('Error saving meditation data:', error);
    }
  }, [meditationData]);

  useEffect(() => {
    try {
      localStorage.setItem('wellnesswave-selected-problem', JSON.stringify(selectedProblem));
    } catch (error) {
      console.error('Error saving selected problem:', error);
    }
  }, [selectedProblem]);

  // Update personalized content when context changes
  useEffect(() => {
    try {
      setPersonalizedGreeting(getPersonalizedGreeting());
      setPersonalizedSuggestions(getPersonalizedSuggestions());
      setWellnessInsights(getWellnessInsights());
    } catch (error) {
      console.error('Error updating personalized content:', error);
    }
  }, [getPersonalizedGreeting, getPersonalizedSuggestions, getWellnessInsights]);

  // Calculate next period based on user data
  const nextPeriod = preferences.lastPeriodDate && preferences.cycleLength 
    ? new Date(new Date(preferences.lastPeriodDate).getTime() + (preferences.cycleLength * 24 * 60 * 60 * 1000))
    : new Date(Date.now() + 5 * 24 * 60 * 60 * 1000);

  const lastScan = healthData.lastHealthScan || { result: "No recent scan", confidence: 0, date: "Never" };
  
  const upcomingReminders = [
    { id: 1, title: "Morning Meditation", time: "9:00 AM", type: "wellness" },
    { id: 2, title: "Hydration Check", time: "2:00 PM", type: "health" },
    { id: 3, title: "Evening Walk", time: "6:00 PM", type: "exercise" }
  ];
  
  const nextAppointment = { 
    doctor: "Dr. Sarah Wilson", 
    date: "March 15, 2025", 
    time: "2:30 PM",
    specialty: "Gynecology"
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-primary text-white">
        <div className="absolute inset-0 opacity-20">
          <img 
            src={heroImage} 
            alt="Wellness" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative px-8 py-12 md:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              {personalizedGreeting || "Welcome back to WellnessWave"}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-6">
              Your personal health companion for tracking, planning, and thriving. 
              {isFirstTimeUser && " Let's start your wellness journey together! 🌟"}
            </p>
            
            {/* Personalized Suggestions */}
            {personalizedSuggestions.length > 0 && (
              <div className="mb-6">
                <p className="text-sm opacity-80 mb-3">Quick actions for you:</p>
                <div className="flex flex-wrap gap-2">
                  {personalizedSuggestions.slice(0, 3).map((suggestion, index) => (
                    <Button
                      key={index}
                      variant="outline"
                      size="sm"
                      className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex flex-wrap gap-4">
              <Button variant="hero" size="lg" asChild>
                <Link to="/health-scanner">
                  <Stethoscope className="w-5 h-5" />
                  Health Scan
                </Link>
              </Button>
              <Button variant="outline" size="lg" className="bg-white/10 border-white/20 text-white hover:bg-white/20" asChild>
                <Link to="/period-tracker">
                  <Calendar className="w-5 h-5" />
                  Log Period
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Sleep Tracking */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="shadow-soft hover:shadow-wellness transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Moon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Track your sleep patterns</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Daily sleep tracking with energy level analysis
                </p>
                <div className="text-2xl">{sleepData.energyLevel}</div>
                <div className="text-xs text-muted-foreground mt-2">
                  {sleepData.last7Days.length > 0 
                    ? `${sleepData.last7Days[0]?.duration.toFixed(1) || 0}h last night`
                    : 'No data yet'
                  }
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <Moon className="w-5 h-5" />
                Sleep Pattern Tracker
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* Daily Sleep Questions */}
              <div className="p-4 bg-primary/5 rounded-lg">
                <h4 className="font-semibold mb-3">Today's Sleep Log</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedtime">What time did you sleep?</Label>
                    <Input
                      id="bedtime"
                      type="time"
                      value={sleepData.bedtime}
                      onChange={(e) => setSleepData(prev => ({ ...prev, bedtime: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                  <div>
                    <Label htmlFor="wakeTime">What time did you wake up?</Label>
                    <Input
                      id="wakeTime"
                      type="time"
                      value={sleepData.wakeTime}
                      onChange={(e) => setSleepData(prev => ({ ...prev, wakeTime: e.target.value }))}
                      className="mt-2"
                    />
                  </div>
                </div>
                
                {/* Auto-calculated sleep duration */}
                {sleepData.bedtime && sleepData.wakeTime && (
                  <div className="mt-4 p-3 bg-muted/30 rounded">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Sleep Duration:</span>
                      <span className="text-lg font-bold text-primary">
                        {(() => {
                          try {
                            const bedtime = new Date(`2000-01-01T${sleepData.bedtime}`);
                            const wakeTime = new Date(`2000-01-01T${sleepData.wakeTime}`);
                            if (wakeTime < bedtime) wakeTime.setDate(wakeTime.getDate() + 1);
                            const duration = (wakeTime.getTime() - bedtime.getTime()) / (1000 * 60 * 60);
                            return `${Math.max(0, duration).toFixed(1)}h`;
                          } catch (error) {
                            console.error('Error calculating sleep duration:', error);
                            return '0.0h';
                          }
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm text-muted-foreground">Recommended:</span>
                      <span className="text-sm text-muted-foreground">{sleepData.recommendedHours}h</span>
                    </div>
                  </div>
                )}
                
                {/* Save Button */}
                <div className="mt-4">
                  <Button 
                    onClick={saveTodaysSleep}
                    className="w-full"
                    variant="wellness"
                  >
                    Save Today's Sleep Data
                  </Button>
                </div>
              </div>
              
              {/* Energy Level Assessment */}
              <div>
                <Label className="text-base font-medium">How do you feel today?</Label>
                <div className="flex gap-2 mt-2">
                  {[
                    { emoji: '😴', level: 'Low', description: 'Tired, need more rest' },
                    { emoji: '🙂', level: 'Medium', description: 'Good energy, feeling balanced' },
                    { emoji: '⚡', level: 'High', description: 'Energized and ready to go' }
                  ].map((item) => (
                    <Button
                      key={item.emoji}
                      variant={sleepData.energyLevel === item.emoji ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSleepData(prev => ({ ...prev, energyLevel: item.emoji }))}
                      className="flex flex-col items-center gap-1 h-auto p-3"
                    >
                      <span className="text-2xl">{item.emoji}</span>
                      <span className="text-xs">{item.level}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Sleep History & Analysis */}
              <div>
                <h4 className="font-semibold mb-3">Sleep History & Analysis</h4>
                {sleepData.last7Days.length === 0 ? (
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">No sleep data recorded yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Enter your bedtime and wake time above, then click "Save Today's Sleep Data" to start tracking.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {sleepData.last7Days.map((day, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium w-16">
                            {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {day.bedtime} - {day.wakeTime}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-muted rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                day.duration >= 8 ? 'bg-green-500' : 
                                day.duration >= 6 ? 'bg-yellow-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${Math.min(100, (day.duration / 10) * 100)}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium w-12">{day.duration.toFixed(1)}h</span>
                          <Badge variant="outline" className="text-xs">
                            {day.quality}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                {/* Sleep Insights */}
                {sleepData.last7Days.length > 0 && (
                  <div className="mt-4 p-3 bg-success/5 rounded-lg">
                    <h5 className="font-medium mb-2">Sleep Insights</h5>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>• Average sleep: {(() => {
                        try {
                          const avg = sleepData.last7Days.reduce((sum, day) => sum + day.duration, 0) / sleepData.last7Days.length;
                          return avg.toFixed(1);
                        } catch (error) {
                          return '0.0';
                        }
                      })()}h</p>
                      <p>• Best sleep quality: {sleepData.last7Days.find(day => day.quality === 'excellent') ? 'Excellent' : 'Good'}</p>
                      <p>• Consistency: {sleepData.last7Days.filter(day => day.duration >= 7).length}/{sleepData.last7Days.length} days</p>
                      <p>• Total entries: {sleepData.last7Days.length} days recorded</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Daily Exercise/Yoga */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="shadow-soft hover:shadow-wellness transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-teal-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Activity className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Daily Exercise/Yoga</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Personalized plans with PCOS specialization
                </p>
                <div className="text-sm text-success">
                  {exerciseData.todayCompleted ? '✅ Completed' : '⏰ Pending'}
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {exerciseData.currentStreak} day streak
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5" />
                Daily Exercise/Yoga
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* Health Problem Selection - Simplified */}
              <div>
                <Label className="text-base font-medium mb-3 block">Select Your Health Concern</Label>
                <p className="text-sm text-muted-foreground mb-4">Choose the health issue you'd like to address with exercise:</p>
                <Select value={selectedProblem} onValueChange={setSelectedProblem}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a health concern..." />
                  </SelectTrigger>
                  <SelectContent>
                    {healthProblems.map((problem) => (
                      <SelectItem key={problem.value} value={problem.value}>
                        {problem.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                {selectedProblem && (
                  <div className="mt-4 p-3 bg-primary/5 rounded-lg">
                    <h5 className="font-medium mb-2">✅ Selected Health Concern</h5>
                    <p className="text-sm text-muted-foreground">
                      We'll show exercises specifically designed for: <strong>{healthProblems.find(p => p.value === selectedProblem)?.label}</strong>
                    </p>
                  </div>
                )}
              </div>
              
              {/* Today's Exercise Plan */}
              <div>
                <h4 className="font-semibold mb-3">
                  {selectedProblem 
                    ? `Recommended Exercises for ${healthProblems.find(p => p.value === selectedProblem)?.label}` 
                    : 'Today\'s Exercise Plan'
                  }
                </h4>
                <div className="space-y-4">
                  {getExercisesForSelectedProblem().map((exercise, index) => (
                    <div key={index} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-medium text-lg">{exercise.name}</h5>
                          <p className="text-sm text-muted-foreground">{exercise.description}</p>
                          <p className="text-xs text-primary mt-1">Duration: {exercise.duration} minutes</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{exercise.duration} min</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setExerciseData(prev => ({ 
                              ...prev, 
                              currentExercise: exercise,
                              timerDuration: exercise.duration * 60,
                              currentTime: 0,
                              currentStep: 0,
                              isTimerRunning: false
                            }))}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Exercise Steps */}
                      <div className="mt-3">
                        <h6 className="font-medium text-sm mb-2">Exercise Steps:</h6>
                        <div className="space-y-2">
                          {exercise.steps.map((step, stepIndex) => (
                            <div key={stepIndex} className="flex items-start gap-3 p-2 bg-white/50 rounded">
                              <span className="text-primary font-bold text-xs mt-1 min-w-[20px]">{stepIndex + 1}.</span>
                              <div className="flex-1">
                                <p className="text-sm font-medium">{step.step}</p>
                                <p className="text-xs text-muted-foreground mt-1">{step.instruction}</p>
                                <p className="text-xs text-primary mt-1">
                                  Duration: {Math.floor(step.duration / 60)}:{(step.duration % 60).toString().padStart(2, '0')}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Exercise Timer */}
              {exerciseData.currentExercise && (
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-3">Exercise Timer - {exerciseData.currentExercise.name}</h4>
                  
                  {/* Current Step Display */}
                  {exerciseData.currentExercise.steps && exerciseData.currentExercise.steps[exerciseData.currentStep] && (
                    <div className="mb-4 p-4 bg-white/50 rounded-lg">
                      <div className="flex items-start gap-4">
                        <div className="flex-1">
                          <h5 className="font-medium mb-2">Current Step: {exerciseData.currentStep + 1} of {exerciseData.currentExercise.steps.length}</h5>
                          <p className="text-sm font-medium mb-1">
                            {exerciseData.currentExercise.steps[exerciseData.currentStep].step}
                          </p>
                          <p className="text-sm text-muted-foreground mb-2">
                            {exerciseData.currentExercise.steps[exerciseData.currentStep].instruction}
                          </p>
                          <div className="text-xs text-primary">
                            Duration: {Math.floor(exerciseData.currentExercise.steps[exerciseData.currentStep].duration / 60)}:{(exerciseData.currentExercise.steps[exerciseData.currentStep].duration % 60).toString().padStart(2, '0')}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  
                  {/* Video Player */}
                  {exerciseData.currentExercise.video && (
                    <div className="mb-4">
                      <h5 className="font-medium mb-2">Exercise Video Guide</h5>
                      <div className="relative w-full h-48 bg-muted rounded-lg overflow-hidden">
                        <iframe
                          src={exerciseData.currentExercise.video}
                          className="w-full h-full"
                          allowFullScreen
                          title={exerciseData.currentExercise.name}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <div className="text-4xl font-bold text-primary mb-2">
                      {Math.floor(exerciseData.currentTime / 60)}:{(exerciseData.currentTime % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="text-sm text-muted-foreground mb-2">
                      Target: {Math.floor(exerciseData.timerDuration / 60)}:{(exerciseData.timerDuration % 60).toString().padStart(2, '0')}
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 mb-4">
                      <div 
                        className="bg-primary h-3 rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min(100, (exerciseData.currentTime / exerciseData.timerDuration) * 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-center gap-4">
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setExerciseData(prev => ({ ...prev, isTimerRunning: !prev.isTimerRunning }))}
                        disabled={exerciseData.currentTime >= exerciseData.timerDuration}
                      >
                        {exerciseData.isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="lg"
                        onClick={() => setExerciseData(prev => ({ 
                          ...prev, 
                          currentExercise: null,
                          isTimerRunning: false,
                          currentTime: 0,
                          currentStep: 0
                        }))}
                      >
                        Stop
                      </Button>
                      {exerciseData.currentTime >= exerciseData.timerDuration && (
                        <Button
                          variant="default"
                          size="lg"
                          onClick={() => {
                            saveExerciseCompletion(exerciseData.currentExercise.name, exerciseData.currentExercise.duration);
                            setExerciseData(prev => ({ 
                              ...prev, 
                              currentExercise: null,
                              isTimerRunning: false,
                              currentTime: 0,
                              currentStep: 0
                            }));
                          }}
                        >
                          Mark Complete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Goal Tracking */}
              <div className="p-4 bg-success/5 rounded-lg">
                <h4 className="font-semibold mb-3">Today's Goal</h4>
                <div className="flex items-center justify-between">
                  <span>Did you complete today's exercises?</span>
                  <Button
                    variant={exerciseData.todayCompleted ? "default" : "outline"}
                    onClick={() => setExerciseData(prev => ({ 
                      ...prev, 
                      todayCompleted: !prev.todayCompleted,
                      currentStreak: !prev.todayCompleted ? prev.currentStreak + 1 : prev.currentStreak
                    }))}
                  >
                    {exerciseData.todayCompleted ? <CheckCircle className="w-4 h-4" /> : 'Mark Complete'}
                  </Button>
                </div>
              </div>
              
              {/* Exercise History */}
              <div>
                <h4 className="font-semibold mb-3">Exercise History</h4>
                {exerciseData.exerciseHistory.length === 0 ? (
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">No exercise data recorded yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Complete an exercise using the timer above to start tracking your progress.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {exerciseData.exerciseHistory.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium w-16">
                            {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-sm font-medium">{entry.exerciseName}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{entry.duration} min</span>
                          <Badge variant="outline" className="text-xs">
                            {entry.completed ? 'Completed' : 'Incomplete'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4 text-center mt-4">
                  <div className="p-3 bg-muted/30 rounded">
                    <div className="text-2xl font-bold text-success">{exerciseData.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <div className="text-2xl font-bold text-primary">{exerciseData.totalSessions}</div>
                    <div className="text-sm text-muted-foreground">Total Sessions</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <div className="text-2xl font-bold text-warning">
                      {exerciseData.exerciseHistory.length > 0 
                        ? Math.round((exerciseData.exerciseHistory.filter(e => e.completed).length / 7) * 100)
                        : 0}%
                    </div>
                    <div className="text-sm text-muted-foreground">Weekly Goal</div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Meditation */}
        <Dialog>
          <DialogTrigger asChild>
            <Card className="shadow-soft hover:shadow-wellness transition-all duration-300 cursor-pointer group">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Headphones className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Practice meditation</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Voice-guided sessions with streak tracking
                </p>
                <div className="text-sm text-success">
                  {meditationData.currentStreak} day streak
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  {meditationData.totalSessions} total sessions
                </div>
              </CardContent>
            </Card>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            <DialogHeader className="flex-shrink-0">
              <DialogTitle className="flex items-center gap-2">
                <Headphones className="w-5 h-5" />
                Voice-Guided Meditation
              </DialogTitle>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto pr-2 space-y-6">
              {/* Meditation Type Selection */}
              <div>
                <Label className="text-base font-medium mb-3 block">Choose Meditation Type</Label>
                <div className="space-y-3">
                  {meditationData.meditationTypes.map((type) => (
                    <div key={type.key} className="p-4 bg-muted/30 rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h5 className="font-medium text-lg">{type.name}</h5>
                          <p className="text-sm text-muted-foreground">{type.description}</p>
                          <p className="text-xs text-primary mt-1">Duration: {type.duration} minutes</p>
                        </div>
                        <Button
                          variant={meditationData.selectedType === type.key ? "default" : "outline"}
                          onClick={() => setMeditationData(prev => ({ 
                            ...prev, 
                            selectedType: type.key,
                            selectedDuration: type.duration,
                            currentTime: 0,
                            currentInstruction: 0
                          }))}
                        >
                          Select
                        </Button>
                      </div>
                      
                      {/* Meditation Instructions Preview */}
                      <div className="mt-3">
                        <h6 className="font-medium text-sm mb-2">Instructions:</h6>
                        <ol className="text-sm text-muted-foreground space-y-1">
                          {type.instructions.slice(0, 3).map((instruction, instIndex) => (
                            <li key={instIndex} className="flex items-start gap-2">
                              <span className="text-primary font-bold text-xs mt-1">{instIndex + 1}.</span>
                              <span>{instruction}</span>
                            </li>
                          ))}
                          {type.instructions.length > 3 && (
                            <li className="text-xs text-muted-foreground italic">
                              ... and {type.instructions.length - 3} more steps
                            </li>
                          )}
                        </ol>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Background Sound Selection */}
              <div>
                <Label className="text-base font-medium mb-3 block">Background Sound</Label>
                <div className="grid grid-cols-2 gap-2">
                  {meditationData.backgroundSounds.map((sound) => (
                    <Button
                      key={sound.name}
                      variant={meditationData.selectedSound === sound.name ? "default" : "outline"}
                      onClick={() => setMeditationData(prev => ({ ...prev, selectedSound: sound.name }))}
                      className="h-auto p-3 flex flex-col items-center gap-1"
                    >
                      <span className="font-medium text-sm">{sound.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
              
              {/* Voice Guidance Toggle */}
              <div className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div>
                  <span className="font-medium">Voice Guidance</span>
                  <p className="text-sm text-muted-foreground">AI voice will guide you through the session</p>
                </div>
                <Button
                  variant={meditationData.isVoiceGuided ? "default" : "outline"}
                  onClick={() => setMeditationData(prev => ({ ...prev, isVoiceGuided: !prev.isVoiceGuided }))}
                >
                  {meditationData.isVoiceGuided ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </Button>
              </div>
              
              {/* Meditation Player */}
              <div className="text-center p-6 bg-muted/30 rounded-lg">
                <h4 className="font-semibold mb-3">
                  {meditationData.meditationTypes.find(t => t.key === meditationData.selectedType)?.name}
                </h4>
                <div className="text-4xl font-bold text-primary mb-2">
                  {Math.floor(meditationData.currentTime / 60)}:{(meditationData.currentTime % 60).toString().padStart(2, '0')}
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  Target: {meditationData.selectedDuration}:00
                </div>
                <div className="w-full bg-muted rounded-full h-3 mb-4">
                  <div 
                    className="bg-primary h-3 rounded-full transition-all duration-1000" 
                    style={{ width: `${Math.min(100, (meditationData.currentTime / (meditationData.selectedDuration * 60)) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-center gap-4">
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      if (meditationData.isTimerRunning) {
                        setMeditationData(prev => ({ ...prev, isTimerRunning: false }));
                        stopBackgroundSound();
                      } else {
                        setMeditationData(prev => ({ ...prev, isTimerRunning: true }));
                        if (meditationData.selectedSound !== 'Silence') {
                          playBackgroundSound();
                        }
                      }
                    }}
                    disabled={meditationData.currentTime >= meditationData.selectedDuration * 60}
                  >
                    {meditationData.isTimerRunning ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    size="lg"
                    onClick={() => {
                      setMeditationData(prev => ({ 
                        ...prev, 
                        currentTime: 0, 
                        isTimerRunning: false,
                        currentInstruction: 0
                      }));
                      stopBackgroundSound();
                    }}
                  >
                    Reset
                  </Button>
                  {meditationData.currentTime >= meditationData.selectedDuration * 60 && (
                    <Button
                      variant="default"
                      size="lg"
                      onClick={() => {
                        const currentType = meditationData.meditationTypes.find(t => t.key === meditationData.selectedType);
                        saveMeditationCompletion(currentType?.name || 'Meditation', meditationData.selectedDuration);
                        setMeditationData(prev => ({ 
                          ...prev, 
                          currentTime: 0,
                          isTimerRunning: false,
                          currentInstruction: 0
                        }));
                        stopBackgroundSound();
                      }}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              </div>
              
              {/* Current Instruction & Hand Movements */}
              {meditationData.isTimerRunning && (
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-3">Current Instruction</h4>
                  {(() => {
                    const currentType = meditationData.meditationTypes.find(t => t.key === meditationData.selectedType);
                    const currentInstruction = currentType?.instructions[meditationData.currentInstruction] || '';
                    const currentHandMovement = currentType?.handMovements[meditationData.currentInstruction] || '';
                    
                    return (
                      <div className="space-y-3">
                        <div className="p-3 bg-white/50 rounded-lg">
                          <h5 className="font-medium text-sm mb-2">📝 What to do:</h5>
                          <p className="text-sm text-muted-foreground">{currentInstruction}</p>
                        </div>
                        {currentHandMovement && (
                          <div className="p-3 bg-white/50 rounded-lg">
                            <h5 className="font-medium text-sm mb-2">🤲 Hand Position:</h5>
                            <p className="text-sm text-muted-foreground">{currentHandMovement}</p>
                          </div>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Step {meditationData.currentInstruction + 1} of {currentType?.instructions.length || 1}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
              
              {/* Full Instructions Preview */}
              {!meditationData.isTimerRunning && (
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-3">Complete Instructions</h4>
                  {(() => {
                    const currentType = meditationData.meditationTypes.find(t => t.key === meditationData.selectedType);
                    return (
                      <div className="space-y-4">
                        <div>
                          <h5 className="font-medium text-sm mb-2">📝 Step-by-step Guide:</h5>
                          <ol className="text-sm text-muted-foreground space-y-1">
                            {currentType?.instructions.map((instruction, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary font-bold text-xs mt-1">{index + 1}.</span>
                                <span>{instruction}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                        <div>
                          <h5 className="font-medium text-sm mb-2">🤲 Hand Movements:</h5>
                          <ol className="text-sm text-muted-foreground space-y-1">
                            {currentType?.handMovements.map((movement, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-primary font-bold text-xs mt-1">{index + 1}.</span>
                                <span>{movement}</span>
                              </li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}
              
              {/* Meditation History */}
              <div>
                <h4 className="font-semibold mb-3">Meditation History</h4>
                {meditationData.meditationHistory.length === 0 ? (
                  <div className="text-center p-6 bg-muted/30 rounded-lg">
                    <p className="text-muted-foreground">No meditation data recorded yet.</p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Complete a meditation session using the timer above to start tracking your progress.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {meditationData.meditationHistory.map((entry, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium w-16">
                            {new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                          <span className="text-sm font-medium">{entry.type}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium">{entry.duration} min</span>
                          <Badge variant="outline" className="text-xs">
                            {entry.completed ? 'Completed' : 'Incomplete'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="grid grid-cols-3 gap-4 text-center mt-4">
                  <div className="p-3 bg-muted/30 rounded">
                    <div className="text-2xl font-bold text-success">{meditationData.currentStreak}</div>
                    <div className="text-sm text-muted-foreground">Day Streak</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <div className="text-2xl font-bold text-primary">{meditationData.totalSessions}</div>
                    <div className="text-sm text-muted-foreground">Total Sessions</div>
                  </div>
                  <div className="p-3 bg-muted/30 rounded">
                    <div className="text-2xl font-bold text-warning">{meditationData.totalTime}</div>
                    <div className="text-sm text-muted-foreground">Total Minutes</div>
                  </div>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

      </div>

      {/* Real-time Wellness Score */}
      <Card className="shadow-soft border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Real-time Wellness Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Overall Score */}
            <div className="text-center p-6 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg">
              <div className="text-4xl font-bold text-primary mb-2">{wellnessScore}%</div>
              <div className="text-sm text-muted-foreground">Overall Wellness</div>
              <div className="w-full bg-muted rounded-full h-2 mt-3">
                <div 
                  className={`h-2 rounded-full transition-all duration-1000 ${
                    wellnessScore >= 80 ? 'bg-green-500' : 
                    wellnessScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${wellnessScore}%` }}
                />
              </div>
            </div>
            
            {/* Sleep Score */}
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Moon className="w-6 h-6 text-blue-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-blue-600">
                {(() => {
                  try {
                    return Math.round((sleepData.last7Days.reduce((sum, day) => sum + day.duration, 0) / 7 / 8) * 25);
                  } catch (error) {
                    return 0;
                  }
                })()}
              </div>
              <div className="text-sm text-muted-foreground">Sleep Quality</div>
            </div>
            
            {/* Exercise Score */}
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Activity className="w-6 h-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {Math.round((exerciseData.currentStreak / 7) * 25)}
              </div>
              <div className="text-sm text-muted-foreground">Exercise Consistency</div>
            </div>
            
            {/* Meditation Score */}
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <Headphones className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-purple-600">
                {Math.round((meditationData.currentStreak / 7) * 25)}
              </div>
              <div className="text-sm text-muted-foreground">Meditation Streak</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Daily Wellness Planner */}
      <Card className="shadow-soft">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-primary" />
            Daily Wellness Planner
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Water Intake */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-blue-600" />
                <h4 className="font-semibold">Water Intake</h4>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {waterIntake.todayGlasses}/{waterIntake.targetGlasses}
                </div>
                <div className="text-sm text-muted-foreground">Glasses Today</div>
                <div className="w-full bg-muted rounded-full h-2 mt-3">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-1000" 
                    style={{ width: `${(waterIntake.todayGlasses / waterIntake.targetGlasses) * 100}%` }}
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newGlasses = Math.min(waterIntake.targetGlasses, waterIntake.todayGlasses + 1);
                    saveWaterIntake(newGlasses);
                  }}
                  className="flex-1"
                >
                  +1 Glass
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const newGlasses = Math.max(0, waterIntake.todayGlasses - 1);
                    saveWaterIntake(newGlasses);
                  }}
                >
                  -1
                </Button>
              </div>
            </div>
            
            {/* Exercise Time */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-green-600" />
                <h4 className="font-semibold">Exercise Time</h4>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-green-600 mb-2">
                  {exerciseData.todayCompleted ? '✅' : '⏰'}
                </div>
                <div className="text-sm text-muted-foreground">
                  {exerciseData.todayCompleted ? 'Completed' : 'Pending'}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {exerciseData.currentStreak} day streak
                </div>
              </div>
              <Button
                variant={exerciseData.todayCompleted ? "default" : "outline"}
                size="sm"
                className="w-full"
                onClick={() => setExerciseData(prev => ({ 
                  ...prev, 
                  todayCompleted: !prev.todayCompleted 
                }))}
              >
                {exerciseData.todayCompleted ? 'Mark Incomplete' : 'Mark Complete'}
              </Button>
            </div>
            
            {/* Meditation Time */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Headphones className="w-5 h-5 text-purple-600" />
                <h4 className="font-semibold">Meditation Time</h4>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {meditationData.currentStreak}
                </div>
                <div className="text-sm text-muted-foreground">Day Streak</div>
                <div className="text-xs text-muted-foreground mt-2">
                  {meditationData.totalSessions} total sessions
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => setMeditationData(prev => ({ 
                  ...prev, 
                  currentStreak: prev.currentStreak + 1,
                  totalSessions: prev.totalSessions + 1
                }))}
              >
                Complete Session
              </Button>
            </div>
            
            {/* Daily Reminders */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-600" />
                <h4 className="font-semibold">Today's Reminders</h4>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                  <span>Morning Exercise</span>
                  <Badge variant="outline">9:00 AM</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                  <span>Water Break</span>
                  <Badge variant="outline">2:00 PM</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                  <span>Evening Meditation</span>
                  <Badge variant="outline">8:00 PM</Badge>
                </div>
                <div className="flex items-center justify-between p-2 bg-muted/30 rounded text-sm">
                  <span>Bedtime Routine</span>
                  <Badge variant="outline">10:00 PM</Badge>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="text-center p-6 shadow-soft">
          <Heart className="w-8 h-8 text-primary mx-auto mb-2" />
          <div className="text-2xl font-bold">{preferences.cycleLength || 28}</div>
          <div className="text-sm text-muted-foreground">Avg Cycle</div>
        </Card>
        <Card className="text-center p-6 shadow-soft">
          <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
          <div className="text-2xl font-bold">{wellnessScore}%</div>
          <div className="text-sm text-muted-foreground">Wellness Score</div>
        </Card>
        <Card className="text-center p-6 shadow-soft">
          <Activity className="w-8 h-8 text-warning mx-auto mb-2" />
          <div className="text-2xl font-bold">{healthData.recentSymptoms.length}</div>
          <div className="text-sm text-muted-foreground">Recent Scans</div>
        </Card>
        <Card className="text-center p-6 shadow-soft">
          <Clock className="w-8 h-8 text-accent mx-auto mb-2" />
          <div className="text-2xl font-bold">{healthData.wellnessActivities.length}</div>
          <div className="text-sm text-muted-foreground">Activities</div>
        </Card>
      </div>

      {/* Wellness Assistant */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WellnessAssistant 
          className="lg:col-span-1"
          onActionClick={(action) => {
            // Handle action clicks - could navigate to specific pages
            console.log('Action clicked:', action);
          }}
        />
        
        {/* Safety Guidelines */}
        <div className="space-y-4">
          <SafetyGuidelines variant="detailed" />
          
          {/* Quick Health Tips */}
          <Card className="shadow-soft">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                Today's Wellness Focus
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-3 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Hydration Check</h4>
                  <p className="text-xs text-muted-foreground">Aim for 8 glasses of water today</p>
                </div>
                <div className="p-3 bg-accent/5 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Mindful Moment</h4>
                  <p className="text-xs text-muted-foreground">Take 5 deep breaths when you feel stressed</p>
                </div>
                <div className="p-3 bg-success/5 rounded-lg">
                  <h4 className="font-semibold text-sm mb-1">Movement</h4>
                  <p className="text-xs text-muted-foreground">Even a 10-minute walk counts!</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}