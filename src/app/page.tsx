import type { Metadata } from "next";
import { WeatherDashboard } from "@/components/weather/weather-dashboard";

export const metadata: Metadata = {
  title: "Home — Weather App",
  description:
    "Search any city to get current weather conditions, 3-day forecasts, and detailed climate data.",
};

export default function Home() {
  return <WeatherDashboard />;
}
