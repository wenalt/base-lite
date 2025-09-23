// lib/appkit.js
import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { base } from 'viem/chains'

// Minimal wagmi config for Base (no AppKit, no CSS)
export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http()
  },
  connectors: [
    injected({ target: 'metaMask' }),
    injected({ target: 'coinbaseWallet' }),
    injected() // generic injected
  ]
})

// Tiny helper to open the provider if present (keeps your callsite intact)
export const appKit = {
  open() {
    if (typeof window === 'undefined') return
    if (window.ethereum?.request) {
      // Prompt standard wallet connect flow
      window.ethereum.request({ method: 'eth_requestAccounts' }).catch(() => {})
    } else {
      // Fallback: send user to a wallet
      window.open('https://metamask.io/download/', '_blank', 'noopener,noreferrer')
    }
  }
}
