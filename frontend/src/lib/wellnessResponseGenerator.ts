import { 
  WellnessResponse, 
  ResponseComponent, 
  MealSuggestion, 
  WorkoutPlan, 
  FirstAidGuidance, 
  MedicalLocation, 
  DoctorProfile, 
  ActivityTracking, 
  WellnessInsight,
  BarcodeScanResponse,
  NutritionInfo
} from '@/types/WellnessResponse';

export class WellnessResponseGenerator {
  private static generateId(): string {
    return Date.now().toString() + Math.random().toString(36).substr(2, 9);
  }

  private static getCurrentTimestamp(): string {
    return new Date().toISOString();
  }

  // Multi-intent query handler
  static generateMultiIntentResponse(userInput: string): WellnessResponse {
    const input = userInput.toLowerCase();
    const components: ResponseComponent[] = [];
    let safetyLevel: 'safe' | 'caution' | 'urgent' = 'safe';
    let summary = '';
    let nextSteps: string[] = [];

    // Detect medical concerns
    if (input.includes('fever') || input.includes('pain') || input.includes('sick')) {
      components.push(this.generateFeverManagementComponent());
      safetyLevel = 'caution';
      summary += 'I\'ve provided guidance for managing your symptoms. ';
    }

    // Detect nutrition requests
    if (input.includes('lunch') || input.includes('meal') || input.includes('food') || input.includes('diet')) {
      const isLowCarb = input.includes('low-carb') || input.includes('low carb');
      components.push(this.generateMealSuggestionComponent(isLowCarb ? 'low-carb' : 'general'));
      summary += 'I\'ve suggested healthy meal options. ';
    }

    // Detect workout requests
    if (input.includes('workout') || input.includes('exercise') || input.includes('fitness')) {
      const isMorning = input.includes('morning') || input.includes('breakfast');
      const duration = this.extractDuration(input) || '15';
      components.push(this.generateWorkoutComponent(duration, isMorning));
      summary += 'I\'ve created a workout plan for you. ';
    }

    // Detect breakfast requests
    if (input.includes('breakfast') || input.includes('morning meal')) {
      components.push(this.generateBreakfastComponent());
      summary += 'I\'ve suggested energizing breakfast options. ';
    }

    // Generate next steps based on components
    nextSteps = this.generateNextSteps(components);

    return {
      intent: 'multi_intent',
      confidence: 0.95,
      components,
      safetyLevel,
      timestamp: this.getCurrentTimestamp(),
      summary: summary || 'I\'ve provided comprehensive guidance based on your request.',
      nextSteps,
      suggestions: this.generateSuggestions(components)
    };
  }

  // Barcode scan response handler
  static generateBarcodeScanResponse(barcodeData?: string): WellnessResponse {
    // Simulate barcode lookup - in real app, this would call an API
    const mockProduct = this.generateMockProduct();
    
    const component: ResponseComponent = {
      type: 'barcode_scan',
      title: 'Food Product Analysis',
      description: 'Nutritional analysis of scanned product',
      data: {
        product: mockProduct,
        suggestions: [
          'Good choice for a healthy snack',
          'Consider pairing with protein',
          'Watch portion size'
        ]
      },
      priority: 'medium',
      actionable: true
    };

    return {
      intent: 'barcode_scan',
      confidence: 0.98,
      components: [component],
      safetyLevel: 'safe',
      timestamp: this.getCurrentTimestamp(),
      summary: 'This is a healthy snack option with good nutritional value. The product contains natural ingredients and provides a good balance of nutrients.',
      suggestions: ['Find alternatives', 'View nutrition details', 'Add to meal plan']
    };
  }

  // Diet & Nutrition Components
  private static generateMealSuggestionComponent(type: 'low-carb' | 'general' | 'breakfast'): ResponseComponent {
    const meals = type === 'low-carb' ? this.getLowCarbMeals() : 
                  type === 'breakfast' ? this.getBreakfastMeals() : 
                  this.getGeneralMeals();

    return {
      type: 'meal_suggestion',
      title: type === 'low-carb' ? 'Low-Carb Lunch Options' : 
             type === 'breakfast' ? 'Energizing Breakfast Options' : 
             'Healthy Meal Suggestions',
      description: type === 'low-carb' ? 'Healthy low-carb lunch suggestions' :
                   type === 'breakfast' ? 'Breakfast ideas to fuel your morning' :
                   'Nutritious meal recommendations',
      data: { meals },
      priority: 'medium',
      actionable: true
    };
  }

  private static generateBreakfastComponent(): ResponseComponent {
    return this.generateMealSuggestionComponent('breakfast');
  }

  // Fitness & Exercise Components
  private static generateWorkoutComponent(duration: string, isMorning: boolean = false): ResponseComponent {
    const workout = this.generateWorkoutPlan(duration, isMorning);
    
    return {
      type: 'workout_plan',
      title: isMorning ? '15-Minute Morning Energy Workout' : `${duration}-Minute Home Workout`,
      description: isMorning ? 'Quick morning routine to boost energy' : 'Effective home workout routine',
      data: workout,
      priority: 'high',
      actionable: true
    };
  }

