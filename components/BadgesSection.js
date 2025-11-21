// components/BadgesSection.js
import React, { useMemo, useState } from "react";

/**
 * Minimal, framework-safe version.
 * - No styled-jsx / next/image
 * - Uses Base Lite pill styles for buttons
 * - Opaque dialog so it's readable over the page
 */

// ---------- Data ----------
const BADGES = [
  // Creator Score
  {
    id: "creator-score",
    title: "Creator Score",
    chain: "Superchain",
    image: "/badges/csbadge.png",
    summary:
      "A reputation metric that quantifies your creative contributions across platforms using verified data.",
    why:
      "Creator Score is designed to recognize authentic creators by evaluating consistent quality output and engagement, not just popularity. It helps platforms and communities discover creators based on impact and consistency.",
    how: [
      "Complete your Talent Protocol profile and connect your primary wallet(s).",
      "Link your social & content accounts (GitHub, Farcaster/Twitter, blogs, etc.) so data points can be verified.",
      "Publish original work regularly (posts, articles, repos, media) to accumulate measurable creative signals.",
      "Earnings and attributions on creator platforms (e.g., mints/sales, tips) further strengthen your score.",
    ],
    tiers: [
      { label: "Reach Creator Score ≥ 10" },
      { label: "Reach Creator Score ≥ 40" },
      { label: "Reach Creator Score ≥ 80" },
      { label: "Reach Creator Score ≥ 120" },
    ],
    external: [
      { label: "Open Creator Score", href: "https://www.creatorscore.app/" },
      { label: "Open Talent Protocol", href: "https://app.talentprotocol.com/" },
      {
        label: "Creator Score (docs)",
        href: "https://docs.talentprotocol.com/docs/protocol-concepts/scoring-systems/creator-score",
      },
    ],
  },

  // Builder Score
  {
    id: "builder-score",
    title: "Builder Score",
    chain: "Ethereum",
    image: "/badges/bsbadge.png",
    summary:
      "A builder reputation signal by Talent Protocol that aggregates onchain activity and public contributions to show your consistency and credibility as a builder.",
    why:
      "A higher Builder Score helps you stand out to ecosystems, programs, and DAOs that reward consistent public building. It captures progress over time, not just one-off moments.",
    how: [
      "Open Talent Protocol and complete your builder profile.",
      "Connect your wallet(s) and link relevant accounts (GitHub, Farcaster, etc.).",
      "Keep shipping public work (code, apps, tutorials), participate in programs, and maintain activity — your score improves over time.",
    ],
    tiers: [
      { label: "Have a Builder score above 30" },
      { label: "Have a Builder score above 60" },
      { label: "Have a Builder score above 90" },
    ],
    external: [
      { label: "Open Builder Score", href: "https://app.talentprotocol.com/" },
      { label: "Builder Rewards", href: "https://www.builderscore.xyz/" },
      {
        label: "Builder Score (docs)",
        href: "https://docs.talentprotocol.com/docs/protocol-concepts/scoring-systems/builder-score",
      },
      {
        label: "Builder Score Levels (docs)",
        href: "https://docs.talentprotocol.com/docs/protocol-concepts/scoring-systems/builder-score/builder-score-levels",
      },
    ],
  },

  // Based Nouns Holder (Base)
  {
    id: "based-nouns-holder",
    title: "Based Nouns Holder",
    chain: "Base",
    image: "/badges/basednounsbadge.png",
    summary: "Hold Based Nouns NFTs on Base to unlock tiers.",
    why:
      "Holding Based Nouns signals participation in the Base-native Nouns ecosystem and its community culture.",
    how: [
      "Get a Based Nouns NFT on Base (secondary markets).",
      "Hold the NFT in your wallet to progress through tiers.",
    ],
    tiers: [
      { label: "Hold 1 Based Nouns on Base" },
      { label: "Hold 3 Based Nouns on Base" },
      { label: "Hold 5 Based Nouns on Base" },
    ],
    external: [
      { label: "Open Based Nouns (OpenSea)", href: "https://opensea.io/collection/based-nouns" },
    ],
  },

  // Lil Nouns Holder (Ethereum)
  {
    id: "lil-nouns-holder",
    title: "Lil Nouns Holder",
    chain: "Ethereum",
    image: "/badges/lnbadge.png",
    summary: "Hold Lil Nouns NFTs on Ethereum Mainnet to unlock tiers.",
    why:
      "Lil Nouns extends the Nouns ecosystem with daily auctions and a vibrant builder community. Holding Lil Nouns shows long-term alignment with the Nouns ethos.",
    how: [
      "Acquire a Lil Nouns NFT on Ethereum (e.g., secondary markets).",
      "Keep the NFT in your wallet — tiers reflect how many you hold.",
    ],
    tiers: [
      { label: "Hold 1 Lil Nouns on Ethereum Mainnet" },
      { label: "Hold 3 Lil Nouns on Ethereum Mainnet" },
      { label: "Hold 5 Lil Nouns on Ethereum Mainnet" },
    ],
    external: [
      { label: "Open Lil Nouns (OpenSea)", href: "https://opensea.io/collection/lil-nouns" },
      { label: "Lil Nouns — LinkTree", href: "https://linktr.ee/lilnounsdao" },
    ],
  },

  // Nouns Holder (Ethereum)
  {
    id: "nouns-holder",
    title: "Nouns Holder",
    chain: "Ethereum",
    image: "/badges/nhbadge.png",
    summary: "Hold Nouns NFTs on Ethereum Mainnet to unlock tiers.",
    why:
      "Nouns DAO is a flagship onchain community/brand. Holding a Noun represents deep participation in the Nouns ecosystem and its governance culture.",
    how: [
      "Acquire a Noun on Ethereum (e.g., via OpenSea/auction).",
      "Hold the Noun in your wallet — tiers reflect how many you hold.",
    ],
    tiers: [
      { label: "Hold 1 Nouns on Ethereum Mainnet" },
      { label: "Hold 3 Nouns on Ethereum Mainnet" },
      { label: "Hold 5 Nouns on Ethereum Mainnet" },
    ],
    external: [
      { label: "Open Nouns (OpenSea)", href: "https://opensea.io/collection/nouns" },
      { label: "Nouns.wtf", href: "https://nouns.wtf/" },
    ],
  },

  // Giveth Donor (OP Mainnet)
  {
    id: "giveth-donor",
    title: "Giveth Donor",
    chain: "Optimism",
    image: "/badges/gdonorbadge.png",
    summary: "Donate on Giveth to support public goods; tiers reflect total USD donated.",
    why:
      "Giveth routes funds directly to impact projects. Donating builds a positive onchain footprint and aligns your activity with public goods funding.",
    how: [
      "Open Giveth, pick a project you believe in, and connect your wallet (OP Mainnet supported).",
      "Choose an amount in USD equivalent and confirm the donation transaction.",
      "Keep records if you need them for personal accounting — donations are generally non-refundable.",
    ],
    tiers: [
      { label: "Donate at least $25 on Giveth" },
      { label: "Donate at least $100 on Giveth" },
      { label: "Donate at least $250 on Giveth" },
      { label: "Donate at least $1K on Giveth" },
    ],
    external: [{ label: "Open Giveth", href: "https://giveth.io/" }],
  },

  // Gitcoin Donor (OP Mainnet)
  {
    id: "gitcoin-donor",
    title: "Gitcoin Donor",
    chain: "Optimism",
    image: "/badges/gtcdbadge.png",
    summary: "Donate on Gitcoin to fund public goods; tiers reflect total USD donated.",
    why:
      "Gitcoin Grants match community donations to accelerate public goods. Supporting rounds adds clear, positive signals to your onchain reputation.",
    how: [
      "Open Gitcoin Grants and connect your wallet (OP Mainnet supported for many rounds).",
      "Select grantees, set amounts, and complete checkout (Quadratic Funding rounds may require passport/verification).",
      "Confirm the donation transaction(s) and keep receipts for your records.",
    ],
    tiers: [
      { label: "Donate at least $25 on Gitcoin" },
      { label: "Donate at least $100 on Gitcoin" },
      { label: "Donate at least $250 on Gitcoin" },
      { label: "Donate at least $1K on Gitcoin" },
    ],
    external: [{ label: "Open Gitcoin Grants", href: "https://grants.gitcoin.co/" }],
  },

  // Worldcoin Verification
  {
    id: "worldcoin-verification",
    title: "Worldcoin Verification",
    chain: "World",
    image: "/badges/wcvbadge.png",
    summary:
      "Verify your personhood with World App to unlock proof-of-uniqueness benefits across supported apps.",
    why:
      "Worldcoin verification provides a sybil-resistance signal (one-human-per-proof) that some apps use to prevent spam and enable fair distributions.",
    how: [
      "Install World App on your phone.",
      "Create or restore your account and find a nearby Orb to schedule a verification.",
      "Complete the in-person verification; your World ID will be available in the app.",
    ],
    tiers: [{ label: "Get verified with Worldcoin" }],
    external: [
      {
        label: "Get World App (Android)",
        href: "https://play.google.com/store/apps/details?id=com.worldcoin",
      },
      {
        label: "Get World App (iOS)",
        href: "https://apps.apple.com/no/app/world-app-worldcoin-wallet/id1560859847",
      },
    ],
  },

  // World User — NEW
  {
    id: "world-user",
    title: "World User",
    chain: "World",
    image: "/badges/wubadge.png",
    summary:
      "Make onchain transactions on the World chain. Higher tiers reflect more activity and a deeper footprint in the World ecosystem.",
    why:
      "World User tracks how actively you transact on World. Consistent usage signals that you are not just verified, but also an engaged participant in the network’s economy.",
    how: [
      "Set up a wallet that supports the World chain (for example via World App or a compatible EVM wallet once support is available).",
      "Bridge or receive funds on World so you can pay gas and interact with apps.",
      "Use World regularly: send transactions, interact with dapps, and move value onchain.",
      "As your total transaction count on World increases, you progress through the different tiers of the badge.",
    ],
    tiers: [
      { label: "5 transactions made on World" },
      { label: "20 transactions made on World" },
      { label: "50 transactions made on World" },
      { label: "100 transactions made on World" },
      { label: "250 transactions made on World" },
    ],
    external: [{ label: "Learn about World", href: "https://world.org/" }],
  },

  // Base User — NEW
  {
    id: "base-user",
    title: "Base User",
    chain: "Base",
    image: "/badges/baseuserbadge.png",
    summary:
      "Make onchain transactions on the Base layer-2 network. Higher tiers reflect more activity and a deeper footprint in the Base ecosystem.",
    why:
      "Base User recognizes consistent onchain usage of Base, the Ethereum L2 built with the OP Stack and incubated by Coinbase. Activity here shows that you are actively exploring apps and contributing to liquidity and usage on Base.",
    how: [
      "Bridge ETH to Base using an official or trusted bridge so you can pay gas.",
      "Connect your wallet to Base-native or Superchain apps and start using them (swaps, mints, deposits, payments, etc.).",
      "Use Base regularly over time; every onchain interaction counts toward your total transactions.",
      "As your total transaction count on Base increases, you move up through the different badge tiers.",
    ],
    tiers: [
      { label: "5 transactions made on Base" },
      { label: "20 transactions made on Base" },
      { label: "50 transactions made on Base" },
      { label: "100 transactions made on Base" },
      { label: "250 transactions made on Base" },
    ],
    external: [{ label: "Learn about Base", href: "https://www.base.org/" }],
  },

  // OP Mainnet User — NEW
  {
    id: "op-mainnet-user",
    title: "OP Mainnet User",
    chain: "OP Mainnet",
    image: "/badges/opuserbadge.png",
    summary:
      "Make onchain transactions on OP Mainnet, the original Optimism network. Higher tiers reflect more activity and a deeper footprint in the OP Mainnet ecosystem.",
    why:
      "OP Mainnet User highlights your direct usage of OP Mainnet itself, not just other OP Stack chains. Regular activity here signals that you are helping secure, test, and grow the core Optimism ecosystem.",
    how: [
      "Add OP Mainnet to your wallet (most wallets support it natively or via chain lists).",
      "Bridge ETH or other supported assets to OP Mainnet so you can pay gas and transact.",
      "Use OP Mainnet apps regularly: swaps, mints, bridges, deposits, governance, and other dapp interactions.",
      "As your total transaction count on OP Mainnet increases, you progress through the different tiers of the badge.",
    ],
    tiers: [
      { label: "5 transactions made on OP Mainnet" },
      { label: "20 transactions made on OP Mainnet" },
      { label: "50 transactions made on OP Mainnet" },
      { label: "100 transactions made on OP Mainnet" },
      { label: "250 transactions made on OP Mainnet" },
    ],
    external: [
      {
        label: "Learn about OP Mainnet",
        href: "https://www.superchain.eco/chains/op-mainnet",
      },
    ],
  },

  // Mode User — NEW
  {
    id: "mode-user",
    title: "Mode User",
    chain: "Mode",
    image: "/badges/modeuserbadge.png",
    summary:
      "Make onchain transactions on Mode, the Ethereum L2 focused on sequencing and yield. Higher tiers reflect more activity and a deeper footprint in the Mode ecosystem.",
    why:
      "Mode User captures your direct transactional activity on Mode. Consistent usage helps bootstrap liquidity, test apps, and grow Mode as a Superchain-aligned L2.",
    how: [
      "Bridge ETH to Mode using an official or trusted bridge so you can pay gas.",
      "Connect your wallet to Mode-native apps or the Mode Early campaign page.",
      "Use Mode regularly: swaps, mints, deposits, lending, and other dapp interactions all count.",
      "As your total transaction count on Mode increases, you move up through the different badge tiers.",
    ],
    tiers: [
      { label: "5 transactions made on Mode" },
      { label: "20 transactions made on Mode" },
      { label: "50 transactions made on Mode" },
    ],
    external: [
      { label: "Mode Early Campaign", href: "https://app.mode.network/early/" },
    ],
  },

  // Unichain User — NEW
  {
    id: "unichain-user",
    title: "Unichain User",
    chain: "Unichain",
    image: "/badges/uniuserbadge.png",
    summary:
      "Make onchain transactions on Unichain, the L2 focused around the Uniswap ecosystem. Higher tiers reflect more activity and a deeper footprint in the Unichain ecosystem.",
    why:
      "Unichain User tracks how actively you transact on Unichain. Consistent activity here shows you are exploring Uniswap-native apps, providing liquidity, and helping grow this OP Stack network.",
    how: [
      "Bridge ETH or other supported assets to Unichain using an official or trusted bridge so you can pay gas.",
      "Add Unichain to your wallet (via chain list or the Unichain app) and connect to supported dapps.",
      "Use Unichain regularly: swaps, liquidity provision, mints, deposits, and other dapp interactions all count.",
      "As your total transaction count on Unichain increases, you move up through the different badge tiers.",
    ],
    tiers: [
      { label: "5 transactions made on Unichain" },
      { label: "20 transactions made on Unichain" },
      { label: "50 transactions made on Unichain" },
      { label: "100 transactions made on Unichain" },
      { label: "250 transactions made on Unichain" },
    ],
    external: [
      { label: "Explore Unichain", href: "https://www.unichain.org/explore" },
    ],
  },

  // Lisk User — NEW
  {
    id: "lisk-user",
    title: "Lisk User",
    chain: "Lisk",
    image: "/badges/liskuserbadge.png",
    summary:
      "Make onchain transactions on Lisk, an OP Stack chain in the Superchain ecosystem. Higher tiers reflect more activity and a deeper footprint in the Lisk ecosystem.",
    why:
      "Lisk User showcases your direct onchain activity on the Lisk network. Regular usage helps test apps, deepen liquidity, and support the growth of Lisk as part of the broader Superchain.",
    how: [
      "Bridge ETH or other supported assets to Lisk so you can pay gas for your transactions.",
      "Add Lisk to your wallet via the official Lisk portal or supported chain lists and connect to Lisk dapps.",
      "Use Lisk regularly: swaps, mints, deposits, lending, and other dapp interactions all count toward your total.",
      "As your total transaction count on Lisk increases, you move up through the different badge tiers.",
    ],
    tiers: [
      { label: "5 transactions made on Lisk" },
      { label: "20 transactions made on Lisk" },
      { label: "50 transactions made on Lisk" },
      { label: "100 transactions made on Lisk" },
      { label: "250 transactions made on Lisk" },
    ],
    external: [
      { label: "Explore the Lisk ecosystem", href: "https://lisk.com/ecosystem/" },
    ],
  },

  // Soneium User — NEW
  {
    id: "soneium-user",
    title: "Soneium User",
    chain: "Soneium",
    image: "/badges/soneiumbadgeuser.png",
    summary:
      "Make onchain transactions on Soneium, an OP Stack L2 in the Superchain ecosystem. Higher tiers reflect more activity and a deeper footprint in the Soneium ecosystem.",
    why:
      "Soneium User highlights your direct activity on Soneium. Consistent usage helps test dapps, deepen liquidity, and support the growth of this Ethereum-aligned L2.",
    how: [
      "Bridge ETH or other supported assets to Soneium so you can pay gas for your transactions.",
      "Add Soneium to your wallet via official chain configs or supported chain lists, then connect to Soneium dapps.",
      "Use Soneium regularly: swaps, mints, deposits, lending, and other dapp interactions all count toward your total.",
      "As your total transaction count on Soneium increases, you move up through the different badge tiers.",
    ],
    tiers: [
      { label: "5 transactions made on Soneium" },
      { label: "20 transactions made on Soneium" },
      { label: "50 transactions made on Soneium" },
      { label: "100 transactions made on Soneium" },
      { label: "250 transactions made on Soneium" },
    ],
    external: [
      { label: "Explore the Soneium ecosystem", href: "https://soneium.org/en/ecosystem/" },
    ],
  },

  // Early Power User
  {
    id: "early-power-user",
    title: "Early Power User",
    chain: "Optimism",
    image: "/badges/epubadge.png",
    summary: "Be among the first 100 accounts to reach Level 3.",
    why:
      "Recognizes early power users on OP Mainnet who actively explore features and level up quickly.",
    how: [
      "Create your account and start using the product on OP Mainnet.",
      "Complete actions that grant XP and progress through levels.",
      "Reach Level 3 — only the first 100 accounts qualify.",
    ],
    tiers: [{ label: "Reach Level 3" }],
  },

  // Super Cohort 24
  {
    id: "super-cohort-24",
    title: "Super Cohort 24",
    chain: "Optimism",
    image: "/badges/sc24badge.png",
    summary:
      "Graduated from Super Cohort 0. Note: this program/badge is no longer available to join.",
    why:
      "Super Cohort 24 celebrated the first graduating cohort (Cohort 0) of Superchain contributors. It’s a legacy badge that recognizes early community members.",
    how: [
      "Participate in Super Cohort 0 activities and complete all requirements.",
      "Graduate from the cohort to receive recognition.",
    ],
    tiers: [{ label: "Complete Super Cohort 0" }],
    external: [
      {
        label: "Announcement / recap",
        href: "https://www.superchain.eco/insights/announcing-super-contributor-cohort-0",
      },
    ],
  },

  // S7 Super User
  {
    id: "s7-super-user",
    title: "S7 Super User",
    chain: "Superchain (Season 7)",
    image: "/badges/s7subadge.png",
    summary:
      "Make transactions across Superchain during Season 7. Higher tiers reflect more onchain activity across supported chains.",
    why:
      "This badge showcases consistent multi-chain usage in the Superchain ecosystem and encourages exploring several OP Stack networks.",
    how: [
      "Bridge to and use apps on Superchain networks (e.g., Base, OP Mainnet, Mode, Zora, Frax, Metal).",
      "Transact normally: swaps, mints, bridges, payments, deploys — they all count.",
      "Accumulate transactions during Season 7 to reach higher tiers.",
    ],
    tiers: [
      { label: "25 transactions made on Superchain in Season 7" },
      { label: "70 transactions made on Superchain in Season 7" },
      { label: "150 transactions made on Superchain in Season 7" },
      { label: "350 transactions made on Superchain in Season 7" },
      { label: "1K transactions made on Superchain in Season 7" },
    ],
    external: [{ label: "Explore Superchain chains", href: "https://www.superchain.eco/chains" }],
  },

  // S8 Super User
  {
    id: "s8-super-user",
    title: "S8 Super User",
    chain: "Superchain (Season 8)",
    image: "/badges/s8subadge.png",
    summary:
      "Make transactions across Superchain during Season 8. Higher tiers reflect more onchain activity across supported chains.",
    why:
      "Demonstrates active, multi-chain participation in the Superchain ecosystem during Season 8.",
    how: [
      "Use apps across OP Stack networks (Base, OP Mainnet, Mode, Zora, Frax, Metal, etc.).",
      "Do everyday transactions (swaps, mints, bridges, payments, deploys).",
      "Accumulate transactions during Season 8 to hit higher tiers.",
    ],
    tiers: [
      { label: "25 transactions made on Superchain in Season 8" },
      { label: "70 transactions made on Superchain in Season 8" },
      { label: "150 transactions made on Superchain in Season 8" },
      { label: "350 transactions made on Superchain in Season 8" },
      { label: "1K transactions made on Superchain in Season 8" },
    ],
    external: [{ label: "Explore Superchain chains", href: "https://www.superchain.eco/chains" }],
  },

  // Self Verification
  {
    id: "self-verification",
    title: "Self Verification",
    chain: "Celo",
    image: "/badges/selfbadge.png",
    summary:
      "Verify your uniqueness and country using Self Protocol’s ZK passport on Celo. Additionally, Self launched a points campaign.",
    why:
      "Self provides privacy-preserving country verification. Some apps use it for sybil resistance and eligibility checks while keeping personal data off-chain.",
    how: [
      "Install the Self app on Android or iOS.",
      "Create your account and complete the in-app country verification flow.",
      "Link/use the same wallet in your dapps to present your proof when required.",
    ],
    tiers: [{ label: "Verify your Country via Self" }],
    external: [
      {
        label: "Join Self",
        href: "https://referral.self.xyz/referral/0x4B741c1047419557D2d1Ac0014A723BBFa3Efcbb",
      },
      {
        label: "Get Self (Android)",
        href: "https://play.google.com/store/apps/details?id=com.proofofpassportapp",
      },
      {
        label: "Get Self (iOS)",
        href: "https://apps.apple.com/fr/app/self-zk-passport-identity/id6478563710",
      },
    ],
  },

  // SuperStacks (Season 7, concluded)
  {
    id: "superstacks",
    title: "SuperStacks",
    chain: "Superchain (Season 7)",
    image: "/badges/superstacksbadge.png",
    summary:
      "XP earned during the SuperStacks campaign (Season 7). Note: this campaign has ended and the badge is no longer obtainable.",
    why:
      "SuperStacks rewarded cross-ecosystem activity with XP during Season 7, encouraging users to explore multiple OP Stack chains and apps.",
    how: [
      "Participate in SuperStacks Season 7 activities across supported chains.",
      "Earn XP by completing eligible onchain actions during the campaign window.",
      "Accumulate enough XP to reach higher tiers.",
    ],
    tiers: [
      { label: "100K XP earned during SuperStacks campaign" },
      { label: "1M XP earned during SuperStacks campaign" },
      { label: "5M XP earned during SuperStacks campaign" },
      { label: "10M XP earned during SuperStacks campaign" },
      { label: "25M XP earned during SuperStacks campaign" },
    ],
    external: [
      { label: "About SuperStacks", href: "https://www.superchain.eco/programs/superstacks" },
    ],
  },

  // Lisk Airdrop S1 — NEW
  {
    id: "lisk-airdrop-s1",
    title: "Lisk Airdrop S1",
    chain: "Lisk",
    image: "/badges/liskabadge.png",
    summary:
      "Seasonal airdrop on the Lisk OP Stack chain. Join the verified airdrop Guild and complete tasks to earn Season 1 points and LSK rewards.",
    why:
      "Lisk Airdrop Season 1 rewards early onchain usage of the Lisk network. By joining the verified airdrop cohort and completing tasks, you build a clear Lisk-specific footprint that can convert into both LSK rewards and Superchain reputation.",
    how: [
      "Open the official Lisk Airdrop portal.",
      "Connect an EVM-compatible wallet (e.g. MetaMask, Rabby, Phantom) and use the portal’s “Switch to Lisk” flow to add the Lisk network.",
      "Bridge a small amount of ETH to Lisk so you can pay gas for your transactions.",
      "Click “Verify with Guild” in the portal and complete at least 2 of the listed requirements to join the Verified Airdrop participant Guild.",
      "Back on the portal, enter the referral code se2024 to unlock the Season 1 dashboard, then complete tasks over time to accumulate points for the airdrop.",
    ],
    tiers: [{ label: "Join the Verified Airdrop participant Guild for Lisk Season 1" }],
    external: [
      {
        label: "How To: Lisk Airdrop Season 1",
        href: "https://www.superchain.eco/insights/how-to-lisk-airdrop-season-1",
      },
      {
        label: "Open Lisk Airdrop portal",
        href: "https://portal.lisk.com/",
      },
    ],
  },

  // Lisk Surge — NEW (Season 7)
  {
    id: "lisk-surge",
    title: "Lisk Surge",
    chain: "Lisk",
    image: "/badges/lisksurgebadge.png",
    summary:
      "LSK earned during the Lisk Surge campaign (Season 7). Earn more LSK to reach higher tiers.",
    why:
      "Lisk Surge highlighted activity on the Lisk OP Stack chain by rewarding users who earned LSK during the campaign.",
    how: [
      "Use apps on Lisk and participate in eligible activities during the campaign window.",
      "Earn LSK through supported actions and accumulate totals to progress.",
    ],
    tiers: [
      { label: "5 LSK earned during the Lisk Surge campaign" },
      { label: "25 LSK earned during the Lisk Surge campaign" },
      { label: "100 LSK earned during the Lisk Surge campaign" },
      { label: "1K LSK earned during the Lisk Surge campaign" },
      { label: "5K LSK earned during the Lisk Surge campaign" },
    ],
    external: [
      { label: "About Lisk Surge", href: "https://www.superchain.eco/programs/lisk-surge" },
    ],
  },

  // ETH Vault Deposits
  {
    id: "eth-vault-deposits",
    title: "ETH Vault Deposits",
    chain: "OP Mainnet",
    image: "/badges/ethvdbadge.png",
    summary:
      "Deposit ETH into the WETH Super Vaults on OP Mainnet to progress through reward tiers.",
    why:
      "Using the WETH Super Vaults puts your ETH to work directly in the Superchain ecosystem, helping deepen liquidity on OP Mainnet while you earn yield and points.",
    how: [
      "Open the Superchain Vaults page on OP Mainnet.",
      "Connect your wallet and choose the WETH Super Vaults product.",
      "Deposit ETH into the vaults and keep your position to maintain your badge progress.",
    ],
    tiers: [
      { label: "Deposit ETH in the WETH Super Vaults (Tier 1)" },
      { label: "Deposit more ETH in the WETH Super Vaults (Tier 2)" },
      { label: "Deposit more ETH in the WETH Super Vaults (Tier 3)" },
      { label: "Deposit more ETH in the WETH Super Vaults (Tier 4)" },
      { label: "Deposit more ETH in the WETH Super Vaults (Tier 5)" },
    ],
    external: [
      { label: "Open Superchain Vaults", href: "https://account.superchain.eco/vaults" },
    ],
  },

  // Citizen — NEW
  {
    id: "citizen",
    title: "Citizen",
    chain: "OP Mainnet",
    image: "/badges/citibadge.png",
    summary:
      "Become an Optimism Citizen by owning a wallet that has been granted Citizenship on OP Mainnet.",
    why:
      "Optimism Citizenship recognizes active, values-aligned contributors to the Optimism Collective. Being a Citizen gives you a voice in Citizens' House governance and signals long-term commitment to the ecosystem.",
    how: [
      "Explore Optimism governance and community channels to understand how Citizenship is granted.",
      "Contribute to the Optimism ecosystem (building, governance, public goods, community) so you can become eligible for a Citizenship grant.",
      "Once one of your wallets is a Citizen wallet, keep ownership of that wallet to satisfy the badge condition.",
    ],
    tiers: [{ label: "Be the owner of a wallet who is a Citizen" }],
    external: [
      {
        label: "Learn about Optimism Citizenship",
        href: "https://atlas.optimism.io/citizenship",
      },
    ],
  },
];

