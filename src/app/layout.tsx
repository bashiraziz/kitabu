import type { Metadata } from 'next'
import { Plus_Jakarta_Sans, Instrument_Serif, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const sans = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans-var',
  weight: ['400', '600'],
})

const serif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-serif-var',
  weight: ['400'],
  style: ['normal', 'italic'],
})

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono-var',
  weight: ['400', '600'],
})

export const metadata: Metadata = {
  title: "Kitabu — Kampala Kids' Library",
  description: 'A small, lovingly-kept lending library for the children of Kampala.',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#1F7A82" />
      </head>
      <body className={`${sans.variable} ${serif.variable} ${mono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
