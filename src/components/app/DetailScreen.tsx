'use client'
import { useStore } from '@/lib/store'
import { CATEGORY_COLORS } from '@/lib/seed'

export function DetailScreen() {
  const store = useStore()
  const book = store.books.find(b => b.id === store.selectedBookId)

  if (!book) {
    return (
      <div className="flex items-center justify-center h-full">
        <button onClick={store.back} className="font-mono text-[12px] text-accent">← Back</button>
      </div>
    )
  }

  const avail = store.getAvailable(book.id)
  const catColor = CATEGORY_COLORS[book.category] ?? '#64748B'

  // Per-child loan counts for the family
  const childLoanCounts = store.children.reduce<Record<string, number>>((acc, child) => {
    acc[child.name] = store.loans.filter(
      l => l.family_name === 'Nsubuga' && l.child_name === child.name
    ).length
    return acc
  }, {})

  const selectedChildLoans = childLoanCounts[store.borrowChild] ?? 0
  const atLimit = selectedChildLoans >= 2
  const canBorrow = avail > 0 && !atLimit && store.borrowPickup !== null

  let btnText = 'Choose a pickup point'
  if (store.borrowPickup && avail > 0 && !atLimit) {
    btnText = `Borrow for ${store.borrowChild}`
  } else if (avail === 0) {
    btnText = 'Join the waitlist'
  } else if (atLimit) {
    btnText = `${store.borrowChild} has 2 books out`
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Back */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-2">
        <button onClick={store.back} className="flex items-center gap-1 font-mono text-[11px] text-ink-3">
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="8,2 4,6 8,10" />
          </svg>
          Back
        </button>
      </div>

      {/* Cover hero */}
      <div className="px-5 mb-5">
        <div
          className="w-full rounded-[20px] p-5 flex flex-col"
          style={{
            background: book.cover_color,
            color: book.ink_color,
            minHeight: '200px',
            boxShadow: '0 12px 32px -10px rgba(15,26,46,.4)',
          }}
        >
          <div className="flex items-start justify-between mb-auto">
            <div>
              <h1
                className="text-[28px] leading-[1.1] mb-1"
                style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}
              >
                {book.title}
              </h1>
              <span className="font-mono text-[11px] tracking-[.1em] uppercase opacity-80">{book.author}</span>
            </div>
            <span
              className="font-mono text-[9px] tracking-[.1em] uppercase px-2 py-1 rounded-full"
              style={{
                background: 'rgba(255,255,255,0.18)',
                whiteSpace: 'nowrap',
                marginLeft: '8px',
              }}
            >
              {book.age_band} yrs
            </span>
          </div>
          <div className="flex items-center gap-2 mt-4">
            <span
              className="font-mono text-[9px] tracking-[.1em] uppercase px-2 py-1 rounded-full"
              style={{ background: 'rgba(255,255,255,0.18)' }}
            >
              {book.category}
            </span>
            <span
              className="font-mono text-[11px]"
              style={{ opacity: 0.85 }}
            >
              {avail > 0 ? `${avail} of ${book.total_copies} available` : 'All copies on loan'}
            </span>
          </div>
        </div>
      </div>

      {/* Blurb */}
      <div className="px-5 mb-5">
        <p className="text-[14px] leading-[1.6] text-ink-2">{book.blurb}</p>
      </div>

      {/* Borrow card */}
      {avail > 0 ? (
        <div className="mx-5 mb-5 bg-surface border border-hair rounded-[16px] p-4">
          <div className="font-mono text-[10px] tracking-[.12em] uppercase text-ink-3 mb-3">Borrow this book</div>

          {/* Child selector */}
          <div className="mb-3">
            <div className="font-mono text-[10px] text-ink-3 mb-2">For which child?</div>
            <div className="flex gap-2">
              {store.children.map(child => {
                const loans = childLoanCounts[child.name] ?? 0
                const atMax = loans >= 2
                return (
                  <button
                    key={child.id}
                    onClick={() => store.setBorrowChild(child.name)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[9999px] border text-[13px] transition-all ${
                      store.borrowChild === child.name
                        ? 'border-accent bg-accent-soft text-accent font-semibold'
                        : 'border-hair bg-paper text-ink-2'
                    } ${atMax ? 'opacity-50' : ''}`}
                  >
                    <span
                      className="w-[20px] h-[20px] rounded-full flex items-center justify-center font-mono text-[9px] text-white flex-none"
                      style={{ background: child.color }}
                    >
                      {child.initial}
                    </span>
                    {child.name}
                    {atMax && <span className="font-mono text-[9px] text-negative ml-1">2/2</span>}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Pickup selector */}
          <div className="mb-4">
            <div className="font-mono text-[10px] text-ink-3 mb-2">Pickup point</div>
            <div className="flex flex-col gap-1.5">
              {store.pickups.map(pickup => (
                <button
                  key={pickup.id}
                  onClick={() => store.setBorrowPickup(pickup.name)}
                  className={`flex items-center justify-between px-3 py-2.5 rounded-[10px] border text-left transition-all ${
                    store.borrowPickup === pickup.name
                      ? 'border-accent bg-accent-soft'
                      : 'border-hair bg-paper'
                  }`}
                >
                  <span className={`text-[13px] font-semibold ${store.borrowPickup === pickup.name ? 'text-accent' : 'text-ink'}`}>
                    {pickup.name}
                  </span>
                  <span className="font-mono text-[10px] text-ink-3">{pickup.note}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Cashless note */}
          <div className="border-t border-b border-hair py-2.5 mb-4 font-mono text-[10px] text-ink-3 leading-[1.5]">
            No payment — you vouch for its safe return. A lost book is replaced with a book, never a fee.
          </div>

          {/* Borrow button */}
          <button
            onClick={canBorrow ? store.borrowBook : undefined}
            disabled={!canBorrow}
            className={`w-full py-3 rounded-[10px] font-semibold text-[14px] transition-all ${
              canBorrow
                ? 'bg-accent text-accent-ink'
                : 'bg-paper-2 text-ink-3 cursor-not-allowed'
            }`}
          >
            {btnText}
          </button>

          {/* Card footer */}
          <div className="mt-3 font-mono text-[10px] text-ink-3 text-center">
            {avail} of {book.total_copies} {book.total_copies === 1 ? 'copy' : 'copies'} in · Loan {store.loanDays} days
          </div>
        </div>
      ) : (
        <div className="mx-5 mb-5 bg-negative-soft border border-hair rounded-[16px] p-4 text-center">
          <div className="font-mono text-[10px] tracking-[.12em] uppercase text-negative mb-2">All copies on loan</div>
          <p className="text-[13px] text-ink-2 mb-3">
            All {book.total_copies} {book.total_copies === 1 ? 'copy' : 'copies'} are currently checked out.
          </p>
          <button className="font-mono text-[12px] text-accent">
            Join the waitlist →
          </button>
        </div>
      )}

      {/* Details */}
      <div className="mx-5 mb-6 border border-hair rounded-[16px] overflow-hidden">
        <div className="bg-paper-2 px-4 py-2 font-mono text-[10px] tracking-[.12em] uppercase text-ink-3 border-b border-hair">
          Details
        </div>
        <div className="divide-y divide-hair">
          <Row label="Category">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm inline-block flex-none" style={{ background: catColor }} />
              {book.category}
            </span>
          </Row>
          <Row label="Age band">{book.age_band} years</Row>
          <Row label="Total copies">{book.total_copies}</Row>
          <Row label="Available now">{avail}</Row>
        </div>
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-[13px]">
      <span className="text-ink-3">{label}</span>
      <span className="font-semibold text-ink">{children}</span>
    </div>
  )
}
