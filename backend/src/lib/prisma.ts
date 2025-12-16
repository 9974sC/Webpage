import { PrismaClient } from "@prisma/client"
import { Pool } from "pg"
import { PrismaPg } from "@prisma/adapter-pg"
import dotenv from "dotenv"
import { resolve } from "path"

// Ensure dotenv is loaded (in case this module is imported before server.ts)
// Use process.cwd() to get the backend directory since we're in CommonJS
dotenv.config({ path: resolve(process.cwd(), ".env") })

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL environment variable is not set. Please create a .env file in the backend directory with DATABASE_URL.")
}

// Create a PostgreSQL connection pool
const pool = new Pool({ connectionString: process.env.DATABASE_URL })
const adapter = new PrismaPg(pool)

// Prisma 7 requires an adapter for database connections
export const prisma = new PrismaClient({ adapter })
