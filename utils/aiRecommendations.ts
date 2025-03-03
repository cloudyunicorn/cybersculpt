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
  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://cybersculpt.com',
        'X-Title': 'CyberSculpt Health'
      },
      body: JSON.stringify({
        model: 'google/gemini-2.0-flash-lite-preview-02-05:free', // Faster model
        messages: [{
          role: 'user',
          content: `Generate detailed health recommendations with exact metrics based on:
          - BMI: ${bmi.toFixed(1)} (${bmiCategory})
          - Primary Goal: ${goal}
          
          Include for each recommendation:
          🍽️ Nutrition: Exact calorie counts, macronutrient breakdown (protein/fat/carbs in grams), portion sizes
          🏋️ Exercise: Specific exercises with sets/reps/weights, duration, intensity (HR zones/RPE)
          📊 Targets: Weekly goals with measurable metrics (kg/lb/cm/inches)
          💡 Tips: Science-backed lifestyle modifications
          
          Example format:
          ${JSON.stringify({
            title: 'string',
            icon: 'string',
            sections: [{
              category: 'string',
              items: [
                '🍳 500kcal breakfast: 3 eggs (18g protein) + 100g oatmeal (60g carbs)',
                '🏋️ 5x5 Squats: 70kg 5 sets of 5 reps (3min rest)'
              ],
              tips: [
                'Increase protein by 0.5g/kg body weight weekly'
              ]
            }]
          })}
          IMPORTANT: 
          - Use metric units with imperial in parentheses
          - All numbers must be BMI/Goal-specific
          - Respond ONLY with valid JSON`
        }],
        temperature: 0.5,
        max_tokens: 2000
      })
    });

    if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
    
    const data = await response.json();
    const jsonString = data.choices[0].message.content
      .replace(/```json/g, '')
      .replace(/```/g, '')
      .trim();
      
    const content = JSON.parse(jsonString);
    
    interface Section {
      category: string;
      items: string[];
      tips?: string[];
    }
    
    console.log(content)
    
    return {
      title: content.title,
      icon: content.icon,
      sections: content.sections.map((section: Section) => ({
        category: section.category,
        items: section.items,
        tips: section.tips || []
      }))
    };
  } catch (error) {
    console.error('AI Recommendation Error:', error);
    return {
      title: 'AI Recommendations Unavailable',
      icon: '⚠️',
      sections: [{
        category: 'Error',
        items: ['Failed to fetch recommendations. Using default suggestions...'],
        tips: []
      },
      ...getBMIBasedRecommendations(bmiCategory),
      ...getGoalSpecificRecommendations(goal)]
    };
  }
}

