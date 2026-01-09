/**
 * Prisma Client Singleton
 *
 * This file creates a single Prisma Client instance that is reused across
 * the application. This is important in development to avoid creating too
 * many database connections during hot-reloading.
 *
 * In production, a new client is created for each request automatically.
 */

import { PrismaClient } from '@prisma/client'

// PrismaClient is attached to the `global` object in development
// to prevent exhausting your database connection limit.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn']
        : ['error'],
  })

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
