import { z } from "zod/v4";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  WEATHER_API_KEY: z.string().min(1, "WEATHER_API_KEY is required"),
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
