// lib/appkit.js
// Minimal, dependency-light wallet connect using wagmi + viem
// Keeps the same API you already call: appKit.open()

import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

// Wagmi client (SSR-safe)
export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(), // public RPC; swap to your own if needed
  },
  connectors: [
    injected({
      shimDisconnect: true,
      // shows “Browser Wallet” that works with MetaMask, Coinbase Wallet extension, etc.
    }),
  ],
  ssr: true,
})

// Tiny helper to request accounts via injected provider (no extra UI libs)
async function requestInjectedAccounts() {
  if (typeof window === 'undefined') return
  const eth = window.ethereum
  if (!eth) {
    alert('No browser wallet detected. Please install MetaMask or Coinbase Wallet.')
    return
  }
  try {
    await eth.request({ method: 'eth_requestAccounts' })
  } catch (err) {
    console.error('eth_requestAccounts error:', err)
    alert('Connection was cancelled or failed.')
  }
}

// Public API used by your page
export const appKit = {
  open: () => requestInjectedAccounts(),
}

// Optional helper
export const connectWallet = () => appKit.open()