function getBMIBasedRecommendations(bmiCategory: string) {
  const recommendations = [];
  
  const baseRecommendations = {
      Underweight: {
        nutrition: [
          '🍳 Breakfast: 3-egg omelette (450 kcal) with 1/2 avocado + 50g oatmeal (Total: 650 kcal, 35g protein)',
          '🥪 Lunch: Grilled chicken wrap (200g chicken, whole wheat) with hummus & veggies (800 kcal, 55g protein)',
          '🍲 Dinner: 200g salmon with 100g quinoa & 150g roasted sweet potatoes (900 kcal, 60g protein)',
          '🥛 Snacks: 200g Greek yogurt (120 kcal) + 100g berries, 50g trail mix (300 kcal), protein shake (30g whey)'
        ],
        exercise: [
          '🏋️ Strength Training: 4x/week (5x5 compound lifts, 70-80% 1RM)',
          '🤸 Mobility: Daily 15-min dynamic stretching + foam rolling',
          '🚴 Cardio: Moderate cycling (12-15 mph) 2x/week (30 mins)'
        ],
      lifestyle: [
        'Track calorie intake using MyFitnessPal',
        'Add healthy fats (nuts, olive oil, avocado)',
        'Consider mass gainer shakes if struggling to eat enough'
      ]
    },
      Normal: {
        nutrition: [
          '🥑 Balanced meals: 40% carbs (150-200g), 30% protein (120-150g), 30% fats (60-80g)',
          '🐟 Omega-3: 200g salmon 3x/week (1.5g EPA/DHA) + 30g chia seeds daily',
          '🌿 Fiber: 50g broccoli (5g fiber), 150g berries (8g fiber), 100g lentils (13g fiber)'
        ],
        exercise: [
          '🏃 Cardio: 150 mins/week zone 2 training (60-70% max HR)',
          '💪 Strength: 3x full-body workouts (8-12 reps, 3 sets)',
          '🧘 Recovery: 2x yoga sessions + daily 10-min mobility drills'
        ],
      lifestyle: [
        'Maintain consistent sleep schedule',
        'Try new physical activities monthly',
        'Practice mindful eating techniques'
      ]
    },
      Overweight: {
        nutrition: [
          '🥦 Volume eating: 500g veggies/day (broccoli, spinach, peppers)',
          '🍗 Protein: 1.6g/kg (e.g., 120g for 75kg) from chicken breast, tofu, fish',
          '🚫 Limit: <25g added sugar, <50g refined carbs daily',
          '🍵 Metabolism: 3 cups green tea + 1g cayenne pepper daily'
        ],
        exercise: [
          '🔥 HIIT: 3x/week (30s sprint/90s rest x 10 rounds)',
          '🚶 LISS: Daily 45-min walk (3.5 mph, 150-170 bpm)',
          '🏋️ Resistance: 3x circuit training (12 stations, 30s work/15s rest)'
        ],
      lifestyle: [
        'Use smaller plates for portion control',
        'Practice 16:8 intermittent fasting',
        'Stay accountable with weekly weigh-ins'
      ]
    },
      Obese: {
        nutrition: [
          '🍽️ Plate method: 50% veggies (300g), 25% protein (100-120g), 25% carbs (75-100g)',
          '🥤 Hydration: 500ml water 30 mins before each meal',
          '🍎 Smart swaps: 200g zoodles (30 kcal) vs pasta (400 kcal)',
          '⏲️ Mindful eating: 20 chews/bite, 20-min meals'
        ],
        exercise: [
          '🏊 Low-Impact: Water aerobics 3x/week (40 mins, 120-140 bpm)',
          '🪑 Chair exercises: 15-min AM/PM routines (leg lifts, seated marches)',
          '🚶 Gradual walking: 10-min sessions 3x/day (2.5 mph)'
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
        '🏃♀️ Cardio: 2x weekly sprints (8x30s all-out w/ 2min rests)',
        '🍴 Meal Timing: 40% calories at breakfast, 30% lunch, 30% dinner',
        '🛑 Cravings: 2 pieces sugar-free gum + 500ml water when hungry',
        '📉 Deficit: 500kcal/day (3500kcal/week = 1lb loss)'
      ],
      tips: [
        'Weekly progress: Front/side photos + waist measurement',
        'Track non-scale wins: Energy levels, sleep quality, clothing fit',
        '16:8 fasting: Eat between 10am-6pm daily'
      ]
    },
    gain: {
      category: '💪 Muscle Gain Focus',
      items: [
        '🏋️ Progressive Overload: +5% weight weekly (e.g., 100kg → 105kg squat)',
        '⏱️ Rest: 90s between sets for hypertrophy (8-12 rep range)',
        '🍌 Post-Workout: 75g carbs + 25g protein within 30 mins',
        '💤 Recovery: 8hr sleep + 20-min naps'
      ],
      tips: [
        'Weekly checks: Goal +0.5-1lb, adjust calories by 200 if not progressing',
        'Mass gainer: 1000kcal shake (oats, peanut butter, whey, banana)',
        'Prioritize: Squat, deadlift, bench press, pull-ups'
      ]
    },
    maintain: {
      category: '⚖️ Maintenance Focus',
      items: [
        '🔄 Training: Rotate modalities every 4-6 weeks (e.g., swimming → cycling)',
        '🍽️ Diet: ±200kcal cycling (workout vs rest days)',
        '📊 Monitoring: Weekly weigh-ins ±1kg threshold',
        '🎯 Goals: Skill targets (e.g., 10 pull-ups, 5k run time)'
      ],
      tips: [
        'Quarterly DEXA scans for body composition',
        'Macro cycling: 40/30/30 (training) vs 30/30/40 (rest) carb/pro/fat',
        'Active recovery: 1 week every 8 weeks at 50% volume'
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
