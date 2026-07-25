'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import type { AgeBand } from '@/lib/types'

const CATEGORIES = ['Picture Books', 'Folktales', 'Adventure', 'Science', 'Poetry & Music', 'People & Places']
const AGE_BANDS: AgeBand[] = ['6-8', '9-12']
const COVER_COLORS = [
  '#C65D3B', '#2E6E5A', '#C9A227', '#7A3B5E',
  '#B23A48', '#3B5478', '#1F7A82', '#4A5043',
]

function inkFor(color: string) {
  return color === '#C9A227' ? '#1a1a1a' : '#fff'
}

export function AddBookScreen() {
  const store = useStore()

  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState(CATEGORIES[0])
  const [ageBand, setAgeBand] = useState<AgeBand>('6-8')
  const [coverColor, setCoverColor] = useState(COVER_COLORS[0])
  const [totalCopies, setTotalCopies] = useState(1)
  const [blurb, setBlurb] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const canSave = title.trim().length > 0 && author.trim().length > 0

  async function handleSave() {
    if (!canSave || saving) return
    setSaving(true)
    setError('')
    try {
      await store.addBook({
        title: title.trim(),
        author: author.trim(),
        category,
        age_band: ageBand,
        cover_color: coverColor,
        total_copies: totalCopies,
        blurb: blurb.trim(),
      })
    } catch {
      setError('Failed to save. Please try again.')
      setSaving(false)
    }
  }

  const ink = inkFor(coverColor)

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Back */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-hair flex-none">
        <button
          onClick={() => store.setScreen('catalogue')}
          className="flex items-center gap-1 font-mono text-[11px] text-ink-3"
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="8,2 4,6 8,10" />
          </svg>
          Catalogue
        </button>
        <span className="font-mono text-[11px] text-ink-4 ml-1">/ Add book</span>
      </div>

      <div className="p-5 flex flex-col gap-5 pb-8">
        {/* Live cover preview */}
        <div className="flex items-start gap-4">
          <div
            className="w-[88px] h-[120px] rounded-[14px] p-3 flex flex-col justify-between flex-none"
            style={{
              background: coverColor,
              color: ink,
              boxShadow: '0 8px 24px -8px rgba(15,26,46,.38)',
            }}
          >
            <span
              className="text-[11px] leading-[1.15]"
              style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}
            >
              {title || <span style={{ opacity: 0.45 }}>Title</span>}
            </span>
            <span className="font-mono text-[7px] tracking-[.09em] uppercase opacity-75">
              {author || <span style={{ opacity: 0.45 }}>Author</span>}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-mono text-[10px] tracking-[.1em] uppercase text-ink-3 mb-2">Cover colour</div>
            <div className="flex flex-wrap gap-2">
              {COVER_COLORS.map(c => (
                <button
                  key={c}
                  onClick={() => setCoverColor(c)}
                  className="w-[28px] h-[28px] rounded-full transition-all"
                  style={{
                    background: c,
                    outline: coverColor === c ? `3px solid ${c}` : '3px solid transparent',
                    outlineOffset: '2px',
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Title */}
        <Field label="Title *">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="e.g. Things Fall Apart"
            className="w-full px-3 py-2.5 bg-surface border border-hair rounded-[10px] font-mono text-[13px] text-ink placeholder:text-ink-4 outline-none focus:border-accent transition-colors"
          />
        </Field>

        {/* Author */}
        <Field label="Author *">
          <input
            type="text"
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="e.g. Chinua Achebe"
            className="w-full px-3 py-2.5 bg-surface border border-hair rounded-[10px] font-mono text-[13px] text-ink placeholder:text-ink-4 outline-none focus:border-accent transition-colors"
          />
        </Field>

        {/* Category */}
        <Field label="Category">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`font-mono text-[10px] tracking-[.06em] uppercase px-3 py-1.5 rounded-[9999px] border transition-all ${
                  category === cat
                    ? 'bg-accent text-accent-ink border-accent'
                    : 'bg-surface text-ink-2 border-hair'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </Field>

        {/* Age band */}
        <Field label="Age band">
          <div className="flex gap-0 bg-paper-2 border border-hair rounded-[10px] p-[3px]">
            {AGE_BANDS.map(band => (
              <button
                key={band}
                onClick={() => setAgeBand(band)}
                className={`flex-1 font-mono text-[11px] py-1.5 rounded-[8px] transition-all duration-150 ${
                  ageBand === band
                    ? 'bg-surface text-ink font-semibold shadow-sm'
                    : 'text-ink-3'
                }`}
              >
                Age {band}
              </button>
            ))}
          </div>
        </Field>

        {/* Copies */}
        <Field label="Number of copies">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setTotalCopies(c => Math.max(1, c - 1))}
              className="w-[34px] h-[34px] rounded-[9px] border border-hair bg-surface font-mono text-[16px] text-ink-2 flex items-center justify-center hover:border-accent transition-colors"
            >
              −
            </button>
            <span className="font-mono text-[18px] font-semibold w-6 text-center">{totalCopies}</span>
            <button
              onClick={() => setTotalCopies(c => Math.min(10, c + 1))}
              className="w-[34px] h-[34px] rounded-[9px] border border-hair bg-surface font-mono text-[16px] text-ink-2 flex items-center justify-center hover:border-accent transition-colors"
            >
              +
            </button>
            <span className="font-mono text-[11px] text-ink-3">{totalCopies === 1 ? 'copy' : 'copies'}</span>
          </div>
        </Field>

        {/* Blurb */}
        <Field label="Blurb (optional)">
          <textarea
            value={blurb}
            onChange={e => setBlurb(e.target.value)}
            placeholder="One or two sentences about the book…"
            rows={3}
            className="w-full px-3 py-2.5 bg-surface border border-hair rounded-[10px] font-mono text-[13px] text-ink placeholder:text-ink-4 outline-none focus:border-accent transition-colors resize-none"
          />
        </Field>

        {error && (
          <div className="font-mono text-[11px] text-negative bg-negative-soft border border-negative rounded-[10px] px-3 py-2">
            {error}
          </div>
        )}

        <button
          onClick={handleSave}
          disabled={!canSave || saving}
          className={`w-full py-3 rounded-[10px] font-semibold text-[14px] transition-all ${
            canSave && !saving
              ? 'bg-accent text-accent-ink'
              : 'bg-paper-2 text-ink-3 cursor-not-allowed'
          }`}
        >
          {saving ? 'Adding…' : `Add ${totalCopies === 1 ? '1 copy' : `${totalCopies} copies`} to catalogue`}
        </button>
      </div>
    </div>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="font-mono text-[10px] tracking-[.1em] uppercase text-ink-3 mb-2">{label}</div>
      {children}
    </div>
  )
}
