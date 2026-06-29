"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Thermometer,
  Droplets,
  Wind,
  Sun,
  Gauge,
  Eye,
  Cloud,
  Waves,
  Zap,
  CloudRain,
} from "lucide-react";
import { Card, CardHeader, CardContent, CardAction } from "@/components/ui/card";
import { FavoriteToggle } from "@/components/weather/favorite-toggle";
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

interface WeatherDetailHeroProps {
  data: ForecastResponse;
}

const styles = {
  card: "w-full",
  backLink: "mb-3 gap-1.5 justify-self-start",
  backIcon: "size-4",
} as const;

export function WeatherDetailHero({ data }: WeatherDetailHeroProps) {
  const { location, current } = data;
  const { unit } = useTemperatureUnitContext();

  const stats = useMemo(() => {
    const feelsLike =
      unit === "celsius"
        ? Math.round(current.feelslike_c)
        : Math.round(convertTemp(current.feelslike_c, "celsius", "fahrenheit"));
    const dewPoint =
      unit === "celsius"
        ? Math.round(current.dewpoint_c)
        : Math.round(convertTemp(current.dewpoint_c, "celsius", "fahrenheit"));
    const unitLabel = unit === "celsius" ? "°C" : "°F";

    return [
      { icon: Thermometer, label: "Feels like", value: `${feelsLike}${unitLabel}` },
      { icon: Droplets, label: "Humidity", value: `${current.humidity}%` },
      {
        icon: Wind,
        label: "Wind",
        value: `${Math.round(current.wind_kph)} km/h ${current.wind_dir}`,
      },
      { icon: Sun, label: "UV Index", value: String(current.uv) },
      { icon: Gauge, label: "Pressure", value: `${current.pressure_mb} mb` },
      { icon: Eye, label: "Visibility", value: `${current.vis_km} km` },
      { icon: Cloud, label: "Cloud cover", value: `${current.cloud}%` },
      { icon: Waves, label: "Dew point", value: `${dewPoint}${unitLabel}` },
      { icon: Zap, label: "Gusts", value: `${Math.round(current.gust_kph)} km/h` },
      {
        icon: CloudRain,
        label: "Precipitation",
        value: `${current.precip_mm} mm`,
      },
    ];
  }, [
    current.feelslike_c,
    current.dewpoint_c,
    current.humidity,
    current.wind_kph,
    current.wind_dir,
    current.uv,
    current.pressure_mb,
    current.vis_km,
    current.cloud,
    current.gust_kph,
    current.precip_mm,
    unit,
  ]);

  return (
    <Card className={styles.card}>
      <CardHeader>
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), styles.backLink)}
        >
          <ArrowLeft className={styles.backIcon} />
          Back
        </Link>
        <CardAction>
          <FavoriteToggle cityName={location.name} />
        </CardAction>
        <WeatherLocation
          name={location.name}
          region={location.region}
          country={location.country}
          localtime={location.localtime}
        />
      </CardHeader>
      <CardContent>
        <WeatherHeroRow
          iconUrl={resolveWeatherIcon(current.condition.icon)}
          conditionText={current.condition.text}
          tempC={current.temp_c}
        />
        <WeatherStatsGrid stats={stats} />
      </CardContent>
    </Card>
  );
}
