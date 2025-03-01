// utils/aiRecommendations.ts

export async function fetchAIRecommendations(
  bmi: number,
  goal: string,
  bmiCategory: string
): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const formattedBMI = bmi.toFixed(1);
      let recommendations = `Personalized Health Recommendations\n\n`;
      recommendations += `BMI: ${formattedBMI} (${bmiCategory})\n`;
      recommendations += `Goal: ${goal}\n\n`;
      
      // Recommendations based on BMI category
      switch (bmiCategory) {
        case "Underweight":
          recommendations += `For Underweight:\n`;
          recommendations += `• Nutrition: Focus on a calorie surplus with nutrient-dense foods such as lean proteins, whole grains, healthy fats, and snacks like smoothies and nuts.\n`;
          recommendations += `• Exercise: Engage in light resistance training to gradually build muscle. Avoid excessive cardio that might burn too many calories.\n`;
          recommendations += `• Lifestyle: Aim for 7-9 hours of quality sleep and consider consulting a nutritionist for a tailored meal plan.\n\n`;
          break;
        case "Normal":
          recommendations += `For Normal BMI:\n`;
          recommendations += `• Nutrition: Maintain a balanced diet with the right mix of proteins, carbs, and fats while focusing on portion control and whole foods.\n`;
          recommendations += `• Exercise: Keep a balanced routine with moderate cardio and strength training (3-5 days a week) to preserve your fitness level.\n`;
          recommendations += `• Lifestyle: Continue your healthy habits and monitor progress over time.\n\n`;
          break;
        case "Overweight":
          recommendations += `For Overweight:\n`;
          recommendations += `• Nutrition: Create a calorie deficit by emphasizing lean proteins, vegetables, and whole grains while reducing processed foods and sugary drinks.\n`;
          recommendations += `• Exercise: Incorporate regular cardio (brisk walking, cycling, HIIT) along with strength training to boost metabolism.\n`;
          recommendations += `• Lifestyle: Make sustainable lifestyle changes and monitor progress for gradual weight loss.\n\n`;
          break;
        case "Obese":
          recommendations += `For Obesity:\n`;
          recommendations += `• Nutrition: Consider a structured, calorie-controlled diet. Professional guidance from a nutritionist or healthcare provider can be very helpful.\n`;
          recommendations += `• Exercise: Start with low-impact activities like walking or water aerobics and gradually increase intensity as your fitness improves.\n`;
          recommendations += `• Lifestyle: Prioritize stress management, quality sleep (7-9 hours), and regular monitoring. Seek professional advice for a safe, personalized approach.\n\n`;
          break;
        default:
          recommendations += `General:\nNo specific recommendations available for your BMI category. Please consult a healthcare provider for personalized advice.\n\n`;
      }
      
      // Additional goal-specific recommendations
      if (goal === "lose") {
        recommendations += `Goal-Specific (Lose Weight):\n`;
        recommendations += `• Incorporate HIIT sessions with strength training to boost metabolism.\n`;
        recommendations += `• Maintain a modest calorie deficit while ensuring sufficient protein to preserve lean mass.\n\n`;
      } else if (goal === "gain") {
        recommendations += `Goal-Specific (Gain Weight):\n`;
        recommendations += `• Focus on progressive resistance training with a calorie surplus.\n`;
        recommendations += `• Increase protein intake to support muscle growth and consider nutrient-dense snacks throughout the day.\n\n`;
      } else {
        recommendations += `Goal-Specific (Maintain Weight):\n`;
        recommendations += `• Continue with a balanced diet and regular exercise routine.\n`;
        recommendations += `• Monitor your progress to stay on track.\n\n`;
      }
      
      // General health tips
      recommendations += `General Health Tips:\n`;
      recommendations += `• Hydration: Drink at least 2-3 liters of water daily.\n`;
      recommendations += `• Sleep: Aim for 7-9 hours of quality sleep each night.\n`;
      recommendations += `• Monitoring: Track your progress and adjust your routine as needed.\n`;
      recommendations += `• Professional Advice: Consider consulting health professionals for personalized guidance.\n`;
      
      resolve(recommendations);
    }, 1000); // simulate a 1-second API delay
  });
}
