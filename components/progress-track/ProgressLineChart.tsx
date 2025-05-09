"use client"

import React from "react"
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { ChartContainer, ChartTooltipContent } from "../ui/chart"
import { useData } from "../../contexts/DataContext"
import { calculateBMI } from "../../utils/body-calculations"
import { ProgressStats } from "./ProgressStats"

interface ChartDataPoint {
  date: string
  value: number | null
}

interface ProgressLineChartProps {
  data: Array<ChartDataPoint>
  metric: string
  unit: string
  dateRange?: {
    start: string
    end: string
  }
}

export const ProgressLineChart = ({ data, metric, unit, dateRange }: ProgressLineChartProps) => {
  // Filter data based on date range if provided
  const filteredData = dateRange 
    ? data.filter(item => 
        new Date(item.date) >= new Date(dateRange.start) && 
        new Date(item.date) <= new Date(dateRange.end)
      )
    : data;

  // Filter out null values for the chart while keeping them in the original data
  const { data: userData } = useData();

  const height = userData?.profile?.height;
  const weightLogs = userData?.progressLogs?.filter(log => 
    log.type === 'WEIGHT' && log.value
  ) || [];
  const fatLogs = userData?.progressLogs?.filter(log => 
    log.type === 'BODY_FAT' && log.value
  ) || [];

  // Process data with comprehensive null checks and BMI calculation
  const chartData = filteredData.map(item => {
    // For BMI and body fat metrics, use weight logs if available
    if (metric === 'bmi' || metric === 'bodyFat') {
      if (!height || height <= 0) {
        console.warn('Cannot calculate BMI - missing or invalid height');
        return null;
      }

      // Find weight log for this date
      const weightLog = weightLogs.find(log => 
        new Date(log.loggedAt).toISOString().split('T')[0] === item.date
      );

      if (weightLog && metric === 'bmi') {
          const bmi = calculateBMI(weightLog.value, height);
          return {
            ...item,
            value: bmi,
            date: new Date(item.date).toLocaleDateString()
          };
      } else if (metric === 'bodyFat') {
        const fatLog = fatLogs.find(log => 
          new Date(log.loggedAt).toISOString().split('T')[0] === item.date
        );
        if (fatLog) {
          return {
            ...item,
            value: fatLog.value, // Assuming body fat is logged directly
            date: new Date(item.date).toLocaleDateString()
          };
        }
      }
      
      // Fall back to pre-calculated value if available
      if (item.value !== null) {
        return {
          ...item,
          value: item.value,
          date: new Date(item.date).toLocaleDateString()
        };
      }

      return null;
    }

    // For other metrics, use the provided value
    if (item.value === null) {
      return null;
    }

    return {
      ...item,
      value: item.value,
      date: new Date(item.date).toLocaleDateString()
    };
  }).filter(Boolean); // Remove null entries after processing

  // Get first and last values from the processed chart data
  const validDataPoints = chartData.filter((item: any) => item.value !== null && item.value !== undefined);
  const firstValue = validDataPoints[0]?.value;
  const lastValue = validDataPoints[validDataPoints.length - 1]?.value;

  return (
    <div className="space-y-4">
      <ChartContainer
        config={{
          [metric]: {
            label: metric,
            color: "#3b82f6" // blue-500
          }
        }}
        className="h-64 w-full"
      >
      <RechartsLineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
        <XAxis 
          dataKey="date" 
          tickMargin={8}
          tick={{ fill: "#6b7280" }} // gray-500
        />
        <YAxis
          tickMargin={8}
          tick={{ fill: "#6b7280" }} // gray-500
          tickFormatter={(value) => {
            if (metric === 'bmi') return value?.toFixed(1);
            if (metric === 'bodyFat') return value?.toFixed(1) + '%';
            return value?.toFixed(metric === 'weight' ? 1 : 0) + unit;
          }}
        />
        <Tooltip 
          content={<ChartTooltipContent 
            formatter={(value) => [`${value}${unit}`, metric]}
          />} 
        />
        <Line
          type="monotone"
          dataKey="value"
          stroke="#3b82f6" // blue-500
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
          connectNulls={true}
        />
      </RechartsLineChart>
      </ChartContainer>
      <ProgressStats 
        firstValue={firstValue}
        lastValue={lastValue}
        unit={unit}
        metric={metric}
      />
    </div>
  )
}
