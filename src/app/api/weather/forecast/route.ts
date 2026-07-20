import * as Sentry from "@sentry/nextjs";
import { z } from "zod/v4";
import { getForecast } from "@/lib/weather-api";
import { logCitySearch } from "@/lib/sentry-logging";

const querySchema = z.object({
  q: z.string().min(1, "Query parameter 'q' is required"),
  days: z.coerce.number().int().min(1).max(3).default(3),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    days: searchParams.get("days") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { q, days } = parsed.data;

  logCitySearch(q, "forecast");

  try {
    const data = await getForecast(q, days);
    return Response.json(data);
  } catch (error) {
    Sentry.captureException(error);
    const message =
      error instanceof Error ? error.message : "Failed to fetch forecast";
    return Response.json({ error: message }, { status: 500 });
  }
}
