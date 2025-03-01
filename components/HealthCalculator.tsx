'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { HealthCalculatorForm, FormData } from './HealthCalculatorForm';
import { HealthCalculatorResults } from './HealthCalculatorResults';
import {
  calculateBMI,
  calculateBMR,
  calculateTDEE,
  adjustCaloriesForGoal,
  getBMICategory,
} from '@/utils/healthCalculations';
import { fetchAIRecommendations } from '@/utils/aiRecommendations';

export function HealthCalculator() {
  const [results, setResults] = React.useState<{
    bmi: number;
    bmiCategory: string;
    calories: number;
    recommendation: string;
  } | null>(null);
  const [loading, setLoading] = React.useState(false);

  const handleSubmit = async (data: FormData) => {
    // Calculate BMI, BMR, TDEE, and adjusted calories as before.
    const bmi = calculateBMI(data.weight, data.height);
    const bmr = calculateBMR(data.gender, data.weight, data.height, data.age);
    const tdee = calculateTDEE(bmr, data.activityLevel);
    const adjustedCalories = adjustCaloriesForGoal(tdee, data.goal);
    const bmiCategory = getBMICategory(bmi);

    // Set loading state while fetching AI-driven recommendations.
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
        <CardTitle className="text-[hsl(var(--foreground))]">
          Cyber Sculpt
        </CardTitle>
      </CardHeader>
      <CardContent>
        <HealthCalculatorForm onSubmit={handleSubmit} />
        {loading && (
          <div className="mt-4 text-center text-sm text-muted-foreground">
            Generating personalized recommendations...
          </div>
        )}
        {results && !loading && <HealthCalculatorResults results={results} />}
      </CardContent>
    </Card>
  );
}
