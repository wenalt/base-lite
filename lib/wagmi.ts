"use client";

import { http, createConfig } from "wagmi";
import { base } from "viem/chains";

export const config = createConfig({
  chains: [base],
  transports: {
    [base.id]: http() // Alchemy/Ankr/RPC public; change if needed
  }
});
