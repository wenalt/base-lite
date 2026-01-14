// lib/appkit.js

import * as React from 'react'
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from '@reown/appkit/networks'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ENV
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// Networks
const networks = [base, baseSepolia]

// Singletons
let _appKit = null
let _wagmiAdapter = null
let _queryClient = null

/**
 * ⚠️ API HISTORIQUE — OBLIGATOIRE
 * Utilisée par _app.js
 */
export function initAppKitClient() {
  if (typeof window === 'undefined') return null
  if (_appKit) return _appKit

  _wagmiAdapter = new WagmiAdapter({
    projectId,
    networks,
    ssr: false
  })

  _appKit = createAppKit({
    adapters: [_wagmiAdapter],
    projectId,
    networks,
    metadata: {
      name: 'Base Lite',
      description: 'Mini hub Base / Superchain',
      url: siteUrl,
      icons: ['https://avatars.githubusercontent.com/u/179229932']
    }
  })

  if (!_queryClient) {
    _queryClient = new QueryClient()
  }

  return _appKit
}

export function getAppKit() {
  return initAppKitClient()
}

export function openConnectModal() {
  const app = initAppKitClient()
  if (!app) return
  app.open()
}

export function AppKitProvider({ children }) {
  const [ready, setReady] = React.useState(false)
  const [config, setConfig] = React.useState(null)

  React.useEffect(() => {
    initAppKitClient()
    if (_wagmiAdapter?.wagmiConfig) {
      setConfig(_wagmiAdapter.wagmiConfig)
      setReady(true)
    }
  }, [])

  if (!ready || !config) return null

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={_queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
