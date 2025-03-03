'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HealthCalculatorForm, FormData } from './HealthCalculatorForm';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  adjustCaloriesForGoal,
  getBMICategory,
} from '@/utils/healthCalculations';
import { fetchAIRecommendations, AIRecommendation } from '@/utils/aiRecommendations';

export function HealthCalculator() {
  const [results, setResults] = React.useState<{
    bmi: number;
    bmiCategory: string;
    calories: number;
    recommendation: AIRecommendation;
  } | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: FormData) => {
    const bmi = calculateBMI(data.weight, data.height);
    const bmr = calculateBMR(data.gender, data.weight, data.height, data.age);
    const tdee = calculateTDEE(bmr, data.activityLevel);
    const adjustedCalories = adjustCaloriesForGoal(tdee, data.goal);
    const bmiCategory = getBMICategory(bmi);

    setLoading(true);
    try {
      const recommendation = await fetchAIRecommendations(
        bmi,
        data.goal,
        bmiCategory
      );
      setResults({
        bmi: Number(bmi.toFixed(1)),
        bmiCategory,
        calories: Math.round(adjustedCalories),
        recommendation,
      });
    } catch (error) {
      console.error('Error fetching AI recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-primary">
          Cyber Sculpt AI
        </CardTitle>
      </CardHeader>
      <CardContent>
        <HealthCalculatorForm onSubmit={handleSubmit} />
        
        {loading && (
          <div className="mt-6 text-center animate-pulse">
            <div className="text-sm text-muted-foreground">
              Generating recommendations...
            </div>
          </div>
        )}

        {results && !loading && (
          <div className="mt-8 space-y-6">
            <Card className="border-primary/20">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-semibold">
                  Basic Metrics
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">BMI</p>
                  <p className="text-2xl text-primary">
                    {results.bmi}
                    <span className="text-sm text-muted-foreground ml-2">
                      ({results.bmiCategory})
                    </span>
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium">Daily Calories</p>
                  <p className="text-2xl text-primary">
                    {results.calories}
                    <span className="text-sm text-muted-foreground ml-2">
                      kcal/day
                    </span>
                  </p>
                </div>
              </CardContent>
            </Card>

            {results.recommendation.sections.map((section) => (
              <Card key={section.category} className="border-border">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold flex items-center gap-2">
                    <span className="text-primary">
                      {section.category.split(' ')[0]}
                    </span>
                    <span className="text-muted-foreground font-normal">
                      {section.category.split(' ').slice(1).join(' ')}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      {section.items.map((item) => (
                        <div
                          key={item}
                          className="flex items-start gap-2 text-sm"
                        >
                          <span className="text-muted-foreground">▹</span>
                          <p>{item}</p>
                        </div>
                      ))}
                    </div>

                    {section.tips && (
                      <div className="bg-muted/10 p-4 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">
                          ✨ Pro Tips
                        </h4>
                        <div className="space-y-2">
                          {section.tips.map((tip) => (
                            <div
                              key={tip}
                              className="flex items-start gap-2 text-sm text-muted-foreground"
                            >
                              <span>•</span>
                              <p>{tip}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}