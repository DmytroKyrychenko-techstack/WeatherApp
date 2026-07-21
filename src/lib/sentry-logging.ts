import { after } from "next/server";
import * as Sentry from "@sentry/nextjs";

export function logCitySearch(city: string, source: "search" | "forecast") {
  Sentry.logger.info("city_searched", { city, source });
  after(() => Sentry.flush(2000));
}
