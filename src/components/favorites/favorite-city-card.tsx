"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";
import { resolveWeatherIcon } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useForecast } from "@/hooks/use-weather";
import { useTemperatureUnitContext } from "@/context/temperature-unit-context";
import { convertTemp } from "@/lib/temperature";

interface FavoriteCityCardProps {
  cityName: string;
  onRemove: () => void;
}

const styles = {
  card: "relative group/favcard cursor-pointer transition-shadow hover:shadow-md",
  removeBtn:
    "absolute top-2 right-2 z-10 size-7 rounded-md flex items-center justify-center opacity-0 group-hover/favcard:opacity-100 transition-opacity hover:bg-muted text-muted-foreground hover:text-foreground",
  content: "flex flex-col gap-1 pt-3",
  cityName: "font-semibold text-base truncate pr-8",
  temp: "text-3xl font-light tabular-nums",
  iconRow: "flex items-center gap-2 mt-0.5",
  condition: "text-sm text-muted-foreground truncate",
  skeletonCity: "h-5 w-24 rounded",
  skeletonTemp: "h-8 w-16 rounded mt-1",
  skeletonCond: "h-4 w-32 rounded mt-1",
  errorName: "font-semibold text-base truncate pr-8",
  errorMsg: "text-sm text-muted-foreground",
} as const;

export function FavoriteCityCard({ cityName, onRemove }: FavoriteCityCardProps) {
  const { data, isLoading, isError } = useForecast(cityName);
  const { unit } = useTemperatureUnitContext();

  const displayTemp = useMemo(() => {
    if (!data) return null;
    const temp = data.current.temp_c;
    return unit === "celsius"
      ? Math.round(temp)
      : Math.round(convertTemp(temp, "celsius", "fahrenheit"));
  }, [data, unit]);

  function handleRemove(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    onRemove();
  }

  return (
    <Card className={styles.card}>
      <button
        onClick={handleRemove}
        aria-label={`Remove ${cityName} from favorites`}
        className={styles.removeBtn}
      >
        <X className="size-4" />
      </button>

      <Link href={`/weather/${encodeURIComponent(cityName)}`} className="block">
        <CardContent className={styles.content}>
          {isLoading && (
            <>
              <Skeleton className={styles.skeletonCity} />
              <Skeleton className={styles.skeletonTemp} />
              <Skeleton className={styles.skeletonCond} />
            </>
          )}

          {isError && (
            <>
              <p className={styles.errorName}>{cityName}</p>
              <p className={styles.errorMsg}>Unable to load weather</p>
            </>
          )}

          {data && (
            <>
              <p className={styles.cityName}>{data.location.name}</p>
              <p className={styles.temp}>
                {displayTemp}°{unit === "celsius" ? "C" : "F"}
              </p>
              <div className={styles.iconRow}>
                <Image
                  src={resolveWeatherIcon(data.current.condition.icon)}
                  alt={data.current.condition.text}
                  width={24}
                  height={24}
                  unoptimized
                />
                <span className={styles.condition}>{data.current.condition.text}</span>
              </div>
            </>
          )}
        </CardContent>
      </Link>
    </Card>
  );
}
