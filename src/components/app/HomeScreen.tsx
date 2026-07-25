'use client'
import { useStore } from '@/lib/store'
import { useTime, greeting } from '@/lib/useTime'
import { CATEGORY_COLORS } from '@/lib/seed'
import type { Loan } from '@/lib/types'

export function HomeScreen() {
  const store = useStore()
  const now = useTime()
  const myChildIds = new Set(store.children.map(c => c.id))
  const familyLoans = store.loans.filter(l => myChildIds.has(l.child_id))
  const dueSoon = familyLoans.filter(l => l.status === 'soon' || l.status === 'overdue')
  const recommended = store.books.slice(0, 5)
  const categories = Object.entries(CATEGORY_COLORS).map(([name, color]) => ({
    name,
    color,
    count: store.books.filter(b => b.category === name).length,
  }))

  const dueColor = (status: string) =>
    status === 'overdue' ? 'text-negative' : 'text-warn'

  const dueLabel = (loan: Loan) =>
    loan.status === 'overdue' ? 'Overdue' : `Due ${loan.due_date}`

  return (
    <div className="p-5 pb-7">
      {/* Greeting */}
      <div className="flex items-baseline justify-between mb-1">
        <span className="font-mono text-[10px] tracking-[.14em] uppercase text-accent">— Karibu</span>
        <span className="font-mono text-[10px] text-ink-3">{store.userName}</span>
      </div>
      <h1 className="text-[30px] leading-[1.1] mb-[14px] font-normal" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }} suppressHydrationWarning>
        {now ? greeting(now.getHours()) : 'Welcome'}, <em>{store.userName.split(' ')[0]}.</em>
      </h1>

      {/* Child chips */}
      <div className="flex gap-2 mb-5 flex-wrap">
        {store.children.map(kid => (
          <div key={kid.id} className="flex items-center gap-2 px-3 py-1.5 pl-1.5 border border-hair rounded-[9999px] bg-surface">
            <span
              className="w-[26px] h-[26px] rounded-full flex items-center justify-center font-mono text-[11px] text-white flex-none"
              style={{ background: kid.color }}
            >
              {kid.initial}
            </span>
            <span className="text-[13px] font-semibold">{kid.name}</span>
            <span className="font-mono text-[10px] text-ink-3">{kid.age}</span>
          </div>
        ))}
      </div>

      {/* Due soon banner */}
      {dueSoon.length > 0 && (
        <div
          className="border border-hair rounded-xl bg-surface p-[14px] mb-[18px]"
          style={{ borderLeftWidth: '3px', borderLeftColor: '#f59e0b' }}
        >
          <div className="flex items-center justify-between mb-[10px]">
            <span className="font-mono text-[10px] tracking-[.12em] uppercase text-ink-2">Due soon</span>
            <button onClick={store.goShelf} className="font-mono text-[11px] text-accent">
              All loans →
            </button>
          </div>
          {dueSoon.map(loan => (
            <div key={loan.id} className="flex items-center gap-3 py-[7px] border-t border-hair">
              <span
                className="w-[30px] h-[40px] rounded-[4px] flex-none"
                style={{ background: loan.cover_color }}
              />
              <div className="flex-1 min-w-0">
                <div className="text-[13px] font-semibold truncate">{loan.title}</div>
                <div className="font-mono text-[10px] text-ink-3">{loan.child_name}</div>
              </div>
              <span className={`font-mono text-[11px] text-right whitespace-nowrap ${dueColor(loan.status)}`}>
                {dueLabel(loan)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Recommended */}
      <div className="flex items-baseline justify-between mb-[10px]">
        <h2 className="text-[20px] font-normal" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
          Picked for your readers
        </h2>
        <button onClick={store.goBrowse} className="font-mono text-[11px] text-accent">
          Browse all →
        </button>
      </div>
      <div className="flex gap-3 overflow-x-auto -mx-5 px-5 pb-1 mb-[22px]">
        {recommended.map(book => {
          const avail = store.getAvailable(book.id)
          return (
            <div
              key={book.id}
              onClick={() => store.openBook(book.id)}
              className="w-[116px] flex-none cursor-pointer"
            >
              <div
                className="w-[116px] h-[158px] rounded-[14px] p-3 flex flex-col justify-between"
                style={{
                  background: book.cover_color,
                  color: book.ink_color,
                  boxShadow: '0 6px 18px -8px rgba(15,26,46,.4)',
                }}
              >
                <span className="text-[16px] leading-[1.1]" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
                  {book.title}
                </span>
                <span className="font-mono text-[8px] tracking-[.1em] uppercase opacity-85">
                  {book.author}
                </span>
              </div>
              <div className={`font-mono text-[10px] mt-[6px] ${avail > 0 ? 'text-positive' : 'text-negative'}`}>
                {avail > 0 ? `${avail} available` : 'On loan'}
              </div>
            </div>
          )
        })}
      </div>

      {/* Categories */}
      <h2 className="text-[20px] font-normal mb-[10px]" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
        Shelves by theme
      </h2>
      <div className="grid grid-cols-2 gap-[10px]">
        {categories.map(cat => (
          <div
            key={cat.name}
            onClick={() => { store.setCategory(cat.name); store.setScreen('browse') }}
            className="border border-hair rounded-xl bg-surface p-[13px] cursor-pointer flex flex-col gap-1"
          >
            <span className="w-5 h-5 rounded-[5px] flex-none" style={{ background: cat.color }} />
            <span className="text-[13px] font-semibold mt-1">{cat.name}</span>
            <span className="font-mono text-[10px] text-ink-3">{cat.count} titles</span>
          </div>
        ))}
      </div>
    </div>
  )
}
