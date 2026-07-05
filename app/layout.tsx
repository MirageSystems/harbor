import type { Metadata } from "next";
import { spaceGrotesk, inter, plexMono, fraunces } from "./fonts";
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
      <body className="font-body">{children}</body>
    </html>
  );
}
