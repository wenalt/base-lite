// components/ConnectButton.jsx
import { useEffect, useState } from 'react'
import { openConnectModal } from '@/lib/appkit'

export default function ConnectButton() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const hasElements = () =>
      !!customElements.get('appkit-button') &&
      !!customElements.get('appkit-account-button') &&
      !!customElements.get('appkit-network-button')

    if (hasElements()) {
      setReady(true)
      return
    }

    const id = setInterval(() => {
      if (hasElements()) {
        setReady(true)
        clearInterval(id)
      }
    }, 100)

    return () => clearInterval(id)
  }, [])

  // Placeholder pendant init AppKit
  if (!ready) {
    return (
      <div
        style={{
          height: 36,
          minWidth: 140,
          borderRadius: 12,
          background: 'rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.14)'
        }}
      />
    )
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      {/* Bouton explicite pour ouvrir le modal */}
      <button
        type="button"
        onClick={openConnectModal}
        style={{
          height: 36,
          padding: '0 14px',
          borderRadius: 12,
          border: '1px solid rgba(255,255,255,0.25)',
          background: 'rgba(255,255,255,0.08)',
          color: '#fff',
          cursor: 'pointer'
        }}
      >
        Connect Wallet
      </button>

      {/* Une fois connecté, AppKit prend le relais */}
      <appkit-account-button />
    </span>
  )
}
