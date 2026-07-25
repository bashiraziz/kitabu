'use client'
import { Suspense, useState, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { resetPassword } from '@/lib/auth-client'

function ResetPasswordForm() {
  const router = useRouter()
  const params = useSearchParams()
  const token = params.get('token')
  const error_param = params.get('error')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(
    error_param === 'INVALID_TOKEN' ? 'This reset link has expired or is invalid. Please request a new one.' : null
  )
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (!token) { setError('Missing reset token — please use the link from your email'); return }
    setError(null)
    setLoading(true)
    try {
      const { error: err } = await resetPassword({ newPassword: password, token })
      if (err) { setError(err.message ?? 'Reset failed'); return }
      setDone(true)
      setTimeout(() => router.push('/sign-in'), 2500)
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
          {done ? (
            <div className="text-center py-2">
              <div className="w-10 h-10 rounded-full bg-positive-soft flex items-center justify-center mx-auto mb-4">
                <svg className="w-5 h-5 text-positive" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 10l4 4 8-8" />
                </svg>
              </div>
              <h2 className="text-[17px] font-semibold mb-2">Password updated</h2>
              <p className="font-mono text-[11px] text-ink-3">Redirecting you to sign in…</p>
            </div>
          ) : (
            <>
              <h1 className="text-[18px] font-semibold mb-1">Set a new password</h1>
              <p className="font-mono text-[11px] text-ink-3 mb-5">Choose something you&apos;ll remember.</p>
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label className="font-mono text-[10px] tracking-[.1em] uppercase text-ink-3 block mb-1">New password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="At least 8 characters"
                    className="w-full border border-hair rounded-[10px] px-3 py-2.5 text-[14px] bg-paper placeholder:text-ink-4 focus:outline-none focus:border-accent transition-colors"
                  />
                </div>
                <div>
                  <label className="font-mono text-[10px] tracking-[.1em] uppercase text-ink-3 block mb-1">Confirm password</label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Same password again"
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
                  disabled={loading || !token}
                  className="w-full bg-accent text-white font-mono text-[12px] font-semibold py-3 rounded-[10px] disabled:opacity-60 transition-opacity"
                >
                  {loading ? 'Saving…' : 'Set new password'}
                </button>
              </form>
              {!token && (
                <div className="text-center mt-4">
                  <Link href="/forgot-password" className="font-mono text-[11px] text-accent">
                    Request a new reset link →
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  )
}
