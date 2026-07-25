'use client'
import { useState, type FormEvent } from 'react'
import Link from 'next/link'
import { requestPasswordReset } from '@/lib/auth-client'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      const { error: err } = await requestPasswordReset({
        email,
        redirectTo: '/reset-password',
      })
      if (err) { setError(err.message ?? 'Something went wrong'); return }
      setSent(true)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper-2 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
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
          {sent ? (
            <div className="text-center py-2">
              <div className="w-10 h-10 rounded-full bg-positive-soft flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-positive" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 10l4 4 8-8" />
                </svg>
              </div>
              <h2 className="text-[17px] font-semibold mb-2">Check your email</h2>
              <p className="font-mono text-[11px] text-ink-3 mb-5">
                If <span className="text-ink">{email}</span> has an account, a reset link is on its way.
              </p>
              <Link href="/sign-in" className="font-mono text-[11px] text-accent">
                Back to sign in →
              </Link>
            </div>
          ) : (
            <>
              <h1 className="text-[18px] font-semibold mb-1">Forgot your password?</h1>
              <p className="font-mono text-[11px] text-ink-3 mb-5">
                Enter your email and we&apos;ll send you a reset link.
              </p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="font-mono text-[10px] tracking-[.1em] uppercase text-ink-3 block mb-1">Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="sarah@example.com"
                    className="w-full border border-hair rounded-[10px] px-3 py-2.5 text-[14px] bg-paper placeholder:text-ink-4 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                {error && (
                  <div className="font-mono text-[11px] text-negative bg-negative-soft border border-negative/20 rounded-[8px] px-3 py-2">
                    {error}
                  </div>
                )}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-accent text-white font-mono text-[12px] font-semibold py-3 rounded-[10px] disabled:opacity-60 transition-opacity"
                >
                  {loading ? 'Sending…' : 'Send reset link'}
                </button>
              </form>
              <div className="text-center mt-4">
                <Link href="/sign-in" className="font-mono text-[11px] text-ink-3 hover:text-accent transition-colors">
                  ← Back to sign in
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
