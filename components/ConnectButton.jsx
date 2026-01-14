// components/ConnectButton.jsx
import { useAccount } from 'wagmi'

export default function ConnectButton() {
  const { isConnected } = useAccount()

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
