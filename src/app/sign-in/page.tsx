'use client'
import { Suspense, useState, useEffect, type FormEvent } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { signIn, signUp, useSession } from '@/lib/auth-client'

function SignInForm() {
  const router = useRouter()
  const params = useSearchParams()
  const { data: session } = useSession()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>(
    params.get('mode') === 'signup' ? 'sign-up' : 'sign-in'
  )
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.user) router.push('/app')
  }, [session?.user, router])

  const field = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm(f => ({ ...f, [key]: e.target.value }))

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      if (mode === 'sign-in') {
        const { error: err } = await signIn.email({ email: form.email, password: form.password, rememberMe: true })
        if (err) { setError(err.message ?? 'Sign-in failed'); return }
      } else {
        if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
        const { error: err } = await signUp.email({ name: form.name, email: form.email, password: form.password })
        if (err) { setError(err.message ?? 'Sign-up failed'); return }
      }
      router.push('/app')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-paper-2 flex items-center justify-center p-4">
      <div className="w-full max-w-[400px]">
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
          {/* Tab toggle */}
          <div className="flex bg-paper-2 border border-hair rounded-[9999px] p-[3px] mb-6">
            <button
              type="button"
              onClick={() => { setMode('sign-in'); setError(null) }}
              className={`flex-1 font-mono text-[11px] py-1.5 rounded-[9999px] transition-all duration-150 ${mode === 'sign-in' ? 'bg-surface text-ink font-semibold shadow-sm' : 'text-ink-3'}`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => { setMode('sign-up'); setError(null) }}
              className={`flex-1 font-mono text-[11px] py-1.5 rounded-[9999px] transition-all duration-150 ${mode === 'sign-up' ? 'bg-surface text-ink font-semibold shadow-sm' : 'text-ink-3'}`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {mode === 'sign-up' && (
              <div>
                <label className="font-mono text-[10px] tracking-[.1em] uppercase text-ink-3 block mb-1">Full name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={field('name')}
                  placeholder="Sarah Nsubuga"
                  className="w-full border border-hair rounded-[10px] px-3 py-2.5 text-[14px] bg-paper placeholder:text-ink-4 focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            )}
            <div>
              <label className="font-mono text-[10px] tracking-[.1em] uppercase text-ink-3 block mb-1">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={field('email')}
                placeholder="sarah@example.com"
                className="w-full border border-hair rounded-[10px] px-3 py-2.5 text-[14px] bg-paper placeholder:text-ink-4 focus:outline-none focus:border-accent transition-colors"
              />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-[.1em] uppercase text-ink-3 block mb-1">Password</label>
              <input
                type="password"
                required
                value={form.password}
                onChange={field('password')}
                placeholder={mode === 'sign-up' ? 'At least 8 characters' : '••••••••'}
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
              className="mt-1 w-full bg-accent text-white font-mono text-[12px] font-semibold py-3 rounded-[10px] disabled:opacity-60 transition-opacity"
            >
              {loading ? 'Please wait…' : mode === 'sign-in' ? 'Sign in' : 'Create account'}
            </button>
          </form>
        </div>

        <p className="font-mono text-[10px] text-ink-4 text-center mt-4">
          Kampala kids&apos; lending library · members only
        </p>
      </div>
    </div>
  )
}

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  )
}
