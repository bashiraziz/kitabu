import Link from 'next/link'
import { getBooks } from '@/db/queries'

export const revalidate = 3600

export default async function LandingPage() {
  const books = await getBooks()
  const shelfBooks = books.slice(0, 8)
  const heroBooks = [books[0], books[1], books[9]].filter(Boolean)

  return (
    <div className="min-h-screen bg-paper font-sans text-ink">
      {/* ── Header ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-50 border-b border-hair" style={{ background: 'rgba(247,249,252,0.92)', backdropFilter: 'blur(8px)' }}>
        <div className="max-w-5xl mx-auto px-[clamp(20px,5vw,56px)] py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-[10px]">
            <div
              className="w-[34px] h-[34px] flex items-center justify-center text-white flex-none"
              style={{ background: '#1F7A82', borderRadius: '9px' }}
            >
              <span className="font-serif italic text-[22px] leading-none" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>K</span>
            </div>
            <div className="flex flex-col leading-[1.1]">
              <span className="italic text-[19px] text-ink" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>Kitabu</span>
              <span className="font-mono text-[9px] tracking-[.14em] uppercase text-ink-3">Kampala kids&apos; library</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6 font-mono text-[12px] text-ink-2">
            <a href="#how-it-works" className="hover:text-ink transition-colors">How it works</a>
            <a href="#shelf" className="hover:text-ink transition-colors">The shelf</a>
            <a href="#join" className="hover:text-ink transition-colors">Join</a>
            <a href="#give" className="hover:text-ink transition-colors">Give a book</a>
          </nav>

          <div className="flex items-center gap-2 flex-none">
            <Link
              href="/sign-in"
              className="font-mono text-[12px] text-ink-2 px-3 py-2 hover:text-accent transition-colors"
            >
              Sign in
            </Link>
            <Link
              href="/sign-in?mode=signup"
              className="bg-accent text-accent-ink font-mono text-[12px] font-semibold px-4 py-2 rounded-[10px] hover:bg-accent-strong transition-colors"
            >
              Request an invite
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="border-b border-hair">
        <div className="max-w-5xl mx-auto px-[clamp(20px,5vw,56px)] py-16 md:py-24 flex flex-col md:flex-row items-center gap-12 md:gap-16">
          <div className="flex-1">
            <div className="font-mono text-[11px] tracking-[.16em] uppercase text-accent mb-4">— Kampala, Uganda</div>
            <h1
              className="text-[clamp(36px,6vw,60px)] leading-[1.05] tracking-[-0.02em] mb-5 font-normal"
              style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}
            >
              Great books,<br /><em>passed hand to hand.</em>
            </h1>
            <p className="text-[16px] leading-[1.6] text-ink-2 mb-8 max-w-[420px]">
              A small, lovingly-kept lending library for the children of Kampala. No fees, no fines — just great books and a community that reads together.
            </p>
            <div className="flex flex-wrap gap-3 mb-10">
              <Link
                href="/sign-in?mode=signup"
                className="bg-accent text-accent-ink font-semibold text-[14px] px-6 py-3 rounded-[10px] hover:bg-accent-strong transition-colors"
              >
                Request an invite
              </Link>
              <a
                href="#shelf"
                className="border border-hair text-ink font-semibold text-[14px] px-6 py-3 rounded-[10px] hover:border-ink-2 transition-colors"
              >
                See the shelf
              </a>
            </div>
            <div className="flex gap-8 flex-wrap">
              <HeroStat value={String(books.length)} label="Titles" />
              <HeroStat value="6–12" label="Ages" />
              <HeroStat value="3" label="Pickup points" />
            </div>
          </div>

          {/* Fanned book covers */}
          <div className="relative flex-none" style={{ width: 200, height: 260 }}>
            {heroBooks.map((book, i) => {
              const rotations = [-8, 3, 13]
              const offsets = [-16, 0, 16]
              const zIndices = [0, 2, 1]
              return (
                <div
                  key={book.id}
                  className="absolute rounded-[12px] overflow-hidden"
                  style={{
                    width: 132,
                    height: 180,
                    background: book.cover_color,
                    color: book.ink_color,
                    transform: `rotate(${rotations[i]}deg) translateX(${offsets[i]}px)`,
                    zIndex: zIndices[i],
                    top: 20,
                    left: '50%',
                    marginLeft: -66,
                    boxShadow: '0 14px 36px -8px rgba(15,26,46,.42)',
                  }}
                >
                  <div className="p-3 h-full flex flex-col justify-between">
                    <span
                      className="text-[13px] leading-[1.1] block"
                      style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}
                    >
                      {book.title}
                    </span>
                    <span className="font-mono text-[8px] tracking-[.1em] uppercase opacity-75">
                      {book.author}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────── */}
      <section id="how-it-works" className="border-b border-hair bg-surface-2">
        <div className="max-w-5xl mx-auto px-[clamp(20px,5vw,56px)] py-16">
          <div className="font-mono text-[11px] tracking-[.16em] uppercase text-ink-3 mb-3">How it works</div>
          <h2
            className="text-[clamp(28px,4vw,40px)] font-normal mb-10"
            style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}
          >
            Borrow in three steps.
          </h2>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                num: '01',
                title: 'Browse',
                body: 'Browse 20 titles by theme and age — Africa-relevant and globally beloved, chosen with Kampala readers in mind.',
              },
              {
                num: '02',
                title: 'Borrow for your child',
                body: 'Place a loan for up to two books per child. Choose your pickup point — school gate, home hub, or neighbourhood delivery.',
              },
              {
                num: '03',
                title: 'Collect & return',
                body: 'Collect at your chosen point on pickup day. Return within 14 days. No fees, no fines — just bring it back.',
              },
            ].map(step => (
              <div key={step.num} className="bg-surface border border-hair rounded-[16px] p-5">
                <div className="font-mono text-[13px] font-semibold text-accent mb-3">{step.num}</div>
                <h3 className="font-semibold text-[16px] mb-2">{step.title}</h3>
                <p className="text-[14px] leading-[1.6] text-ink-2">{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── The shelf ─────────────────────────────────────────── */}
      <section id="shelf" className="border-b border-hair">
        <div className="max-w-5xl mx-auto px-[clamp(20px,5vw,56px)] py-16">
          <div className="font-mono text-[11px] tracking-[.16em] uppercase text-ink-3 mb-3">The shelf</div>
          <h2
            className="text-[clamp(28px,4vw,40px)] font-normal mb-10"
            style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}
          >
            Some of what we have.
          </h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
            {shelfBooks.map(book => (
              <Link href="/app" key={book.id} className="block">
                <div
                  className="w-full aspect-[2/3] rounded-[10px] p-2 flex flex-col justify-between"
                  style={{
                    background: book.cover_color,
                    color: book.ink_color,
                    boxShadow: '0 6px 18px -8px rgba(15,26,46,.35)',
                  }}
                >
                  <span
                    className="text-[9px] leading-[1.1]"
                    style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}
                  >
                    {book.title}
                  </span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-6 text-center">
            <Link href="/app" className="font-mono text-[12px] text-accent">
              See all 20 titles in the app →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stat band ─────────────────────────────────────────── */}
      <section className="border-b border-hair" style={{ background: '#0F1A2E' }}>
        <div className="max-w-5xl mx-auto px-[clamp(20px,5vw,56px)] py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <StatBand value={`${books.length}+`} label="Books" />
            <StatBand value="6" label="Founding families" />
            <StatBand value="1" label="Partner school (KPS)" />
            <StatBand value="UGX 0" label="Fully cashless" />
          </div>
        </div>
      </section>

      {/* ── Who can join ──────────────────────────────────────── */}
      <section id="join" className="border-b border-hair bg-surface-2">
        <div className="max-w-5xl mx-auto px-[clamp(20px,5vw,56px)] py-16">
          <div className="font-mono text-[11px] tracking-[.16em] uppercase text-ink-3 mb-3">Membership</div>
          <h2
            className="text-[clamp(28px,4vw,40px)] font-normal mb-10"
            style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}
          >
            Who can join.
          </h2>
          <div className="grid md:grid-cols-2 gap-5 max-w-2xl">
            <div className="bg-surface border-2 border-accent rounded-[16px] p-6">
              <div className="font-mono text-[10px] tracking-[.12em] uppercase text-accent mb-2">Family &amp; friends</div>
              <h3 className="font-semibold text-[17px] mb-2">Open to family</h3>
              <p className="text-[14px] leading-[1.6] text-ink-2">
                Friends and family of the founding circle. Invite-based — ask someone you know in the library.
              </p>
              <div className="mt-4 pt-4 border-t border-hair font-mono text-[11px] text-ink-3">
                KPS children collect at the school gate. No school admin involved.
              </div>
            </div>
            <div className="bg-surface border border-hair rounded-[16px] p-6">
              <div className="font-mono text-[10px] tracking-[.12em] uppercase text-ink-3 mb-2">Wider circle</div>
              <h3 className="font-semibold text-[17px] mb-2">Vouched members</h3>
              <p className="text-[14px] leading-[1.6] text-ink-2">
                Anyone vouched for by an existing member. A member sponsors your invitation.
              </p>
              <div className="mt-4 pt-4 border-t border-hair font-mono text-[11px] text-ink-3">
                No fees at any tier.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Grow the shelf ────────────────────────────────────── */}
      <section id="give" className="border-b border-hair">
        <div className="max-w-5xl mx-auto px-[clamp(20px,5vw,56px)] py-16">
          <div className="font-mono text-[11px] tracking-[.16em] uppercase text-ink-3 mb-3">Grow the shelf</div>
          <h2
            className="text-[clamp(28px,4vw,40px)] font-normal mb-4"
            style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}
          >
            Add to the collection.
          </h2>
          <p className="text-[15px] leading-[1.6] text-ink-2 mb-8 max-w-[520px]">
            The library grows through books, not cash. Three ways to contribute:
          </p>
          <div className="flex flex-col mb-8 max-w-[520px]">
            {[
              { label: 'Member donations', desc: 'Pass on a book your child has grown out of.' },
              { label: 'Gifted titles', desc: 'Request a title each term — we add it to the shelf.' },
              { label: 'Book swaps', desc: 'Bring one, take one. Condition checked at intake.' },
            ].map(row => (
              <div key={row.label} className="flex items-start gap-3 py-3 border-t border-hair">
                <span className="text-accent font-mono text-[12px] mt-0.5">→</span>
                <div>
                  <span className="font-semibold text-[14px]">{row.label}</span>
                  <span className="text-[14px] text-ink-3 ml-2">{row.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/sign-in?mode=signup"
              className="border border-accent text-accent font-mono text-[12px] font-semibold px-5 py-2.5 rounded-[10px] hover:bg-accent-soft transition-colors"
            >
              Donate a book
            </Link>
            <Link
              href="/sign-in"
              className="border border-hair text-ink font-mono text-[12px] px-5 py-2.5 rounded-[10px] hover:border-ink-2 transition-colors"
            >
              Gift a shelf
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────── */}
      <section className="border-b border-hair bg-surface-2">
        <div className="max-w-5xl mx-auto px-[clamp(20px,5vw,56px)] py-20 text-center">
          <div className="font-mono text-[11px] tracking-[.16em] uppercase text-ink-3 mb-4">Ready?</div>
          <h2
            className="text-[clamp(30px,4vw,46px)] font-normal mb-5"
            style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}
          >
            Join the library.
          </h2>
          <p className="text-[15px] leading-[1.6] text-ink-2 mb-8 max-w-[400px] mx-auto">
            Kitabu is invitation-based. Request your invite below or message us on WhatsApp.
          </p>
          <div className="flex gap-3 justify-center flex-wrap">
            <Link
              href="/sign-in?mode=signup"
              className="bg-accent text-accent-ink font-semibold text-[15px] px-8 py-3.5 rounded-[10px] hover:bg-accent-strong transition-colors"
            >
              Request an invite
            </Link>
            <a
              href="#"
              className="border border-hair text-ink font-semibold text-[15px] px-8 py-3.5 rounded-[10px] hover:border-ink-2 transition-colors"
            >
              Message on WhatsApp
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────── */}
      <footer className="py-10">
        <div className="max-w-5xl mx-auto px-[clamp(20px,5vw,56px)] flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-[10px]">
            <div
              className="w-[28px] h-[28px] flex items-center justify-center text-white flex-none"
              style={{ background: '#1F7A82', borderRadius: '7px' }}
            >
              <span className="font-serif italic text-[17px] leading-none" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>K</span>
            </div>
            <span className="italic text-[16px]" style={{ fontFamily: 'var(--font-serif-var), Georgia, serif' }}>Kitabu</span>
          </div>
          <div className="font-mono text-[11px] text-ink-3 text-center">
            Kampala Parents School · Nakawa · Ntinda
          </div>
          <div className="font-mono text-[11px] text-ink-4">
            Fully cashless · Kampala, Uganda
          </div>
        </div>
      </footer>
    </div>
  )
}

function HeroStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-mono text-[28px] font-semibold text-ink" style={{ fontVariantNumeric: 'tabular-nums' }}>
        {value}
      </div>
      <div className="font-mono text-[10px] tracking-[.1em] uppercase text-ink-3 mt-0.5">{label}</div>
    </div>
  )
}

function StatBand({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div
        className="font-mono text-[clamp(22px,3vw,34px)] font-semibold"
        style={{ color: '#93A9C7', fontVariantNumeric: 'tabular-nums' }}
      >
        {value}
      </div>
      <div className="font-mono text-[11px] tracking-[.1em] uppercase mt-1" style={{ color: '#41506B' }}>
        {label}
      </div>
    </div>
  )
}
