// pages/_app.js
import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from '@/lib/appkit'

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
