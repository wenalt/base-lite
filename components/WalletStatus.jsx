// components/WalletStatus.jsx
import { useAccount, useChainId } from 'wagmi'

export default function WalletStatus() {
  const { address, isConnected } = useAccount()
  const chainId = useChainId()

  if (!isConnected || !address) return null

  const short = (a) => a.slice(0, 6) + '…' + a.slice(-4)

  const chainLabel = (id) => {
    switch (id) {
      case 8453: return 'Base'
      case 84532: return 'Base Sepolia'
      case 1: return 'Ethereum'
      case 11155111: return 'Sepolia'
      case 42220: return 'Celo'
      case 44787: return 'Alfajores'
      default: return `Chain ${id}`
    }
  }

  const explorer = (id, addr) => {
    switch (id) {
      case 8453: return `https://basescan.org/address/${addr}`
      case 84532: return `https://sepolia.basescan.org/address/${addr}`
      case 1: return `https://etherscan.io/address/${addr}`
      case 11155111: return `https://sepolia.etherscan.io/address/${addr}`
      case 42220: return `https://celoscan.io/address/${addr}`
      case 44787: return `https://alfajores.celoscan.io/address/${addr}`
      default: return `https://explorer.xyz/address/${addr}`
    }
  }

  return (
    <div style={{ marginTop: 8, fontSize: 14, opacity: 0.95 }}>
      Connected:&nbsp;
      <code title={address}>{short(address)}</code>
      &nbsp;on&nbsp;
      <strong>{chainLabel(chainId)}</strong>
      &nbsp;(<code>{chainId}</code>)
      &nbsp;—&nbsp;
      <a
        href={explorer(chainId, address)}
        target="_blank"
        rel="noreferrer"
        style={{ textDecoration: 'underline' }}
      >
        View on explorer
      </a>
    </div>
  )
}
