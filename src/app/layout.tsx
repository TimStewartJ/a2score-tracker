import "~/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { TRPCReactProvider } from "~/trpc/react";
import { ScoreProvider } from "~/context/ScoreContext";
import Head from "next/head";

export const metadata: Metadata = {
  title: "Score Keeper",
  description: "Score keeping app for games",
  icons: [{ rel: "icon", url: "/ios/64.png" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Score Keeper',
  }
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#1e40af" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </Head>
      <body>
        <TRPCReactProvider>
          <ScoreProvider>{children}</ScoreProvider>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
