'use client'
import { useStore } from '@/lib/store'
import type { Loan } from '@/lib/types'

function statusBadge(status: Loan['status']) {
  if (status === 'overdue') return { label: 'Overdue', cls: 'bg-negative-soft text-negative' }
  if (status === 'soon') return { label: 'Due soon', cls: 'bg-warn-soft text-warn' }
  return { label: 'Active', cls: 'bg-positive-soft text-positive' }
}

export function LoansScreen() {
  const store = useStore()

  const overdue = store.loans.filter(l => l.status === 'overdue')
  const soon = store.loans.filter(l => l.status === 'soon')
  const active = store.loans.filter(l => l.status === 'active')
  const ordered = [...overdue, ...soon, ...active]

  return (
    <div className="p-5 pb-7">
      <div className="flex items-start justify-between mb-1">
        <h1 className="text-[26px] font-normal" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
          Active loans
        </h1>
        <button
          onClick={store.goCheckout}
          className="flex items-center gap-1.5 bg-accent text-accent-ink font-mono text-[11px] font-semibold px-3 py-2 rounded-[10px] flex-none mt-1"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="7" y1="2" x2="7" y2="12" />
            <line x1="2" y1="7" x2="12" y2="7" />
          </svg>
          New loan
        </button>
      </div>
      <p className="font-mono text-[11px] text-ink-3 mb-5">
        {store.loans.length} books out ·{' '}
        {overdue.length > 0 && (
          <span className="text-negative">{overdue.length} overdue</span>
        )}
        {overdue.length === 0 && 'all on time'}
      </p>

      {/* Summary row */}
      <div className="flex gap-2.5 mb-5">
        <SummaryTile count={overdue.length} label="Overdue" color="text-negative" bg="bg-negative-soft" />
        <SummaryTile count={soon.length} label="Due soon" color="text-warn" bg="bg-warn-soft" />
        <SummaryTile count={active.length} label="Active" color="text-positive" bg="bg-positive-soft" />
      </div>

      {ordered.length === 0 ? (
        <div className="border border-hair rounded-[16px] bg-surface p-8 text-center">
          <div className="font-mono text-[12px] text-ink-3">No active loans</div>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {ordered.map(loan => {
            const badge = statusBadge(loan.status)
            const rowBg = loan.status === 'overdue' ? 'bg-negative-soft border-negative' : 'bg-surface border-hair'
            return (
              <div
                key={loan.id}
                className={`flex items-center gap-3 p-3.5 rounded-[13px] border ${rowBg}`}
              >
                <span
                  className="w-[36px] h-[48px] rounded-[4px] flex-none"
                  style={{ background: loan.cover_color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold truncate">{loan.title}</div>
                  <div className="font-mono text-[10px] text-ink-3 truncate">
                    {loan.child_name} · {loan.family_name}
                  </div>
                  <div className="font-mono text-[10px] text-ink-3 truncate">{loan.pickup}</div>
                </div>
                <div className="flex flex-col items-end gap-1.5">
                  <span className={`font-mono text-[9px] tracking-[.06em] uppercase px-2 py-0.5 rounded-full ${badge.cls}`}>
                    {badge.label}
                  </span>
                  <span className="font-mono text-[10px] text-ink-3 text-right">{loan.due_date}</span>
                  <button
                    onClick={() => store.returnBook(loan.id)}
                    className="font-mono text-[9px] text-ink-3 border border-hair px-2 py-0.5 rounded-[5px] hover:border-accent hover:text-accent transition-colors"
                  >
                    Return
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

function SummaryTile({
  count,
  label,
  color,
  bg,
}: {
  count: number
  label: string
  color: string
  bg: string
}) {
  return (
    <div className={`flex-1 rounded-[12px] p-3 ${bg}`}>
      <div className={`font-mono text-[22px] font-semibold leading-none mb-1 ${color}`}>{count}</div>
      <div className="font-mono text-[9px] uppercase tracking-[.08em] text-ink-3">{label}</div>
    </div>
  )
}
