// components/ConnectButton.jsx
import { useEffect, useState } from 'react'
import { appKit } from '../lib/appkit'

export default function ConnectButton() {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // le custom element est défini côté client quand AppKit est initialisé
    if (typeof window !== 'undefined') {
      const ok = !!customElements.get('appkit-button')
      setReady(ok)
      if (!ok) {
        // ré-essaie au prochain tick (rare, mais utile sur Next)
        setTimeout(() => setReady(!!customElements.get('appkit-button')), 0)
      }
    }
  }, [])

  if (ready) {
    // web component natif AppKit (gère texte/état/compte)
    return <appkit-button />
  }

  // Fallback: un bouton simple qui ouvre quand même le modal
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
