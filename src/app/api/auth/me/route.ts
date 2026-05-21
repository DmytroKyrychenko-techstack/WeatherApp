import { getPrisma } from "@/lib/db";
import { getAuthUser } from "@/lib/auth";

export async function GET(request: Request): Promise<Response> {
  const auth = await getAuthUser(request);
  if (!auth) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await getPrisma().user.findUnique({
    where: { id: auth.id },
    select: { id: true, email: true, createdAt: true },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }

  return Response.json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  });
}
