import { z } from "zod/v4";
import { getPrisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";
import { Prisma } from "@/generated/prisma/client";

const addSchema = z.object({
  cityName: z.string().min(1).max(100),
});

const removeSchema = z.object({
  cityName: z.string().min(1),
});

export async function GET(request: Request): Promise<Response> {
  const auth = await getAuthUser(request);
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const favorites = await getPrisma().favoriteCity.findMany({
    where: { userId: auth.id },
    orderBy: { createdAt: "asc" },
    select: { id: true, cityName: true, userId: true, createdAt: true },
  });

  return Response.json(
    favorites.map((f) => ({ ...f, createdAt: f.createdAt.toISOString() }))
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

  const parsed = addSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: z.prettifyError(parsed.error) }, { status: 400 });
  }

  try {
    const favorite = await getPrisma().favoriteCity.create({
      data: { userId: auth.id, cityName: parsed.data.cityName },
    });
    return Response.json(
      { ...favorite, createdAt: favorite.createdAt.toISOString() },
      { status: 201 }
    );
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return Response.json({ error: "Already favorited" }, { status: 409 });
    }
    throw e;
  }
}

export async function DELETE(request: Request): Promise<Response> {
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

  const parsed = removeSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: z.prettifyError(parsed.error) }, { status: 400 });
  }

  await getPrisma().favoriteCity.deleteMany({
    where: { userId: auth.id, cityName: parsed.data.cityName },
  });

  return Response.json({ success: true });
}
