import {
  TEMP_COLD,
  TEMP_HOT,
  TEMP_EXTREME_HEAT,
  WIND_STRONG,
  UV_HIGH,
} from "./constants";
import type { CurrentWeather, WeatherRecommendation } from "@/types/weather";

const RAIN_CONDITIONS = /rain|drizzle|sleet|snow|blizzard|thunder|storm/i;
const FOG_CONDITIONS = /fog|mist|haze/i;

export function getRecommendations(
  weather: CurrentWeather
): WeatherRecommendation[] {
  const recommendations: WeatherRecommendation[] = [];

  // Rain / precipitation
  if (RAIN_CONDITIONS.test(weather.condition.text)) {
    recommendations.push({
      text: "Take an umbrella — rain is expected.",
      icon: "umbrella",
      severity: "warning",
    });
  }

  // Extreme heat
  if (weather.temp_c > TEMP_EXTREME_HEAT) {
    recommendations.push({
      text: "Stay hydrated and seek shade — extreme heat.",
      icon: "thermometer-sun",
      severity: "danger",
    });
  }

  // Cold
  if (weather.temp_c < TEMP_COLD) {
    recommendations.push({
      text: "Wear a warm jacket — it's cold outside.",
      icon: "snowflake",
      severity: "warning",
    });
  }

  // Sunny / hot (but not extreme)
  if (weather.temp_c > TEMP_HOT && weather.temp_c <= TEMP_EXTREME_HEAT) {
    recommendations.push({
      text: "Wear sunglasses and apply sunscreen.",
      icon: "sun",
      severity: "info",
    });
  }

  // High UV
  if (weather.uv > UV_HIGH) {
    recommendations.push({
      text: "UV index is high — wear sun protection.",
      icon: "shield-alert",
      severity: "warning",
    });
  }

  // Strong wind
  if (weather.wind_kph > WIND_STRONG) {
    recommendations.push({
      text: "It's quite windy — secure loose items.",
      icon: "wind",
      severity: "info",
    });
  }

  // Fog / mist
  if (FOG_CONDITIONS.test(weather.condition.text)) {
    recommendations.push({
      text: "Visibility is low — drive carefully.",
      icon: "eye-off",
      severity: "warning",
    });
  }

  // Mild (fallback if nothing else applies)
  if (recommendations.length === 0) {
    recommendations.push({
      text: "Great weather for outdoor activities!",
      icon: "smile",
      severity: "info",
    });
  }

  return recommendations;
}
