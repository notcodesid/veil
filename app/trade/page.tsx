"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import { BalanceStrip } from "@/components/trade/balance-strip";
import { ConnectPrompt } from "@/components/trade/connect-prompt";
import { ShieldForm } from "@/components/trade/shield-form";
import { SwapForm } from "@/components/trade/swap-form";
import { UnshieldForm } from "@/components/trade/unshield-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TradePage() {
  const { connected } = useWallet();
  const [tab, setTab] = useState("shield");

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-5 px-4 pt-28 pb-10 sm:gap-6 sm:px-6">
      <div className="space-y-1">
        <h1 className="font-luckiest-guy text-4xl sm:text-5xl uppercase tracking-wider text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">
          Trade
        </h1>
        <p className="font-bold text-zinc-100 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.4)]">
          Shield, swap, and unshield SPL tokens privately.
        </p>
      </div>

      <ConnectPrompt />

      {connected ? (
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid h-auto w-full grid-cols-3 p-1">
            <TabsTrigger value="shield" className="text-xs sm:text-sm">
              Shield
            </TabsTrigger>
            <TabsTrigger value="swap" className="text-xs sm:text-sm">
              Swap
            </TabsTrigger>
            <TabsTrigger value="unshield" className="text-xs sm:text-sm">
              Unshield
            </TabsTrigger>
          </TabsList>
          <TabsContent value="shield" className="mt-4">
            <ShieldForm />
          </TabsContent>
          <TabsContent value="swap" className="mt-4">
            <SwapForm streamEnabled={tab === "swap"} />
          </TabsContent>
          <TabsContent value="unshield" className="mt-4">
            <UnshieldForm />
          </TabsContent>
        </Tabs>
      ) : null}

      <BalanceStrip />
    </main>
  );
}