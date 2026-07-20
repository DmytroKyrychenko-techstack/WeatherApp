import { getPrisma } from "@/lib/db";
import { beforeEach } from "vitest";

beforeEach(async () => {
  const prisma = getPrisma();
  // Delete in reverse order of FK dependencies
  await prisma.searchHistory.deleteMany({});
  await prisma.favoriteCity.deleteMany({});
  await prisma.user.deleteMany({});
});
