import "../styles/globals.css";
import Head from "next/head";
import { WagmiConfig } from "wagmi";
import { wagmiConfig } from "../lib/appkit";

export default function App({ Component, pageProps }) {
  return (
    <>
      <Head>
        {/* Farcaster Mini App meta (kept for parity) */}
        <meta name="fc:miniapp" content="1" />
        <meta property="og:title" content="Base Lite" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/icons/app.png" />
      </Head>

      <WagmiConfig config={wagmiConfig}>
        <div className="container">
          {/* Blue hero bar like Celo Lite’s header but Base-flavored */}
          <div className="hero" style={{ marginBottom: 12 }}>
            <div className="title">Base Lite</div>
            <div className="pill">mini-hub Superchain</div>
          </div>

          <Component {...pageProps} />
        </div>
      </WagmiConfig>
    </>
  );
}
