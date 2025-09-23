"use client";

import { createAppKit } from "@reown/appkit";
import { defaultWagmiConfig } from "@reown/appkit-wagmi";
import { createConfig, http } from "wagmi";
import { CHAINS, PRIMARY } from "./chains";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;
if (!projectId) console.warn("Missing NEXT_PUBLIC_WC_PROJECT_ID");

export const wagmiConfig = createConfig(
  defaultWagmiConfig({
    chains: CHAINS,
    projectId,
    metadata: {
      name: "Base Lite",
      description: "A lightweight Base mini-hub",
      url: process.env.NEXT_PUBLIC_BASE_LITE_URL || "https://base-lite.vercel.app",
      icons: ["/icons/app.png"]
    },
    transports: CHAINS.reduce((acc, c) => ({ ...acc, [c.id]: http() }), {})
  })
);

export const appKit = createAppKit({
  projectId,
  wagmiConfig,
  defaultChain: PRIMARY,
  features: { email: false }
});
