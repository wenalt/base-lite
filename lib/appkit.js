// lib/appkit.js
// Plain JavaScript – no CSS, no TS

import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base } from '@reown/appkit/networks' // AppKit’s own networks export

// Required: set this on Vercel (Project Settings → Environment Variables)
const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

// Pick the networks you want (Base only here, you can add baseSepolia later)
const networks = [base]

// Build the Wagmi adapter (SSR true is recommended for Next.js)
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  ssr: true
})

// Optional UI metadata (shows in wallet UIs)
const metadata = {
  name: 'Base Lite',
  description: 'Minihub for Superchain Account ecosystem (Base)',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://base-lite.vercel.app',
  icons: [
    (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://base-lite.vercel.app') + '/baseicon.png'
  ]
}

// Initialize AppKit once and export it in case you want to call methods later
export const appkit = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true
  },
  themeMode: 'system',           // light/dark like Celo Lite
  themeVariables: {              // subtle Base-blue accent
    '--w3m-accent': '#0052ff',
    '--w3m-background': '#0052ff'
  }
})
