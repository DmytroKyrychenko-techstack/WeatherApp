import type { ForecastDay } from "@/types/weather";

export type TrendDirection = "rising" | "stable" | "falling";

export interface WeatherStatsSummary {
  tempRangeC: { min: number; max: number };
  avgHumidity: number;
  peakUvHour: string;
  rainTrend: TrendDirection;
}

export function computeWeatherStats(forecastDays: ForecastDay[]): WeatherStatsSummary {
  if (forecastDays.length === 0) {
    return {
      tempRangeC: { min: 0, max: 0 },
      avgHumidity: 0,
      peakUvHour: "N/A",
      rainTrend: "stable",
    };
  }

  let minTemp = Infinity;
  let maxTemp = -Infinity;
  let totalHumidity = 0;
  let maxUv = 0;
  let peakUvTime = "";
  const rainChances: number[] = [];

  for (const day of forecastDays) {
    minTemp = Math.min(minTemp, day.day.mintemp_c);
    maxTemp = Math.max(maxTemp, day.day.maxtemp_c);
    totalHumidity += day.day.avghumidity;
    rainChances.push(day.day.daily_chance_of_rain);

    for (const hour of day.hour) {
      if (hour.uv > maxUv) {
        maxUv = hour.uv;
        peakUvTime = hour.time;
      }
    }
  }

  const avgHumidity = Math.round(totalHumidity / forecastDays.length);

  let rainTrend: TrendDirection = "stable";
  if (rainChances.length >= 2) {
    const firstHalf = rainChances.slice(0, Math.ceil(rainChances.length / 2));
    const secondHalf = rainChances.slice(Math.ceil(rainChances.length / 2));
    const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
    const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;

    if (avgSecond > avgFirst + 5) {
      rainTrend = "rising";
    } else if (avgFirst > avgSecond + 5) {
      rainTrend = "falling";
    }
  }

  return {
    tempRangeC: {
      min: Math.round(minTemp),
      max: Math.round(maxTemp),
    },
    avgHumidity,
    peakUvHour: peakUvTime || "N/A",
    rainTrend,
  };
}
