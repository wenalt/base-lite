/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

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
}

module.exports = nextConfig
