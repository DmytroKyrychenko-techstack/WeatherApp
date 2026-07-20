import * as Sentry from "@sentry/nextjs";
import { z } from "zod/v4";
import { searchCities } from "@/lib/weather-api";

const querySchema = z.object({
  q: z.string().min(1, "Query parameter 'q' is required"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = querySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
  });

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? "Invalid request" },
      { status: 400 }
    );
  }

  const { q } = parsed.data;

  if (q === "__sentry_test__") {
    throw new Error(
      "Sentry test error: triggered via magic search query '__sentry_test__'"
    );
  }

  try {
    const data = await searchCities(q);
    return Response.json(data);
  } catch (error) {
    Sentry.captureException(error);
    const message =
      error instanceof Error ? error.message : "Failed to search cities";
    return Response.json({ error: message }, { status: 500 });
  }
}
