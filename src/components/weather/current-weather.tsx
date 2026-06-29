"use client";

import { useMemo } from "react";
import Link from "next/link";
import { Droplets, Wind, Thermometer, Sun } from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn, resolveWeatherIcon } from "@/lib/utils";
import {
  WeatherLocation,
  WeatherHeroRow,
  WeatherStatsGrid,
} from "@/components/weather/weather-card-parts";
import { useTemperatureUnitContext } from "@/context/temperature-unit-context";
import { convertTemp } from "@/lib/temperature";
import type { ForecastResponse } from "@/types/weather";

interface CurrentWeatherProps {
  data: ForecastResponse;
  isGeoLocation?: boolean;
}

const styles = {
  card: "w-full",
  footer: "mt-4 flex justify-end",
} as const;

export function CurrentWeatherCard({ data, isGeoLocation }: CurrentWeatherProps) {
  const { location, current } = data;
  const { unit } = useTemperatureUnitContext();

  const stats = useMemo(() => {
    const feelsLike =
      unit === "celsius"
        ? Math.round(current.feelslike_c)
        : Math.round(convertTemp(current.feelslike_c, "celsius", "fahrenheit"));
    const unitLabel = unit === "celsius" ? "°C" : "°F";

    return [
      { icon: Thermometer, label: "Feels like", value: `${feelsLike}${unitLabel}` },
      { icon: Droplets, label: "Humidity", value: `${current.humidity}%` },
      { icon: Wind, label: "Wind", value: `${Math.round(current.wind_kph)} km/h` },
      { icon: Sun, label: "UV Index", value: String(current.uv) },
    ];
  }, [current.feelslike_c, current.humidity, current.wind_kph, current.uv, unit]);

  return (
    <Card className={styles.card}>
      <CardHeader>
        <WeatherLocation
          name={location.name}
          region={location.region}
          country={location.country}
          localtime={location.localtime}
          isGeoLocation={isGeoLocation}
        />
      </CardHeader>
      <CardContent>
        <WeatherHeroRow
          iconUrl={resolveWeatherIcon(current.condition.icon)}
          conditionText={current.condition.text}
          tempC={current.temp_c}
        />
        <WeatherStatsGrid stats={stats} />
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
