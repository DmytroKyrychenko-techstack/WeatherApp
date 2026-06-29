"use client";

import { useMemo } from "react";
import Image from "next/image";
import { MapPin, type LucideIcon } from "lucide-react";
import { CardTitle, CardDescription } from "@/components/ui/card";
import { useTemperatureUnitContext } from "@/context/temperature-unit-context";
import { convertTemp } from "@/lib/temperature";

export type StatItem = {
  icon: LucideIcon;
  label: string;
  value: string;
};

const styles = {
  locationBlock: "space-y-0.5",
  titleRow: "flex items-center gap-1.5",
  geoIcon: "size-4 shrink-0 text-muted-foreground",
  title: "text-xl sm:text-2xl",
  heroRow: "flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6",
  iconTempGroup: "flex items-center gap-3",
  conditionIcon: "rounded-lg",
  tempBlock: "text-center sm:text-left",
  temperature: "text-5xl font-light tabular-nums leading-none",
  condition: "text-sm text-muted-foreground mt-1",
  statsGrid: "flex flex-wrap gap-3 mt-6",
  statItem: "flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2 flex-1 min-w-[140px]",
  statIcon: "size-4 shrink-0 text-muted-foreground",
  statTextBlock: "min-w-0",
  statLabel: "text-[11px] text-muted-foreground leading-none",
  statValue: "text-sm font-medium leading-snug",
} as const;

function formatLocaltime(localtime: string): string {
  const [datePart, timePart] = localtime.split(" ");
  const [year, month, day] = datePart.split("-").map(Number);
  const [hour, minute] = timePart.split(":").map(Number);
  const utc = new Date(Date.UTC(year, month - 1, day, hour, minute));
  return new Intl.DateTimeFormat("en-US", {
    timeZone: "UTC",
    weekday: "short",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(utc);
}

interface WeatherLocationProps {
  name: string;
  region: string;
  country: string;
  localtime: string;
  isGeoLocation?: boolean;
}

export function WeatherLocation({
  name,
  region,
  country,
  localtime,
  isGeoLocation,
}: WeatherLocationProps) {
  return (
    <div className={styles.locationBlock}>
      <CardTitle className={styles.title}>
        <span className={styles.titleRow}>
          {isGeoLocation && <MapPin className={styles.geoIcon} />}
          {name}
        </span>
      </CardTitle>
      <CardDescription>
        {region ? `${region}, ${country}` : country} · {formatLocaltime(localtime)}
      </CardDescription>
    </div>
  );
}

interface WeatherHeroRowProps {
  iconUrl: string;
  conditionText: string;
  tempC: number;
}

export function WeatherHeroRow({
  iconUrl,
  conditionText,
  tempC,
}: WeatherHeroRowProps) {
  const { unit } = useTemperatureUnitContext();

  const displayTemp = useMemo(() => {
    return unit === "celsius"
      ? Math.round(tempC)
      : Math.round(convertTemp(tempC, "celsius", "fahrenheit"));
  }, [tempC, unit]);

  return (
    <div className={styles.heroRow}>
      <div className={styles.iconTempGroup}>
        <Image
          src={iconUrl}
          alt={conditionText}
          width={64}
          height={64}
          className={styles.conditionIcon}
        />
        <div className={styles.tempBlock}>
          <p className={styles.temperature}>{displayTemp}°</p>
          <p className={styles.condition}>{conditionText}</p>
        </div>
      </div>
    </div>
  );
}

interface WeatherStatsGridProps {
  stats: StatItem[];
}

export function WeatherStatsGrid({ stats }: WeatherStatsGridProps) {
  return (
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
  );
}
