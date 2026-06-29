"use client";

import { useMemo } from "react";
import Image from "next/image";
import { Droplets } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { resolveWeatherIcon } from "@/lib/utils";
import { useTemperatureUnitContext } from "@/context/temperature-unit-context";
import { convertTemp } from "@/lib/temperature";
import type { HourForecast } from "@/types/weather";

interface HourlyForecastProps {
  hours: HourForecast[];
  locationLocaltime: string;
}

const styles = {
  section: "w-full",
  heading: "text-lg font-semibold mb-4",
  scrollContainer: "overflow-x-auto pb-2 -mx-1",
  innerRow: "flex gap-3 p-1 min-w-max",
  hourCard: "flex-shrink-0 w-[80px] text-center",
  hourContent: "flex flex-col items-center gap-1.5 py-1",
  timeLabel: "text-xs text-muted-foreground font-medium",
  conditionIcon: "rounded",
  tempText: "text-sm font-medium tabular-nums",
  rainRow: "flex items-center gap-0.5 text-xs text-muted-foreground",
  rainIcon: "size-3",
} as const;

export function HourlyForecast({
  hours,
  locationLocaltime,
}: HourlyForecastProps) {
  const { unit } = useTemperatureUnitContext();
  const currentHour = locationLocaltime.slice(0, 13);
  const futureHours = hours.filter((h) => h.time.slice(0, 13) >= currentHour);

  const displayedHours = useMemo(() => {
    return futureHours.map((hour) => ({
      ...hour,
      displayTemp:
        unit === "celsius"
          ? Math.round(hour.temp_c)
          : Math.round(convertTemp(hour.temp_c, "celsius", "fahrenheit")),
    }));
  }, [futureHours, unit]);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Today&apos;s Forecast</h2>
      <div className={styles.scrollContainer}>
        <div className={styles.innerRow}>
          {displayedHours.map((hour) => {
            const iconUrl = resolveWeatherIcon(hour.condition.icon);
            const timeLabel = format(parseISO(hour.time), "h a");

            return (
              <Card key={hour.time_epoch} className={styles.hourCard}>
                <CardContent className={styles.hourContent}>
                  <span className={styles.timeLabel}>{timeLabel}</span>
                  <Image
                    src={iconUrl}
                    alt={hour.condition.text}
                    width={36}
                    height={36}
                    className={styles.conditionIcon}
                  />
                  <span className={styles.tempText}>{hour.displayTemp}°</span>
                  {hour.chance_of_rain > 0 && (
                    <span className={styles.rainRow}>
                      <Droplets className={styles.rainIcon} />
                      {hour.chance_of_rain}%
                    </span>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
