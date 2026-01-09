/**
 * Prisma Client Singleton
 *
 * This file creates a single Prisma Client instance that is reused across
 * the application. Uses @prisma/adapter-pg for Prisma 7 compatibility.
 *
 * In production, a new client is created for each request automatically.
 */

import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

// Create the PostgreSQL adapter with connection string
const connectionString = process.env.DATABASE_URL!

// PrismaClient is attached to the `global` object in development
// to prevent exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaPg({ connectionString })
  return new PrismaClient({
    adapter,
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma
}

// Export Prisma enums for use in the application
export {
  ImageStatus,
  TransformationType,
  TransformationStatus,
  BatchJobStatus,
} from '@prisma/client'
