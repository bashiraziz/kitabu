export const dynamic = 'force-dynamic'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { sql } from '@/db'
import { getFamilies } from '@/db/queries'
import { SetupClient } from './SetupClient'

export default async function SetupPage() {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })
  if (!session) redirect('/sign-in')

  // If already linked, skip setup
  const rows = await sql`SELECT member_id FROM user_profiles WHERE id = ${session.user.id}`
  const memberId = (rows[0] as { member_id: number | null } | undefined)?.member_id ?? null
  if (memberId !== null) redirect('/app')

  const families = await getFamilies()

  return (
    <SetupClient
      userId={session.user.id}
      userName={session.user.name ?? session.user.email}
      families={families}
    />
  )
}
