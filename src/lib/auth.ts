import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { Pool } from 'pg'

const databaseUrl = process.env.POSTGRES_URL
const ssl = databaseUrl?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined

const authSecret = process.env.BETTER_AUTH_SECRET
if (!authSecret && process.env.NODE_ENV === 'production') {
  throw new Error('BETTER_AUTH_SECRET is required in production.')
}

const database = databaseUrl
  ? new Pool({ connectionString: databaseUrl, ssl })
  : undefined

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: authSecret || 'dev-insecure-secret-please-set-env',
  database,
  emailAndPassword: { enabled: true },
  plugins: [nextCookies()],
})
