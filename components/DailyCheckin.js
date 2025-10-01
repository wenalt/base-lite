// components/DailyCheckin.js
import { useEffect, useMemo, useState } from 'react'

/** ====== CONFIG ======
 * If you want the streak to be *per address*, set this to true.
 * If you want one streak regardless of which wallet is connected (Celo Lite style),
 * leave it false (default).
 */
const PER_ADDRESS = false

/** ====== UTC date helpers ====== */
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
  return Math.round(Math.abs(a - b) / 86400000)
}
function nextStreakValue(lastDate, today, current) {
  if (lastDate === today) return current
  return diffDaysUTC(lastDate, today) === 1 ? current + 1 : 1
}

/** ====== EIP-1193 helpers ====== */
async function getProvider() {
  if (typeof window === 'undefined') return null
  return window.ethereum ?? null
}
async function getAccounts(eth) {
  try {
    const accs = await eth.request({ method: 'eth_accounts' })
    return Array.isArray(accs) ? accs : []
  } catch {
    return []
  }
}
async function ensureChainBase(eth) {
  try {
    const chainId = await eth.request({ method: 'eth_chainId' })
    if (chainId === '0x2105') return true // Base Mainnet (8453)
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }]
    })
    return true
  } catch {
    return false
  }
}

/** ====== STORAGE KEYS (v2) ====== */
const GLOBAL_KEY = 'base-lite:checkin:v2'
const ADDR_KEY = (addr) => `base-lite:checkin:v2:${addr?.toLowerCase() || 'anon'}`

// simple backward-compat (old v1 used base-lite:checkin:<addr>)
function readLegacy(addr) {
  try {
    const raw = localStorage.getItem(`base-lite:checkin:${addr || 'anon'}`)
    if (!raw) return null
    const { streak, lastDate } = JSON.parse(raw)
    if (typeof streak === 'number' && typeof lastDate === 'string') {
      return { streak, lastDate }
    }
  } catch {}
  return null
}

export default function DailyCheckin() {
  const today = useMemo(() => getUTCDateStr(), [])
  const [address, setAddress] = useState('anon')

  // canonical streak state (from chosen key mode)
  const [streak, setStreak] = useState(0)
  const [lastDate, setLastDate] = useState(null)
  const [status, setStatus] = useState('')

  // Load initial address (if wallet already connected) — best effort
  useEffect(() => {
    (async () => {
      const eth = await getProvider()
      if (!eth) return
      const accs = await getAccounts(eth)
      const acct = String(accs[0] || '').toLowerCase()
      if (acct) setAddress(acct)
    })()
  }, [])

  // Read storage based on mode (GLOBAL or PER_ADDRESS).
  // Runs on mount, and when address changes (only matters if PER_ADDRESS = true).
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      const key = PER_ADDRESS ? ADDR_KEY(address) : GLOBAL_KEY
      let raw = localStorage.getItem(key)
      if (!raw && PER_ADDRESS && address && address !== 'anon') {
        // try legacy
        const legacy = readLegacy(address)
        if (legacy) {
          setStreak(legacy.streak)
          setLastDate(legacy.lastDate)
          localStorage.setItem(key, JSON.stringify(legacy)) // migrate forward
          return
        }
      }
      if (raw) {
        const parsed = JSON.parse(raw)
        if (typeof parsed.streak === 'number') setStreak(parsed.streak)
        else setStreak(0)
        if (typeof parsed.lastDate === 'string') setLastDate(parsed.lastDate)
        else setLastDate(null)
      } else {
        setStreak(0)
        setLastDate(null)
      }
    } catch {
      setStreak(0)
      setLastDate(null)
    }
  }, [address])

  const hasCheckedToday = lastDate === today

  function persist(nextStreak, dateStr) {
    setStreak(nextStreak)
    setLastDate(dateStr)
    try {
      const key = PER_ADDRESS ? ADDR_KEY(address) : GLOBAL_KEY
      localStorage.setItem(key, JSON.stringify({ streak: nextStreak, lastDate: dateStr }))
    } catch {}
  }

  async function handleCheckin() {
    setStatus('')
    const eth = await getProvider()

    // If no wallet, allow free/local check-in (keeps UX smooth)
    if (!eth) {
      doLocalCheckin()
      setStatus('Local check-in recorded.')
      return
    }

    // Ensure account
    let accs = await getAccounts(eth)
    if (!accs.length) {
      try {
        accs = await eth.request({ method: 'eth_requestAccounts' })
      } catch {
        doLocalCheckin()
        setStatus('Account access denied — local check-in recorded.')
        return
      }
    }
    const acct = String(accs[0] || '').toLowerCase()
    if (acct && acct !== address) setAddress(acct) // keep address in sync

    // already done today?
    if (hasCheckedToday) {
      setStatus('Already checked in today.')
      return
    }

    // Try to ensure Base, but if it fails, still allow local check-in
    const okBase = await ensureChainBase(eth)
    const note = `BL-CHECKIN-${today}`
    const dataHex =
      '0x' +
      Array.from(new TextEncoder().encode(note))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

    if (!okBase) {
      doLocalCheckin()
      setStatus('Not on Base — local check-in recorded.')
      return
    }

    // On-chain self-tx (0 ETH) with daily tag in calldata
    try {
      setStatus('Sending check-in transaction…')
      const txHash = await eth.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: acct,
            to: acct,
            value: '0x0',
            data: dataHex
          }
        ]
      })

      // light delay for UX
      await new Promise((r) => setTimeout(r, 1200))

      const next = nextStreakValue(lastDate, today, streak)
      persist(next, today)
      setStatus(`On-chain check-in ✅ Tx: ${txHash.slice(0, 10)}…`)
    } catch {
      // fallback to local
      doLocalCheckin()
      setStatus('Tx rejected/failed — local check-in recorded.')
    }
  }

  function doLocalCheckin() {
    if (hasCheckedToday) return
    const next = nextStreakValue(lastDate, today, streak)
    persist(next, today)
  }

  const shortAddr =
    address && address !== 'anon'
      ? `${address.slice(0, 6)}…${address.slice(-4)}`
      : 'not connected'

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>
        <strong>Streak</strong>: {streak}
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

      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>
        Address: {shortAddr} {PER_ADDRESS ? '(per address)' : '(global)'}
      </div>

      {!!status && (
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>
          {status}
        </div>
      )}
    </div>
  )
}
