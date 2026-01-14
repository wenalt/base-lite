// lib/appkit.js

import * as React from 'react'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from '@reown/appkit/networks'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// --- ENV ---
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Networks
const caipNetworks = [base, baseSepolia]

// Singletons
let appKit = null
let wagmiAdapter = null
let queryClient = null

export function ensureClientInit() {
  if (typeof window === 'undefined') return null
  if (appKit) return appKit

  wagmiAdapter = new WagmiAdapter({
    projectId,
    networks: caipNetworks,
    ssr: false
  })

  appKit = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks: caipNetworks,
    metadata: {
      name: 'Base Lite',
      description: 'Mini hub Base / Superchain',
      url: siteUrl,
      icons: ['https://avatars.githubusercontent.com/u/179229932']
    }
  })

  if (!queryClient) queryClient = new QueryClient()

  return appKit
}

export function getAppKit() {
  return ensureClientInit()
}

export function openConnectModal() {
  const app = ensureClientInit()
  if (!app) return
  app.open()
}

export function AppKitProvider({ children }) {
  const [ready, setReady] = React.useState(false)
  const [config, setConfig] = React.useState(null)

  React.useEffect(() => {
    ensureClientInit()
    if (wagmiAdapter?.wagmiConfig) {
      setConfig(wagmiAdapter.wagmiConfig)
      setReady(true)
    }
  }, [])

  if (!ready || !config) return null

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
