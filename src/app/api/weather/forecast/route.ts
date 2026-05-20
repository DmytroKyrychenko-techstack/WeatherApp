import { z } from "zod/v4";
import { getForecast } from "@/lib/weather-api";
import { getWithSWR } from "@/lib/cache";
import { CACHE_TTL_MS } from "@/lib/constants";

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

  try {
    const data = await getWithSWR(
      `forecast:${q.toLowerCase()}:${days}`,
      () => getForecast(q, days),
      CACHE_TTL_MS
    );
    return Response.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch forecast";
    return Response.json({ error: message }, { status: 500 });
  }
}
