// components/Header.js
import { useEffect, useState, useMemo } from 'react'
import { appKit as importedAppKit } from '../lib/appkit' // safe if not present

export default function Header() {
  const [isDark, setIsDark] = useState(false)

  // fallback so the button doesn’t break before AppKit is wired
  const appKit = useMemo(
    () =>
      importedAppKit ?? {
        open: () => {
          if (typeof window !== 'undefined') {
            console.warn('appKit.open() called but AppKit is not initialized.')
            alert('Connect is not available yet.')
          }
        }
      },
    []
  )

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const apply = () => setIsDark(mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  const pill = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    height: 36,
    padding: '0 12px',
    borderRadius: 12,
    border: '1px solid rgba(0,0,0,0.12)',
    background: isDark ? 'rgba(255,255,255,0.06)' : '#fff',
    color: isDark ? '#E6E8F0' : '#0B1B3B',
    cursor: 'pointer',
    textDecoration: 'none',
    fontSize: 13,
    fontWeight: 600
  }

  const iconImg = { width: 16, height: 16, borderRadius: 4, display: 'block' }

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        padding: 12
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 1060,
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}
      >
        {/* left brand block (logo + title + tiny subtitle) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/baseicon.png"
            alt="Base Lite"
            width={36}
            height={36}
            style={{ borderRadius: 10 }}
          />
          <div style={{ lineHeight: 1.05 }}>
            <div style={{ fontWeight: 800, fontSize: 20 }}>Base</div>
            <div style={{ fontWeight: 800, fontSize: 20, marginTop: -2 }}>
              Lite
            </div>
            <div
              style={{
                fontSize: 11,
                opacity: 0.8,
                marginTop: 3,
                maxWidth: 160
              }}
            >
              Superchain · Governance
            </div>
          </div>
        </div>

        {/* right actions */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => appKit.open?.()}
            style={{
              ...pill,
              background: isDark ? '#1A4DFF' : '#013BE0',
              color: '#fff',
              border: 'none'
            }}
            aria-label="Connect wallet"
          >
            Connect Wallet
          </button>

          <a
            href="https://warpcast.com/wenalt"
            target="_blank"
            rel="noreferrer"
            style={pill}
            aria-label="Farcaster"
          >
            {/* shows icon if you later add /farcaster.png to /public */}
            <img src="/farcaster.png" alt="" style={iconImg} onError={(e)=>{e.currentTarget.style.display='none'}} />
            @wenaltszn.eth
          </a>

          <a
            href="https://github.com/wenalt"
            target="_blank"
            rel="noreferrer"
            style={pill}
            aria-label="GitHub"
          >
            <img src="/github.png" alt="" style={iconImg} onError={(e)=>{e.currentTarget.style.display='none'}} />
            wenalt
          </a>

          <div style={{ ...pill, pointerEvents: 'none' }}>
            {isDark ? 'Dark' : 'Light'}
          </div>
        </div>
      </div>
    </div>
  )
}
