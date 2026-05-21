"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod/v4";
import { getPrisma } from "@/lib/db";
import { hashPassword, verifyPassword, signToken } from "@/lib/auth";
import { AUTH_COOKIE_NAME } from "@/lib/auth-constants";

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  maxAge: 60 * 60 * 24 * 7, // 7 days
  path: "/",
};

export type AuthFormState = { error: string } | undefined;

const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
});

const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
});

export async function loginAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!parsed.success) {
    return { error: "Invalid email or password" };
  }

  const { email, password } = parsed.data;

  try {
    const user = await getPrisma().user.findUnique({ where: { email } });

    if (!user || !(await verifyPassword(password, user.passwordHash))) {
      return { error: "Invalid email or password" };
    }

    const token = await signToken({ sub: user.id, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
  } catch {
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/");
}

export async function registerAction(
  _prevState: AuthFormState,
  formData: FormData
): Promise<AuthFormState> {
  const parsed = registerSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid input";
    return { error: firstError };
  }

  const { email, password, confirmPassword } = parsed.data;

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  try {
    const existing = await getPrisma().user.findUnique({ where: { email } });
    if (existing) {
      return { error: "Email already registered" };
    }

    const passwordHash = await hashPassword(password);
    const user = await getPrisma().user.create({ data: { email, passwordHash } });

    const token = await signToken({ sub: user.id, email: user.email });
    const cookieStore = await cookies();
    cookieStore.set(AUTH_COOKIE_NAME, token, COOKIE_OPTIONS);
  } catch {
    return { error: "Something went wrong. Please try again." };
  }

  redirect("/");
}

export async function logoutAction(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
  redirect("/login");
}
