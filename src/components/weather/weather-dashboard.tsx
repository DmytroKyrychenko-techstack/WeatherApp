"use client";

import { SearchBar } from "@/components/weather/search-bar";
import { CurrentWeatherCard } from "@/components/weather/current-weather";
import { ForecastGrid } from "@/components/weather/forecast-card";
import { GeoPrompt } from "@/components/weather/geo-prompt";
import {
  CurrentWeatherSkeleton,
  ForecastGridSkeleton,
} from "@/components/weather/weather-skeleton";
import { useGeolocation } from "@/hooks/use-geolocation";
import { useForecast } from "@/hooks/use-weather";

const styles = {
  container: "flex flex-col gap-8",
  searchSection: "w-full",
  weatherSection: "w-full",
  forecastSection: "w-full",
  forecastHeading: "text-lg font-semibold mb-4",
  errorCard:
    "rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-center text-sm text-destructive",
} as const;

export function WeatherDashboard() {
  const { status: geoStatus, coords, requestPermission } = useGeolocation();

  const coordsQuery = coords ? `${coords.lat},${coords.lon}` : null;

  const { data: forecast, isLoading, error } = useForecast(coordsQuery);

  const showGeoPrompt =
    !coordsQuery &&
    !isLoading &&
    (geoStatus === "idle" || geoStatus === "denied" || geoStatus === "unavailable");

  return (
    <div className={styles.container}>
      <section className={styles.searchSection}>
        <SearchBar />
      </section>

      <section className={styles.weatherSection}>
        {isLoading && <CurrentWeatherSkeleton />}
        {forecast && <CurrentWeatherCard data={forecast} isGeoLocation={!!coordsQuery} />}
        {showGeoPrompt && (
          <GeoPrompt
            status={geoStatus as "idle" | "denied" | "unavailable"}
            onRequestPermission={requestPermission}
          />
        )}
        {error && (
          <div className={styles.errorCard}>
            {error instanceof Error
              ? error.message
              : "Something went wrong. Please try again."}
          </div>
        )}
      </section>

      {(isLoading || forecast) && (
        <section className={styles.forecastSection}>
          <h2 className={styles.forecastHeading}>3-Day Forecast</h2>
          {isLoading && <ForecastGridSkeleton />}
          {forecast && (
            <ForecastGrid days={forecast.forecast.forecastday} />
          )}
        </section>
      )}
    </div>
  );
}
