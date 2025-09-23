import { useEffect, useState } from 'react'
import { appKit } from '../lib/appkit' // was '@/lib/appkit'

export default function Home() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => setIsDark(mq.matches)
    apply()
    mq.addEventListener?.('change', apply)
    return () => mq.removeEventListener?.('change', apply)
  }, [])

  const baseBlue = '#0052FF'
  const baseBlueDark = '#0B1B3B'
  const textLight = '#FFFFFF'
  const textDark = '#E6E8F0'
  const cardBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.10)'
  const border = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.22)'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: isDark ? baseBlueDark : baseBlue,
        color: isDark ? textDark : textLight,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 560,
          borderRadius: 16,
          padding: 20,
          border: `1px solid ${border}`,
          background: cardBg,
          boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(6px)'
        }}
      >
        <header style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <img src="/baseicon.png" alt="Base Lite" width={40} height={40} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 18 }}>Base Lite</div>
            <div style={{ opacity: 0.85, fontSize: 12 }}>minihub Superchain Account Eco</div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <button
              onClick={() => appKit.open?.()}
              style={{
                padding: '8px 12px',
                borderRadius: 10,
                background: isDark ? '#1A4DFF' : '#013BE0',
                color: '#fff',
                border: 'none',
                cursor: 'pointer'
              }}
            >
              Connect
            </button>
          </div>
        </header>

        <main>
          <div style={{ marginBottom: 10, fontWeight: 600 }}>Mini-app</div>
          <div style={{ opacity: 0.9, lineHeight: 1.5 }}>
            Base-blue background, system light/dark, JS-only.
          </div>
        </main>
      </div>
    </div>
  )
}