  // Medical & Emergency Components
  private static generateFeverManagementComponent(): ResponseComponent {
    return {
      type: 'medical_advice',
      title: 'Fever Management',
      description: 'Guidance for managing mild fever',
      data: {
        condition: 'mild_fever',
        temperature: '100.4°F',
        recommendations: [
          'Rest and stay hydrated',
          'Take over-the-counter fever reducers if needed',
          'Monitor temperature every 4 hours',
          'Seek medical attention if fever persists >3 days'
        ],
        whenToSeekHelp: 'If fever exceeds 103°F or persists >3 days'
      },
      priority: 'high',
      actionable: true
    };
  }

  // Helper methods for generating mock data
  private static generateMockProduct() {
    return {
      name: 'Organic Granola Bars',
      brand: 'Nature\'s Valley',
      barcode: '1234567890123',
      nutritionInfo: {
        foodName: 'Organic Granola Bars',
        isHealthy: true,
        healthScore: 7,
        nutritionalBreakdown: {
          calories: 190,
          protein: 4,
          carbs: 29,
          fat: 7,
          fiber: 3,
          sugar: 12,
          sodium: 140
        },
        recommendations: [
          'Good source of fiber',
          'Contains natural sugars',
          'Moderate portion size recommended'
        ],
        alternatives: [
          'Homemade granola bars',
          'Mixed nuts and dried fruit',
          'Greek yogurt with berries'
        ]
      }
    };
  }

  private static getLowCarbMeals(): MealSuggestion[] {
    return [
      {
        id: this.generateId(),
        name: 'Grilled Chicken Salad',
        description: 'Fresh mixed greens with grilled chicken and avocado',
        category: 'lunch',
        calories: 320,
        prepTime: '15 min',
        difficulty: 'easy',
        ingredients: ['chicken breast', 'mixed greens', 'avocado', 'olive oil', 'lemon'],
        instructions: [
          'Season chicken breast with salt and pepper',
          'Grill chicken for 6-7 minutes per side',
          'Slice chicken and arrange over mixed greens',
          'Add sliced avocado and drizzle with olive oil and lemon'
        ],
        nutritionalInfo: {
          protein: 35,
          carbs: 12,
          fat: 18,
          fiber: 8,
          sugar: 4
        },
        dietaryTags: ['low-carb', 'high-protein', 'gluten-free'],
        allergens: []
      },
      {
        id: this.generateId(),
        name: 'Cauliflower Rice Bowl',
        description: 'Cauliflower rice with broccoli and almonds',
        category: 'lunch',
        calories: 280,
        prepTime: '20 min',
        difficulty: 'easy',
        ingredients: ['cauliflower rice', 'broccoli', 'almonds', 'lemon', 'olive oil'],
        instructions: [
          'Sauté cauliflower rice in olive oil for 5 minutes',
          'Add chopped broccoli and cook for 3 minutes',
          'Season with salt, pepper, and lemon juice',
          'Top with sliced almonds'
        ],
        nutritionalInfo: {
          protein: 12,
          carbs: 8,
          fat: 22,
          fiber: 6,
          sugar: 3
        },
        dietaryTags: ['low-carb', 'vegetarian', 'gluten-free'],
        allergens: ['nuts']
      }
    ];
  }

  private static getBreakfastMeals(): MealSuggestion[] {
    return [
      {
        id: this.generateId(),
        name: 'Protein Oatmeal Bowl',
        description: 'Energizing oatmeal with protein powder and toppings',
        category: 'breakfast',
        calories: 350,
        prepTime: '10 min',
        difficulty: 'easy',
        ingredients: ['oats', 'protein powder', 'banana', 'almonds', 'honey'],
        instructions: [
          'Cook oats with water or milk',
          'Mix in protein powder',
          'Top with sliced banana and almonds',
          'Drizzle with honey'
        ],
        nutritionalInfo: {
          protein: 25,
          carbs: 45,
          fat: 8,
          fiber: 6,
          sugar: 15
        },
        dietaryTags: ['high-protein', 'fiber-rich', 'energy-boosting'],
        allergens: ['nuts']
      },
      {
        id: this.generateId(),
        name: 'Green Smoothie Bowl',
        description: 'Nutrient-packed smoothie bowl with fresh toppings',
        category: 'breakfast',
        calories: 280,
        prepTime: '5 min',
        difficulty: 'easy',
        ingredients: ['spinach', 'banana', 'mango', 'protein powder', 'coconut milk'],
        instructions: [
          'Blend all ingredients until smooth',
          'Pour into bowl',
          'Top with granola and berries'
        ],
        nutritionalInfo: {
          protein: 20,
          carbs: 35,
          fat: 6,
          fiber: 8,
          sugar: 20
        },
        dietaryTags: ['vegetarian', 'vitamin-rich', 'quick-prep'],
        allergens: []
      }
    ];
  }

