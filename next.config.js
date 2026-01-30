/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Webpack config (kept as-is)
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),

      // wagmi experimental / optional connectors (DO NOT EXIST)
      porto: false,
      '@base-org/account': false,
      '@gemini-wallet/core': false,
      '@metamask/sdk': false,
    }

    return config
  },

  // Turbopack config (required since Next.js 16)
  turbopack: {
    resolveAlias: {
      porto: false,
      '@base-org/account': false,
      '@gemini-wallet/core': false,
      '@metamask/sdk': false,
    },
  },
}

module.exports = nextConfig
