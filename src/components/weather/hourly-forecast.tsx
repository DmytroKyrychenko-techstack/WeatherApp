import Image from "next/image";
import { Droplets } from "lucide-react";
import { format, parseISO } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { resolveWeatherIcon } from "@/lib/utils";
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
  const currentHour = locationLocaltime.slice(0, 13); // "2024-05-20 21"
  const futureHours = hours.filter((h) => h.time.slice(0, 13) >= currentHour);

  return (
    <section className={styles.section}>
      <h2 className={styles.heading}>Today&apos;s Forecast</h2>
      <div className={styles.scrollContainer}>
        <div className={styles.innerRow}>
          {futureHours.map((hour) => {
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
                  <span className={styles.tempText}>
                    {Math.round(hour.temp_c)}°
                  </span>
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
