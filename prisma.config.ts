import { fileURLToPath } from "url";
import path from "path";
import { config } from "dotenv";
import { defineConfig, env } from "prisma/config";

config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), ".env.local") });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
