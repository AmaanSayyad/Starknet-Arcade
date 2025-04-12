"use client";

import { CoinFlipDemo } from "../components/CoinFlipDemo";

export default function CoinFlipPage() {
  return (
    <div className="flex flex-col p-5 md:py-[56px] md:px-[116px] flex-1 h-full">
      <div className="flex w-full lg:max-w-[1178px] lg:mx-auto">
        <CoinFlipDemo />
      </div>
    </div>
  );
}
