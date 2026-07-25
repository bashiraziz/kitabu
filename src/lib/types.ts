export type Role = 'parent' | 'librarian'
export type Screen = 'home' | 'browse' | 'detail' | 'shelf' | 'desk' | 'loans' | 'catalogue' | 'members' | 'add-book' | 'add-member' | 'checkout'
export type AgeBand = '6-8' | '9-12'
export type LoanStatus = 'active' | 'soon' | 'overdue'
export type Tier = 'family_friends' | 'wider_circle'

export interface Book {
  id: number
  title: string
  author: string
  category: string
  age_band: AgeBand
  cover_color: string
  ink_color: string
  total_copies: number
  available: number
  blurb: string
}

export interface Child {
  id: string
  name: string
  age: number
  initial: string
  color: string
  member_id: string
}

export interface Loan {
  id: string
  child_name: string
  child_id: string
  family_name: string
  title: string
  book_id: number
  cover_color: string
  pickup: string
  due_date: string
  status: LoanStatus
}

export interface Pickup {
  id: string
  name: string
  note: string
}

export interface Family {
  id: string
  name: string
  parent: string
  kids_text: string
  loan_count: number
  tier: Tier
}

export interface ConfirmBanner {
  title: string
  sub: string
}
