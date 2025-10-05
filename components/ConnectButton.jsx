// components/ConnectButton.jsx
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'
import { openConnectModal } from '../lib/appkit'   // <--

export default function ConnectButton() {
  const { isConnected } = useAccount()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const has = () =>
      !!customElements.get('appkit-button') &&
      !!customElements.get('appkit-account-button') &&
      !!customElements.get('appkit-network-button')

    if (has()) {
      setReady(true)
      return
    }
    const id = setInterval(() => {
      if (has()) {
        setReady(true)
        clearInterval(id)
      }
    }, 100)
    return () => clearInterval(id)
  }, [])

  if (!ready) {
    return (
      <button
        onClick={() => openConnectModal()}
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
        aria-label={isConnected ? 'Account' : 'Connect Wallet'}
        title={isConnected ? 'Account' : 'Connect Wallet'}
      >
        {isConnected ? 'Account' : 'Connect Wallet'}
      </button>
    )
  }

  if (isConnected) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
        <appkit-network-button />
        <appkit-account-button />
      </span>
    )
  }

  return <appkit-button />
}
