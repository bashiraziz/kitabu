'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { claimFamily } from '@/db/actions'
import type { Family } from '@/lib/types'

export function SetupClient({
  userId,
  userName,
  families,
}: {
  userId: string
  userName: string
  families: Family[]
}) {
  const router = useRouter()
  const [selected, setSelected] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const firstName = userName.split(' ')[0]

  const handleClaim = async () => {
    if (!selected) return
    setLoading(true)
    setError(null)
    try {
      await claimFamily(userId, selected)
      router.push('/app')
      router.refresh()
    } catch {
      setError('Something went wrong. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper-2 flex items-center justify-center p-4">
      <div className="w-full max-w-[440px]">
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div
            className="w-[42px] h-[42px] flex items-center justify-center text-white rounded-[11px] flex-none"
            style={{ background: '#1F7A82' }}
          >
            <span className="font-serif italic text-[26px] leading-none" style={{ fontFamily: 'Georgia, serif' }}>K</span>
          </div>
          <div>
            <div className="italic text-[22px] text-ink" style={{ fontFamily: 'Georgia, serif' }}>Kitabu</div>
            <div className="font-mono text-[9px] tracking-[.14em] uppercase text-ink-3">Kampala kids&apos; library</div>
          </div>
        </div>

        <div className="bg-surface border border-hair rounded-[20px] p-6">
          <h1 className="text-[22px] font-normal mb-1" style={{ fontFamily: 'Georgia, serif' }}>
            Welcome, <em>{firstName}.</em>
          </h1>
          <p className="font-mono text-[11px] text-ink-3 mb-5">
            Which family account is yours? This links your login to your children and loans.
          </p>

          <div className="flex flex-col gap-2 mb-5">
            {families.map(family => (
              <button
                key={family.id}
                type="button"
                onClick={() => setSelected(Number(family.id))}
                className={`w-full text-left p-3.5 rounded-[12px] border transition-all ${
                  selected === Number(family.id)
                    ? 'border-accent bg-accent-soft'
                    : 'border-hair bg-surface hover:border-ink-3'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-[14px] font-semibold">{family.name}</div>
                    <div className="font-mono text-[10px] text-ink-3 mt-0.5">{family.kids_text || 'No children listed'}</div>
                  </div>
                  {selected === Number(family.id) && (
                    <svg className="w-4 h-4 text-accent flex-none" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="8" cy="8" r="6" />
                      <path d="M5.5 8l1.8 1.8L10.5 6" />
                    </svg>
                  )}
                </div>
              </button>
            ))}
          </div>

          {error && (
            <div className="font-mono text-[11px] text-negative bg-negative-soft border border-negative/20 rounded-[8px] px-3 py-2 mb-3">
              {error}
            </div>
          )}

          <button
            onClick={handleClaim}
            disabled={!selected || loading}
            className="w-full bg-accent text-white font-mono text-[12px] font-semibold py-3 rounded-[10px] disabled:opacity-40 transition-opacity"
          >
            {loading ? 'Linking account…' : 'This is my family'}
          </button>

          <p className="font-mono text-[10px] text-ink-4 text-center mt-3">
            Don&apos;t see your family? Ask the librarian to add you.
          </p>
        </div>
      </div>
    </div>
  )
}
