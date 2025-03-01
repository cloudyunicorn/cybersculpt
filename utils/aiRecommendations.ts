// utils/aiRecommendations.ts

export interface AIRecommendation {
  title: string;
  icon: string;
  sections: {
    category: string;
    items: string[];
    tips?: string[];
  }[];
}

export async function fetchAIRecommendations(
  bmi: number,
  goal: string,
  bmiCategory: string
): Promise<AIRecommendation> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const formattedBMI = bmi.toFixed(1);
      
      const recommendations: AIRecommendation = {
        title: `Your Personalized Health Plan 🌟`,
        icon: '💪',
        sections: [
          {
            category: '📊 Health Overview',
            items: [
              `BMI: ${formattedBMI} (${bmiCategory})`,
              `Primary Goal: ${goal.charAt(0).toUpperCase() + goal.slice(1)} Weight`,
              `Daily Hydration Goal: 2-3L 💧`,
              `Recommended Sleep: 7-9 hours 🌙`
            ]
          },
          ...getBMIBasedRecommendations(bmiCategory),
          ...getGoalSpecificRecommendations(goal),
          {
            category: '🌟 General Wellness',
            items: [
              'Track progress weekly with measurements & photos',
              'Practice stress-reduction techniques',
              'Get sunlight exposure daily',
              'Consider periodic check-ups'
            ]
          }
        ]
      };

      resolve(recommendations);
    }, 1000);
  });
}

function getBMIBasedRecommendations(bmiCategory: string) {
  const recommendations = [];
  
  const baseRecommendations = {
    Underweight: {
      nutrition: [
        '🍳 Breakfast: 3-egg omelette with avocado + oatmeal',
        '🥪 Lunch: Grilled chicken wrap with hummus & veggies',
        '🍲 Dinner: Salmon with quinoa & roasted sweet potatoes',
        '🥛 Snacks: Greek yogurt with berries, trail mix, protein shake'
      ],
      exercise: [
        '🏋️ Strength Training: 4x/week (Focus on compound movements)',
        '🤸 Mobility: Daily 15-min stretching routine',
        '🚴 Cardio: Light cycling 2x/week (20-30 mins)'
      ],
      lifestyle: [
        'Track calorie intake using MyFitnessPal',
        'Add healthy fats (nuts, olive oil, avocado)',
        'Consider mass gainer shakes if struggling to eat enough'
      ]
    },
    Normal: {
      nutrition: [
        '🥑 Balanced meals: 40% carbs, 30% protein, 30% fats',
        '🐟 Omega-3 sources: Salmon, chia seeds, walnuts',
        '🌿 Fiber-rich foods: Broccoli, berries, lentils'
      ],
      exercise: [
        '🏃 Cardio: 150 mins moderate/week (running, swimming)',
        '💪 Strength: Full-body workouts 3x/week',
        '🧘 Recovery: Yoga or mobility sessions 2x/week'
      ],
      lifestyle: [
        'Maintain consistent sleep schedule',
        'Try new physical activities monthly',
        'Practice mindful eating techniques'
      ]
    },
    Overweight: {
      nutrition: [
        '🥦 Volume eating: Focus on fibrous vegetables',
        '🍗 Protein: 1.6g/kg body weight (chicken, tofu, fish)',
        '🚫 Limit: Processed sugars and refined carbs',
        '🍵 Metabolism boosters: Green tea, chili peppers'
      ],
      exercise: [
        '🔥 HIIT: 3x/week (20-30 min sessions)',
        '🚶 LISS: Daily 45-min brisk walking',
        '🏋️ Resistance Training: Circuit training 3x/week'
      ],
      lifestyle: [
        'Use smaller plates for portion control',
        'Practice 16:8 intermittent fasting',
        'Stay accountable with weekly weigh-ins'
      ]
    },
    Obese: {
      nutrition: [
        '🍽️ Plate method: 50% veggies, 25% protein, 25% carbs',
        '🥤 Hydration: Drink water before meals',
        '🍎 Smart swaps: Zoodles vs pasta, cauliflower rice',
        '⏲️ Mindful eating: 20-minute meals'
      ],
      exercise: [
        '🏊 Low-Impact: Water aerobics 3x/week',
        '🪑 Chair exercises: Daily 15-min routine',
        '🚶 Gradual walking: Start with 10-min sessions 3x/day'
      ],
      lifestyle: [
        'Food journaling for awareness',
        'Stress management techniques',
        'Sleep quality improvement plan'
      ]
    }
  };

  const categoryData = baseRecommendations[bmiCategory as keyof typeof baseRecommendations] || {};
  
  recommendations.push({
    category: `📈 ${bmiCategory} Management`,
    items: [
      ...(categoryData.nutrition || []),
      ...(categoryData.exercise || [])
    ],
    tips: categoryData.lifestyle
  });

  return recommendations;
}

function getGoalSpecificRecommendations(goal: string) {
  const goalRecommendations = {
    lose: {
      category: '🔥 Weight Loss Focus',
      items: [
        '🏃♀️ Cardio Acceleration: Add 2 sprint sessions/week',
        '🍴 Meal Timing: Front-load calories (big breakfast)',
        '🛑 Craving Control: Sugar-free gum, herbal tea',
        '📉 Deficit Strategy: 500kcal daily reduction'
      ],
      tips: [
        'Weekly progress photos',
        'Non-scale victory tracking',
        'Intermittent fasting options'
      ]
    },
    gain: {
      category: '💪 Muscle Gain Focus',
      items: [
        '🏋️ Progressive Overload: Increase weights 5% weekly',
        '⏱️ Rest Periods: 90-120s between sets',
        '🍌 Post-Workout: 3:1 carb:protein ratio',
        '💤 Recovery: 8hr sleep minimum'
      ],
      tips: [
        'Weekly weight checks',
        'Mass gainer shakes if needed',
        'Focus on compound lifts'
      ]
    },
    maintain: {
      category: '⚖️ Maintenance Focus',
      items: [
        '🔄 Training Variety: Try new sports/activities',
        '🍽️ Diet: Cyclical calorie intake',
        '📊 Monitoring: Weekly measurements',
        '🎯 Goal Setting: Skill-based objectives'
      ],
      tips: [
        'Seasonal body comp assessments',
        'Macro cycling strategies',
        'Active recovery weeks'
      ]
    }
  };

  const goalData = goalRecommendations[goal as keyof typeof goalRecommendations] || {};
  
  return [{
    category: `🎯 ${goalData.category}`,
    items: goalData.items,
    tips: goalData.tips
  }];
}