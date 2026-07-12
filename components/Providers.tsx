"use client";

import { PrivyProvider } from "@privy-io/react-auth";
import { chain } from "@/lib/harbor";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PrivyProvider
      appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID!}
      config={{
        loginMethods: ["email"],
        embeddedWallets: {
          ethereum: { createOnLogin: "all-users" },
          showWalletUIs: false,
        },
        defaultChain: chain,
        supportedChains: [chain],
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
