import * as Sentry from "@sentry/nextjs";

export function logCitySearch(city: string, source: "search" | "forecast") {
  Sentry.captureEvent({
    message: "city_searched",
    level: "info",
    extra: { city, source },
  });
}
