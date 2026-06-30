"use client";

import { Wallet } from "lucide-react";
import { useWallet } from "@solana/wallet-adapter-react";

import { ConnectButton } from "@/components/wallet/connect-button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ConnectPromptProps = {
  title?: string;
  description?: string;
};

export function ConnectPrompt({
  title = "Connect your wallet",
  description = "Connect your wallet to shield, swap, and unshield privately.",
}: ConnectPromptProps) {
  const { connected } = useWallet();

  if (connected) return null;

  return (
    <Card className="veil-surface border-dashed">
      <CardHeader className="text-center sm:text-left">
        <div className="mx-auto mb-2 flex size-10 items-center justify-center rounded-xl border-2 border-black bg-yellow-300 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:mx-0">
          <Wallet className="size-5" />
        </div>
        <CardTitle className="font-luckiest-guy text-xl uppercase tracking-wider">{title}</CardTitle>
        <CardDescription className="font-semibold text-zinc-600">{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center sm:justify-start">
        <ConnectButton />
      </CardContent>
    </Card>
  );
}