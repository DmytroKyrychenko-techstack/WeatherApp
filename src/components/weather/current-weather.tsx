import Image from "next/image";
import Link from "next/link";
import { Droplets, Wind, Thermometer, Sun } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn, resolveWeatherIcon } from "@/lib/utils";
import type { ForecastResponse } from "@/types/weather";

interface CurrentWeatherProps {
  data: ForecastResponse;
}

const styles = {
  card: "w-full",
  headerRow: "flex items-start justify-between flex-wrap gap-2",
  locationBlock: "space-y-0.5",
  title: "text-xl sm:text-2xl",
  region: "",
  weatherRow: "flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6",
  iconTempGroup: "flex items-center gap-3",
  conditionIcon: "rounded-lg",
  tempBlock: "text-center sm:text-left",
  temperature: "text-5xl font-light tabular-nums leading-none",
  condition: "text-sm text-muted-foreground mt-1",
  statsGrid: "grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6",
  statItem:
    "flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2",
  statIcon: "size-4 shrink-0 text-muted-foreground",
  statTextBlock: "min-w-0",
  statLabel: "text-[11px] text-muted-foreground leading-none",
  statValue: "text-sm font-medium leading-snug",
  footer: "mt-4 flex justify-end",
} as const;

export function CurrentWeatherCard({ data }: CurrentWeatherProps) {
  const { location, current } = data;
  const conditionIconUrl = resolveWeatherIcon(current.condition.icon);

  const stats = [
    {
      icon: Thermometer,
      label: "Feels like",
      value: `${Math.round(current.feelslike_c)}°C`,
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${current.humidity}%`,
    },
    {
      icon: Wind,
      label: "Wind",
      value: `${Math.round(current.wind_kph)} km/h`,
    },
    {
      icon: Sun,
      label: "UV Index",
      value: `${current.uv}`,
    },
  ];

  return (
    <Card className={styles.card}>
      <CardHeader>
        <div className={styles.headerRow}>
          <div className={styles.locationBlock}>
            <CardTitle className={styles.title}>{location.name}</CardTitle>
            <CardDescription className={styles.region}>
              {location.region}, {location.country}
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={styles.weatherRow}>
          <div className={styles.iconTempGroup}>
            <Image
              src={conditionIconUrl}
              alt={current.condition.text}
              width={64}
              height={64}
              className={styles.conditionIcon}
            />
            <div className={styles.tempBlock}>
              <p className={styles.temperature}>
                {Math.round(current.temp_c)}°
              </p>
              <p className={styles.condition}>{current.condition.text}</p>
            </div>
          </div>
        </div>

        <div className={styles.statsGrid}>
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className={styles.statItem}>
              <Icon className={styles.statIcon} />
              <div className={styles.statTextBlock}>
                <p className={styles.statLabel}>{label}</p>
                <p className={styles.statValue}>{value}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <Link
            href={`/weather/${encodeURIComponent(location.name)}`}
            className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
