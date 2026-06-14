"use client";

import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { PendingLabel } from "@/components/ui/pending-label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useBalances } from "@/hooks/use-balances";
import { useMagicBlockAuth } from "@/hooks/use-magicblock-auth";
import { useVeilTx } from "@/hooks/use-veil-tx";
import { parseAmountToNumber } from "@/lib/magicblock/amount";
import { buildUnshieldTx } from "@/lib/magicblock/unshield";
import {
  TOKENS,
  type CanonicalSymbol,
  toBaseUnits,
} from "@/lib/constants/tokens";
import { devnetTxUrl } from "@/lib/solana/explorer";

export function UnshieldForm() {
  const { connected, publicKey } = useWallet();
  const { isAuthenticated } = useMagicBlockAuth();
  const { publicBalances, privateBalances, isLoading, refresh } = useBalances();
  const { execute, isPending } = useVeilTx();

  const [token, setToken] = useState<CanonicalSymbol>("USDC");
  const [amount, setAmount] = useState("");

  const selected = TOKENS[token];
  const walletBalance = publicBalances[token];
  const shieldedBalance = privateBalances[token];

  async function handleUnshield() {
    if (!connected || !publicKey) {
      toast.error("Connect your wallet first");
      return;
    }
    if (!isAuthenticated) {
      toast.error("Complete MagicBlock auth first");
      return;
    }

    try {
      const baseUnits = parseAmountToNumber(amount, selected.decimals);
      const shieldedUnits = toBaseUnits(shieldedBalance, selected.decimals);

      if (BigInt(baseUnits) > shieldedUnits) {
        toast.error(`Insufficient shielded ${token}`);
        return;
      }

      const built = await buildUnshieldTx({
        owner: publicKey.toBase58(),
        mint: selected.mint,
        amount: baseUnits,
      });

      const sig = await execute(
        built.transactionBase64,
        built.sendTo,
        built.version === "v0" ? "v0" : "legacy",
      );

      toast.success(`Unshielded ${amount} ${token}`, {
        description: "Tokens settled back to your Solana wallet",
        action: {
          label: "View",
          onClick: () => window.open(devnetTxUrl(sig), "_blank"),
        },
      });

      setAmount("");
      await refresh({ force: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unshield transaction failed";
      if (message.toLowerCase().includes("user rejected")) {
        toast.error("Transaction cancelled");
        return;
      }
      toast.error(message);
    }
  }

  function handleMax() {
    setAmount(shieldedBalance === "0" ? "" : shieldedBalance);
  }

  return (
    <Card className="veil-surface">
      <CardHeader>
        <CardTitle className="font-luckiest-guy text-2xl uppercase tracking-wider">Unshield</CardTitle>
        <CardDescription className="font-semibold text-zinc-500">
          Withdraw {token} from the Private ER back to your wallet.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          {(Object.keys(TOKENS) as CanonicalSymbol[]).map((symbol) => (
            <Button
              key={symbol}
              type="button"
              size="sm"
              variant={token === symbol ? "default" : "outline"}
              onClick={() => setToken(symbol)}
            >
              {symbol}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          <label htmlFor="unshield-amount" className="font-luckiest-guy text-sm uppercase tracking-wider text-zinc-400">
            Amount
          </label>
          <div className="flex gap-2">
            <Input
              id="unshield-amount"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!connected || isPending || !isAuthenticated}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleMax}
              disabled={
                !connected || isLoading || isPending || !isAuthenticated
              }
            >
              Max
            </Button>
          </div>
        </div>

        <div className="rounded-xl border-2 border-black bg-zinc-50 p-4 text-sm font-semibold">
          <div className="flex justify-between">
            <span className="text-zinc-500">Shielded balance</span>
            <span className="text-emerald-600 font-bold">
              {isLoading ? "…" : `${shieldedBalance} ${token}`}
            </span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-zinc-500">Wallet balance</span>
            <span className="text-black font-bold">
              {isLoading ? "…" : `${walletBalance} ${token}`}
            </span>
          </div>
        </div>

        {!isAuthenticated && connected ? (
          <p className="text-xs font-semibold text-red-500">
            Complete MagicBlock auth to view shielded balances and unshield.
          </p>
        ) : null}

        <Button
          type="button"
          className="w-full"
          onClick={() => void handleUnshield()}
          disabled={
            !connected || !isAuthenticated || isPending || !amount
          }
        >
          <PendingLabel
            pending={isPending}
            pendingText="Unshielding…"
            idleText={`Unshield ${token}`}
          />
        </Button>
      </CardContent>
    </Card>
  );
}