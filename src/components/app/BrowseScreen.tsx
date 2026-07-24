'use client'
import { useStore } from '@/lib/store'
import { CATEGORY_COLORS } from '@/lib/seed'

const CATEGORIES = ['All', ...Object.keys(CATEGORY_COLORS)]
const AGES = ['All', '6-8', '9-12']

export function BrowseScreen() {
  const store = useStore()

  const filtered = store.books.filter(book => {
    const matchCat = store.category === 'All' || book.category === store.category
    const matchAge = store.age === 'All' || book.age_band === store.age
    const q = store.query.toLowerCase()
    const matchQ = !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q)
    return matchCat && matchAge && matchQ
  })

  return (
    <div className="flex flex-col h-full">
      {/* Search + filters sticky area */}
      <div className="px-5 pt-4 pb-3 bg-paper border-b border-hair flex-none">
        {/* Search bar */}
        <div className="relative mb-3">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-ink-3"
            viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"
          >
            <circle cx="6.5" cy="6.5" r="5" />
            <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" />
          </svg>
          <input
            type="text"
            value={store.query}
            onChange={e => store.setQuery(e.target.value)}
            placeholder="Search titles or authors…"
            className="w-full pl-9 pr-4 py-[9px] bg-surface border border-hair rounded-[10px] font-mono text-[13px] text-ink placeholder:text-ink-4 outline-none focus:border-accent transition-colors"
          />
          {store.query && (
            <button
              onClick={() => store.setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 font-mono text-[13px]"
            >
              ×
            </button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 mb-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => store.setCategory(cat)}
              className={`flex-none font-mono text-[10px] tracking-[.06em] uppercase px-3 py-1.5 rounded-[9999px] border transition-all duration-150 ${
                store.category === cat
                  ? 'bg-accent text-accent-ink border-accent'
                  : 'bg-surface text-ink-2 border-hair'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Age segmented control */}
        <div className="flex gap-0 bg-paper-2 border border-hair rounded-[10px] p-[3px]">
          {AGES.map(age => (
            <button
              key={age}
              onClick={() => store.setAge(age)}
              className={`flex-1 font-mono text-[11px] py-1.5 rounded-[8px] transition-all duration-150 ${
                store.age === age
                  ? 'bg-surface text-ink font-semibold shadow-sm'
                  : 'text-ink-3'
              }`}
            >
              {age === 'All' ? 'All ages' : `Age ${age}`}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      <div className="flex-1 overflow-y-auto p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="font-mono text-[10px] tracking-[.1em] uppercase text-ink-3">
            {filtered.length} {filtered.length === 1 ? 'title' : 'titles'}
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12">
            <div className="font-mono text-[12px] text-ink-3 mb-2">No books found</div>
            <button
              onClick={() => { store.setQuery(''); store.setCategory('All'); store.setAge('All') }}
              className="font-mono text-[11px] text-accent"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map(book => {
              const avail = store.getAvailable(book.id)
              return (
                <div
                  key={book.id}
                  onClick={() => store.openBook(book.id)}
                  className="cursor-pointer"
                >
                  <div
                    className="w-full aspect-[3/4] rounded-[14px] p-3 flex flex-col justify-between"
                    style={{
                      background: book.cover_color,
                      color: book.ink_color,
                      boxShadow: '0 6px 18px -8px rgba(15,26,46,.35)',
                    }}
                  >
                    <div>
                      <span
                        className="text-[13px] leading-[1.15] block mb-1"
                        style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}
                      >
                        {book.title}
                      </span>
                      <span className="font-mono text-[8px] tracking-[.09em] uppercase opacity-80">
                        {book.category}
                      </span>
                    </div>
                    <span className="font-mono text-[8px] tracking-[.09em] uppercase opacity-80">
                      {book.author}
                    </span>
                  </div>
                  <div className="mt-[5px] flex items-center justify-between">
                    <span className="font-mono text-[9px] text-ink-3">{book.age_band} yrs</span>
                    <span className={`font-mono text-[9px] ${avail > 0 ? 'text-positive' : 'text-negative'}`}>
                      {avail > 0 ? `${avail} in` : 'Out'}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
