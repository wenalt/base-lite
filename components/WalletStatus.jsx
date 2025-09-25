// components/WalletStatus.jsx
import { useAccount, useChainId } from 'wagmi'

export default function WalletStatus() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()
  if (!isConnected) return null
  return (
    <div style={{ marginTop: 8, fontSize: 14, opacity: 0.9 }}>
      Connected: <code>{address}</code> — ChainId: <code>{chainId}</code>
    </div>
  )
}
