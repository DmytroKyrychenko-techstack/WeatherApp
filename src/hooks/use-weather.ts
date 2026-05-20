"use client";

import { useQuery, queryOptions } from "@tanstack/react-query";
import { fetchApi } from "@/lib/fetch-api";
import { normalizeLocationQuery } from "@/lib/utils";
import type { ForecastResponse, SearchResult } from "@/types/weather";

export function forecastQueryOptions(query: string | null) {
  return queryOptions<ForecastResponse>({
    queryKey: ["forecast", query ? normalizeLocationQuery(query) : null],
    queryFn: () =>
      fetchApi<ForecastResponse>(
        `/api/weather/forecast?q=${encodeURIComponent(query!)}&days=3`
      ),
    enabled: !!query,
  });
}

export function citySearchQueryOptions(term: string) {
  return queryOptions<SearchResult[]>({
    queryKey: ["search", term],
    queryFn: () =>
      fetchApi<SearchResult[]>(
        `/api/search?q=${encodeURIComponent(term)}`
      ),
    enabled: term.length >= 2,
  });
}

export function useForecast(query: string | null) {
  return useQuery(forecastQueryOptions(query));
}

export function useCitySearch(term: string) {
  return useQuery(citySearchQueryOptions(term));
}
