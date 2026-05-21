import { cache } from "react";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";
import { getPrisma } from "@/lib/db";

/**
 * Verifies the session cookie and returns the decoded payload.
 * Memoized per request via React cache() — safe to call in multiple server components.
 */
export const verifySession = cache(async (): Promise<{
  userId: string;
  email: string;
} | null> => {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  return { userId: payload.sub, email: payload.email };
});

/**
 * Returns the current authenticated user's public data, or null.
 * Memoized per request — safe to call in Server Components, Actions, and Route Handlers.
 */
export const getUser = cache(async (): Promise<{
  id: string;
  email: string;
} | null> => {
  const session = await verifySession();
  if (!session) return null;
  const user = await getPrisma().user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true },
  });
  return user;
});
