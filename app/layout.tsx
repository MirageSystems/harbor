import type { Metadata } from "next";
import { spaceGrotesk, inter, plexMono, fraunces } from "./fonts";
import { Providers } from "@/components/Providers";
import { AuthGate } from "@/components/AuthGate";
import "./globals.css";

export const metadata: Metadata = {
  title: "Harbor",
  description: "On-chain LC settlement for SMEs",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${plexMono.variable} ${fraunces.variable}`}
    >
      <body className="font-body">
        <Providers>
          <AuthGate>{children}</AuthGate>
        </Providers>
      </body>
    </html>
  );
}
