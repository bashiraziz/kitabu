import 'dotenv/config'
import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: process.env.POSTGRES_URL?.includes('neon.tech') ? { rejectUnauthorized: false } : undefined,
})

const email = process.argv[2] || 'bashiraziz@yahoo.com'

async function run() {
  const client = await pool.connect()

  const userRow = await client.query(`SELECT id FROM "user" WHERE email = $1`, [email])
  if (userRow.rowCount === 0) {
    console.error(`No user found with email ${email}`)
    client.release(); await pool.end(); return
  }
  const userId = userRow.rows[0].id

  await client.query(
    `INSERT INTO user_profiles (id, role, member_id)
     VALUES ($1, 'librarian', NULL)
     ON CONFLICT (id) DO UPDATE SET role = 'librarian'`,
    [userId]
  )
  console.log(`✅ ${email} (${userId}) is now a librarian.`)

  client.release()
  await pool.end()
}

run().catch(err => { console.error(err); process.exit(1) })
