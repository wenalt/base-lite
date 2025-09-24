// pages/index.js
import { useEffect, useMemo, useState } from 'react'
import Footer from '../components/Footer'
import { appKit as importedAppKit } from '../lib/appkit' // expects ../lib/appkit.js stub

export default function Home() {
  // --- Theme (Light / Dark / Auto) ---
  const [theme, setTheme] = useState('auto')
  const [systemDark, setSystemDark] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('base-lite:theme')
    if (saved === 'light' || saved === 'dark' || saved === 'auto') {
      setTheme(saved)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    if (!mq) return
    const apply = () => setSystemDark(mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  const isDark = theme === 'dark' || (theme === 'auto' && systemDark)
  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light'
    setTheme(next)
    if (typeof window !== 'undefined') {
      localStorage.setItem('base-lite:theme', next)
    }
  }

  // --- Colors (Base blue, brighter) ---
  const baseBlue = '#0A57FF'
  const baseBlueDark = '#003AD1'
  const textLight = '#FFFFFF'
  const textDark = '#E6E8F0'

  // --- Pills (Celo Lite–style) ---
  const pill = (filled = false) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    height: 36,
    padding: '0 12px',
    borderRadius: 12,
    fontSize: 14,
    fontWeight: 600,
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.14)'}`,
    background: filled
      ? (isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)')
      : 'transparent',
    color: isDark ? textDark : '#111',
    cursor: 'pointer'
  })

  // --- Safe AppKit stub if not wired yet ---
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

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark ? baseBlueDark : baseBlue,
        color: isDark ? textDark : textLight,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden'
      }}
    >
      {/* ===== Header (transparent, Celo Lite layout) ===== */}
      <header
        style={{
          width: '100%',
          maxWidth: 1100,
          margin: '0 auto',
          padding: '16px 16px 6px',
          display: 'flex',
          alignItems: 'center',
          gap: 12
        }}
      >
        {/* BL icon (original) */}
        <img
          src="/baseicon.png"
          alt="BL"
          width={32}
          height={32}
          style={{ borderRadius: 8, display: 'block' }}
        />

        {/* Title + subtitle (left-aligned) */}
        <div style={{ lineHeight: 1.05, marginRight: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#000', mixBlendMode: 'screen' }}>
            Base Lite
          </div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>Ecosystem · Superchain Eco</div>
        </div>

        {/* Superchain Eco logo — independent pill on the LEFT, like CeloPG */}
        <a
          href="https://www.superchain.eco/"
          target="_blank"
          rel="noreferrer"
          style={pill(true)}
          aria-label="Superchain Eco"
          title="Superchain Eco"
        >
          <img
            src="/selogo.png"
            alt="SE"
            style={{ width: 18, height: 18, display: 'block', borderRadius: 4 }}
          />
        </a>

        {/* spacer */}
        <div style={{ flex: 1 }} />

        {/* Right-side controls */}
        <button onClick={() => appKit.open?.()} style={pill(true)} aria-label="Connect Wallet">
          Connect Wallet
        </button>

        <a
          href="https://farcaster.xyz/wenaltszn.eth"
          target="_blank"
          rel="noreferrer"
          style={pill()}
          aria-label="Farcaster"
        >
          🟪 @wenaltszn.eth
        </a>

        <a
          href="https://github.com/wenalt"
          target="_blank"
          rel="noreferrer"
          style={pill()}
          aria-label="GitHub"
        >
          🐙 wenalt
        </a>

        <button onClick={cycleTheme} style={pill()} aria-label="Theme">
          🌗 {theme === 'auto' ? 'Auto' : theme === 'dark' ? 'Dark' : 'Light'}
        </button>
      </header>

      {/* ===== Main minimized for now (we’ll replicate Celo Lite sections next) ===== */}
      <div style={{ flex: 1 }} />

      <Footer />
    </div>
  )
}

