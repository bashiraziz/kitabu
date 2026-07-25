import { useState, useEffect } from 'react'

export function useTime() {
  const [now, setNow] = useState<Date | null>(null)

  useEffect(() => {
    setNow(new Date())

    let interval: ReturnType<typeof setInterval>

    // Align first tick to the next minute boundary, then tick every 60s
    const msToNextMinute = (60 - new Date().getSeconds()) * 1000
    const timeout = setTimeout(() => {
      setNow(new Date())
      interval = setInterval(() => setNow(new Date()), 60_000)
    }, msToNextMinute)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [])

  return now
}

export function greeting(hour: number): string {
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

export function formatTime(date: Date): string {
  const h = date.getHours().toString().padStart(2, '0')
  const m = date.getMinutes().toString().padStart(2, '0')
  return `${h}:${m}`
}
