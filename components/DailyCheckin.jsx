// components/DailyCheckin.js
import { useEffect, useMemo, useState } from 'react'

// --- helpers time (UTC) ---
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

// --- EIP-1193 helpers ---
async function getProvider() {
  if (typeof window === 'undefined') return null
  const eth = window.ethereum
  if (!eth) return null
  return eth
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
    if (chainId === '0x2105') return true // Base mainnet (8453)
    // Try switch
    await eth.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: '0x2105' }]
    })
    return true
  } catch {
    // Optionally try add chain (rarement nécessaire côté wallet grand public)
    return false
  }
}

export default function DailyCheckin() {
  // address courante lue au clic pour éviter l’état “stale”
  const [address, setAddress] = useState('anon')
  const [streak, setStreak] = useState(0)
  const [lastDate, setLastDate] = useState(null)
  const [status, setStatus] = useState('') // messages courts UX
  const today = useMemo(() => getUTCDateStr(), [])
  const storageKey = useMemo(() => `base-lite:checkin:${address}`, [address])

  // hydrate depuis storage quand l'adresse change
  useEffect(() => {
    if (typeof window === 'undefined' || address === 'anon') return
    try {
      const raw = localStorage.getItem(storageKey)
      if (raw) {
        const parsed = JSON.parse(raw)
        if (typeof parsed.streak === 'number') setStreak(parsed.streak)
        if (typeof parsed.lastDate === 'string') setLastDate(parsed.lastDate)
      } else {
        setStreak(0)
        setLastDate(null)
      }
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey])

  const hasCheckedToday = lastDate === today

  function persist(nextStreak, dateStr) {
    setStreak(nextStreak)
    setLastDate(dateStr)
    if (address !== 'anon') {
      try {
        localStorage.setItem(
          storageKey,
          JSON.stringify({ streak: nextStreak, lastDate: dateStr })
        )
      } catch {}
    }
  }

  async function handleCheckin() {
    setStatus('')
    const eth = await getProvider()
    if (!eth) {
      setStatus('No wallet detected — local check-in only.')
      doLocalCheckin()
      return
    }

    // Assure une adresse sélectionnée
    let accs = await getAccounts(eth)
    if (!accs.length) {
      try {
        accs = await eth.request({ method: 'eth_requestAccounts' })
      } catch (e) {
        setStatus('Wallet denied account access — using local check-in.')
        doLocalCheckin()
        return
      }
    }
    const acct = String(accs[0] || '').toLowerCase()
    if (!acct) {
      setStatus('No active account — local check-in.')
      doLocalCheckin()
      return
    }
    // met à jour l'adresse (ce qui recharge le storage si besoin)
    if (address !== acct) setAddress(acct)

    // déjà fait aujourd’hui ?
    if (lastDate === today) {
      setStatus('Already checked in today.')
      return
    }

    // Force Base
    const okBase = await ensureChainBase(eth)
    if (!okBase) {
      setStatus('Please switch to Base mainnet.')
      return
    }

    // Prépare une self-tx 0 ETH avec un petit tag en data
    const note = `BL-CHECKIN-${today}`
    const dataHex =
      '0x' + Array.from(new TextEncoder().encode(note))
        .map((b) => b.toString(16).padStart(2, '0'))
        .join('')

    try {
      setStatus('Sending transaction…')
      const txHash = await eth.request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: acct,
            to: acct,                 // self-transfer
            value: '0x0',             // 0 ETH
            data: dataHex             // petite “signature” du jour
            // gas / gasPrice laissés au wallet
          }
        ]
      })

      // Attente simple (poll) pour confirmer mini-delay UX ; le wallet gère le reste
      await new Promise((r) => setTimeout(r, 1500))

      // maj streak UTC (hier => +1, sinon reset=1)
      const next =
        lastDate && diffDaysUTC(lastDate, today) === 1 ? streak + 1 : 1
      persist(next, today)
      setStatus(`Checked in ✅ Tx: ${txHash.slice(0, 10)}…`)
    } catch (e) {
      // Repli local si rejet utilisateur ou erreur réseau
      setStatus('Tx rejected/failed — using local check-in.')
      doLocalCheckin()
    }
  }

  function doLocalCheckin() {
    if (lastDate === today) return
    const next =
      lastDate && diffDaysUTC(lastDate, today) === 1 ? streak + 1 : 1
    persist(next, today)
  }

  // Adresse affichée (si connectée)
  const shortAddr =
    address !== 'anon'
      ? `${address.slice(0, 6)}…${address.slice(-4)}`
      : 'not connected'

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
        {hasCheckedToday ? 'Checked in (today)' : 'Daily check-in (on-chain)'}
      </button>

      <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>
        Address: {shortAddr}
      </div>

      {!!status && (
        <div style={{ marginTop: 6, fontSize: 12, opacity: 0.85 }}>
          {status}
        </div>
      )}
    </div>
  )
}
