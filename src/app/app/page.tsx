export const dynamic = 'force-dynamic'

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { sql } from '@/db'
import { StoreProvider } from '@/lib/store'
import { AppShell } from '@/components/app/AppShell'
import { getBooks, getChildren, getAllChildren, getAllLoans, getPickups, getFamilies } from '@/db/queries'

export default async function AppPage() {
  const reqHeaders = await headers()
  const session = await auth.api.getSession({ headers: reqHeaders })

  if (!session) redirect('/sign-in')

  let role: 'parent' | 'librarian' = 'parent'
  let memberId: number | null = null

  try {
    const rows = await sql`SELECT role, member_id FROM user_profiles WHERE id = ${session.user.id}`
    const row = rows[0] as { role: string; member_id: number | null } | undefined
    if (row) {
      role = row.role === 'librarian' ? 'librarian' : 'parent'
      memberId = row.member_id ?? null
    }
  } catch {
    // profile row not yet created — default to parent
  }

  const books = await getBooks()
  const children = memberId ? await getChildren(memberId) : []
  const allChildren = await getAllChildren()
  const loans = await getAllLoans()
  const pickups = await getPickups()
  const families = await getFamilies()

  return (
    <StoreProvider
      initialData={{ books, children, allChildren, loans, pickups, families }}
      initialRole={role}
      userName={session.user.name ?? session.user.email}
    >
      <AppShell />
    </StoreProvider>
  )
}