// ---------- UI helpers ----------
const wrap = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: 10,
};

const item = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 12,
  flexWrap: "wrap",
};

const imgStyle = { borderRadius: 12, width: 64, height: 64, objectFit: "cover" };
const name = { margin: 0, fontSize: 16, fontWeight: 800 };
const chip = {
  display: "inline-flex",
  alignItems: "center",
  padding: "2px 8px",
  borderRadius: 999,
  border: "1px solid var(--card-border, rgba(255,255,255,0.18))",
  background: "var(--card-bg, rgba(16,24,48,0.30))",
  fontSize: 12,
  marginLeft: 8,
};
const summary = {
  margin: "4px 0 0",
  color: "var(--muted, #c9d1d9)",
  fontSize: 14,
  textAlign: "center",
};

// pill buttons
const pillBtn = {
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
  height: 36,
  padding: "0 12px",
  borderRadius: 12,
  fontSize: 14,
  fontWeight: 600,
  border: "1px solid rgba(255,255,255,0.18)",
  background: "rgba(255,255,255,0.10)",
  color: "inherit",
  textDecoration: "none",
  cursor: "pointer",
};

const actions = {
  display: "flex",
  gap: 8,
  flexWrap: "wrap",
  justifyContent: "center",
  marginTop: 8,
};

