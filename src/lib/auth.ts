import * as Sentry from "@sentry/nextjs";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { getEnv } from "@/config/env";
import { AUTH_COOKIE_NAME, SENTRY_TEST_BANNED_EMAIL } from "@/lib/auth-constants";

function getSecret(): Uint8Array {
  return new TextEncoder().encode(getEnv().JWT_SECRET);
}

export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}

export async function signToken(payload: { sub: string; email: string }): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<{ sub: string; email: string } | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return { sub: payload.sub as string, email: payload.email as string };
  } catch {
    return null;
  }
}

export async function getAuthUser(
  request: Request
): Promise<{ id: string; email: string } | null> {
  const cookieHeader = request.headers.get("cookie") ?? "";
  const match = cookieHeader.match(new RegExp(`(?:^|; )${AUTH_COOKIE_NAME}=([^;]+)`));
  if (!match) return null;
  const token = decodeURIComponent(match[1]);
  const payload = await verifyToken(token);
  if (!payload) return null;

  if (payload.email === SENTRY_TEST_BANNED_EMAIL) {
    Sentry.captureException(
      new Error("Blocked request from simulated banned user"),
      { extra: { email: payload.email } }
    );
    return null;
  }

  return { id: payload.sub, email: payload.email };
}

