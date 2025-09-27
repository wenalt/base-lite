// pages/index.js
import { useEffect, useState } from 'react'
import Footer from '../components/Footer'
import ConnectButton from '../components/ConnectButton'
import WalletStatus from '../components/WalletStatus'
import DailyCheckin from '../components/DailyCheckin'

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
      {/* HEADER — inchangé */}
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
        {/* BL icon */}
        <img
          src="/baseicon.png"
          alt="BL"
          width={32}
          height={32}
          style={{ borderRadius: 8, display: 'block' }}
        />

        {/* Title + subtitle */}
        <div style={{ lineHeight: 1.05, marginRight: 4 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: '#fff' }}>
            Base Lite
          </div>
          <div style={{ fontSize: 12, opacity: 0.9 }}>
            Ecosystem - Superchain Eco
          </div>
        </div>

        {/* Superchain Eco (à gauche du header, juste après le sous-titre) */}
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

        {/* Spacer */}
        <div style={{ flex: 1 }} />

        {/* Connect (AppKit button) */}
        <ConnectButton />

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

      {/* SECTION WALLET — remplace le contenu central, style “carte” comme Celo Lite */}
      <section style={{ width: '100%' }}>
        <div
          style={{
            width: '100%',
            maxWidth: 1100,
            margin: '10px auto 0',
            padding: '18px 14px',
            borderRadius: 16,
            border: `1px solid ${isDark ? 'rgba(255,255,255,0.18)' : 'rgba(0,0,0,0.16)'}`,
            background: isDark ? 'rgba(0,0,0,0.25)' : 'rgba(255,255,255,0.20)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.20)',
            backdropFilter: 'blur(8px)',
            textAlign: 'center'
          }}
        >
          <div style={{ fontWeight: 800, marginBottom: 4 }}>Wallet</div>
          <div style={{ opacity: 0.9 }}>Connect to show status.</div>
          <WalletStatus />
          <DailyCheckin />
        </div>
      </section>

      <Footer />
    </div>
  )
}

