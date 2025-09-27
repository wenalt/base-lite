// components/DailyCheckin.js
import { useEffect, useMemo, useState } from 'react'
// If you have wagmi already wired later, you can import useAccount from 'wagmi'
// For now we read window.__currentAddress if your WalletStatus sets it.
// You can swap this to wagmi's useAccount() later.

function getUTCDateStr(d = new Date()) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function diffDaysUTC(aStr, bStr) {
  if (!aStr || !bStr) return Infinity
  const a = Date.parse(`${aStr}T00:00:00Z`)
  const b = Date.parse(`${bStr}T00:00:00Z`)
  const ms = Math.abs(a - b)
  return Math.round(ms / 86400000)
}

export default function DailyCheckin() {
  // Detect current address if your WalletStatus populates it on window.
  // Later: replace with wagmi's useAccount().address
  const address =
    typeof window !== 'undefined' && window.__currentAddress
      ? String(window.__currentAddress).toLowerCase()
      : 'anon'

  const storageKey = useMemo(() => `base-lite:checkin:${address}`, [address])

  const [streak, setStreak] = useState(0)
  const [lastDate, setLastDate] = useState(null)
  const [today] = useState(getUTCDateStr())

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (typeof parsed.streak === 'number') setStreak(parsed.streak)
        if (typeof parsed.lastDate === 'string') setLastDate(parsed.lastDate)
      }
    } catch (_) {}
  }, [storageKey])

  const hasCheckedToday = lastDate === today

  function save(nextStreak, dateStr) {
    setStreak(nextStreak)
    setLastDate(dateStr)
    try {
      localStorage.setItem(
        storageKey,
        JSON.stringify({ streak: nextStreak, lastDate: dateStr })
      )
    } catch (_) {}
  }

  function handleCheckin() {
    const nowStr = getUTCDateStr()
    if (lastDate === nowStr) return // already checked today

    // If yesterday -> increment; otherwise reset to 1
    const increment =
      lastDate && diffDaysUTC(lastDate, nowStr) === 1 ? streak + 1 : 1
    save(increment, nowStr)
  }

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>
        Streak (per address): <strong>{streak}</strong>
      </div>

      <button
        onClick={handleCheckin}
        disabled={hasCheckedToday}
        style={{
          padding: '8px 12px',
          borderRadius: 10,
          border: '1px solid rgba(255,255,255,0.18)',
          background: hasCheckedToday ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.08)',
          color: '#fff',
          cursor: hasCheckedToday ? 'default' : 'pointer',
          fontWeight: 700
        }}
      >
        {hasCheckedToday ? 'Checked in (today)' : 'Daily check-in'}
      </button>

      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.8 }}>
        {address === 'anon'
          ? 'Connect a wallet to track per-address streaks.'
          : `Tracking for: ${address.slice(0, 6)}…${address.slice(-4)}`}
      </div>
    </div>
  )
}
