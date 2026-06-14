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
import { devnetTxUrl } from "@/lib/solana/explorer";
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
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
          <p className="text-sm text-muted-foreground">
            Hidden shielded balances inside Veil.
          </p>
        </div>
        <ConnectButton />
      </div>

      {!connected ? (
        <Card>
          <CardHeader>
            <CardTitle>Connect wallet</CardTitle>
            <CardDescription>
              Connect your devnet wallet to view private balances.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ConnectButton />
          </CardContent>
        </Card>
      ) : null}

      {connected && !isAuthenticated && !isAuthenticating ? (
        <Card>
          <CardHeader>
            <CardTitle>MagicBlock auth required</CardTitle>
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
        <Card>
          <CardContent className="py-6 text-sm text-muted-foreground">
            Authenticating with MagicBlock…
          </CardContent>
        </Card>
      ) : null}

      {connected && isAuthenticated ? (
        <>
          <p className="text-xs text-muted-foreground">
            Devnet · {publicKey ? truncateAddress(publicKey, 6) : ""}
          </p>
          <ShieldedBalances />
        </>
      ) : null}

      {connected && isAuthenticated && lastTxSig ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Last transaction</CardTitle>
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
              onClick={() => window.open(devnetTxUrl(lastTxSig), "_blank")}
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