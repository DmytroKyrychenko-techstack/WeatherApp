import { z } from "zod/v4";
import { getPrisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

const MAX_HISTORY = 5;

const postSchema = z.object({
  searchTerm: z.string().min(1).max(100),
});

export async function GET(request: Request): Promise<Response> {
  const auth = await getAuthUser(request);
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const history = await getPrisma().searchHistory.findMany({
    where: { userId: auth.id },
    orderBy: { timestamp: "desc" },
    take: MAX_HISTORY,
    select: { id: true, searchTerm: true, userId: true, timestamp: true },
  });

  return Response.json(
    history.map((h) => ({ ...h, timestamp: h.timestamp.toISOString() }))
  );
}

export async function POST(request: Request): Promise<Response> {
  const auth = await getAuthUser(request);
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json(
      { error: z.prettifyError(parsed.error) },
      { status: 400 }
    );
  }

  const { searchTerm } = parsed.data;
  const prisma = getPrisma();

  const record = await prisma.$transaction(async (tx) => {
    const existing = await tx.searchHistory.findFirst({
      where: { userId: auth.id, searchTerm },
    });

    if (existing) {
      return tx.searchHistory.update({
        where: { id: existing.id },
        data: { timestamp: new Date() },
      });
    }

    const count = await tx.searchHistory.count({
      where: { userId: auth.id },
    });

    if (count >= MAX_HISTORY) {
      const oldest = await tx.searchHistory.findFirst({
        where: { userId: auth.id },
        orderBy: { timestamp: "asc" },
      });
      if (oldest) {
        await tx.searchHistory.delete({ where: { id: oldest.id } });
      }
    }

    return tx.searchHistory.create({
      data: { userId: auth.id, searchTerm },
    });
  });

  return Response.json(
    { ...record, timestamp: record.timestamp.toISOString() },
    { status: 201 }
  );
}
