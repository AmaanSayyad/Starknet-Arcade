"use client";
import "./globals.css";
import { useEffect } from "react";
// import { LotteryProvider } from "./contexts/LotteryContext";
import Head from "next/head";

import "@fontsource/press-start-2p";
import "@fontsource/orbitron"; // Optional weights: /400.css, /700.css
import "@fontsource/silkscreen";
import { Toaster } from "react-hot-toast";
import { Navbar } from "./components/Navbar";
import { CoinFlipProvider } from "./contexts/CoinFlipContext";
import Script from "next/script";
import { StarknetProvider } from "./components/StarknetProvider";
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    document.title = "Starknet Arcade";
    document.head
      .querySelector("link[rel='icon']")
      ?.setAttribute("href", "/starknet.svg");
  }, []);

  return (
    <html lang="en">
      <Head>
        <title>Starknet Arcade - Gamifying Starknet</title>
        <meta name="description" content="Play games on Starknet blockchain" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/css/style.css" />
        <link
          href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Exo:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body className="min-h-screen ">
        <Script
          src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"
          strategy="beforeInteractive"
        />
        <Script src="/js/scripts.js" strategy="afterInteractive" />
        <StarknetProvider>
          <CoinFlipProvider>
            <Navbar />
            <main className="w-full">{children}</main>
          </CoinFlipProvider>
        </StarknetProvider>
        <Toaster />
      </body>
    </html>
  );
}
