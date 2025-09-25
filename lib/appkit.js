// lib/appkit.js

// Reown AppKit + Wagmi (initialisation au module scope)
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from '@reown/appkit/networks'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// --- ENV ---
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

if (!projectId && typeof window !== 'undefined') {
  console.warn('Missing NEXT_PUBLIC_REOWN_PROJECT_ID. AppKit modal will not work.')
}

// --- Réseaux utilisés ---
export const networks = [base, baseSepolia]

// --- Adapter Wagmi (une seule instance pour toute l’app) ---
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  networks,
  ssr: true
})

// --- Initialisation AppKit (au module scope, une seule fois) ---
export const appKit = createAppKit({
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

// --- Providers (Wagmi + React Query) ---
const queryClient = new QueryClient()

export function AppKitProvider({ children }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
