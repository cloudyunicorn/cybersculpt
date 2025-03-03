'use client';
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  AIRecommendation,
  fetchAIRecommendations,
} from '@/utils/aiRecommendations';

interface HealthData {
  bmi: number;
  bmiCategory: string;
  goal: string;
  calories: number;
}

interface HealthCalculatorResultsProps {
  results: {
    bmi: number;
    bmiCategory: string;
    calories: number;
    recommendation: string;
  };
  data: HealthData;
}

export function HealthCalculatorResults({
  results,
  data,
}: HealthCalculatorResultsProps) {
  const [recommendations, setRecommendations] =
    useState<AIRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const result = await fetchAIRecommendations(
          data.bmi,
          data.goal,
          data.bmiCategory
        );
        setRecommendations(result);
        setLoading(false);
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : 'Failed to load AI recommendations'
        );
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [data]);

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
            {loading ? (
              <div className="space-y-6 animate-pulse">
                {/* Title Skeleton */}
                <div className="text-center mb-4">
                  <div className="h-8 bg-gray-200 rounded w-1/4 mx-auto mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>

                {/* Section Skeletons */}
                {[0, 1, 2].map((i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                    <ul className="space-y-2">
                      <li className="h-4 bg-gray-100 rounded w-4/5"></li>
                      <li className="h-4 bg-gray-100 rounded w-3/4"></li>
                      <li className="h-4 bg-gray-100 rounded w-2/3"></li>
                    </ul>
                    <div className="mt-2 p-3 bg-gray-50 rounded-md">
                      <div className="h-4 bg-gray-200 rounded w-1/5 mb-2"></div>
                      <ul className="space-y-1">
                        <li className="h-3 bg-gray-100 rounded w-1/4"></li>
                        <li className="h-3 bg-gray-100 rounded w-1/3"></li>
                      </ul>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="p-4 bg-red-50 rounded-md border border-red-200 text-red-600">
                {error}
              </div>
            ) : recommendations ? (
              <div className="space-y-6">
                <div className="text-center mb-4">
                  <span className="text-3xl">{recommendations.icon}</span>
                  <h3 className="text-xl font-semibold mt-2">
                    {recommendations.title}
                  </h3>
                </div>
                {recommendations.sections.map((section, index) => (
                  <div key={index} className="space-y-2">
                    <h4 className="font-medium text-lg">{section.category}</h4>
                    <ul className="list-disc pl-6 space-y-1">
                      {section.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    {section.tips && section.tips.length > 0 && (
                      <div className="mt-2 p-3 bg-blue-50 rounded-md">
                        <p className="text-sm font-medium text-blue-800">
                          Pro Tips:
                        </p>
                        <ul className="list-[circle] pl-5 space-y-1">
                          {section.tips.map((tip, j) => (
                            <li key={j} className="text-blue-700">
                              {tip}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-md border border-gray-200">
                {results.recommendation}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
