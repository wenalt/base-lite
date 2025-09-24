// lib/appkit.js
// Safe defaults so pages can import without breaking on SSR
export let appKit = {
  open: () => {
    if (typeof window !== 'undefined') {
      console.warn('AppKit not initialized yet.')
      alert('Connect is not available yet.')
    }
  }
}
export let wagmiConfig = undefined

// Call this once on the client (e.g., in pages/_app.js useEffect)
// It lazy-loads AppKit + Wagmi only in the browser.
export async function initAppKit() {
  if (typeof window === 'undefined') return
  if (wagmiConfig && appKit && appKit.open !== undefined) return

  const [{ createAppKit }, { AppKitWagmiAdapter }, wagmi, chains] = await Promise.all([
    import('@reown/appkit'),
    import('@reown/appkit-adapter-wagmi'),
    import('wagmi'),
    import('wagmi/chains')
  ])

  const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID || ''
  // minimal Base-only setup
  const { base } = chains
  const { http } = await import('viem')

  const adapter = new AppKitWagmiAdapter({
    networks: [base],
    transports: { [base.id]: http() }
  })

  wagmiConfig = adapter.wagmiConfig

  appKit = createAppKit({
    adapters: [adapter],
    projectId,
    features: {
      analytics: true
    }
  })
}
