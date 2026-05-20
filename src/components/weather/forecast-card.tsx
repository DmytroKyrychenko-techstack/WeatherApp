import Image from "next/image";
import { format, parseISO } from "date-fns";
import { Droplets } from "lucide-react";
import { resolveWeatherIcon } from "@/lib/utils";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ForecastDay } from "@/types/weather";

interface ForecastCardProps {
  day: ForecastDay;
}

interface ForecastGridProps {
  days: ForecastDay[];
}

const styles = {
  grid: "grid grid-cols-1 sm:grid-cols-3 gap-4",
  card: "w-full text-center",
  dayName: "",
  content: "flex flex-col items-center gap-2",
  icon: "rounded-lg",
  tempRow: "flex items-baseline gap-1.5 text-lg font-medium tabular-nums",
  tempHigh: "",
  tempSeparator: "text-muted-foreground text-sm",
  tempLow: "text-muted-foreground",
  conditionText: "text-sm text-muted-foreground",
  rainBadge: "gap-1",
} as const;

export function ForecastCard({ day }: ForecastCardProps) {
  const conditionIconUrl = resolveWeatherIcon(day.day.condition.icon);

  const dayName = format(parseISO(day.date), "EEEE");
  const rainChance = day.day.daily_chance_of_rain;

  return (
    <Card className={styles.card}>
      <CardHeader>
        <CardTitle className={styles.dayName}>{dayName}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={styles.content}>
          <Image
            src={conditionIconUrl}
            alt={day.day.condition.text}
            width={48}
            height={48}
            className={styles.icon}
          />
          <div className={styles.tempRow}>
            <span className={styles.tempHigh}>
              {Math.round(day.day.maxtemp_c)}°
            </span>
            <span className={styles.tempSeparator}>/</span>
            <span className={styles.tempLow}>
              {Math.round(day.day.mintemp_c)}°
            </span>
          </div>
          <p className={styles.conditionText}>{day.day.condition.text}</p>
          {rainChance > 0 && (
            <Badge variant="secondary" className={styles.rainBadge}>
              <Droplets className="size-3" />
              {rainChance}% rain
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export function ForecastGrid({ days }: ForecastGridProps) {
  return (
    <div className={styles.grid}>
      {days.map((day) => (
        <ForecastCard key={day.date} day={day} />
      ))}
    </div>
  );
}
