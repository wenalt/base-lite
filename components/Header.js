// components/Header.js
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { appKit } from '../lib/appkit'

export default function Header() {
  const [isDark, setIsDark] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-color-scheme: dark)')
    const apply = () => setIsDark(mq?.matches)
    apply()
    mq?.addEventListener?.('change', apply)
    return () => mq?.removeEventListener?.('change', apply)
  }, [])

  const baseBlue = '#0052FF'
  const baseBlueDark = '#0B1B3B'
  const chipBg = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)'
  const chipBorder = isDark ? 'rgba(255,255,255,0.16)' : 'rgba(0,0,0,0.12)'
  const text = isDark ? '#E6E8F0' : '#111'
  const sub = isDark ? '#AAB4CF' : '#3B4256'

  const Chip = ({ children, href, onClick }) => (
    <Link href={href || '#'} onClick={onClick} style={{
      padding: '8px 12px',
      borderRadius: 12,
      background: chipBg,
      border: `1px solid ${chipBorder}`,
      textDecoration: 'none',
      color: text,
      fontSize: 13,
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }}>
      {children}
    </Link>
  )

  return (
    <div style={{
      position: 'sticky',
      top: 0,
      zIndex: 10,
      backdropFilter: 'saturate(180%) blur(8px)',
      background: isDark ? `${baseBlueDark}CC` : `${baseBlue}CC`,
      borderBottom: `1px solid ${chipBorder}`
    }}>
      <div style={{
        margin: '0 auto',
        maxWidth: 1100,
        padding: '14px 16px',
        display: 'flex',
        alignItems: 'center',
        gap: 12
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <img
            src="/baseicon.png"
            alt="Base Lite"
            width={28}
            height={28}
            style={{ borderRadius: 6, boxShadow: '0 1px 0 rgba(0,0,0,0.15)' }}
          />
          <div>
            <div style={{ fontWeight: 800, color: text }}>Base Lite</div>
            <div style={{ fontSize: 12, color: sub }}>Superchain · Wallet · Badges</div>
          </div>
        </div>

        {/* Right controls */}
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <Chip onClick={() => appKit.open?.()}>Connect Wallet</Chip>
          <Chip href="https://warpcast.com/wenaltszn.eth" target="_blank" rel="noreferrer">
            <span style={{ fontSize: 16 }}>🟣</span>@wenaltszn.eth
          </Chip>
          <Chip href="https://github.com/wenalt" target="_blank" rel="noreferrer">
            <span style={{ fontSize: 16 }}>🐙</span>wenalt
          </Chip>
          <Chip onClick={() => {
            const body = document.body
            const wasDark = body.dataset.theme === 'dark'
            body.dataset.theme = wasDark ? 'light' : 'dark'
          }}>
            <span style={{ fontSize: 14 }}>🌗</span>
            <span>Theme</span>
          </Chip>
        </div>
      </div>
    </div>
  )
}
