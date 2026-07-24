'use client'
import { useStore } from '@/lib/store'
import type { Tier } from '@/lib/types'

function tierLabel(tier: Tier) {
  return tier === 'family_friends' ? 'Family & friends' : 'Wider circle'
}

export function MembersScreen() {
  const store = useStore()

  return (
    <div className="p-5 pb-7">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-[26px] font-normal" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
            Members
          </h1>
          <p className="font-mono text-[11px] text-ink-3 mt-0.5">{store.families.length} member families</p>
        </div>
        <button className="flex items-center gap-1.5 bg-accent text-accent-ink font-mono text-[11px] font-semibold px-3 py-2 rounded-[10px]">
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="7" y1="2" x2="7" y2="12" />
            <line x1="2" y1="7" x2="12" y2="7" />
          </svg>
          Invite
        </button>
      </div>

      <div className="flex flex-col gap-3">
        {store.families.map(family => (
          <div key={family.id} className="bg-surface border border-hair rounded-[14px] p-4">
            <div className="flex items-start justify-between gap-2 mb-2">
              <span className="font-semibold text-[14px]">{family.name}</span>
              <span
                className={`font-mono text-[9px] tracking-[.06em] uppercase px-2 py-0.5 rounded-full flex-none ${
                  family.loan_count > 0
                    ? 'bg-accent-soft text-accent'
                    : 'bg-paper-2 text-ink-3'
                }`}
              >
                {family.loan_count > 0 ? `${family.loan_count} out` : 'No loans'}
              </span>
            </div>
            <div className="font-mono text-[10px] text-ink-3 mb-0.5">{family.parent}</div>
            <div className="font-mono text-[10px] text-ink-3 mb-3">{family.kids_text}</div>
            <span
              className={`inline-block font-mono text-[9px] tracking-[.06em] uppercase px-2 py-0.5 rounded-full ${
                family.tier === 'family_friends'
                  ? 'bg-accent-soft text-accent'
                  : 'bg-paper-2 text-ink-3'
              }`}
            >
              {tierLabel(family.tier)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
