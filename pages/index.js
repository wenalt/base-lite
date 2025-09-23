// pages/index.js
import { useEffect, useState } from 'react'
import Header from '../components/Header'
import Footer from '../components/Footer'

export default function Home() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    // read body dataset (toggle button writes it), then fallback to media query
    const bodyTheme = document.body.dataset.theme
    if (bodyTheme) setIsDark(bodyTheme === 'dark')
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    const apply = () => {
      const t = document.body.dataset.theme || (mq?.matches ? 'dark' : 'light')
      setIsDark(t === 'dark')
    }
    apply()
    const onChange = () => apply()
    mq?.addEventListener?.('change', onChange)
    return () => mq?.removeEventListener?.('change', onChange)
  }, [])

  const baseBlue = '#0052FF'
  const baseBlueDark = '#0B1B3B'
  const bg = isDark ? baseBlueDark : baseBlue
  const text = isDark ? '#E6E8F0' : '#0E1116'
  const panel = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(255,255,255,0.10)'
  const border = isDark ? 'rgba(255,255,255,0.14)' : 'rgba(0,0,0,0.12)'

  const Card = ({ title, children }) => (
    <div style={{
      borderRadius: 16,
      background: panel,
      border: `1px solid ${border}`,
      padding: 16
    }}>
      <div style={{ fontWeight: 700, marginBottom: 8 }}>{title}</div>
      <div style={{ opacity: 0.9 }}>{children}</div>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: bg,
      color: text
    }}>
      <Header />

      <main style={{ maxWidth: 1100, margin: '18px auto 0', padding: '0 16px' }}>
        {/* Wallet Section */}
        <section style={{ margin: '14px 0 18px' }}>
          <Card title="Wallet">
            Connect to show status.
          </Card>
        </section>

        {/* Badges Section (skeleton like Celo Lite) */}
        <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12, marginBottom: 16 }}>
          <Card title="Badges">
            Guides for each badge coming next. Layout mirrors Celo Lite (Base-blue theme).
          </Card>
          <Card title="Ecosystem">
            Links to Base ecosystem apps & docs.
          </Card>
          <Card title="Governance">
            Migrate the governance & participation links similar to Celo Lite.
          </Card>
        </section>
      </main>

      <Footer />
    </div>
  )
}

