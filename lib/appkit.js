// lib/appkit.js
// SSR-safe AppKit wiring. Nothing heavy runs on import.
// Call enableAppKitClientSide() from the browser to initialize.

export let wagmiConfig = null
export let appKit = {
  open: () => {
    if (typeof window !== 'undefined') {
      console.warn('AppKit not initialized yet.')
      alert('Connect is not available yet.')
    }
  }
}

/**
 * Initialize AppKit/Wagmi on the client only.
 * Safe to call multiple times; it no-ops after the first init.
 */
export async function enableAppKitClientSide() {
  if (typeof window === 'undefined') return appKit // SSR guard
  if (appKit && appKit.__ready) return appKit

  const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID
  if (!projectId) {
    console.warn('Missing NEXT_PUBLIC_WC_PROJECT_ID env var.')
  }

  // Lazy-load heavy deps only in the browser
  const [{ http, createConfig }, chainsMod, { AppKit }, { WagmiAdapter }] =
    await Promise.all([
      import('wagmi'),
      import('wagmi/chains'),
      import('@reown/appkit'),
      import('@reown/appkit-adapter-wagmi'),
    ])

  // Choose networks (Base only for now)
  const { base } = chainsMod
  const chains = [base]

  // Minimal wagmi config
  const cfg = createConfig({
    chains,
    transports: {
      [base.id]: http(), // default transport
    },
    ssr: true,
  })

  // Create adapter & AppKit instance
  const adapter = new WagmiAdapter({
    projectId,
    networks: chains,
    wagmi: cfg,
  })

  wagmiConfig = cfg
  appKit = new AppKit({
    projectId,
    adapters: [adapter],
    features: {
      email: false,
      socials: ['farcaster'],
    },
    themeMode: 'auto',
  })
  appKit.__ready = true
  return appKit
}

