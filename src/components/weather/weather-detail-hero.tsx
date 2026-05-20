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
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn, resolveWeatherIcon } from "@/lib/utils";
import {
  WeatherLocation,
  WeatherHeroRow,
  WeatherStatsGrid,
} from "@/components/weather/weather-card-parts";
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

  const stats = [
    { icon: Thermometer, label: "Feels like",   value: `${Math.round(current.feelslike_c)}°C` },
    { icon: Droplets,    label: "Humidity",      value: `${current.humidity}%` },
    { icon: Wind,        label: "Wind",          value: `${Math.round(current.wind_kph)} km/h ${current.wind_dir}` },
    { icon: Sun,         label: "UV Index",      value: String(current.uv) },
    { icon: Gauge,       label: "Pressure",      value: `${current.pressure_mb} mb` },
    { icon: Eye,         label: "Visibility",    value: `${current.vis_km} km` },
    { icon: Cloud,       label: "Cloud cover",   value: `${current.cloud}%` },
    { icon: Waves,       label: "Dew point",     value: `${Math.round(current.dewpoint_c)}°C` },
    { icon: Zap,         label: "Gusts",         value: `${Math.round(current.gust_kph)} km/h` },
    { icon: CloudRain,   label: "Precipitation", value: `${current.precip_mm} mm` },
  ];

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
