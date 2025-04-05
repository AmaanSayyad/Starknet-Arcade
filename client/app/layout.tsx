"use client";
import "./globals.css";
import StarknetProvider from "./components/StarknetProvider";
import { Navbar } from "./components/Navbar";
import { useEffect } from "react";
import { LotteryProvider } from "./contexts/LotteryContext";
import Head from "next/head";

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
        <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet"/>

      </Head>
      <body className="min-h-screen bg-[#070005]">
        <StarknetProvider>
          <LotteryProvider>
            <Navbar />
            <main className="w-full">{children}</main>
          </LotteryProvider>
        </StarknetProvider>
      </body>
    </html>
  );
}
