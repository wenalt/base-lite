// lib/appkit.js
import { createAppKit } from '@reown/appkit'
import { defaultWagmiConfig } from '@reown/appkit-wagmi'
import { base } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

const metadata = {
  name: 'Base Lite',
  description: 'minihub Superchain Account Eco',
  url: 'https://your-domain.example', // update later
  icons: ['https://your-domain.example/baseicon.png'] // update later
}

// Build a Wagmi config for Base
export const wagmiConfig = defaultWagmiConfig({
  chains: [base],
  projectId,
  metadata
})

// Create the AppKit instance
export const appKit = createAppKit({
  projectId,
  wagmiConfig,
  themeMode: 'system',
  features: { analytics: false }
})
