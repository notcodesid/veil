"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { ExternalLink } from "lucide-react";

import { ShieldedBalances } from "@/components/portfolio/shielded-balances";
import { AuthStatus } from "@/components/wallet/auth-status";
import { ConnectButton } from "@/components/wallet/connect-button";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePrivateBalances } from "@/hooks/use-private-balances";
import { getLastTxSig, VEIL_BALANCES_EVENT } from "@/lib/veil/session";
import { clusterLabel } from "@/lib/magicblock/config";
import { txUrl } from "@/lib/solana/explorer";
import { truncateAddress } from "@/lib/solana/format";

function subscribeLastTx(callback: () => void) {
  const handler = () => callback();
  window.addEventListener(VEIL_BALANCES_EVENT, handler);
  window.addEventListener("storage", handler);
  return () => {
    window.removeEventListener(VEIL_BALANCES_EVENT, handler);
    window.removeEventListener("storage", handler);
  };
}

function getLastTxSnapshot() {
  return getLastTxSig();
}

function getServerLastTxSnapshot() {
  return null;
}

export default function PortfolioPage() {
  const {
    connected,
    publicKey,
    isAuthenticated,
    isAuthenticating,
    refresh,
  } = usePrivateBalances();

  const lastTxSig = useSyncExternalStore(
    subscribeLastTx,
    getLastTxSnapshot,
    getServerLastTxSnapshot,
  );

  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-5 px-4 pt-28 pb-10 sm:gap-6 sm:px-6">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h1 className="font-luckiest-guy text-4xl sm:text-5xl uppercase tracking-wider text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,1)]">Portfolio</h1>
          <p className="font-bold text-zinc-100 drop-shadow-[1px_1px_0px_rgba(0,0,0,0.4)]">
            Hidden shielded balances inside Veil.
          </p>
        </div>
      </div>

      {!connected ? (
        <Card className="veil-surface">
          <CardHeader>
            <CardTitle className="font-luckiest-guy text-xl sm:text-2xl uppercase tracking-wider">Connect wallet</CardTitle>
            <CardDescription>
              Connect your wallet to view private balances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectButton />
          </CardContent>
        </Card>
      ) : null}

      {connected && !isAuthenticated && !isAuthenticating ? (
        <Card className="veil-surface">
          <CardHeader>
            <CardTitle className="font-luckiest-guy text-xl sm:text-2xl uppercase tracking-wider">MagicBlock auth required</CardTitle>
            <CardDescription>
              Sign the challenge to read shielded balances from the Private ER.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-start gap-3">
            <AuthStatus />
          </CardContent>
        </Card>
      ) : null}

      {connected && isAuthenticating ? (
        <Card className="veil-surface">
          <CardContent className="py-6 text-sm text-muted-foreground">
            Authenticating with MagicBlock…
          </CardContent>
        </Card>
      ) : null}

      {connected && isAuthenticated ? (
        <>
          <div className="bg-white border-2 border-black px-3 py-1.5 rounded-full text-black font-luckiest-guy uppercase text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] max-w-fit hover:-rotate-1 active:translate-y-px transition-all">
            {clusterLabel()} · {publicKey ? truncateAddress(publicKey, 6) : ""}
          </div>
          <ShieldedBalances />
        </>
      ) : null}

      {connected && isAuthenticated && lastTxSig ? (
        <Card className="veil-surface">
          <CardHeader>
            <CardTitle className="font-luckiest-guy text-base uppercase tracking-wide">Last transaction</CardTitle>
            <CardDescription>Most recent Veil action this session.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap items-center gap-2">
            <code className="rounded bg-muted px-2 py-1 text-xs">
              {truncateAddress(lastTxSig, 8)}
            </code>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => window.open(txUrl(lastTxSig), "_blank")}
            >
              <ExternalLink className="mr-2 size-3.5" />
              Solscan
            </Button>
          </CardContent>
        </Card>
      ) : null}

      {connected && isAuthenticated ? (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => void refresh({ force: true })}
          >
            Refresh balances
          </Button>
          <Link href="/trade">
            <Button type="button">Open Trade</Button>
          </Link>
        </div>
      ) : null}
    </main>
  );
}