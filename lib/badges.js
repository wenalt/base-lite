export const BADGES = [
  {
    id: "base-txs",
    title: "Base Transactions",
    chain: "Base",
    image: "/icons/app.png",
    summary: "Make transactions on Base to build an onchain footprint.",
    why: "Organic usage shows real activity across Superchain apps.",
    how: [
      "Switch your wallet to Base (chainId 8453).",
      "Use bridges, swaps, mints, or transfers on Base."
    ],
    tiers: [
      { label: "10 transactions on Base" },
      { label: "50 transactions on Base" },
      { label: "100 transactions on Base" }
    ],
    external: [{ label: "Base ecosystem", href: "https://www.base.org/ecosystem" }]
  },
  {
    id: "zora-on-base",
    title: "Zora (on Base)",
    chain: "Base",
    image: "/icons/app.png",
    summary: "Mint or collect on Zora using Base.",
    why: "Grow culture & distribution on Superchain.",
    how: ["Switch to Base.", "Mint/collect.", "Return later for daily drip (WIP)."],
    tiers: [
      { label: "Mint/Collect 1" },
      { label: "Mint/Collect 5" },
      { label: "Mint/Collect 25" }
    ],
    external: [{ label: "Zora", href: "https://zora.co" }]
  }
];
