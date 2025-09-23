import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from '../lib/appkit' // was '@/lib/appkit'

export default function App({ Component, pageProps }) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <Component {...pageProps} />
    </WagmiConfig>
  )
}
