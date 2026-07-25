'use client'
import { useState } from 'react'
import Link from 'next/link'
import type { Book } from '@/lib/types'
import { CATEGORY_COLORS } from '@/lib/seed'

const CATEGORIES = ['All', ...Object.keys(CATEGORY_COLORS)]
const AGES = ['All', '6-8', '9-12']

export function BrowsePublic({ books }: { books: Book[] }) {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [age, setAge] = useState('All')

  const filtered = books.filter(book => {
    const matchCat = category === 'All' || book.category === category
    const matchAge = age === 'All' || book.age_band === age
    const q = query.toLowerCase()
    const matchQ = !q || book.title.toLowerCase().includes(q) || book.author.toLowerCase().includes(q)
    return matchCat && matchAge && matchQ
  })

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-hair" style={{ background: 'rgba(247,249,252,0.92)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-5xl mx-auto px-[clamp(20px,5vw,56px)] py-4 flex items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-[10px]">
            <div className="w-[34px] h-[34px] flex items-center justify-center text-white flex-none" style={{ background: '#1F7A82', borderRadius: '9px' }}>
              <span className="font-serif italic text-[22px] leading-none" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>K</span>
            </div>
            <div className="flex flex-col leading-[1.1]">
              <span className="italic text-[19px] text-ink" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>Kitabu</span>
              <span className="font-mono text-[9px] tracking-[.14em] uppercase text-ink-3">Kampala kids&apos; library</span>
            </div>
          </Link>
          <div className="flex items-center gap-2 flex-none">
            <Link href="/sign-in" className="font-mono text-[12px] text-ink-2 px-3 py-2 hover:text-accent transition-colors">
              Sign in
            </Link>
            <Link href="/sign-in?mode=signup" className="bg-accent text-accent-ink font-mono text-[12px] font-semibold px-4 py-2 rounded-[10px] hover:bg-accent-strong transition-colors">
              Request an invite
            </Link>
          </div>
        </div>
      </header>

      {/* Borrow nudge */}
      <div className="border-b border-hair/60 bg-paper-2 px-[clamp(20px,5vw,56px)] py-3 text-center">
        <span className="font-mono text-[11px] text-ink-3">
          Members can borrow any book. &nbsp;
          <Link href="/sign-in?mode=signup" className="text-accent underline underline-offset-2">Request an invite →</Link>
        </span>
      </div>

      <div className="max-w-5xl mx-auto px-[clamp(20px,5vw,56px)] pt-8 pb-4">
        <h1 className="text-[clamp(26px,4vw,38px)] font-normal mb-6" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
          The shelf — <span className="text-ink-3">{books.length} titles</span>
        </h1>

        {/* Search */}
        <div className="relative mb-4 max-w-[440px]">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-ink-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <circle cx="6.5" cy="6.5" r="5" /><line x1="10.5" y1="10.5" x2="14.5" y2="14.5" />
          </svg>
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search titles or authors…"
            className="w-full pl-9 pr-4 py-[9px] bg-surface border border-hair rounded-[10px] font-mono text-[13px] text-ink placeholder:text-ink-4 outline-none focus:border-accent transition-colors"
          />
          {query && (
            <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 font-mono text-[16px] leading-none">×</button>
          )}
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 mb-3">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex-none font-mono text-[10px] tracking-[.06em] uppercase px-3 py-1.5 rounded-[9999px] border transition-all ${
                category === cat ? 'bg-accent text-accent-ink border-accent' : 'bg-surface text-ink-2 border-hair hover:border-ink-3'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Age filter */}
        <div className="flex bg-paper-2 border border-hair rounded-[10px] p-[3px] w-fit mb-6">
          {AGES.map(a => (
            <button
              key={a}
              onClick={() => setAge(a)}
              className={`font-mono text-[11px] px-4 py-1.5 rounded-[8px] transition-all ${
                age === a ? 'bg-surface text-ink font-semibold shadow-sm' : 'text-ink-3'
              }`}
            >
              {a === 'All' ? 'All ages' : `Age ${a}`}
            </button>
          ))}
        </div>

        <p className="font-mono text-[10px] tracking-[.1em] uppercase text-ink-3 mb-5">
          {filtered.length} {filtered.length === 1 ? 'title' : 'titles'}
        </p>
      </div>

      {/* Grid */}
      <div className="max-w-5xl mx-auto px-[clamp(20px,5vw,56px)] pb-20">
        {filtered.length === 0 ? (
          <div className="text-center py-20">
            <p className="font-mono text-[13px] text-ink-3 mb-3">No books match your filters.</p>
            <button
              onClick={() => { setQuery(''); setCategory('All'); setAge('All') }}
              className="font-mono text-[11px] text-accent"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map(book => (
              <div key={book.id}>
                <div
                  className="w-full aspect-[3/4] rounded-[14px] p-3 flex flex-col justify-between"
                  style={{ background: book.cover_color, color: book.ink_color, boxShadow: '0 6px 18px -8px rgba(15,26,46,.35)' }}
                >
                  <div>
                    <span className="text-[13px] leading-[1.15] block mb-1" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
                      {book.title}
                    </span>
                    <span className="font-mono text-[8px] tracking-[.09em] uppercase opacity-75">{book.category}</span>
                  </div>
                  <span className="font-mono text-[8px] tracking-[.09em] uppercase opacity-75">{book.author}</span>
                </div>
                <div className="mt-[5px] flex items-center justify-between">
                  <span className="font-mono text-[9px] text-ink-3">{book.age_band} yrs</span>
                  <span className={`font-mono text-[9px] ${book.available > 0 ? 'text-positive' : 'text-negative'}`}>
                    {book.available > 0 ? `${book.available} in` : 'Out'}
                  </span>
                </div>
                {book.blurb && (
                  <p className="font-mono text-[9px] text-ink-3 mt-1 leading-[1.4] line-clamp-2">{book.blurb}</p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-hair py-14 text-center bg-paper-2">
        <p className="text-[clamp(20px,3vw,28px)] font-normal mb-3" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
          Want to borrow a book?
        </p>
        <p className="font-mono text-[12px] text-ink-3 mb-6 max-w-[340px] mx-auto">
          Kitabu is a members-only lending library for Kampala families. Request an invite to get started.
        </p>
        <Link
          href="/sign-in?mode=signup"
          className="bg-accent text-accent-ink font-mono text-[13px] font-semibold px-6 py-3 rounded-[10px] hover:bg-accent-strong transition-colors"
        >
          Request an invite
        </Link>
      </div>
    </div>
  )
}