// Modal: backdrop + opaque dialog
const modalRoot = {
  position: "fixed",
  inset: 0,
  zIndex: 999, // above footer/icons
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: 16,
};
const backdrop = { position: "absolute", inset: 0, background: "rgba(0,0,0,.6)" };
const dialog = {
  position: "relative",
  width: "100%",
  maxWidth: 720,
  background: "rgba(16,24,48,0.96)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,0.18)",
  borderRadius: 16,
  boxShadow: "0 20px 50px rgba(0,0,0,.45)",
};
const dhead = { display: "flex", alignItems: "center", gap: 10, padding: "14px 16px 0" };
const dtitle = { margin: 0, fontSize: 18, fontWeight: 800 };
const closeBtn = {
  marginLeft: "auto",
  background: "transparent",
  border: 0,
  fontSize: 24,
  lineHeight: 1,
  cursor: "pointer",
  color: "inherit",
};
const dbody = { padding: "12px 16px 16px", fontSize: 15, lineHeight: 1.55 };
const meta = { color: "rgba(255,255,255,0.75)", fontSize: 13 };

// ---------- Component ----------
export default function BadgesSection() {
  const data = useMemo(() => BADGES, []);
  const [openId, setOpenId] = useState(null);
  const openSpec = useMemo(
    () => data.find((b) => b.id === openId) || null,
    [data, openId]
  );

  return (
    <div style={wrap}>
      {data.map((b) => (
        <div key={b.id} style={item}>
          <img src={b.image} alt={b.title} style={imgStyle} />
          <div style={{ maxWidth: 640 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
              <h3 style={name}>{b.title}</h3>
              <span style={chip}>{b.chain}</span>
            </div>
            <p style={summary}>{b.summary}</p>
            <div style={actions}>
              <button style={pillBtn} onClick={() => setOpenId(b.id)}>Details</button>
              {b.external?.map((x) => (
                <a
                  key={x.href}
                  href={x.href}
                  target="_blank"
                  rel="noreferrer"
                  style={pillBtn}
                >
                  {x.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      ))}

      {openSpec && (
        <div style={modalRoot} role="dialog" aria-modal="true">
          <div style={backdrop} onClick={() => setOpenId(null)} />
          <div style={dialog}>
            <div style={dhead}>
              <img src={openSpec.image} alt="" width={28} height={28} style={{ borderRadius: 8 }} />
              <h4 style={dtitle}>{openSpec.title}</h4>
              <button style={closeBtn} onClick={() => setOpenId(null)} aria-label="Close">×</button>
            </div>

            <div style={dbody}>
              <div style={meta}>Chain: {openSpec.chain}</div>

              <section>
                <h5 style={{ margin: "12px 0 6px", fontSize: 15 }}>Why it matters</h5>
                <p style={{ margin: 0 }}>{openSpec.why}</p>
              </section>

              <section>
                <h5 style={{ margin: "12px 0 6px", fontSize: 15 }}>How to progress</h5>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {openSpec.how.map((li, i) => <li key={i}>{li}</li>)}
                </ul>
              </section>

              {openSpec.tiers && (
                <section>
                  <h5 style={{ margin: "12px 0 6px", fontSize: 15 }}>Tiers</h5>
                  <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                    {openSpec.tiers.map((t, i) => (
                      <li
                        key={i}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 8,
                          margin: "6px 0",
                        }}
                      >
                        <span
                          style={{
                            display: "inline-block",
                            width: 6,
                            height: 6,
                            borderRadius: 999,
                            background: "currentColor",
                            opacity: 0.75,
                          }}
                        />
                        <span>
                          {t.label}
                          {t.hint ? (
                            <span style={{ color: "rgba(255,255,255,0.75)", fontSize: 12 }}>
                              {" "}
                              – {t.hint}
                            </span>
                          ) : null}
                        </span>
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {openSpec.external && openSpec.external.length > 0 && (
                <section>
                  <h5 style={{ margin: "12px 0 6px", fontSize: 15 }}>Links</h5>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
                    {openSpec.external.map((x) => (
                      <a key={x.href} href={x.href} target="_blank" rel="noreferrer" style={pillBtn}>
                        {x.label}
                      </a>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
