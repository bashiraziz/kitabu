'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import type { Book, Child, Family, Pickup } from '@/lib/types'

type Step = 'family' | 'child' | 'book' | 'pickup' | 'confirm'
const STEPS: Step[] = ['family', 'child', 'book', 'pickup', 'confirm']
const STEP_LABELS: Record<Step, string> = {
  family: 'Family',
  child: 'Child',
  book: 'Book',
  pickup: 'Pickup',
  confirm: 'Confirm',
}

export function CheckoutScreen() {
  const store = useStore()

  const [step, setStep] = useState<Step>('family')
  const [selectedFamily, setSelectedFamily] = useState<Family | null>(null)
  const [selectedChild, setSelectedChild] = useState<Child | null>(null)
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [selectedPickup, setSelectedPickup] = useState<Pickup | null>(null)
  const [bookQuery, setBookQuery] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const stepIndex = STEPS.indexOf(step)

  const familyChildren = store.allChildren.filter(c => c.member_id === selectedFamily?.id)
  const availableBooks = store.books
    .filter(b => b.available > 0)
    .filter(b => {
      const q = bookQuery.toLowerCase()
      return !q || b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)
    })

  function goBack() {
    const prev = STEPS[stepIndex - 1]
    if (prev) setStep(prev)
    else store.setScreen('loans')
  }

  function pickFamily(family: Family) {
    setSelectedFamily(family)
    setSelectedChild(null)
    setStep('child')
  }

  function pickChild(child: Child) {
    setSelectedChild(child)
    setStep('book')
  }

  function pickBook(book: Book) {
    setSelectedBook(book)
    setStep('pickup')
  }

  function pickPickup(pickup: Pickup) {
    setSelectedPickup(pickup)
    setStep('confirm')
  }

  async function handleConfirm() {
    if (!selectedFamily || !selectedChild || !selectedBook || !selectedPickup || saving) return
    setSaving(true)
    setError('')
    try {
      await store.librarianCheckout({
        bookId: selectedBook.id,
        childId: parseInt(selectedChild.id),
        pickupId: parseInt(selectedPickup.id),
        childName: selectedChild.name,
        familyName: selectedFamily.name,
        bookTitle: selectedBook.title,
        coverColor: selectedBook.cover_color,
        pickupName: selectedPickup.name,
      })
    } catch {
      setError('Failed to record loan. Please try again.')
      setSaving(false)
    }
  }

  const backLabel = stepIndex === 0 ? 'Loans' : STEP_LABELS[STEPS[stepIndex - 1]]

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-5 pt-4 pb-3 border-b border-hair flex-none">
        <div className="flex items-center gap-2 mb-3">
          <button onClick={goBack} className="flex items-center gap-1 font-mono text-[11px] text-ink-3">
            <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
              <polyline points="8,2 4,6 8,10" />
            </svg>
            {backLabel}
          </button>
          <span className="font-mono text-[11px] text-ink-4 ml-1">/ New loan</span>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-1">
              <div className={`flex items-center justify-center w-5 h-5 rounded-full font-mono text-[9px] transition-all ${
                i < stepIndex ? 'bg-accent text-accent-ink' :
                i === stepIndex ? 'bg-accent text-accent-ink' :
                'bg-paper-2 text-ink-4 border border-hair'
              }`}>
                {i < stepIndex ? (
                  <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="2,6 5,9 10,3" />
                  </svg>
                ) : i + 1}
              </div>
              <span className={`font-mono text-[9px] tracking-[.06em] uppercase ${i === stepIndex ? 'text-accent' : 'text-ink-4'}`}>
                {STEP_LABELS[s]}
              </span>
              {i < STEPS.length - 1 && (
                <div className={`w-4 h-px mx-1 ${i < stepIndex ? 'bg-accent' : 'bg-hair'}`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1 overflow-y-auto">

        {/* Step 1: Family */}
        {step === 'family' && (
          <div className="p-5">
            <h2 className="text-[18px] font-normal mb-4" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
              Which family?
            </h2>
            <div className="flex flex-col gap-2">
              {store.families.map(family => (
                <button
                  key={family.id}
                  onClick={() => pickFamily(family)}
                  className="flex items-center justify-between px-4 py-3 bg-surface border border-hair rounded-[12px] text-left hover:border-accent transition-colors"
                >
                  <div>
                    <div className="font-semibold text-[13px]">{family.name} family</div>
                    <div className="font-mono text-[10px] text-ink-3 mt-0.5">{family.parent} · {family.kids_text}</div>
                  </div>
                  <svg className="w-4 h-4 text-ink-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <polyline points="6,4 10,8 6,12" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Child */}
        {step === 'child' && selectedFamily && (
          <div className="p-5">
            <h2 className="text-[18px] font-normal mb-1" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
              Which child?
            </h2>
            <p className="font-mono text-[11px] text-ink-3 mb-4">{selectedFamily.name} family</p>
            {familyChildren.length === 0 ? (
              <div className="border border-hair rounded-[12px] bg-surface p-6 text-center">
                <div className="font-mono text-[12px] text-ink-3">No children registered for this family.</div>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {familyChildren.map(child => {
                  const activeLoans = store.loans.filter(l => l.child_id === child.id).length
                  const atLimit = activeLoans >= 2
                  return (
                    <button
                      key={child.id}
                      onClick={() => !atLimit && pickChild(child)}
                      disabled={atLimit}
                      className={`flex items-center gap-3 px-4 py-3 bg-surface border rounded-[12px] text-left transition-colors ${
                        atLimit ? 'border-hair opacity-50 cursor-not-allowed' : 'border-hair hover:border-accent'
                      }`}
                    >
                      <span
                        className="w-8 h-8 rounded-full flex items-center justify-center font-mono text-[11px] text-white flex-none"
                        style={{ background: child.color }}
                      >
                        {child.initial}
                      </span>
                      <div className="flex-1">
                        <div className="font-semibold text-[13px]">{child.name}</div>
                        <div className="font-mono text-[10px] text-ink-3">
                          {child.age ? `Age ${child.age} · ` : ''}{activeLoans}/2 books out
                        </div>
                      </div>
                      {atLimit ? (
                        <span className="font-mono text-[9px] text-negative bg-negative-soft px-2 py-0.5 rounded-full">Limit reached</span>
                      ) : (
                        <svg className="w-4 h-4 text-ink-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                          <polyline points="6,4 10,8 6,12" />
                        </svg>
                      )}
                    </button>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Step 3: Book */}
        {step === 'book' && (
          <div className="flex flex-col h-full">
            <div className="px-5 pt-4 pb-3 border-b border-hair flex-none">
              <h2 className="text-[18px] font-normal mb-3" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
                Which book?
              </h2>
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-[14px] h-[14px] text-ink-3" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="6.5" cy="6.5" r="5" />
                  <line x1="10.5" y1="10.5" x2="14.5" y2="14.5" />
                </svg>
                <input
                  type="text"
                  value={bookQuery}
                  onChange={e => setBookQuery(e.target.value)}
                  placeholder="Search available books…"
                  className="w-full pl-8 pr-4 py-2 bg-surface border border-hair rounded-[8px] font-mono text-[12px] text-ink placeholder:text-ink-4 outline-none focus:border-accent transition-colors"
                />
              </div>
              <p className="font-mono text-[10px] text-ink-3 mt-2">{availableBooks.length} available</p>
            </div>
            <div className="flex-1 overflow-y-auto divide-y divide-hair mx-5 mt-3 mb-5 border border-hair rounded-[12px] overflow-hidden">
              {availableBooks.map(book => (
                <button
                  key={book.id}
                  onClick={() => pickBook(book)}
                  className="flex items-center gap-3 px-3.5 py-3 bg-surface w-full text-left hover:bg-paper transition-colors"
                >
                  <span className="w-[30px] h-[40px] rounded-[4px] flex-none" style={{ background: book.cover_color }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold truncate">{book.title}</div>
                    <div className="font-mono text-[10px] text-ink-3 truncate">{book.author}</div>
                  </div>
                  <span className="font-mono text-[10px] text-positive flex-none">{book.available} in</span>
                </button>
              ))}
              {availableBooks.length === 0 && (
                <div className="p-8 text-center font-mono text-[12px] text-ink-3">No books match your search.</div>
              )}
            </div>
          </div>
        )}

        {/* Step 4: Pickup */}
        {step === 'pickup' && (
          <div className="p-5">
            <h2 className="text-[18px] font-normal mb-1" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
              Pickup point?
            </h2>
            <p className="font-mono text-[11px] text-ink-3 mb-4">{selectedBook?.title}</p>
            <div className="flex flex-col gap-2">
              {store.pickups.map(pickup => (
                <button
                  key={pickup.id}
                  onClick={() => pickPickup(pickup)}
                  className="flex items-center justify-between px-4 py-3 bg-surface border border-hair rounded-[12px] text-left hover:border-accent transition-colors"
                >
                  <div>
                    <div className="font-semibold text-[13px]">{pickup.name}</div>
                    <div className="font-mono text-[10px] text-ink-3 mt-0.5">{pickup.note}</div>
                  </div>
                  <svg className="w-4 h-4 text-ink-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <polyline points="6,4 10,8 6,12" />
                  </svg>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Confirm */}
        {step === 'confirm' && selectedFamily && selectedChild && selectedBook && selectedPickup && (
          <div className="p-5">
            <h2 className="text-[18px] font-normal mb-4" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>
              Confirm loan
            </h2>

            {/* Summary card */}
            <div className="bg-surface border border-hair rounded-[16px] overflow-hidden mb-5">
              <div className="flex items-center gap-3 p-4 border-b border-hair">
                <span className="w-[44px] h-[58px] rounded-[6px] flex-none" style={{ background: selectedBook.cover_color }} />
                <div>
                  <div className="font-semibold text-[14px]">{selectedBook.title}</div>
                  <div className="font-mono text-[10px] text-ink-3 mt-0.5">{selectedBook.author}</div>
                </div>
              </div>
              <div className="divide-y divide-hair">
                <SummaryRow label="Family" value={`${selectedFamily.name} family`} />
                <SummaryRow label="Child" value={`${selectedChild.name}${selectedChild.age ? ` (${selectedChild.age})` : ''}`} />
                <SummaryRow label="Pickup" value={`${selectedPickup.name} · ${selectedPickup.note}`} />
                <SummaryRow label="Loan period" value={`${store.loanDays} days`} />
              </div>
            </div>

            {error && (
              <div className="font-mono text-[11px] text-negative bg-negative-soft border border-negative rounded-[10px] px-3 py-2 mb-4">
                {error}
              </div>
            )}

            <button
              onClick={handleConfirm}
              disabled={saving}
              className={`w-full py-3 rounded-[10px] font-semibold text-[14px] transition-all ${
                saving ? 'bg-paper-2 text-ink-3 cursor-not-allowed' : 'bg-accent text-accent-ink'
              }`}
            >
              {saving ? 'Recording…' : 'Confirm loan'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5 text-[13px]">
      <span className="font-mono text-[10px] text-ink-3 uppercase tracking-[.06em]">{label}</span>
      <span className="font-semibold text-ink">{value}</span>
    </div>
  )
}
