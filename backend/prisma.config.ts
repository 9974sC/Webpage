import 'dotenv/config'
import { defineConfig } from 'prisma/config'

// Use a placeholder URL for Prisma client generation if DATABASE_URL is not set
// This allows generating the client without a real database connection
const databaseUrl = process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/ascendia?schema=public'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  datasource: {
    url: databaseUrl,
  },
  migrations: {
    path: 'prisma/migrations',
  },
})
