import { z } from "zod/v4";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  WEATHER_API_KEY: z.string().min(1, "WEATHER_API_KEY is required"),
  JWT_SECRET: z.string().min(32, "JWT_SECRET must be at least 32 characters"),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
});

export function getEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      z.prettifyError(parsed.error)
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}
