'use client';
import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { cmToFeetInches } from "@/utils/healthCalculations";

export const FormSchema = z.object({
  age: z.number().min(1).max(120),
  gender: z.enum(["male", "female"]),
  height: z.number().min(30).max(300),
  weight: z.number().min(10).max(500),
  activityLevel: z.enum(["sedentary", "light", "moderate", "active", "veryActive"]),
  goal: z.enum(["maintain", "lose", "gain"]),
});

export type FormData = z.infer<typeof FormSchema>;

interface HealthCalculatorFormProps {
  onSubmit: (data: FormData) => void;
}

export function HealthCalculatorForm({ onSubmit }: HealthCalculatorFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      age: 25,
      gender: "male",
      height: 170,
      weight: 70,
      activityLevel: "moderate",
      goal: "maintain",
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Age */}
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            type="number"
            {...form.register("age", { valueAsNumber: true })}
          />
        </div>
        {/* Gender */}
        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Controller
            control={form.control}
            name="gender"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {/* Height */}
        <div className="space-y-2">
          <Label htmlFor="height">Height (cm)</Label>
          <Input
            id="height"
            type="number"
            {...form.register("height", { valueAsNumber: true })}
          />
          <p className="text-sm text-muted-foreground">
            ≈ {cmToFeetInches(form.watch("height") || 0)}
          </p>
        </div>
        {/* Weight */}
        <div className="space-y-2">
          <Label htmlFor="weight">Weight (kg)</Label>
          <Input
            id="weight"
            type="number"
            {...form.register("weight", { valueAsNumber: true })}
          />
        </div>
        {/* Activity Level */}
        <div className="space-y-2">
          <Label htmlFor="activityLevel">Activity Level</Label>
          <Controller
            control={form.control}
            name="activityLevel"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select activity level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sedentary">Sedentary</SelectItem>
                  <SelectItem value="light">Light Exercise</SelectItem>
                  <SelectItem value="moderate">Moderate Exercise</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="veryActive">Very Active</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
        {/* Goal */}
        <div className="space-y-2">
          <Label htmlFor="goal">Goal</Label>
          <Controller
            control={form.control}
            name="goal"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select goal" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="maintain">Maintain Weight</SelectItem>
                  <SelectItem value="lose">Lose Weight</SelectItem>
                  <SelectItem value="gain">Gain Weight</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>
      </div>
      <Button type="submit" className="w-full">
        Calculate
      </Button>
    </form>
  );
}
