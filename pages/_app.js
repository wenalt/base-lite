// pages/_app.js
import Head from 'next/head'
import { useEffect, useState } from 'react'

export default function App({ Component, pageProps }) {
  // Persisted theme: 'auto' | 'light' | 'dark'
  const [theme, setTheme] = useState('auto')

  // Apply theme to <html data-theme="">
  useEffect(() => {
    const saved = typeof window !== 'undefined' && localStorage.getItem('theme')
    const t = saved || 'auto'
    setTheme(t)
    document.documentElement.dataset.theme = t

    // lock horizontal scroll
    document.documentElement.style.overflowX = 'hidden'
    document.body.style.overflowX = 'hidden'
  }, [])

  return (
    <>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* Base Lite meta assets */}
        <link rel="icon" href="/baseicon.png" />
        <meta property="og:image" content="/baseog.png" />
        <meta name="theme-color" content="#0052FF" />
        {/* Farcaster meta (kept for future mini-app compat) */}
        <meta name="fc:frame" content="vNext" />
        <meta name="fc:miniapp" content="v1" />
        <title>Base Lite</title>
      </Head>

      {/* No Wagmi provider until AppKit is wired client-only */}
      <Component {...pageProps} />

      {/* Global styles (styled-jsx) — JS-only, no CSS files */}
      <style jsx global>{`
        :root {
          --base-blue: #0052ff;
          --base-blue-dark: #0b1b3b;

          --chip-bg: #ffffff;
          --chip-fg: #111;
          --chip-border: rgba(0,0,0,0.08);

          --bg: var(--base-blue);
          --fg: #0e1116;

          --card-bg: rgba(255,255,255,0.10);
          --card-border: rgba(255,255,255,0.22);
          --card-fg: #ffffff;
          --shadow: 0 8px 24px rgba(0,0,0,0.2);
        }

        /* Dark overrides when user forces dark */
        [data-theme="dark"] {
          --bg: var(--base-blue-dark);
          --fg: #e6e8f0;

          --chip-bg: rgba(255,255,255,0.08);
          --chip-fg: #e6e8f0;
          --chip-border: rgba(255,255,255,0.14);

          --card-bg: rgba(255,255,255,0.06);
          --card-border: rgba(255,255,255,0.12);
          --card-fg: #e6e8f0;
        }

        /* Auto follows system; we scope to body for simplicity */
        @media (prefers-color-scheme: dark) {
          [data-theme="auto"] {
            --bg: var(--base-blue-dark);
            --fg: #e6e8f0;

            --chip-bg: rgba(255,255,255,0.08);
            --chip-fg: #e6e8f0;
            --chip-border: rgba(255,255,255,0.14);

            --card-bg: rgba(255,255,255,0.06);
            --card-border: rgba(255,255,255,0.12);
            --card-fg: #e6e8f0;
          }
        }

        html, body, #__next {
          height: 100%;
        }

        body {
          margin: 0;
          background: var(--bg);
          color: var(--fg);
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
          overflow-x: hidden;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Inter, "Helvetica Neue", Arial, Noto Sans, "Apple Color Emoji", "Segoe UI Emoji";
        }

        /* Pills */
        .chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 12px;
          background: var(--chip-bg);
          color: var(--chip-fg);
          border: 1px solid var(--chip-border);
          font-weight: 600;
          font-size: 14px;
          text-decoration: none;
        }

        .chip img {
          width: 16px;
          height: 16px;
          border-radius: 4px;
        }

        /* Card */
        .card {
          width: 100%;
          max-width: 960px;
          border-radius: 16px;
          padding: 20px;
          border: 1px solid var(--card-border);
          background: var(--card-bg);
          color: var(--card-fg);
          box-shadow: var(--shadow);
          backdrop-filter: blur(6px);
        }

        /* Footer icon row */
        .social-row {
          display: flex;
          gap: 10px;
          justify-content: center;
          align-items: center;
        }

        .social-row a img {
          width: 22px;
          height: 22px;
          display: block;
        }

        /* Prevent layout shift on small screens */
        .container {
          max-width: 1120px;
          margin: 0 auto;
          padding: 16px;
        }
      `}</style>

      {/* Tiny helper for other components to update theme */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.__setTheme = function(t){
              try {
                localStorage.setItem('theme', t);
                document.documentElement.dataset.theme = t;
              } catch(e){}
            }
          `,
        }}
      />
    </>
  )
}
