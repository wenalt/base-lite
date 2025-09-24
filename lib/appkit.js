import { createConfig, http } from 'wagmi'
import { base } from 'wagmi/chains'
import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'

const projectId = process.env.NEXT_PUBLIC_APPKIT_PROJECT_ID || ''

// Minimal wagmi config for Base
export const wagmiConfig = createConfig({
  chains: [base],
  transports: {
    [base.id]: http(), // public RPC; swap to your own if desired
  },
})

// Bridge wagmi into AppKit
const adapter = new WagmiAdapter({
  projectId,
  chains: [base],
  wagmiConfig,
})

// Only create the modal on the client (and when projectId is present)
export const appKit =
  typeof window !== 'undefined' && projectId
    ? createAppKit({
        projectId,
        adapters: [adapter],
        themeMode: 'auto',
        features: { analytics: false },
      })
    : {
        open: () => {
          if (typeof window !== 'undefined') {
            const reason = projectId
              ? 'AppKit not initialized on server.'
              : 'Missing NEXT_PUBLIC_APPKIT_PROJECT_ID.'
            console.warn(reason)
            alert('Connect is not available yet.')
          }
        },
      }

// Optional helper to keep callsites neat
export const connectWallet = () => appKit.open?.()
