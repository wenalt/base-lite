// components/ConnectButton.jsx
import { useEffect, useState } from 'react'
import { openConnectModal } from '../lib/appkit'

export default function ConnectButton() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <appkit-network-button />
      <appkit-account-button />
    </span>
  )
}
