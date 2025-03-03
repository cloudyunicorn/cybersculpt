export function calculateBMI(weight: number, heightCm: number) {
  const heightInMeters = heightCm / 100;
  return weight / (heightInMeters * heightInMeters);
}

export function calculateBMR(
  gender: "male" | "female",
  weight: number,
  height: number,
  age: number
) {
  return gender === "male"
    ? 88.362 + 13.397 * weight + 4.799 * height - 5.677 * age
    : 447.593 + 9.247 * weight + 3.098 * height - 4.330 * age;
}

export function calculateTDEE(
  bmr: number,
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "veryActive"
) {
  const multipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    veryActive: 1.9,
  };
  return bmr * multipliers[activityLevel];
}

export function adjustCaloriesForGoal(
  tdee: number,
  goal: "maintain" | "lose" | "gain"
) {
  if (goal === "lose") return tdee - 500;
  if (goal === "gain") return tdee + 500;
  return tdee;
}

export function getBMICategory(bmi: number) {
  if (bmi < 18.5) return "Underweight";
  if (bmi < 24.9) return "Normal";
  if (bmi < 29.9) return "Overweight";
  return "Obese";
}

export function cmToFeetInches(cm: number): string {
  const inches = cm / 2.54;
  const feet = Math.floor(inches / 12);
  const remainingInches = Math.round(inches % 12);
  return `${feet}ft${remainingInches}in`;
}

export function generateRecommendations(bmiCategory: string, goal: string) {
  const recommendations = [];

  if (bmiCategory === "Obese" || bmiCategory === "Overweight") {
    recommendations.push(
      "Aim to lose 0.5-1 kg per week through a combination of diet and exercise"
    );
    recommendations.push("150-300 minutes of moderate-intensity exercise per week");
  } else if (bmiCategory === "Underweight") {
    recommendations.push("Focus on gradual weight gain through calorie surplus and strength training");
  } else {
    recommendations.push("Maintain current weight with balanced diet and regular exercise");
  }

  if (goal === "lose") {
    recommendations.push("Strength training 2-3 times per week combined with cardio 3-5 times per week");
  } else if (goal === "gain") {
    recommendations.push("Resistance training 4-5 times per week with adequate protein intake");
  }

  recommendations.push("Get 7-9 hours of quality sleep each night");
  recommendations.push("Stay hydrated - drink at least 2-3 liters of water daily");

  return recommendations.join("\n");
}
