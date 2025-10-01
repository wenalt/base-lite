// components/DailyCheckin.js
import { useEffect, useMemo, useState } from 'react'

/** ---------- UTC helpers ---------- **/
function getUTCDateStr(d = new Date()) {
  const y = d.getUTCFullYear()
  const m = String(d.getUTCMonth() + 1).padStart(2, '0')
  const day = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}
function daysBetweenUTC(aStr, bStr) {
  if (!aStr || !bStr) return Infinity
  const a = Date.parse(`${aStr}T00:00:00Z`)
  const b = Date.parse(`${bStr}T00:00:00Z`)
  return Math.round((b - a) / 86400000)
}
function isYesterdayUTC(lastStr, todayStr) {
  return daysBetweenUTC(lastStr, todayStr) === 1
}

/** ---------- EIP-1193 helpers (wallet) ---------- **/
const BASE_CHAIN_HEX = '0x2105' // Base mainnet 8453

function getEth() {
  if (typeof window === 'undefined') return null
  return window.ethereum || null
}

async function getActiveAccount(eth) {
  try {
    const accs = await eth.request({ method: 'eth_accounts' })
    return Array.isArray(accs) && accs[0] ? String(accs[0]).toLowerCase() : null
  } catch {
    return null
  }
}

async function getChainId(eth) {
  try {
    const id = await eth.request({ method: 'eth_chainId' })
    return id
  } catch {
    return null
  }
}

/** ---------- Component ---------- **/
export default function DailyCheckin() {
  const today = useMemo(() => getUTCDateStr(), [])
  const [address, setAddress] = useState(null)
  const [chainId, setChainId] = useState(null)

  const [streak, setStreak] = useState(0)
  const [lastDate, setLastDate] = useState(null)
  const [status, setStatus] = useState('')

  // Storage key: app + version + chain + address
  const storageKey = useMemo(() => {
    const addr = address || 'anon'
    const chain = chainId || 'unknown'
    return `base-lite:checkin:v1:${chain}:${addr}`
  }, [address, chainId])

  /** Read wallet state (if present) and subscribe to changes */
  useEffect(() => {
    const eth = getEth()
    let unsub = () => {}

    async function hydrateWallet() {
      if (!eth) {
        setAddress(null)
        setChainId(null)
        return
      }
      const [acct, cid] = await Promise.all([getActiveAccount(eth), getChainId(eth)])
      setAddress(acct) // can be null
      setChainId(cid)  // can be null

      // Subscribe to changes
      const onAccounts = (accs) => setAddress(accs?.[0] ? String(accs[0]).toLowerCase() : null)
      const onChain = (hex) => setChainId(hex || null)
      eth.on?.('accountsChanged', onAccounts)
      eth.on?.('chainChanged', onChain)
      unsub = () => {
        try { eth.removeListener?.('accountsChanged', onAccounts) } catch {}
        try { eth.removeListener?.('chainChanged', onChain) } catch {}
      }
    }

    hydrateWallet()
    return () => unsub()
  }, [])

  /** Hydrate streak state whenever key (addr/chain) changes */
  useEffect(() => {
    try {
      const raw = typeof window !== 'undefined' ? localStorage.getItem(storageKey) : null
      if (raw) {
        const parsed = JSON.parse(raw)
        setStreak(typeof parsed.streak === 'number' ? parsed.streak : 0)
        setLastDate(typeof parsed.lastDate === 'string' ? parsed.lastDate : null)
      } else {
        setStreak(0)
        setLastDate(null)
      }
    } catch {
      setStreak(0)
      setLastDate(null)
    }
  }, [storageKey])

  const hasCheckedToday = lastDate === today

  function persist(nextStreak, dateStr) {
    setStreak(nextStreak)
    setLastDate(dateStr)
    try {
      localStorage.setItem(storageKey, JSON.stringify({ streak: nextStreak, lastDate: dateStr }))
    } catch {}
  }

  async function handleCheckin() {
    setStatus('')

    // Optional: prefer Base address context, but allow anon local check-in
    const eth = getEth()
    if (eth) {
      const cid = await getChainId(eth)
      setChainId(cid || null)
      const acct = await getActiveAccount(eth)
      setAddress(acct || null)
    }

    if (hasCheckedToday) {
      setStatus('Already checked in today.')
      return
    }

    // Consecutive logic (UTC)
    const next = lastDate && isYesterdayUTC(lastDate, today) ? streak + 1 : 1
    persist(next, today)
    setStatus('Checked in ✅ (local)')

    // If you later wire a relayer, call it here and keep local write as immediate UX.
  }

  const shortAddr = address ? `${address.slice(0, 6)}…${address.slice(-4)}` : 'not connected'
  const onBase = chainId === BASE_CHAIN_HEX

  return (
    <div style={{ marginTop: 12 }}>
      <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 6 }}>
        Current streak: <strong>{streak}</strong>
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
        Address: {shortAddr} · Chain: {onBase ? 'Base' : (chainId || 'unknown')}
      </div>

      {!!lastDate && (
        <div style={{ marginTop: 2, fontSize: 12, opacity: 0.85 }}>
          Last check-in (UTC): {lastDate}
        </div>
      )}

      {!!status && (
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.9 }}>
          {status}
        </div>
      )}
    </div>
  )
}
