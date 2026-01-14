// lib/appkit.js
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base } from '@reown/appkit/networks'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

const networks = [base]

let appKit
let wagmiAdapter
let queryClient

function ensureClientInit() {
  if (typeof window === 'undefined') return null
  if (appKit) return appKit

  wagmiAdapter = new WagmiAdapter({
    projectId,
    networks,
    ssr: false
  })

  appKit = createAppKit({
    adapters: [wagmiAdapter],
    projectId,
    networks,
    metadata: {
      name: 'Base Lite',
      description: 'Mini hub Base / Superchain',
      url: siteUrl,
      icons: ['https://avatars.githubusercontent.com/u/179229932']
    }
  })

  queryClient = new QueryClient()
  return appKit
}

export function AppKitProvider({ children }) {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    ensureClientInit()
    setReady(true)
  }, [])

  if (!ready || !wagmiAdapter?.wagmiConfig) return null

  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export function openConnectModal() {
  const app = ensureClientInit()
  app?.open()
}
