'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { BOOKS, CHILDREN, INITIAL_LOANS, PICKUPS, FAMILIES, LOAN_DAYS } from './seed'
import type { Book, Child, Loan, Pickup, Family, ConfirmBanner, Role, Screen } from './types'

interface AppState {
  role: Role
  screen: Screen
  query: string
  category: string
  age: string
  selectedBookId: number | null
  borrowChild: string
  borrowPickup: string | null
  loans: Loan[]
  confirm: ConfirmBanner | null
  availableOverrides: Record<number, number>
}

interface AppStore extends AppState {
  books: Book[]
  children: Child[]
  pickups: Pickup[]
  families: Family[]
  loanDays: number
  setRole: (role: Role) => void
  setScreen: (screen: Screen) => void
  setQuery: (q: string) => void
  setCategory: (cat: string) => void
  setAge: (age: string) => void
  openBook: (id: number) => void
  back: () => void
  setBorrowChild: (name: string) => void
  setBorrowPickup: (name: string) => void
  borrowBook: () => void
  returnBook: (loanId: string) => void
  dismissConfirm: () => void
  goHome: () => void
  goBrowse: () => void
  goShelf: () => void
  getAvailable: (bookId: number) => number
}

const StoreCtx = createContext<AppStore | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>({
    role: 'parent',
    screen: 'home',
    query: '',
    category: 'All',
    age: 'All',
    selectedBookId: null,
    borrowChild: CHILDREN[0].name,
    borrowPickup: null,
    loans: INITIAL_LOANS,
    confirm: null,
    availableOverrides: {},
  })

  const set = (patch: Partial<AppState>) => setState(s => ({ ...s, ...patch }))

  const getAvailable = (bookId: number, overrides?: Record<number, number>): number => {
    const ov = overrides ?? state.availableOverrides
    if (bookId in ov) return ov[bookId]
    return BOOKS.find(b => b.id === bookId)?.available ?? 0
  }

  const childLoans = (childName: string, loans: Loan[]) =>
    loans.filter(l => l.family_name === 'Nsubuga' && l.child_name === childName)

  const store: AppStore = {
    ...state,
    books: BOOKS,
    children: CHILDREN,
    pickups: PICKUPS,
    families: FAMILIES,
    loanDays: LOAN_DAYS,
    getAvailable: (id) => getAvailable(id),
    setRole: (role) => set({ role, screen: role === 'parent' ? 'home' : 'desk', confirm: null }),
    setScreen: (screen) => set({ screen }),
    setQuery: (query) => set({ query }),
    setCategory: (category) => set({ category }),
    setAge: (age) => set({ age }),
    openBook: (id) => set({ selectedBookId: id, screen: 'detail', borrowPickup: null, borrowChild: CHILDREN[0].name }),
    back: () => set({ screen: 'browse', selectedBookId: null }),
    setBorrowChild: (name) => set({ borrowChild: name }),
    setBorrowPickup: (name) => set({ borrowPickup: name }),
    borrowBook: () => {
      const book = BOOKS.find(b => b.id === state.selectedBookId)
      if (!book || !state.borrowPickup) return
      const avail = getAvailable(book.id)
      if (avail === 0) return
      const cl = childLoans(state.borrowChild, state.loans)
      if (cl.length >= 2) return
      const child = CHILDREN.find(c => c.name === state.borrowChild)
      const newLoan: Loan = {
        id: `n${Date.now()}`,
        child_name: state.borrowChild,
        child_id: child?.id ?? 'c1',
        family_name: 'Nsubuga',
        title: book.title,
        book_id: book.id,
        cover_color: book.cover_color,
        pickup: state.borrowPickup,
        due_date: `${LOAN_DAYS}-day loan`,
        status: 'active',
      }
      const newOverrides = {
        ...state.availableOverrides,
        [book.id]: avail - 1,
      }
      set({
        loans: [newLoan, ...state.loans],
        screen: 'shelf',
        selectedBookId: null,
        confirm: {
          title: 'Request placed',
          sub: `${book.title} for ${state.borrowChild} · collect at ${state.borrowPickup}.`,
        },
        availableOverrides: newOverrides,
      })
    },
    returnBook: (loanId) => {
      const loan = state.loans.find(l => l.id === loanId)
      if (!loan) return
      const currentAvail = getAvailable(loan.book_id)
      const baseAvail = BOOKS.find(b => b.id === loan.book_id)?.available ?? 0
      const totalCopies = BOOKS.find(b => b.id === loan.book_id)?.total_copies ?? 1
      const newAvail = Math.min(currentAvail + 1, totalCopies)
      const newOverrides = {
        ...state.availableOverrides,
        [loan.book_id]: newAvail === baseAvail ? undefined : newAvail,
      }
      // Remove undefined keys
      const cleanOverrides: Record<number, number> = {}
      for (const [k, v] of Object.entries(newOverrides)) {
        if (v !== undefined) cleanOverrides[Number(k)] = v as number
      }
      set({
        loans: state.loans.filter(l => l.id !== loanId),
        confirm: { title: 'Returned — asante!', sub: `${loan.title} is back on the shelf.` },
        availableOverrides: cleanOverrides,
      })
    },
    dismissConfirm: () => set({ confirm: null }),
    goHome: () => set({ screen: 'home' }),
    goBrowse: () => set({ screen: 'browse' }),
    goShelf: () => set({ screen: 'shelf' }),
  }

  return <StoreCtx.Provider value={store}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
