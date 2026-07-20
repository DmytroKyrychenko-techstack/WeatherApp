import { hashPassword, signToken } from "@/lib/auth";
import { getPrisma } from "@/lib/db";

export async function createTestUser(email?: string) {
  if (!email) {
    email = `test-${crypto.randomUUID().substring(0, 8)}@example.com`;
  }

  // Use the global Prisma singleton to ensure data is visible
  const prisma = getPrisma();

  const passwordHash = await hashPassword("password123");

  const user = await prisma.user.create({
    data: {
      email,
      passwordHash,
    },
  });

  const token = await signToken({ sub: user.id, email: user.email });

  return { user, token };
}

export function makeAuthRequest(
  url: string,
  token: string,
  init?: RequestInit
): Request {
  return new Request(url, {
    ...init,
    headers: {
      "Cookie": `auth_token=${token}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
}
