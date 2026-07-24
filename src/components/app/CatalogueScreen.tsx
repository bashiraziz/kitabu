'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import { CATEGORY_COLORS } from '@/lib/seed'

export function CatalogueScreen() {
  const store = useStore()
  const [query, setQuery] = useState('')

  const filtered = store.books.filter(b => {
    const q = query.toLowerCase()
    return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
  })

  const totalCopies = store.books.reduce((s, b) => s + b.total_copies, 0)
  const available = store.books.reduce((s, b) => s + store.getAvailable(b.id), 0)

  return (
    <div className="flex flex-col h-full">
      <div className="px-5 pt-4 pb-3 border-b border-hair flex-none">
        <h1 className="text-[22px] font-normal mb-3" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
          Catalogue
        </h1>
        <div className="flex gap-2 mb-3">
          <div className="bg-paper-2 rounded-[10px] p-2.5 flex-1 text-center">
            <div className="font-mono text-[18px] font-semibold text-ink">{store.books.length}</div>
            <div className="font-mono text-[9px] uppercase text-ink-3">Titles</div>
          </div>
          <div className="bg-paper-2 rounded-[10px] p-2.5 flex-1 text-center">
            <div className="font-mono text-[18px] font-semibold text-ink">{totalCopies}</div>
            <div className="font-mono text-[9px] uppercase text-ink-3">Copies</div>
          </div>
          <div className="bg-paper-2 rounded-[10px] p-2.5 flex-1 text-center">
            <div className="font-mono text-[18px] font-semibold text-positive">{available}</div>
            <div className="font-mono text-[9px] uppercase text-ink-3">Available</div>
          </div>
        </div>
        <div className="relative">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-ink-3"
            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
          >
            <circle cx="6.5" cy="6.5" r="5" />
            <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search catalogue…"
            className="w-full pl-8 pr-4 py-2 bg-surface border border-hair rounded-[8px] font-mono text-[12px] text-ink placeholder:text-ink-4 outline-none focus:border-accent transition-colors"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-5 pt-3 pb-2 flex items-center justify-between">
          <span className="font-mono text-[10px] text-ink-3">{filtered.length} of {store.books.length} titles</span>
        </div>
        <div className="divide-y divide-hair mx-5 border border-hair rounded-[12px] overflow-hidden mb-5">
          {filtered.map((book) => {
            const avail = store.getAvailable(book.id)
            const catColor = CATEGORY_COLORS[book.category] ?? '#64748B'
            return (
              <div
                key={book.id}
                onClick={() => store.openBook(book.id)}
                className="flex items-center gap-3 px-3.5 py-3 bg-surface cursor-pointer hover:bg-paper transition-colors"
              >
                <span
                  className="w-[30px] h-[40px] rounded-[4px] flex-none"
                  style={{ background: book.cover_color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">{book.title}</div>
                  <div className="font-mono text-[10px] text-ink-3 truncate">{book.author}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-[2px] flex-none" style={{ background: catColor }} />
                    <span className="font-mono text-[9px] text-ink-3">{book.category}</span>
                    <span className="font-mono text-[9px] text-ink-4">· {book.age_band} yrs</span>
                  </div>
                </div>
                <div className="text-right flex-none">
                  <div className={`font-mono text-[11px] ${avail > 0 ? 'text-positive' : 'text-negative'}`}>
                    {avail}/{book.total_copies}
                  </div>
                  <div className="font-mono text-[9px] text-ink-4">avail</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
