// lib/appkit.js
import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base } from 'viem/chains'

// 1) WalletConnect / Reown project id (must be set in .env.local)
const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID
if (!projectId && typeof window !== 'undefined') {
  // Helpful console hint during local dev
  console.warn('NEXT_PUBLIC_WC_PROJECT_ID is missing')
}

// 2) Supported networks (Base only to start)
const networks = [base]

// 3) Build wagmi adapter & config
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks
})

export const wagmiConfig = wagmiAdapter.wagmiConfig

// 4) Create the AppKit modal (guarded for SSR)
export const appKit =
  typeof window !== 'undefined'
    ? createAppKit({
        adapters: [wagmiAdapter],
        networks,
        themeMode: 'auto',
        themeVariables: {
          // optional accent; tune later if you want
          '--w3m-accent': '#0A57FF'
        }
      })
    : {
        // safe no-ops for server/SSG
        open: () => {},
        close: () => {}
      }
