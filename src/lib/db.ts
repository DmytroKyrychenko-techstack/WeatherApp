import { PrismaClient } from "@/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

let prismaInstance: PrismaClient | null = null;

export function getPrisma(): PrismaClient {
  if (!prismaInstance) {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    prismaInstance = new PrismaClient({ adapter });
  }
  return prismaInstance;
}
