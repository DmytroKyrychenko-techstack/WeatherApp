import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getForecast } from "@/lib/weather-api";
import { WeatherDetailHero } from "@/components/weather/weather-detail-hero";
import { HourlyForecast } from "@/components/weather/hourly-forecast";
import { ForecastGrid } from "@/components/weather/forecast-card";
import { AstronomyCard } from "@/components/weather/astronomy-card";
import { RecommendationsCard } from "@/components/weather/recommendations-card";
import { WeatherStatsPanel } from "@/components/weather/weather-stats-panel";

type Props = {
  params: Promise<{ city: string }>;
};

const styles = {
  page: "flex flex-col gap-8",
  section: "w-full",
  sectionHeading: "text-lg font-semibold mb-4",
} as const;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);

  try {
    const data = await getForecast(decodedCity);
    return {
      title: `${data.location.name} Weather — WeatherApp`,
      description: `Current weather and 3-day forecast for ${data.location.name}, ${data.location.region}.`,
    };
  } catch {
    return {
      title: "City Not Found — WeatherApp",
    };
  }
}

export default async function WeatherCityPage({ params }: Props) {
  const { city } = await params;
  const decodedCity = decodeURIComponent(city);

  let data;
  try {
    data = await getForecast(decodedCity, 3);
  } catch {
    notFound();
  }

  const { location, current, forecast } = data;
  const today = forecast.forecastday[0];

  return (
    <div className={styles.page}>
      <WeatherDetailHero data={data} />

      <RecommendationsCard current={current} />

      <section className={styles.section}>
        <HourlyForecast
          hours={today.hour}
          locationLocaltime={location.localtime}
        />
      </section>

      <section className={styles.section}>
        <h2 className={styles.sectionHeading}>3-Day Forecast</h2>
        <ForecastGrid days={forecast.forecastday} />
      </section>

      <section className={styles.section}>
        <WeatherStatsPanel forecastDays={forecast.forecastday} />
      </section>

      <section className={styles.section}>
        <AstronomyCard
          astro={today.astro}
          locationDate={today.date}
          locationTzId={location.tz_id}
        />
      </section>
    </div>
  );
}
