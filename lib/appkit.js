// lib/appkit.js
// AppKit + Wagmi (SSR-safe) singleton for Base

import { http } from 'viem'
import { base } from 'viem/chains'
import { createConfig } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { createAppKit } from '@reown/appkit'

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID

// ---- Singleton guards (avoid multiple modals stuck in closed state) ----
if (typeof window !== 'undefined') {
  // Ensure only one instance across HMR/navigations
  window.__BL__ = window.__BL__ || {}
}

// Build wagmi config once
function buildWagmiConfig() {
  const transports = {
    [base.id]: http(), // public RPC is fine for UI; swap to your own if needed
  }

  const adapter = new WagmiAdapter({
    ssr: true,
    projectId,        // required for WalletConnect
    chains: [base],
    transports,
  })

  const config = adapter.wagmiConfig
  return { adapter, config }
}

function buildAppKit(adapter) {
  return createAppKit({
    adapters: [adapter],
    projectId,
    features: {
      connectModal: true,
    },
    themeMode: 'auto',
    defaultChain: base,
    metadata: {
      name: 'Base Lite',
      description: 'Minihub for Superchain Eco — Wallet, Badges, Guides.',
      url: 'https://base-lite.vercel.app', // update if you use a different domain
      icons: ['https://base-lite.vercel.app/baseicon.png'],
    },
  })
}

let wagmiConfig
let appKit

// Reuse singleton in browser; create once on server too
if (typeof window !== 'undefined') {
  if (!window.__BL__.wagmiConfig || !window.__BL__.appKit) {
    const { adapter, config } = buildWagmiConfig()
    wagmiConfig = config
    appKit = buildAppKit(adapter)
    window.__BL__.wagmiConfig = wagmiConfig
    window.__BL__.appKit = appKit
  } else {
    wagmiConfig = window.__BL__.wagmiConfig
    appKit = window.__BL__.appKit
  }
} else {
  // SSR path
  const { adapter, config } = buildWagmiConfig()
  wagmiConfig = config
  appKit = buildAppKit(adapter)
}

export { wagmiConfig, appKit }

// Convenience opener used by the UI
export function openConnect() {
  appKit?.open?.()
}

// Optional debug helpers you can call from DevTools if things get stuck
export function resetSessions() {
  try {
    // Common WalletConnect/wagmi caches that may block a fresh connect
    localStorage.removeItem('wagmi.store')
    localStorage.removeItem('wc@2:client')
    localStorage.removeItem('walletconnect')
    sessionStorage.removeItem('wagmi.store')
  } catch {}
}

