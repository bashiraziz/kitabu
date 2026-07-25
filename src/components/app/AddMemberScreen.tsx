'use client'
import { useState } from 'react'
import { useStore } from '@/lib/store'
import type { Tier } from '@/lib/types'

interface ChildRow {
  name: string
  age: string
}

const TIERS: { value: Tier; label: string; desc: string }[] = [
  { value: 'family_friends', label: 'Family & friends', desc: 'Direct invite from the founding circle' },
  { value: 'wider_circle', label: 'Wider circle', desc: 'Vouched for by an existing member' },
]

export function AddMemberScreen() {
  const store = useStore()

  const [accountName, setAccountName] = useState('')
  const [adultHolder, setAdultHolder] = useState('')
  const [tier, setTier] = useState<Tier>('family_friends')
  const [childRows, setChildRows] = useState<ChildRow[]>([{ name: '', age: '' }])
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const canSave = accountName.trim().length > 0 && adultHolder.trim().length > 0

  function updateChild(index: number, field: keyof ChildRow, value: string) {
    setChildRows(rows => rows.map((r, i) => i === index ? { ...r, [field]: value } : r))
  }

  function addChildRow() {
    setChildRows(rows => [...rows, { name: '', age: '' }])
  }

  function removeChildRow(index: number) {
    setChildRows(rows => rows.filter((_, i) => i !== index))
  }

  async function handleSave() {
    if (!canSave || saving) return
    setSaving(true)
    setError('')
    try {
      const validChildren = childRows
        .filter(c => c.name.trim().length > 0)
        .map(c => ({
          name: c.name.trim(),
          age: c.age.trim() ? parseInt(c.age.trim()) : null,
        }))

      await store.addMember({
        account_name: accountName.trim(),
        adult_holder: adultHolder.trim(),
        tier,
        children: validChildren,
      })
    } catch {
      setError('Failed to save. Please try again.')
      setSaving(false)
    }
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      {/* Back */}
      <div className="flex items-center gap-2 px-5 pt-4 pb-3 border-b border-hair flex-none">
        <button
          onClick={() => store.setScreen('members')}
          className="flex items-center gap-1 font-mono text-[11px] text-ink-3"
        >
          <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.8">
            <polyline points="8,2 4,6 8,10" />
          </svg>
          Members
        </button>
        <span className="font-mono text-[11px] text-ink-4 ml-1">/ Add member</span>
      </div>

      <div className="p-5 flex flex-col gap-5 pb-8">

        {/* Account name */}
        <Field label="Family name *">
          <input
            type="text"
            value={accountName}
            onChange={e => setAccountName(e.target.value)}
            placeholder="e.g. Nsubuga"
            className="w-full px-3 py-2.5 bg-surface border border-hair rounded-[10px] font-mono text-[13px] text-ink placeholder:text-ink-4 outline-none focus:border-accent transition-colors"
          />
          <p className="font-mono text-[10px] text-ink-3 mt-1.5">Used as the account identifier (surname or household name).</p>
        </Field>

        {/* Adult holder */}
        <Field label="Parent / guardian name *">
          <input
            type="text"
            value={adultHolder}
            onChange={e => setAdultHolder(e.target.value)}
            placeholder="e.g. Sarah Nsubuga"
            className="w-full px-3 py-2.5 bg-surface border border-hair rounded-[10px] font-mono text-[13px] text-ink placeholder:text-ink-4 outline-none focus:border-accent transition-colors"
          />
        </Field>

        {/* Tier */}
        <Field label="Membership tier">
          <div className="flex flex-col gap-2">
            {TIERS.map(t => (
              <button
                key={t.value}
                onClick={() => setTier(t.value)}
                className={`flex items-start gap-3 px-3 py-3 rounded-[12px] border text-left transition-all ${
                  tier === t.value
                    ? 'border-accent bg-accent-soft'
                    : 'border-hair bg-surface'
                }`}
              >
                <span
                  className={`w-4 h-4 rounded-full border-2 flex-none mt-0.5 transition-all ${
                    tier === t.value ? 'border-accent bg-accent' : 'border-hair bg-paper'
                  }`}
                />
                <div>
                  <div className={`font-semibold text-[13px] ${tier === t.value ? 'text-accent' : 'text-ink'}`}>
                    {t.label}
                  </div>
                  <div className="font-mono text-[10px] text-ink-3 mt-0.5">{t.desc}</div>
                </div>
              </button>
            ))}
          </div>
        </Field>

        {/* Children */}
        <Field label="Children">
          <div className="flex flex-col gap-2">
            {childRows.map((child, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  type="text"
                  value={child.name}
                  onChange={e => updateChild(i, 'name', e.target.value)}
                  placeholder="Child's name"
                  className="flex-1 px-3 py-2 bg-surface border border-hair rounded-[10px] font-mono text-[12px] text-ink placeholder:text-ink-4 outline-none focus:border-accent transition-colors"
                />
                <input
                  type="number"
                  value={child.age}
                  onChange={e => updateChild(i, 'age', e.target.value)}
                  placeholder="Age"
                  min={1}
                  max={18}
                  className="w-[60px] px-2 py-2 bg-surface border border-hair rounded-[10px] font-mono text-[12px] text-ink placeholder:text-ink-4 outline-none focus:border-accent transition-colors text-center"
                />
                {childRows.length > 1 && (
                  <button
                    onClick={() => removeChildRow(i)}
                    className="w-[30px] h-[30px] flex items-center justify-center text-ink-3 hover:text-negative transition-colors flex-none"
                  >
                    <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <line x1="3" y1="8" x2="13" y2="8" />
                    </svg>
                  </button>
                )}
              </div>
            ))}

            <button
              onClick={addChildRow}
              className="flex items-center gap-1.5 font-mono text-[11px] text-accent mt-1 self-start"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="7" y1="2" x2="7" y2="12" />
                <line x1="2" y1="7" x2="12" y2="7" />
              </svg>
              Add another child
            </button>
          </div>
          <p className="font-mono text-[10px] text-ink-3 mt-2">Leave name blank to skip a row.</p>
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
          {saving ? 'Adding…' : 'Add member family'}
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
