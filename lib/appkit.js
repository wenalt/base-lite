export function AppKitProvider({ children }) {
  const [state, setState] = React.useState({
    ready: false,
    config: null
  })

  React.useEffect(() => {
    const app = ensureClientInit()
    if (wagmiAdapter?.wagmiConfig) {
      setState({
        ready: true,
        config: wagmiAdapter.wagmiConfig
      })
    }
  }, [])

  if (!state.ready || !state.config) return null

  return (
    <WagmiProvider config={state.config}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  )
}
