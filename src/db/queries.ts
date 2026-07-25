import { db } from './index'
import { books, copies, children, loans, members, pickups } from './schema'
import { eq, sql, and, isNull, inArray } from 'drizzle-orm'
import type { AgeBand, Book, Child, Loan, Pickup, Family } from '@/lib/types'

const CHILD_COLORS = ['#C65D3B', '#1F7A82', '#7A3B5E', '#2E6E5A', '#C9A227', '#B23A48']
const LIGHT_COVERS = new Set(['#C9A227'])

function inkColor(hex: string) {
  return LIGHT_COVERS.has(hex) ? '#1a1a1a' : '#fff'
}

export function loanStatus(dueDate: Date): 'active' | 'soon' | 'overdue' {
  const diff = dueDate.getTime() - Date.now()
  if (diff < 0) return 'overdue'
  if (diff < 3 * 24 * 60 * 60 * 1000) return 'soon'
  return 'active'
}

export function formatDue(dueDate: Date) {
  return dueDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })
}

export async function getBooks(): Promise<Book[]> {
  const rows = await db
    .select({
      id: books.id,
      title: books.title,
      author: books.author,
      category: books.category,
      age_band: books.age_band,
      total_copies: books.total_copies,
      cover_color: books.cover_color,
      blurb: books.blurb,
      available: sql<number>`cast(count(case when ${copies.status} = 'in' then 1 end) as int)`,
    })
    .from(books)
    .leftJoin(copies, eq(copies.book_id, books.id))
    .groupBy(books.id)
    .orderBy(books.id)

  return rows.map(row => ({
    ...row,
    age_band: row.age_band as AgeBand,
    cover_color: row.cover_color ?? '#64748B',
    ink_color: inkColor(row.cover_color ?? ''),
    blurb: row.blurb ?? '',
    available: Number(row.available),
  }))
}

export async function getChildren(memberId: number): Promise<Child[]> {
  const rows = await db
    .select()
    .from(children)
    .where(eq(children.member_id, memberId))
    .orderBy(children.id)

  return rows.map((row, i) => ({
    id: row.id.toString(),
    name: row.name,
    age: row.age ?? 0,
    initial: row.name[0].toUpperCase(),
    color: CHILD_COLORS[i % CHILD_COLORS.length],
    member_id: row.member_id.toString(),
  }))
}

export async function getAllChildren(): Promise<Child[]> {
  const rows = await db.select().from(children).orderBy(children.member_id, children.id)
  return rows.map(row => ({
    id: row.id.toString(),
    name: row.name,
    age: row.age ?? 0,
    initial: row.name[0].toUpperCase(),
    color: CHILD_COLORS[row.id % CHILD_COLORS.length],
    member_id: row.member_id.toString(),
  }))
}

export async function getPickups(): Promise<Pickup[]> {
  const rows = await db.select().from(pickups).orderBy(pickups.id)
  return rows.map(row => ({
    id: row.id.toString(),
    name: row.name,
    note: row.schedule ?? '',
  }))
}

export async function getAllLoans(): Promise<Loan[]> {
  const rows = await db
    .select({
      loan_id: loans.id,
      child_id: loans.child_id,
      due_date: loans.due_date,
      child_name: children.name,
      member_name: members.account_name,
      book_id: books.id,
      book_title: books.title,
      cover_color: books.cover_color,
      pickup_name: pickups.name,
    })
    .from(loans)
    .innerJoin(children, eq(loans.child_id, children.id))
    .innerJoin(members, eq(children.member_id, members.id))
    .innerJoin(copies, eq(loans.copy_id, copies.id))
    .innerJoin(books, eq(copies.book_id, books.id))
    .innerJoin(pickups, eq(loans.pickup_id, pickups.id))
    .where(isNull(loans.returned_date))
    .orderBy(loans.due_date)

  return rows.map(row => ({
    id: row.loan_id.toString(),
    child_id: row.child_id.toString(),
    child_name: row.child_name,
    family_name: row.member_name,
    title: row.book_title,
    book_id: row.book_id,
    cover_color: row.cover_color ?? '#64748B',
    pickup: row.pickup_name,
    due_date: formatDue(row.due_date),
    status: loanStatus(row.due_date),
  }))
}

export async function getFamilies(): Promise<Family[]> {
  const [memberRows, childRows, loanCounts] = await Promise.all([
    db.select().from(members).orderBy(members.id),
    db.select().from(children),
    db
      .select({ child_id: loans.child_id, count: sql<number>`cast(count(*) as int)` })
      .from(loans)
      .where(isNull(loans.returned_date))
      .groupBy(loans.child_id),
  ])

  const countMap = new Map(loanCounts.map(l => [l.child_id, Number(l.count)]))

  return memberRows.map(member => {
    const memberChildren = childRows.filter(c => c.member_id === member.id)
    const loanCount = memberChildren.reduce((sum, c) => sum + (countMap.get(c.id) ?? 0), 0)
    const kidsText = memberChildren
      .map(c => `${c.name}${c.age ? ` (${c.age})` : ''}`)
      .join(' · ')

    return {
      id: member.id.toString(),
      name: member.account_name,
      parent: member.adult_holder,
      kids_text: kidsText,
      loan_count: loanCount,
      tier: member.tier,
    }
  })
}
