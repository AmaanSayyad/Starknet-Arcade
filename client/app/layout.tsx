"use client";
import "./globals.css";
import StarknetProvider from "./components/StarknetProvider";
import { Navbar } from "./components/Navbar";
import { useEffect } from "react";
import { LotteryProvider } from "./contexts/LotteryContext";

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
      <body className="min-h-screen bg-purple-100">
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
