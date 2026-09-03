import { PrismaClient } from '@prisma/client';

const globalForPrisma = global;

const dbUrl =
  process.env.DATABASE_URL ||
  process.env.DATABASE1_URL ||
  process.env.DATABASE1_URL_PRISMA_URL ||
  process.env.DATABASE1_URL_URL ||
  process.env.DATABASE1_URL_DATABASE_URL ||
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient(
    dbUrl
      ? {
          datasources: {
            db: {
              url: dbUrl,
            },
          },
        }
      : undefined
  );

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
