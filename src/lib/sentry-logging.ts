import { after } from "next/server";
import * as Sentry from "@sentry/nextjs";

export function logCitySearch(city: string) {
  Sentry.logger.info("city_searched", { city });
  after(() => Sentry.flush(2000));
}
