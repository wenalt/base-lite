// lib/appkit.js

// Reown AppKit + Wagmi
import { createAppKit } from '@reown/appkit'               // <-- sans /react
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from 'viem/chains'            // <-- depuis viem/chains
import { WagmiConfig } from 'wagmi'                        // <-- WagmiConfig (pas WagmiProvider)
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// --- ENV (on accepte 2 noms d'ENV pour éviter les surprises) ---
const projectId =
  process.env.NEXT_PUBLIC_REOWN_PROJECT_ID ||
  process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

if (!projectId && typeof window !== 'undefined') {
  console.warn(
    'Missing NEXT_PUBLIC_REOWN_PROJECT_ID (or NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID). AppKit modal will not work.'
  )
}

// --- Réseaux (wagmi/viem) ---
export const CHAINS = [base, baseSepolia]

// --- Adapter Wagmi ---
export const wagmiAdapter = new WagmiAdapter({
  projectId,
  chains: CHAINS,            // <-- clé "chains" attendue par l’adapter
  ssr: true
})

// wagmi config (utile si tu veux l’utiliser ailleurs)
export const wagmiConfig = wagmiAdapter.wagmiConfig

// --- AppKit (enregistre aussi les web components) ---
export const appKit = createAppKit({
  adapters: [wagmiAdapter],
  projectId,
  metadata: {
    name: 'Base Lite',
    description: 'Mini hub Base / Superchain',
    url: siteUrl,
    icons: ['https://avatars.githubusercontent.com/u/179229932']
  },
  themeMode: 'auto'
})

// --- Providers (Wagmi + React Query) ---
const queryClient = new QueryClient()

export function AppKitProvider({ children }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiConfig>
  )
}

// Helper pour ouvrir le modal proprement
export const openConnectModal = () => appKit?.open?.()
