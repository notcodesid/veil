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
import { buildShieldTx } from "@/lib/magicblock/shield";
import {
  TOKENS,
  type CanonicalSymbol,
  toBaseUnits,
} from "@/lib/constants/tokens";
import { devnetTxUrl } from "@/lib/solana/explorer";

export function ShieldForm() {
  const { connected, publicKey } = useWallet();
  const { isAuthenticated } = useMagicBlockAuth();
  const { publicBalances, privateBalances, isLoading, refresh } = useBalances();
  const { execute, isPending } = useVeilTx();

  const [token, setToken] = useState<CanonicalSymbol>("USDC");
  const [amount, setAmount] = useState("");

  const selected = TOKENS[token];
  const walletBalance = publicBalances[token];
  const shieldedBalance = privateBalances[token];

  async function handleShield() {
    if (!connected || !publicKey) {
      toast.error("Connect your wallet first");
      return;
    }

    try {
      const baseUnits = parseAmountToNumber(amount, selected.decimals);
      const walletUnits = toBaseUnits(walletBalance, selected.decimals);

      if (BigInt(baseUnits) > walletUnits) {
        toast.error(`Insufficient ${token} in wallet`);
        return;
      }

      const built = await buildShieldTx({
        owner: publicKey.toBase58(),
        mint: selected.mint,
        amount: baseUnits,
      });

      const sig = await execute(
        built.transactionBase64,
        built.sendTo,
        built.version === "v0" ? "v0" : "legacy",
      );

      toast.success(`Shielded ${amount} ${token}`, {
        description: "Tokens moved into the Private ER",
        action: {
          label: "View",
          onClick: () => window.open(devnetTxUrl(sig), "_blank"),
        },
      });

      setAmount("");
      await refresh({ force: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Shield transaction failed";
      if (message.toLowerCase().includes("user rejected")) {
        toast.error("Transaction cancelled");
        return;
      }
      toast.error(message);
    }
  }

  function handleMax() {
    setAmount(walletBalance === "0" ? "" : walletBalance);
  }

  return (
    <Card className="veil-surface">
      <CardHeader>
        <CardTitle className="font-luckiest-guy text-2xl uppercase tracking-wider">Shield</CardTitle>
        <CardDescription className="font-semibold text-zinc-500">
          Deposit {token} from your wallet into the Private ER.
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
          <label htmlFor="shield-amount" className="font-luckiest-guy text-sm uppercase tracking-wider text-zinc-400">
            Amount
          </label>
          <div className="flex gap-2">
            <Input
              id="shield-amount"
              type="text"
              inputMode="decimal"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!connected || isPending}
            />
            <Button
              type="button"
              variant="outline"
              onClick={handleMax}
              disabled={!connected || isLoading || isPending}
            >
              Max
            </Button>
          </div>
        </div>

        <div className="rounded-xl border-2 border-black bg-zinc-50 p-4 text-sm font-semibold">
          <div className="flex justify-between">
            <span className="text-zinc-500">Wallet balance</span>
            <span className="text-black font-bold">
              {isLoading ? "…" : `${walletBalance} ${token}`}
            </span>
          </div>
          <div className="mt-2 flex justify-between">
            <span className="text-zinc-500">Shielded balance</span>
            <span className="text-emerald-600 font-bold">
              {isLoading ? "…" : `${shieldedBalance} ${token}`}
            </span>
          </div>
        </div>

        {!isAuthenticated && connected ? (
          <p className="text-xs text-muted-foreground">
            Complete MagicBlock auth to view shielded balances after deposit.
          </p>
        ) : null}

        <Button
          type="button"
          className="w-full"
          onClick={() => void handleShield()}
          disabled={!connected || isPending || !amount}
        >
          <PendingLabel
            pending={isPending}
            pendingText="Shielding…"
            idleText={`Shield ${token}`}
          />
        </Button>
      </CardContent>
    </Card>
  );
}