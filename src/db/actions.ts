'use server'

import { db } from './index'
import { books, children, loans, copies, members } from './schema'
import { eq, and } from 'drizzle-orm'
import { loanStatus, formatDue } from './queries'
import type { AgeBand, Book, Family, Loan, Tier } from '@/lib/types'
import { LOAN_DAYS } from '@/lib/constants'

export async function borrowBook(params: {
  bookId: number
  childId: number
  pickupId: number
  childName: string
  familyName: string
  bookTitle: string
  coverColor: string
  pickupName: string
}): Promise<Loan> {
  const { bookId, childId, pickupId, childName, familyName, bookTitle, coverColor, pickupName } = params

  const [availableCopy] = await db
    .select()
    .from(copies)
    .where(and(eq(copies.book_id, bookId), eq(copies.status, 'in')))
    .limit(1)

  if (!availableCopy) throw new Error('No copies available')

  const borrowedDate = new Date()
  const dueDate = new Date(borrowedDate)
  dueDate.setDate(dueDate.getDate() + LOAN_DAYS)

  const [newLoan] = await db
    .insert(loans)
    .values({ copy_id: availableCopy.id, child_id: childId, pickup_id: pickupId, borrowed_date: borrowedDate, due_date: dueDate })
    .returning({ id: loans.id })

  await db.update(copies).set({ status: 'out' }).where(eq(copies.id, availableCopy.id))

  return {
    id: newLoan.id.toString(),
    child_id: childId.toString(),
    child_name: childName,
    family_name: familyName,
    title: bookTitle,
    book_id: bookId,
    cover_color: coverColor,
    pickup: pickupName,
    due_date: formatDue(dueDate),
    status: loanStatus(dueDate),
  }
}

export async function addBook(params: {
  title: string
  author: string
  category: string
  age_band: AgeBand
  cover_color: string
  total_copies: number
  blurb: string
}): Promise<Book> {
  const [newBook] = await db.insert(books).values(params).returning()

  await db.insert(copies).values(
    Array.from({ length: params.total_copies }, () => ({
      book_id: newBook.id,
      status: 'in' as const,
    }))
  )

  return {
    id: newBook.id,
    title: newBook.title,
    author: newBook.author,
    category: newBook.category,
    age_band: newBook.age_band as AgeBand,
    cover_color: newBook.cover_color ?? params.cover_color,
    ink_color: ['#C9A227'].includes(params.cover_color) ? '#1a1a1a' : '#fff',
    blurb: newBook.blurb ?? '',
    total_copies: newBook.total_copies,
    available: newBook.total_copies,
  }
}

export async function addMember(params: {
  account_name: string
  adult_holder: string
  tier: Tier
  children: Array<{ name: string; age: number | null }>
}): Promise<Family> {
  const [newMember] = await db
    .insert(members)
    .values({ account_name: params.account_name, adult_holder: params.adult_holder, tier: params.tier })
    .returning()

  if (params.children.length > 0) {
    await db.insert(children).values(
      params.children.map(c => ({ member_id: newMember.id, name: c.name, age: c.age }))
    )
  }

  const kidsText = params.children
    .map(c => `${c.name}${c.age ? ` (${c.age})` : ''}`)
    .join(' · ')

  return {
    id: newMember.id.toString(),
    name: newMember.account_name,
    parent: newMember.adult_holder,
    kids_text: kidsText,
    loan_count: 0,
    tier: newMember.tier,
  }
}

export async function returnBook(loanId: number): Promise<void> {
  const [loan] = await db.select().from(loans).where(eq(loans.id, loanId)).limit(1)
  if (!loan) throw new Error('Loan not found')

  await db.update(loans).set({ returned_date: new Date() }).where(eq(loans.id, loanId))
  await db.update(copies).set({ status: 'in' }).where(eq(copies.id, loan.copy_id))
}
