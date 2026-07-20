import { getPrisma } from "@/lib/db";

export async function teardown() {
  const prisma = getPrisma();
  await prisma.$disconnect();
}
