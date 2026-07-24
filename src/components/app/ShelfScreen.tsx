'use client'
import { useStore } from '@/lib/store'
import type { Loan } from '@/lib/types'

function statusStyle(status: Loan['status']) {
  if (status === 'overdue') return { color: 'var(--color-negative)', bg: 'var(--color-negative-soft)', label: 'Overdue' }
  if (status === 'soon') return { color: 'var(--color-warn)', bg: 'var(--color-warn-soft)', label: 'Due soon' }
  return { color: 'var(--color-positive)', bg: 'var(--color-positive-soft)', label: 'Active' }
}

export function ShelfScreen() {
  const store = useStore()
  const myLoans = store.loans.filter(l => l.family_name === 'Nsubuga')

  return (
    <div className="p-5 pb-7">
      {/* Confirm banner */}
      {store.confirm && (
        <div className="bg-accent-soft border border-accent rounded-[14px] p-4 mb-5 flex items-start gap-3">
          <span className="text-accent mt-0.5">
            <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8">
              <circle cx="10" cy="10" r="8" />
              <polyline points="7,10 9,12 13,8" />
            </svg>
          </span>
          <div className="flex-1">
            <div className="font-semibold text-accent text-[14px] mb-0.5">{store.confirm.title}</div>
            <div className="font-mono text-[11px] text-ink-2 leading-[1.4]">{store.confirm.sub}</div>
          </div>
          <button onClick={store.dismissConfirm} className="text-ink-3 font-mono text-[16px] leading-none">×</button>
        </div>
      )}

      <h1 className="text-[26px] font-normal mb-1" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
        Your shelf
      </h1>
      <p className="font-mono text-[11px] text-ink-3 mb-5">
        {myLoans.length} {myLoans.length === 1 ? 'book' : 'books'} on loan to the Nsubuga family
      </p>

      {myLoans.length === 0 ? (
        <div className="border border-hair rounded-[16px] bg-surface p-8 text-center">
          <div
            className="text-[40px] mb-3"
            style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}
          >
            📚
          </div>
          <div className="font-semibold text-[15px] mb-1">Your shelf is empty</div>
          <p className="font-mono text-[11px] text-ink-3 mb-4">Browse the catalogue to borrow books for Amina and Daniel.</p>
          <button
            onClick={store.goBrowse}
            className="bg-accent text-accent-ink px-5 py-2.5 rounded-[10px] text-[13px] font-semibold"
          >
            Browse books
          </button>
        </div>
      ) : (
        <div className="flex flex-col gap-3 mb-6">
          {myLoans.map(loan => {
            const st = statusStyle(loan.status)
            return (
              <div key={loan.id} className="bg-surface border border-hair rounded-[14px] p-4 flex gap-3">
                <span
                  className="w-[40px] h-[54px] rounded-[5px] flex-none"
                  style={{ background: loan.cover_color }}
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[14px] font-semibold truncate mb-0.5">{loan.title}</div>
                  <div className="font-mono text-[10px] text-ink-3 mb-2">{loan.child_name} · {loan.pickup}</div>
                  <div className="flex items-center gap-2">
                    <span
                      className="font-mono text-[9px] tracking-[.06em] uppercase px-2 py-0.5 rounded-full"
                      style={{ color: st.color, background: st.bg }}
                    >
                      {st.label}
                    </span>
                    {loan.due_date && (
                      <span className="font-mono text-[10px] text-ink-3">{loan.due_date}</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col items-end justify-between">
                  <button
                    onClick={() => store.returnBook(loan.id)}
                    className="font-mono text-[10px] text-ink-3 border border-hair px-2 py-1 rounded-[6px] hover:border-accent hover:text-accent transition-colors"
                  >
                    Return
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* How pickup works */}
      <div className="bg-surface border border-hair rounded-[14px] p-4">
        <div className="font-mono text-[10px] tracking-[.12em] uppercase text-ink-3 mb-3">How pickup works</div>
        <div className="flex flex-col gap-2.5">
          {store.pickups.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3 text-[13px]">
              <span className="w-6 h-6 rounded-full bg-accent-soft text-accent font-mono text-[10px] flex items-center justify-center flex-none">
                {i + 1}
              </span>
              <div>
                <span className="font-semibold">{p.name}</span>
                <span className="text-ink-3 ml-1.5 font-mono text-[11px]">{p.note}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t border-hair font-mono text-[10px] text-ink-3">
          Loan period: {store.loanDays} days · WhatsApp reminders at 3 days before due
        </div>
      </div>
    </div>
  )
}
