'use client'
import { useEffect } from 'react'
import { useStore } from '@/lib/store'
import { useTime, formatTime } from '@/lib/useTime'
import { signOut } from '@/lib/auth-client'
import { useRouter } from 'next/navigation'
import { HomeScreen } from './HomeScreen'
import { BrowseScreen } from './BrowseScreen'
import { DetailScreen } from './DetailScreen'
import { ShelfScreen } from './ShelfScreen'
import { DeskScreen } from './DeskScreen'
import { LoansScreen } from './LoansScreen'
import { CatalogueScreen } from './CatalogueScreen'
import { MembersScreen } from './MembersScreen'
import { AddBookScreen } from './AddBookScreen'
import { AddMemberScreen } from './AddMemberScreen'
import { CheckoutScreen } from './CheckoutScreen'

const homeIcon = (
  <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H4a1 1 0 01-1-1V9.5z" />
    <rect x="8" y="13" width="6" height="7" rx="1" />
  </svg>
)

const searchIcon = (
  <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9.5" cy="9.5" r="6.5" />
    <line x1="14.5" y1="14.5" x2="20" y2="20" />
  </svg>
)

const shelfIcon = (
  <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="4" height="14" rx="1" />
    <rect x="9" y="6" width="4" height="12" rx="1" />
    <rect x="15" y="3" width="4" height="15" rx="1" />
    <line x1="2" y1="19" x2="20" y2="19" />
  </svg>
)

const deskIcon = (
  <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="16" height="7" rx="1.5" />
    <rect x="3" y="13" width="16" height="5" rx="1.5" />
  </svg>
)

const loansIcon = (
  <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <line x1="4" y1="6" x2="18" y2="6" />
    <line x1="4" y1="11" x2="18" y2="11" />
    <line x1="4" y1="16" x2="13" y2="16" />
  </svg>
)

const catalogueIcon = (
  <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7" rx="1" />
    <rect x="12" y="3" width="7" height="7" rx="1" />
    <rect x="3" y="12" width="7" height="7" rx="1" />
    <rect x="12" y="12" width="7" height="7" rx="1" />
  </svg>
)

const membersIcon = (
  <svg viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="8" cy="7" r="3.5" />
    <path d="M2 19c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="16" cy="8" r="2.5" />
    <path d="M14 19c0-2 1.3-3.7 3-4.4" />
  </svg>
)

function TabBtn({
  icon,
  label,
  active,
  onClick,
}: {
  icon: React.ReactNode
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex flex-col items-center gap-[3px] py-[10px] pb-[14px] transition-colors duration-150 ${active ? 'text-accent' : 'text-ink-3'}`}
    >
      <span className="w-[22px] h-[22px]">{icon}</span>
      <span className="font-mono text-[9px] tracking-[.06em] uppercase">{label}</span>
    </button>
  )
}

export function AppShell() {
  const store = useStore()
  const now = useTime()
  const router = useRouter()

  const firstName = store.userName.split(' ')[0]

  // Tab-close session guard: sessionStorage is cleared when the tab closes.
  // If the flag is missing on mount, the user reopened a closed tab — sign them out.
  useEffect(() => {
    if (!sessionStorage.getItem('kitabu-tab')) {
      signOut().then(() => router.replace('/sign-in'))
      return
    }
  }, [router])

  const handleSignOut = async () => {
    sessionStorage.removeItem('kitabu-tab')
    await signOut()
    router.push('/sign-in')
  }

  function renderScreen() {
    if (store.role === 'parent') {
      switch (store.screen) {
        case 'home': return <HomeScreen />
        case 'browse': return <BrowseScreen />
        case 'detail': return <DetailScreen />
        case 'shelf': return <ShelfScreen />
        default: return <HomeScreen />
      }
    } else {
      switch (store.screen) {
        case 'desk': return <DeskScreen />
        case 'loans': return <LoansScreen />
        case 'catalogue': return <CatalogueScreen />
        case 'members': return <MembersScreen />
        case 'add-book': return <AddBookScreen />
        case 'add-member': return <AddMemberScreen />
        case 'checkout': return <CheckoutScreen />
        default: return <DeskScreen />
      }
    }
  }

  return (
    <div className="min-h-screen bg-paper-2 flex items-center justify-center p-4 font-sans text-ink">
      <div
        className="w-full max-w-[430px] bg-paper rounded-[34px] overflow-hidden flex flex-col relative border border-hair-2"
        style={{
          height: 'min(900px, 94vh)',
          boxShadow: '0 30px 80px -20px rgba(15,26,46,.35)',
        }}
      >
        {/* Status bar */}
        <div className="flex items-center justify-between px-[26px] py-[10px] font-mono text-[12px] text-ink-2 flex-none">
          <span suppressHydrationWarning>{now ? formatTime(now) : '—:—'}</span>
          <span className="tracking-[.1em]">KAMPALA</span>
          <span suppressHydrationWarning>{now ? now.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) : ''}</span>
        </div>

        {/* Header */}
        <header className="flex items-center justify-between gap-3 px-5 pb-3 border-b border-hair flex-none">
          <div className="flex items-center gap-[10px]">
            <div
              className="w-[34px] h-[34px] flex items-center justify-center text-accent-ink"
              style={{ background: '#1F7A82', borderRadius: '9px' }}
            >
              <span className="font-serif italic text-[22px] leading-none" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>K</span>
            </div>
            <div className="flex flex-col leading-[1.1]">
              <span className="italic text-[19px] text-ink" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>Kitabu</span>
              <span className="font-mono text-[9px] tracking-[.14em] uppercase text-ink-3">Kampala kids&apos; library</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-[11px] text-ink-3">{firstName}</span>
            <button
              onClick={handleSignOut}
              className="font-mono text-[10px] text-ink-3 border border-hair px-2.5 py-1 rounded-[9999px] hover:border-accent hover:text-accent transition-colors"
            >
              Sign out
            </button>
          </div>
        </header>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden">
          {renderScreen()}
        </div>

        {/* Bottom tab bar */}
        <nav className="flex border-t border-hair bg-surface flex-none">
          {store.role === 'parent' ? (
            <>
              <TabBtn icon={homeIcon} label="Home" active={store.screen === 'home'} onClick={store.goHome} />
              <TabBtn icon={searchIcon} label="Books" active={store.screen === 'browse' || store.screen === 'detail'} onClick={store.goBrowse} />
              <TabBtn icon={shelfIcon} label="Shelf" active={store.screen === 'shelf'} onClick={store.goShelf} />
            </>
          ) : (
            <>
              <TabBtn icon={deskIcon} label="Desk" active={store.screen === 'desk'} onClick={() => store.setScreen('desk')} />
              <TabBtn icon={loansIcon} label="Loans" active={store.screen === 'loans'} onClick={() => store.setScreen('loans')} />
              <TabBtn icon={catalogueIcon} label="Catalogue" active={store.screen === 'catalogue'} onClick={() => store.setScreen('catalogue')} />
              <TabBtn icon={membersIcon} label="Members" active={store.screen === 'members'} onClick={() => store.setScreen('members')} />
            </>
          )}
        </nav>
      </div>
    </div>
  )
}
