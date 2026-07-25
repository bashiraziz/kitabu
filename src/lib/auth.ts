import { betterAuth } from 'better-auth'
import { nextCookies } from 'better-auth/next-js'
import { Pool } from 'pg'

const databaseUrl = process.env.POSTGRES_URL
const ssl = databaseUrl?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined

const authSecret = process.env.BETTER_AUTH_SECRET
if (!authSecret && process.env.NODE_ENV === 'production') {
  throw new Error('BETTER_AUTH_SECRET is required in production.')
}

const pool = databaseUrl ? new Pool({ connectionString: databaseUrl, ssl }) : undefined

async function sendResetEmail(email: string, url: string) {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    // Dev fallback — log the link so you can test without an email provider
    console.log(`\n🔑 Password reset link for ${email}:\n${url}\n`)
    return
  }
  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: 'Kitabu <noreply@kitabu.app>',
      to: email,
      subject: 'Reset your Kitabu password',
      html: `<p>Click the link below to reset your password. It expires in 1 hour.</p>
             <p><a href="${url}">${url}</a></p>
             <p>If you didn't request this, ignore this email.</p>`,
    }),
  })
}

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
  secret: authSecret || 'dev-insecure-secret-please-set-env',
  database: pool,
  session: {
    cookieCache: {
      enabled: false,
    },
  },
  advanced: {
    cookiePrefix: 'kitabu',
    defaultCookieAttributes: {
      // No maxAge = session cookie: cleared when the browser is closed
      sameSite: 'lax',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  },
  emailAndPassword: {
    enabled: true,
    sendResetPassword: async ({ user, url }) => {
      await sendResetEmail(user.email, url)
    },
  },
  plugins: [nextCookies()],
  databaseHooks: {
    user: {
      create: {
        async after(user) {
          if (!pool) return
          const client = await pool.connect()
          try {
            await client.query(
              `INSERT INTO user_profiles (id, role, member_id) VALUES ($1, 'parent', NULL) ON CONFLICT (id) DO NOTHING`,
              [user.id]
            )
          } finally {
            client.release()
          }
        },
      },
    },
  },
})
