// pages/_app.js
import Head from 'next/head'
import { WagmiConfig } from 'wagmi'
import { wagmiConfig } from '../lib/appkit'

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Base Lite meta assets */}
        <link rel="icon" href="/baseicon.png" />
        <meta property="og:image" content="/baseog.png" />
        <meta name="theme-color" content="#0052FF" />
        {/* Farcaster Mini-app meta kept compatible */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:miniapp" content="v1" />
      </Head>
      <WagmiConfig config={wagmiConfig}>
        <Component {...pageProps} />
      </WagmiConfig>
    </>
  )
}
