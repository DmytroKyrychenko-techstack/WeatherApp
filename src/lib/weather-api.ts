import { WEATHER_API_BASE_URL, FORECAST_DAYS, CACHE_TTL_S } from "./constants";
import { normalizeLocationQuery } from "./utils";
import type { ForecastResponse, SearchResult } from "@/types/weather";

function getApiKey(): string {
  const key = process.env.WEATHER_API_KEY;
  if (!key) throw new Error("WEATHER_API_KEY is not configured");
  return key;
}

export async function getForecast(
  query: string,
  days: number = FORECAST_DAYS
): Promise<ForecastResponse> {
  const normalizedQuery = normalizeLocationQuery(query);
  const url = `${WEATHER_API_BASE_URL}/forecast.json?key=${getApiKey()}&q=${encodeURIComponent(normalizedQuery)}&days=${days}&aqi=no&alerts=no`;

  const response = await fetch(url, {
    next: { revalidate: CACHE_TTL_S },
  });

  if (!response.ok) {
    const body = await response.json().catch(() => null);
    throw new Error(
      body?.error?.message ?? `WeatherAPI error: ${response.status}`
    );
  }

  return response.json();
}

export async function searchCities(query: string): Promise<SearchResult[]> {
  const url = `${WEATHER_API_BASE_URL}/search.json?key=${getApiKey()}&q=${encodeURIComponent(query)}`;

  const response = await fetch(url, {
    next: { revalidate: 120 },
  });

  if (!response.ok) {
    throw new Error(`WeatherAPI search error: ${response.status}`);
  }

  return response.json();
}
