// pages/index.js
import { useEffect, useMemo, useState } from 'react'
import Footer from '../components/Footer'
import { appKit as importedAppKit } from '../lib/appkit' // safe stub

export default function Home() {
  // THEME
  const [theme, setTheme] = useState('auto') // 'light' | 'dark' | 'auto'
  const [systemDark, setSystemDark] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const saved = localStorage.getItem('base-lite:theme')
    if (saved === 'light' || saved === 'dark' || saved === 'auto') setTheme(saved)
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => setSystemDark(!!mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  const isDark = theme === 'dark' || (theme === 'auto' && systemDark)
  const cycleTheme = () => {
    const next = theme === 'light' ? 'dark' : theme === 'dark' ? 'auto' : 'light'
    setTheme(next)
    if (typeof window !== 'undefined') localStorage.setItem('base-lite:theme', next)
  }

  // COLORS
  const baseBlueLight = '#0A57FF'
  const baseBlueDark = '#003AD1'
  const textLight = '#FFFFFF'
  const textDark = '#E6E8F0'

  // Pills
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
  const tinyIcon = { width: 18, height: 18, display: 'block', borderRadius: 4 }

  // SAFE AppKit stub
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

  // Card style (like Celo Lite sections)
  const cardStyle = {
    width: '100%',
    borderRadius: 16,
    padding: '22px 16px',
    border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.16)'}`,
    background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.92)',
    color: isDark ? textDark : '#111',
    boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
    backdropFilter: 'blur(8px)'
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark ? baseBlueDark : baseBlueLight,
        color: isDark ? textDark : textLight,
        display: 'flex',
        flexDirection: 'column',
        overflowX: 'hidden'
      }}
    >
      {/* HEADER — transparent, like Celo Lite */}
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
        {/* Small “BL” badge */}
        <div
          aria-label="BL"
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            display: 'grid',
            placeItems: 'center',
            fontWeight: 800,
            fontSize: 13,
            color: '#000',
            background: 'rgba(255,255,255,0.65)'
          }}
        >
          BL
        </div>

        {/* Title + subtitle */}
        <div style={{ lineHeight: 1.05, marginRight: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#000', mixBlendMode: 'screen' }}>
            Base Lite
          </div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>
            Ecosystem · Superchain Eco
          </div>
        </div>

        <div style={{ flex: 1 }} />

        {/* Superchain Eco logo (independent) */}
        <a
          href="https://www.superchain.eco/"
          target="_blank"
          rel="noreferrer"
          style={pill(true)}
          aria-label="Superchain Eco"
          title="Superchain Eco"
        >
          <img src="/selogo.png" alt="SE" style={tinyIcon} />
        </a>

        {/* Connect */}
        <button onClick={() => appKit.open?.()} style={pill(true)} aria-label="Connect Wallet">
          Connect Wallet
        </button>

        {/* Farcaster */}
        <a
          href="https://farcaster.xyz/wenaltszn.eth"
          target="_blank"
          rel="noreferrer"
          style={pill()}
          aria-label="Farcaster"
        >
          <img src="/farcaster.png" alt="farcaster" style={tinyIcon} />
          @wenaltszn.eth
        </a>

        {/* GitHub */}
        <a
          href="https://github.com/wenalt"
          target="_blank"
          rel="noreferrer"
          style={pill()}
          aria-label="GitHub"
        >
          <img src="/github.png" alt="github" style={tinyIcon} />
          wenalt
        </a>

        {/* Theme toggle */}
        <button onClick={cycleTheme} style={pill()} aria-label="Theme">
          <span role="img" aria-label="theme">🌗</span>
          {theme === 'auto' ? 'Auto' : theme === 'dark' ? 'Dark' : 'Light'}
        </button>
      </header>

      {/* MAIN — Wallet section only (like Celo Lite), centered column */}
      <main
        style={{
          width: '100%',
          maxWidth: 1100,
          margin: '12px auto 28px',
          padding: '0 16px',
          display: 'flex',
          flexDirection: 'column',
          gap: 16
        }}
      >
        {/* Wallet card */}
        <section style={{ ...cardStyle, textAlign: 'center' }}>
          <div style={{ fontWeight: 800, marginBottom: 6 }}>Wallet</div>
          <div style={{ opacity: 0.9 }}>
            Connect to show status.
          </div>

          {/* 
            When AppKit is integrated, render:
            - address (shortened)
            - chain id / name (Base)
            - balances
            - tx counts (optional)
            - daily check-in button (future)
          */}
        </section>
      </main>

      <Footer />
    </div>
  )
}
