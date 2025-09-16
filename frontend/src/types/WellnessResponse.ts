// Core response types for structured UI components
export interface WellnessResponse {
  intent: string;
  confidence: number;
  components: ResponseComponent[];
  safetyLevel: 'safe' | 'caution' | 'urgent';
  timestamp: string;
  suggestions?: string[];
}

export interface ResponseComponent {
  type: 'meal_suggestion' | 'workout_plan' | 'medical_advice' | 'appointment_booking' | 'wellness_tracking' | 'emergency_alert' | 'nutrition_info' | 'motivational_message' | 'barcode_scan';
  title: string;
  description: string;
  data: {
    [key: string]: unknown;
    meals?: Array<{
      name: string;
      calories: string;
      prepTime: string;
      difficulty: string;
      ingredients: string[];
    }>;
    exercises?: Array<{
      name: string;
      reps: string;
    }>;
    duration?: string;
    difficulty?: string;
    condition?: string;
    recommendations?: string[];
    whenToSeekHelp?: string;
    product?: {
      name: string;
      brand: string;
      nutritionInfo?: {
        healthScore: number;
      };
    };
  };
  priority: 'high' | 'medium' | 'low';
  actionable: boolean;
}

// Diet & Nutrition Types
export interface MealSuggestion {
  id: string;
  name: string;
  description: string;
  category: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  calories: number;
  prepTime: string;
  difficulty: 'easy' | 'moderate' | 'advanced';
  ingredients: string[];
  instructions: string[];
  nutritionalInfo: {
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
  dietaryTags: string[];
  allergens: string[];
  alternatives?: MealSuggestion[];
}

export interface NutritionInfo {
  foodName: string;
  barcode?: string;
  isHealthy: boolean;
  healthScore: number; // 1-10
  nutritionalBreakdown: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
    sodium: number;
  };
  recommendations: string[];
  alternatives: string[];
  warnings?: string[];
}

// Fitness & Exercise Types
export interface WorkoutPlan {
  id: string;
  name: string;
  description: string;
  duration: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  equipment: string[];
  exercises: Exercise[];
  targetMuscles: string[];
  caloriesBurned: number;
  instructions: string[];
  modifications?: {
    easier: string[];
    harder: string[];
  };
}

export interface Exercise {
  name: string;
  sets: number;
  reps: string;
  duration?: string;
  rest: string;
  instructions: string[];
  videoUrl?: string;
  imageUrl?: string;
}

export interface ActivityTracking {
  steps: number;
  calories: number;
  sleep: {
    duration: number;
    quality: number;
  };
  waterIntake: number;
  date: string;
}

// Medical & Emergency Types
export interface FirstAidGuidance {
  condition: string;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  immediateActions: string[];
  doNot: string[];
  whenToSeekHelp: string;
  emergencyNumber: string;
  estimatedWaitTime?: string;
}

export interface MedicalLocation {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'pharmacy' | 'urgent_care';
  address: string;
  phone: string;
  distance: number; // in miles/km
  rating: number;
  waitTime?: string;
  specialties?: string[];
  isOpen: boolean;
  directions?: string;
}

// Doctor Appointments Types
export interface DoctorProfile {
  id: string;
  name: string;
  specialty: string;
  credentials: string;
  rating: number;
  experience: number; // years
  location: string;
  availability: {
    nextAvailable: string;
    slots: TimeSlot[];
  };
  languages: string[];
  insurance: string[];
  bio: string;
  imageUrl?: string;
}

export interface TimeSlot {
  date: string;
  time: string;
  duration: number; // minutes
  available: boolean;
}

export interface AppointmentBooking {
  doctorId: string;
  date: string;
  time: string;
  duration: number;
  type: 'consultation' | 'follow-up' | 'emergency';
  reason: string;
  confirmationNumber: string;
  reminderTime: string;
}

// Wellness Tracking Types
export interface WellnessLog {
  id: string;
  date: string;
  type: 'diet' | 'exercise' | 'sleep' | 'water' | 'mood' | 'symptoms';
  data: Record<string, unknown>;
  notes?: string;
}

export interface WellnessInsight {
  type: 'trend' | 'achievement' | 'recommendation' | 'warning';
  title: string;
  description: string;
  data: Record<string, unknown>;
  actionable: boolean;
  priority: 'high' | 'medium' | 'low';
}

// Multi-intent response examples
export interface MultiIntentResponse {
  intents: {
    medical: boolean;
    nutrition: boolean;
    fitness: boolean;
    appointment: boolean;
    tracking: boolean;
  };
  components: ResponseComponent[];
  summary: string;
  nextSteps: string[];
}

// Barcode scan response
export interface BarcodeScanResponse {
  found: boolean;
  product?: {
    name: string;
    brand: string;
    barcode: string;
    nutritionInfo: NutritionInfo;
  };
  suggestions: string[];
  alternatives: string[];
}

