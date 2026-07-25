import 'dotenv/config'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.POSTGRES_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
})

async function run() {
  const client = await pool.connect()
  try {
    console.log('Creating Better Auth tables...')

    await client.query(`
      CREATE TABLE IF NOT EXISTS "user" (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        "emailVerified" BOOLEAN NOT NULL DEFAULT FALSE,
        image TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS "session" (
        id TEXT PRIMARY KEY,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        token TEXT NOT NULL UNIQUE,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "ipAddress" TEXT,
        "userAgent" TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS "account" (
        id TEXT PRIMARY KEY,
        "accountId" TEXT NOT NULL,
        "providerId" TEXT NOT NULL,
        "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
        "accessToken" TEXT,
        "refreshToken" TEXT,
        "idToken" TEXT,
        "accessTokenExpiresAt" TIMESTAMPTZ,
        "refreshTokenExpiresAt" TIMESTAMPTZ,
        scope TEXT,
        password TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await client.query(`
      CREATE TABLE IF NOT EXISTS "verification" (
        id TEXT PRIMARY KEY,
        identifier TEXT NOT NULL,
        value TEXT NOT NULL,
        "expiresAt" TIMESTAMPTZ NOT NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    await client.query(`CREATE INDEX IF NOT EXISTS idx_session_user ON "session"("userId");`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_account_user ON "account"("userId");`)
    await client.query(`CREATE INDEX IF NOT EXISTS idx_verification_id ON "verification"(identifier);`)

    // App-specific: links auth users to library members and roles
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
        role TEXT NOT NULL DEFAULT 'parent',
        member_id INTEGER REFERENCES members(id) ON DELETE SET NULL,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
      );
    `)

    console.log('✅ Auth tables created successfully.')
  } finally {
    client.release()
    await pool.end()
  }
}

run().catch(err => { console.error(err); process.exit(1) })
