'use client'
import { createContext, useContext, useState, type ReactNode } from 'react'
import { borrowBook as dbBorrowBook, returnBook as dbReturnBook, addBook as dbAddBook, addMember as dbAddMember } from '@/db/actions'
import { LOAN_DAYS } from '@/lib/constants'
import type { AgeBand, Book, Child, Loan, Pickup, Family, ConfirmBanner, Role, Screen, Tier } from './types'

export { LOAN_DAYS }

interface InitialData {
  books: Book[]
  children: Child[]
  allChildren: Child[]
  loans: Loan[]
  pickups: Pickup[]
  families: Family[]
}

interface StoreProviderProps {
  children: ReactNode
  initialData: InitialData
  initialRole?: Role
  userName?: string
}

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
  books: Book[]
  families: Family[]
  confirm: ConfirmBanner | null
}

interface AppStore extends AppState {
  children: Child[]
  allChildren: Child[]
  pickups: Pickup[]
  loanDays: number
  userName: string
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
  goAddBook: () => void
  goAddMember: () => void
  goCheckout: () => void
  getAvailable: (bookId: number) => number
  addBook: (params: { title: string; author: string; category: string; age_band: AgeBand; cover_color: string; total_copies: number; blurb: string }) => Promise<void>
  addMember: (params: { account_name: string; adult_holder: string; tier: Tier; children: Array<{ name: string; age: number | null }> }) => Promise<void>
  librarianCheckout: (params: { bookId: number; childId: number; pickupId: number; childName: string; familyName: string; bookTitle: string; coverColor: string; pickupName: string }) => Promise<void>
}

const StoreCtx = createContext<AppStore | null>(null)

export function StoreProvider({ children: childrenProp, initialData, initialRole = 'parent', userName = '' }: StoreProviderProps) {
  const [state, setState] = useState<AppState>({
    role: initialRole,
    screen: 'home',
    query: '',
    category: 'All',
    age: 'All',
    selectedBookId: null,
    borrowChild: initialData.children[0]?.name ?? '',
    borrowPickup: null,
    loans: initialData.loans,
    books: initialData.books,
    families: initialData.families,
    confirm: null,
  })

  const set = (patch: Partial<AppState>) => setState(s => ({ ...s, ...patch }))

  const getAvailable = (bookId: number) =>
    state.books.find(b => b.id === bookId)?.available ?? 0

  const store: AppStore = {
    ...state,
    children: initialData.children,
    allChildren: initialData.allChildren,
    pickups: initialData.pickups,
    loanDays: LOAN_DAYS,
    userName,
    getAvailable,
    setRole: (role) => set({ role, screen: role === 'parent' ? 'home' : 'desk', confirm: null }),
    setScreen: (screen) => set({ screen }),
    setQuery: (query) => set({ query }),
    setCategory: (category) => set({ category }),
    setAge: (age) => set({ age }),
    openBook: (id) => set({ selectedBookId: id, screen: 'detail', borrowPickup: null, borrowChild: initialData.children[0]?.name ?? '' }),
    back: () => set({ screen: 'browse', selectedBookId: null }),
    setBorrowChild: (name) => set({ borrowChild: name }),
    setBorrowPickup: (name) => set({ borrowPickup: name }),

    borrowBook: () => {
      const book = state.books.find(b => b.id === state.selectedBookId)
      const child = initialData.children.find(c => c.name === state.borrowChild)
      const pickup = initialData.pickups.find(p => p.name === state.borrowPickup)
      if (!book || !child || !pickup || book.available === 0) return

      const childLoans = state.loans.filter(l => l.child_id === child.id)
      if (childLoans.length >= 2) return

      // Optimistic update
      set({
        books: state.books.map(b => b.id === book.id ? { ...b, available: b.available - 1 } : b),
        screen: 'shelf',
        selectedBookId: null,
        confirm: { title: 'Request placed', sub: `${book.title} for ${child.name} · collect at ${pickup.name}.` },
      })

      dbBorrowBook({
        bookId: book.id,
        childId: parseInt(child.id),
        pickupId: parseInt(pickup.id),
        childName: child.name,
        familyName: userName,
        bookTitle: book.title,
        coverColor: book.cover_color,
        pickupName: pickup.name,
      }).then(newLoan => {
        setState(s => ({ ...s, loans: [newLoan, ...s.loans] }))
      }).catch(err => {
        console.error('borrowBook failed:', err)
        // Revert optimistic update
        setState(s => ({
          ...s,
          books: s.books.map(b => b.id === book.id ? { ...b, available: b.available + 1 } : b),
          confirm: { title: 'Something went wrong', sub: 'Please try again.' },
        }))
      })
    },

    returnBook: (loanId) => {
      const loan = state.loans.find(l => l.id === loanId)
      if (!loan) return

      // Optimistic update
      set({
        loans: state.loans.filter(l => l.id !== loanId),
        books: state.books.map(b => b.id === loan.book_id ? { ...b, available: Math.min(b.available + 1, b.total_copies) } : b),
        confirm: { title: 'Returned — asante!', sub: `${loan.title} is back on the shelf.` },
      })

      dbReturnBook(parseInt(loanId)).catch(err => {
        console.error('returnBook failed:', err)
        setState(s => ({
          ...s,
          loans: [loan, ...s.loans],
          books: s.books.map(b => b.id === loan.book_id ? { ...b, available: b.available - 1 } : b),
          confirm: { title: 'Something went wrong', sub: 'Please try again.' },
        }))
      })
    },

    dismissConfirm: () => set({ confirm: null }),
    goHome: () => set({ screen: 'home' }),
    goBrowse: () => set({ screen: 'browse' }),
    goShelf: () => set({ screen: 'shelf' }),
    goAddBook: () => set({ screen: 'add-book' }),
    goAddMember: () => set({ screen: 'add-member' }),
    goCheckout: () => set({ screen: 'checkout' }),

    addBook: async (params) => {
      const newBook = await dbAddBook(params)
      set({ books: [...state.books, newBook], screen: 'catalogue' })
    },

    addMember: async (params) => {
      const newFamily = await dbAddMember(params)
      set({ families: [...state.families, newFamily], screen: 'members' })
    },

    librarianCheckout: async (params) => {
      const newLoan = await dbBorrowBook(params)
      setState(s => ({
        ...s,
        loans: [newLoan, ...s.loans],
        books: s.books.map(b =>
          b.id === params.bookId ? { ...b, available: b.available - 1 } : b
        ),
        screen: 'loans',
        confirm: { title: 'Loan recorded', sub: `${params.bookTitle} checked out to ${params.childName} · ${params.familyName}.` },
      }))
    },
  }

  return <StoreCtx.Provider value={store}>{childrenProp}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