  private static getGeneralMeals(): MealSuggestion[] {
    return [
      {
        id: this.generateId(),
        name: 'Mediterranean Quinoa Bowl',
        description: 'Nutritious quinoa bowl with Mediterranean flavors',
        category: 'lunch',
        calories: 420,
        prepTime: '25 min',
        difficulty: 'moderate',
        ingredients: ['quinoa', 'cherry tomatoes', 'cucumber', 'feta cheese', 'olives', 'olive oil'],
        instructions: [
          'Cook quinoa according to package directions',
          'Chop vegetables and mix with quinoa',
          'Add crumbled feta and olives',
          'Drizzle with olive oil and lemon'
        ],
        nutritionalInfo: {
          protein: 18,
          carbs: 52,
          fat: 16,
          fiber: 8,
          sugar: 6
        },
        dietaryTags: ['vegetarian', 'mediterranean', 'balanced'],
        allergens: ['dairy']
      }
    ];
  }

  private static generateWorkoutPlan(duration: string, isMorning: boolean): WorkoutPlan {
    const exercises = isMorning ? this.getMorningExercises() : this.getGeneralExercises();
    
    return {
      id: this.generateId(),
      name: isMorning ? 'Morning Energy Boost' : 'Quick Energy Boost',
      description: isMorning ? 'Quick morning routine to boost energy' : 'Effective home workout routine',
      duration: `${duration} minutes`,
      difficulty: 'beginner',
      equipment: ['None'],
      exercises,
      targetMuscles: ['legs', 'core', 'arms'],
      caloriesBurned: parseInt(duration) * 8,
      instructions: [
        'Warm up with light movement for 2 minutes',
        'Complete each exercise for the specified duration',
        'Rest 30 seconds between exercises',
        'Cool down with stretching for 2 minutes'
      ],
      modifications: {
        easier: ['Reduce duration by half', 'Use lighter movements', 'Add more rest'],
        harder: ['Increase duration', 'Add resistance', 'Reduce rest time']
      }
    };
  }

  private static getMorningExercises() {
    return [
      {
        name: 'Sun Salutations',
        sets: 1,
        reps: '3 minutes',
        instructions: [
          'Start in mountain pose',
          'Reach arms up and back',
          'Fold forward to touch toes',
          'Step back to plank',
          'Lower to cobra pose',
          'Return to downward dog',
          'Step forward and rise up'
        ]
      },
      {
        name: 'High Knees',
        sets: 1,
        reps: '2 minutes',
        instructions: [
          'Stand tall with feet hip-width apart',
          'Lift knees up to hip level',
          'Pump arms naturally',
          'Maintain quick pace'
        ]
      },
      {
        name: 'Bodyweight Squats',
        sets: 1,
        reps: '2 minutes',
        instructions: [
          'Stand with feet shoulder-width apart',
          'Lower down as if sitting in chair',
          'Keep chest up and core engaged',
          'Return to standing position'
        ]
      }
    ];
  }

  private static getGeneralExercises() {
    return [
      {
        name: 'Jumping Jacks',
        sets: 1,
        reps: '1 minute',
        instructions: [
          'Start standing',
          'Jump feet apart while raising arms',
          'Return to start position',
          'Maintain steady rhythm'
        ]
      },
      {
        name: 'Push-ups',
        sets: 1,
        reps: '1 minute',
        instructions: [
          'Start in plank position',
          'Lower chest to ground',
          'Push back up to start',
          'Keep core engaged'
        ]
      },
      {
        name: 'Mountain Climbers',
        sets: 1,
        reps: '1 minute',
        instructions: [
          'Start in plank position',
          'Alternate bringing knees to chest',
          'Maintain plank position',
          'Keep core tight'
        ]
      }
    ];
  }

  private static extractDuration(input: string): string | null {
    const match = input.match(/(\d+)\s*min/);
    return match ? match[1] : null;
  }

  private static generateNextSteps(components: ResponseComponent[]): string[] {
    const steps: string[] = [];
    
    components.forEach(component => {
      switch (component.type) {
        case 'medical_advice':
          steps.push('Monitor your symptoms closely');
          steps.push('Follow the recommended care instructions');
          break;
        case 'meal_suggestion':
          steps.push('Choose one of the suggested meals');
          steps.push('Gather the required ingredients');
          break;
        case 'workout_plan':
          steps.push('Complete the suggested workout');
          steps.push('Track your progress');
          break;
      }
    });
    
    return [...new Set(steps)]; // Remove duplicates
  }

  private static generateSuggestions(components: ResponseComponent[]): string[] {
    const suggestions: string[] = [];
    
    components.forEach(component => {
      switch (component.type) {
        case 'medical_advice':
          suggestions.push('Schedule a doctor visit', 'Track symptoms');
          break;
        case 'meal_suggestion':
          suggestions.push('Add to meal plan', 'Find alternatives');
          break;
        case 'workout_plan':
          suggestions.push('Start workout', 'Modify difficulty');
          break;
        case 'barcode_scan':
          suggestions.push('Find alternatives', 'View nutrition details');
          break;
      }
    });
    
    return [...new Set(suggestions)];
  }
}

