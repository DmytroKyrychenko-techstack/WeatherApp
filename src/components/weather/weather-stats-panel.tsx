"use client";

import { useMemo } from "react";
import { Thermometer, Droplets, Sun, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useTemperatureUnitContext } from "@/context/temperature-unit-context";
import { convertTemp } from "@/lib/temperature";
import { computeWeatherStats, type TrendDirection } from "@/lib/weather-stats";
import type { ForecastDay } from "@/types/weather";

interface WeatherStatsPanelProps {
  forecastDays: ForecastDay[];
}

const styles = {
  card: "w-full",
  header: "pb-3",
  title: "text-lg font-semibold",
  content: "space-y-4",
  statRow: "flex items-start gap-3 p-3 rounded-lg border bg-muted/40",
  statIcon: "size-5 text-muted-foreground shrink-0 mt-0.5",
  statInfo: "flex-1 min-w-0",
  statLabel: "text-sm text-muted-foreground leading-none",
  statValue: "text-lg font-semibold mt-1",
  trendLabel: "text-xs text-muted-foreground",
  trendBadge: "inline-block ml-2 px-2 py-0.5 rounded text-xs font-medium",
  trendRising: "bg-red-100 text-red-900 dark:bg-red-900/30 dark:text-red-300",
  trendFalling: "bg-blue-100 text-blue-900 dark:bg-blue-900/30 dark:text-blue-300",
  trendStable: "bg-gray-100 text-gray-900 dark:bg-gray-900/30 dark:text-gray-300",
} as const;

function getTrendLabel(trend: TrendDirection): string {
  switch (trend) {
    case "rising":
      return "Chance rising";
    case "falling":
      return "Chance falling";
    case "stable":
      return "Stable";
  }
}

function getTrendColor(trend: TrendDirection): string {
  switch (trend) {
    case "rising":
      return styles.trendRising;
    case "falling":
      return styles.trendFalling;
    case "stable":
      return styles.trendStable;
  }
}

export function WeatherStatsPanel({ forecastDays }: WeatherStatsPanelProps) {
  const { unit } = useTemperatureUnitContext();

  const stats = useMemo(() => {
    return computeWeatherStats(forecastDays);
  }, [forecastDays]);

  const displayTempMin =
    unit === "celsius"
      ? stats.tempRangeC.min
      : Math.round(convertTemp(stats.tempRangeC.min, "celsius", "fahrenheit"));

  const displayTempMax =
    unit === "celsius"
      ? stats.tempRangeC.max
      : Math.round(convertTemp(stats.tempRangeC.max, "celsius", "fahrenheit"));

  const tempUnit = unit === "celsius" ? "°C" : "°F";

  return (
    <Card className={styles.card}>
      <CardHeader className={styles.header}>
        <CardTitle className={styles.title}>3-Day Summary</CardTitle>
      </CardHeader>
      <CardContent className={styles.content}>
        <div className={styles.statRow}>
          <Thermometer className={styles.statIcon} />
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Temperature Range</p>
            <p className={styles.statValue}>
              {displayTempMin}° to {displayTempMax}
              {tempUnit}
            </p>
          </div>
        </div>

        <div className={styles.statRow}>
          <Droplets className={styles.statIcon} />
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Average Humidity</p>
            <p className={styles.statValue}>{stats.avgHumidity}%</p>
          </div>
        </div>

        <div className={styles.statRow}>
          <Sun className={styles.statIcon} />
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Peak UV Index Time</p>
            <p className={styles.statValue}>
              {stats.peakUvHour === "N/A"
                ? "N/A"
                : new Date(stats.peakUvHour).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    minute: "2-digit",
                    hour12: true,
                  })}
            </p>
          </div>
        </div>

        <div className={styles.statRow}>
          <TrendingUp className={styles.statIcon} />
          <div className={styles.statInfo}>
            <p className={styles.statLabel}>Rain Probability Trend</p>
            <div className={styles.statValue}>
              <span>{getTrendLabel(stats.rainTrend)}</span>
              <span className={`${styles.trendBadge} ${getTrendColor(stats.rainTrend)}`}>
                {stats.rainTrend}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
