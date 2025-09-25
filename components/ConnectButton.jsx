// components/ConnectButton.jsx
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { appKit } from '../lib/appkit'

export default function ConnectButton() {
  const { isConnected } = useAccount()
  const [ready, setReady] = useState(false)

  // Attendre que le web component <appkit-button> soit défini côté client
  useEffect(() => {
    if (typeof window === 'undefined') return
    const has = () => !!customElements.get('appkit-button')
    if (has()) {
      setReady(true)
      return
    }
    // petit polling court pour Next (rare mais utile)
    const id = setInterval(() => {
      if (has()) {
        setReady(true)
        clearInterval(id)
      }
    }, 100)
    return () => clearInterval(id)
  }, [])

  // Si connecté, on montre le bouton compte natif d’AppKit
  if (isConnected) {
    return <appkit-account-button />
  }

  // Sinon, si le web component est prêt : bouton Connect natif d’AppKit
  if (ready) {
    return <appkit-button />
  }

  // Fallback (très court) si AppKit n'est pas prêt: ouvre quand même le modal
  return (
    <button
      onClick={() => appKit?.open?.()}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        height: 36,
        padding: '0 12px',
        borderRadius: 12,
        fontSize: 14,
        fontWeight: 600,
        border: '1px solid rgba(0,0,0,0.14)',
        background: 'rgba(0,0,0,0.08)',
        color: '#111',
        cursor: 'pointer'
      }}
      aria-label="Connect Wallet"
      title="Connect Wallet"
    >
      Connect Wallet
    </button>
  )
}

