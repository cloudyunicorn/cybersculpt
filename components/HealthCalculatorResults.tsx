'use client';
import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

interface HealthCalculatorResultsProps {
  results: {
    bmi: number;
    bmiCategory: string;
    calories: number;
    recommendation: string;
  };
}

export function HealthCalculatorResults({
  results,
}: HealthCalculatorResultsProps) {
  return (
    <div className="mt-8">
      <Card>
        <CardHeader>
          <CardTitle>Results</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <p className="font-medium text-lg">BMI: {results.bmi}</p>
            <p className="text-sm text-gray-500">
              Category: {results.bmiCategory}
            </p>
          </div>
          <div>
            <p className="font-medium text-lg">
              Daily Calories: {results.calories} kcal
            </p>
            <p className="text-sm text-gray-500">
              (Based on your activity level and goals)
            </p>
          </div>
          <div>
            <p className="font-medium mb-2">Recommendations:</p>
            <div className="p-4 bg-gray-50 rounded-md border border-gray-200 text-gray-700 whitespace-pre-wrap">
              {results.recommendation}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
