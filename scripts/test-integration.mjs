import { execSync } from "child_process";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(__dirname, "..");

const testDbUrl =
  "postgresql://weatherapp_test:weatherapp_test@localhost:5434/weatherapp_test";

console.log("🐳 Starting test database container...");
try {
  execSync(
    "docker compose -f docker-compose.test.yml up -d --wait",
    {
      cwd: projectRoot,
      stdio: "inherit",
    }
  );
} catch (error) {
  console.error("❌ Failed to start database container");
  process.exit(1);
}

console.log("📦 Running migrations...");
try {
  execSync("npx prisma migrate deploy", {
    cwd: projectRoot,
    env: {
      ...process.env,
      DATABASE_URL: testDbUrl,
    },
    stdio: "inherit",
  });
} catch (error) {
  console.error("❌ Migrations failed");
  execSync("docker compose -f docker-compose.test.yml down -v", {
    cwd: projectRoot,
    stdio: "inherit",
  });
  process.exit(1);
}

console.log("🧪 Running integration tests...");
let testExit = 0;
try {
  execSync(
    "vitest run --config vitest.integration.ts",
    {
      cwd: projectRoot,
      env: {
        ...process.env,
        DATABASE_URL: testDbUrl,
        JWT_SECRET: "integration-test-jwt-secret-minimum-32-chars!",
        WEATHER_API_KEY: "test-only-not-used",
      },
      stdio: "inherit",
    }
  );
} catch (error) {
  testExit = error.status || 1;
}

console.log("🧹 Cleaning up containers and volumes...");
try {
  execSync("docker compose -f docker-compose.test.yml down -v", {
    cwd: projectRoot,
    stdio: "inherit",
  });
} catch (error) {
  console.warn("⚠️ Failed to fully clean up containers");
}

process.exit(testExit);
