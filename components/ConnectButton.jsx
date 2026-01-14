// components/ConnectButton.jsx
import { useEffect, useState } from 'react'

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

  if (!ready) {
    return (
      <div
        style={{
          height: 36,
          minWidth: 140,
          borderRadius: 12,
          background: 'rgba(255,255,255,0.08)',
          border: '1px solid rgba(255,255,255,0.15)'
        }}
      />
    )
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <appkit-network-button />
      <appkit-account-button />
    </span>
  )
}
