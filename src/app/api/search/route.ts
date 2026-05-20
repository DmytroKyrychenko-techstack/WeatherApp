import { z } from "zod/v4";
import { searchCities } from "@/lib/weather-api";
import { getWithSWR } from "@/lib/cache";
import { CACHE_TTL_MS } from "@/lib/constants";

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

  try {
    const data = await getWithSWR(
      `search:${q.toLowerCase()}`,
      () => searchCities(q),
      CACHE_TTL_MS
    );
    return Response.json(data);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to search cities";
    return Response.json({ error: message }, { status: 500 });
  }
}
