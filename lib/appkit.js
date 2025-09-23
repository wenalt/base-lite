// lib/appkit.js
import { createAppKit, defaultWagmiConfig } from '@reown/appkit/wagmi/react'
import { base } from 'wagmi/chains'

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

export const metadata = {
  name: 'Base Lite',
  description: 'minihub Superchain Account Eco',
  url: 'https://YOUR-DOMAIN', // update later
  icons: ['https://YOUR-DOMAIN/baseicon.png'] // update later
}

const chains = [base]
export const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

export const appKit = createAppKit({
  wagmiConfig,
  projectId,
  themeMode: 'system', // light/dark auto
  features: { analytics: false }
})
