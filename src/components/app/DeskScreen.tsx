'use client'
import { useStore } from '@/lib/store'
import { useTime, greeting } from '@/lib/useTime'
import { CATEGORY_COLORS } from '@/lib/seed'

export function DeskScreen() {
  const store = useStore()
  const now = useTime()

  const totalBooks = store.books.reduce((s, b) => s + b.total_copies, 0)
  const totalOut = store.loans.length
  const totalIn = totalBooks - totalOut
  const overdueCount = store.loans.filter(l => l.status === 'overdue').length
  const memberCount = store.families.length

  // Category distribution
  const catDist = Object.entries(CATEGORY_COLORS).map(([cat, color]) => {
    const books = store.books.filter(b => b.category === cat)
    const copies = books.reduce((s, b) => s + b.total_copies, 0)
    return { cat, color, copies, pct: Math.round((copies / totalBooks) * 100) }
  }).sort((a, b) => b.copies - a.copies)

  const stats = [
    { label: 'Total copies', value: totalBooks, color: '#1F7A82' },
    { label: 'On loan', value: totalOut, color: '#C9A227' },
    { label: 'On shelf', value: totalIn, color: '#2E6E5A' },
    { label: 'Overdue', value: overdueCount, color: overdueCount > 0 ? '#C65D3B' : '#64748B' },
    { label: 'Members', value: memberCount, color: '#7A3B5E' },
    { label: 'Titles', value: store.books.length, color: '#4A5043' },
  ]

  return (
    <div className="p-5 pb-7">
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-mono text-[10px] tracking-[.14em] uppercase text-accent">— Librarian</span>
        <span className="font-mono text-[10px] text-ink-3">Kitabu desk</span>
      </div>
      <h1 className="text-[26px] font-normal mb-5" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }} suppressHydrationWarning>
        {now ? greeting(now.getHours()) : 'Welcome'}, Librarian.
      </h1>

      {/* Stats grid */}
      <div className="grid grid-cols-3 gap-2.5 mb-5">
        {stats.map(stat => (
          <div key={stat.label} className="bg-surface border border-hair rounded-[14px] p-3">
            <div
              className="text-[28px] font-mono font-semibold leading-none mb-1"
              style={{ color: stat.color }}
            >
              {stat.value}
            </div>
            <div className="font-mono text-[9px] tracking-[.08em] uppercase text-ink-3">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Category distribution */}
      <div className="bg-surface border border-hair rounded-[14px] p-4 mb-4">
        <div className="font-mono text-[10px] tracking-[.12em] uppercase text-ink-3 mb-3">By category</div>
        <div className="flex flex-col gap-2">
          {catDist.map(c => (
            <div key={c.cat}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-[3px] flex-none" style={{ background: c.color }} />
                  <span className="text-[12px] font-semibold">{c.cat}</span>
                </div>
                <span className="font-mono text-[10px] text-ink-3">{c.copies} copies</span>
              </div>
              <div className="h-1.5 rounded-full bg-paper-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all"
                  style={{ width: `${c.pct}%`, background: c.color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-surface border border-hair rounded-[14px] p-4">
        <div className="font-mono text-[10px] tracking-[.12em] uppercase text-ink-3 mb-3">Quick actions</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => store.setScreen('catalogue')}
            className="flex items-center gap-2 px-3 py-2.5 border border-hair rounded-[10px] text-[13px] font-semibold text-ink hover:border-accent hover:text-accent transition-colors text-left"
          >
            <svg className="w-4 h-4 flex-none" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="2" y="2" width="5" height="5" rx="0.8" />
              <rect x="9" y="2" width="5" height="5" rx="0.8" />
              <rect x="2" y="9" width="5" height="5" rx="0.8" />
              <rect x="9" y="9" width="5" height="5" rx="0.8" />
            </svg>
            View catalogue
          </button>
          <button
            onClick={() => store.setScreen('loans')}
            className="flex items-center gap-2 px-3 py-2.5 border border-hair rounded-[10px] text-[13px] font-semibold text-ink hover:border-accent hover:text-accent transition-colors text-left"
          >
            <svg className="w-4 h-4 flex-none" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <line x1="3" y1="5" x2="13" y2="5" />
              <line x1="3" y1="8" x2="13" y2="8" />
              <line x1="3" y1="11" x2="9" y2="11" />
            </svg>
            View loans
          </button>
          <button
            onClick={() => store.setScreen('members')}
            className="flex items-center gap-2 px-3 py-2.5 border border-hair rounded-[10px] text-[13px] font-semibold text-ink hover:border-accent hover:text-accent transition-colors text-left"
          >
            <svg className="w-4 h-4 flex-none" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="6" cy="5.5" r="2.5" />
              <path d="M2 14c0-2.2 1.8-4 4-4s4 1.8 4 4" />
              <circle cx="12" cy="6" r="1.8" />
              <path d="M10.5 14c0-1.5 0.9-2.7 2.2-3.2" />
            </svg>
            Members
          </button>
          <button
            onClick={() => store.goAddBook()}
            className="flex items-center gap-2 px-3 py-2.5 border border-accent bg-accent-soft rounded-[10px] text-[13px] font-semibold text-accent transition-colors text-left"
          >
            <svg className="w-4 h-4 flex-none" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
              <circle cx="8" cy="8" r="6" />
              <line x1="8" y1="5" x2="8" y2="11" />
              <line x1="5" y1="8" x2="11" y2="8" />
            </svg>
            Add book
          </button>
        </div>
      </div>
    </div>
  )
}
