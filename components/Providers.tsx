"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { polygonAmoy } from "viem/chains";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email"],
        embeddedWallets: {
          ethereum: { createOnLogin: "all-users" },
        },
        defaultChain: polygonAmoy,
        supportedChains: [polygonAmoy],
        appearance: {
          theme: "light",
          accentColor: "#2B3AFF",
        },
      }}
    >
      {children}
    </PrivyProvider>
  );
}
