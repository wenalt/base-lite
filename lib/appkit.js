// lib/appkit.js

// ⚠️ Aucune initialisation au top-level pour éviter les erreurs SSR.
import { createAppKit } from '@reown/appkit/react'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { base, baseSepolia } from '@reown/appkit/networks'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import React from 'react'

// --- ENV ---
const projectId = process.env.NEXT_PUBLIC_REOWN_PROJECT_ID
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// On garde la liste des réseaux au même endroit
const caipNetworks = [base, baseSepolia]

// Singletons internes (non exportés)
let _appKit = null
let _wagmiAdapter = null
let _queryClient = null

/**
 * Init client-only (idempotent). Ne fait rien côté serveur.
 */
export function initAppKitClient() {
  if (typeof window === 'undefined') return null
  if (_appKit && _wagmiAdapter) return _appKit

  if (!projectId) {
    console.warn('Missing NEXT_PUBLIC_REOWN_PROJECT_ID. AppKit modal will not work.')
  }

  _wagmiAdapter = new WagmiAdapter({
    projectId,
    networks: caipNetworks,
    ssr: false // important: on initialise côté client
  })

  _appKit = createAppKit({
    adapters: [_wagmiAdapter],
    projectId,
    networks: caipNetworks,
    metadata: {
      name: 'Base Lite',
      description: 'Mini hub Base / Superchain',
      url: siteUrl,
      icons: ['https://avatars.githubusercontent.com/u/179229932']
    }
  })

  if (!_queryClient) _queryClient = new QueryClient()
  return _appKit
}

/**
 * Petit helper pour récupérer l’instance (ou null avant init).
 */
export function getAppKit() {
  if (typeof window === 'undefined') return null
  // s’assure que c’est bien initialisé si pas encore fait
  return initAppKitClient()
}

/**
 * Fournisseur global (Wagmi + React Query) qui attend le client-ready
 * avant d’injecter WagmiProvider pour éviter les erreurs SSR.
 */
export function AppKitProvider({ children }) {
  const [{ ready, wagmiConfig }, setState] = React.useState({
    ready: false,
    wagmiConfig: null
  })

  React.useEffect(() => {
    // client only
    initAppKitClient()
    if (_wagmiAdapter?.wagmiConfig) {
      setState({ ready: true, wagmiConfig: _wagmiAdapter.wagmiConfig })
    } else {
      // fallback ultra défensif si jamais l’adapter n’est pas prêt
      setState({ ready: false, wagmiConfig: null })
    }
  }, [])

  // Tant que non prêt côté client, on rend rien (évite les hooks wagmi en SSR)
  if (!ready || !wagmiConfig) return null

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={_queryClient || new QueryClient()}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}

// Pour compat avec votre code existant qui importe { appKit } :
export const appKit = (typeof window !== 'undefined' ? getAppKit() : null)

/**
 * ✅ FIX : helper minimal attendu par ConnectButton.jsx
 * Remplace l’ancienne API cassée.
 */
export function openConnectModal() {
  const app = getAppKit()
  if (!app) {
    console.warn('AppKit not initialized yet')
    return
  }
  app.open()
}

