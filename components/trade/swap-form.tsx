"use client";

import { useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { ArrowLeftRight } from "lucide-react";
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
import { usePriceStream } from "@/hooks/use-price-stream";
import { useVeilTx } from "@/hooks/use-veil-tx";
import { parseAmountToNumber } from "@/lib/magicblock/amount";
import { CLUSTER } from "@/lib/magicblock/config";
import {
  buildPrivateSwap,
  DEFAULT_SWAP_SLIPPAGE_BPS,
  getSwapQuote,
} from "@/lib/magicblock/swap";
import { formatPercent } from "@/lib/format/display";
import {
  TOKENS,
  type CanonicalSymbol,
  getDevnetSwapHint,
  getSwapMint,
  isSwapInputAllowed,
  toBaseUnits,
} from "@/lib/constants/tokens";
import { txUrl } from "@/lib/solana/explorer";

type SwapFormProps = {
  streamEnabled?: boolean;
};

export function SwapForm({ streamEnabled = true }: SwapFormProps) {
  const { connected, publicKey } = useWallet();
  const { publicBalances, privateBalances, isLoading: balancesLoading, refresh } =
    useBalances();
  const { executeSwap, isPending } = useVeilTx();

  const [inputToken, setInputToken] = useState<CanonicalSymbol>("SOL");
  const [outputToken, setOutputToken] = useState<CanonicalSymbol>("USDC");
  const [amount, setAmount] = useState("");

  const input = TOKENS[inputToken];
  const output = TOKENS[outputToken];
  const inputSwapAllowed = isSwapInputAllowed(inputToken, CLUSTER);
  const devnetSwapHint = CLUSTER === "devnet" ? getDevnetSwapHint() : null;

  const amountBaseUnits = useMemo(() => {
    if (!amount.trim()) return null;
    try {
      return String(parseAmountToNumber(amount, input.decimals));
    } catch {
      return null;
    }
  }, [amount, input.decimals]);

  const SOL_FEE_RESERVE = 0.003;

  const {
    quote,
    rateLabel,
    estimatedOut,
    secondsAgo,
    isStale,
    isLoading,
    slippageBps,
    error: quoteError,
    refresh: refreshQuote,
  } = usePriceStream({
    inputMint: getSwapMint(inputToken),
    outputMint: getSwapMint(outputToken),
    inputSymbol: inputToken,
    outputSymbol: outputToken,
    amountBaseUnits,
    enabled:
      streamEnabled && inputSwapAllowed && Boolean(amountBaseUnits),
  });

  function selectInputToken(symbol: CanonicalSymbol) {
    if (!isSwapInputAllowed(symbol, CLUSTER)) {
      toast.error("Devnet USDC cannot be swapped via Jupiter", {
        description: "Use SOL as input, or shield USDC on the Deposit tab.",
      });
      return;
    }
    if (symbol === outputToken) flipPair();
    else setInputToken(symbol);
  }

  function flipPair() {
    const nextInput = outputToken;
    const nextOutput = inputToken;
    if (!isSwapInputAllowed(nextInput, CLUSTER)) {
      toast.error("Devnet USDC cannot be used as swap input on Jupiter");
      return;
    }
    setInputToken(nextInput);
    setOutputToken(nextOutput);
    setAmount("");
  }

  function handleMax() {
    const balance = Number(publicBalances[inputToken]);
    if (!Number.isFinite(balance) || balance <= 0) {
      setAmount("");
      return;
    }
    if (inputToken === "SOL") {
      const max = Math.max(0, balance - SOL_FEE_RESERVE);
      setAmount(max > 0 ? String(max) : "");
      return;
    }
    setAmount(publicBalances[inputToken]);
  }

  async function handleSwap() {
    if (!connected || !publicKey) {
      toast.error("Connect your wallet first");
      return;
    }
    try {
      const baseUnits = parseAmountToNumber(amount, input.decimals);
      const walletUnits = toBaseUnits(publicBalances[inputToken], input.decimals);
      if (BigInt(baseUnits) > walletUnits) {
        toast.error(`Insufficient ${inputToken} in wallet`);
        return;
      }

      if (inputToken === "SOL") {
        const reserveUnits = toBaseUnits(String(SOL_FEE_RESERVE), TOKENS.SOL.decimals);
        if (BigInt(baseUnits) > walletUnits - reserveUnits) {
          toast.error(`Leave at least ${SOL_FEE_RESERVE} SOL for fees`, {
            description: "Private swaps need extra SOL for Jupiter + network fees.",
          });
          return;
        }
      }

      const freshQuote = await getSwapQuote({
        inputMint: getSwapMint(inputToken),
        outputMint: getSwapMint(outputToken),
        amount: String(baseUnits),
        slippageBps: DEFAULT_SWAP_SLIPPAGE_BPS,
      });
      void refreshQuote();

      const built = await buildPrivateSwap({
        userPublicKey: publicKey.toBase58(),
        quoteResponse: freshQuote,
      });

      const sig = await executeSwap(built.swapTransaction);

      toast.success(`Swapped ${inputToken} → ${outputToken}`, {
        description: "Private execution — no public order flow",
        action: {
          label: "View",
          onClick: () => window.open(txUrl(sig), "_blank"),
        },
      });

      setAmount("");
      await refresh({ force: true });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Private swap failed";
      if (message.toLowerCase().includes("user rejected")) {
        toast.error("Transaction cancelled");
        return;
      }
      if (
        message.toLowerCase().includes("slippage") ||
        message.toLowerCase().includes("0x1771")
      ) {
        toast.error("Price moved — try again", {
          description:
            "Quote was stale or volatility exceeded slippage. Use a smaller amount or retry.",
        });
        return;
      }
      toast.error(message);
    }
  }

  return (
    <Card className="veil-surface">
      <CardHeader>
        <CardTitle className="font-luckiest-guy text-2xl uppercase tracking-wider">Swap</CardTitle>
        <CardDescription className="font-semibold text-zinc-500">
          Live quotes with private execution (`visibility: private`).
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {devnetSwapHint ? (
          <p className="rounded-xl border-2 border-black bg-amber-100 px-3 py-2.5 text-xs font-semibold text-amber-900 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
            {devnetSwapHint}
          </p>
        ) : null}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-2">
            {(Object.keys(TOKENS) as CanonicalSymbol[]).map((symbol) => (
              <Button
                key={`in-${symbol}`}
                type="button"
                size="sm"
                variant={inputToken === symbol ? "default" : "outline"}
                disabled={!isSwapInputAllowed(symbol, CLUSTER)}
                onClick={() => selectInputToken(symbol)}
              >
                {symbol}
              </Button>
            ))}
          </div>
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            onClick={flipPair}
            aria-label="Flip pair"
          >
            <ArrowLeftRight className="size-4" />
          </Button>
          <div className="flex gap-2">
            {(Object.keys(TOKENS) as CanonicalSymbol[]).map((symbol) => (
              <Button
                key={`out-${symbol}`}
                type="button"
                size="sm"
                variant={outputToken === symbol ? "default" : "outline"}
                onClick={() => {
                  if (symbol === inputToken) flipPair();
                  else setOutputToken(symbol);
                }}
              >
                {symbol}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="swap-amount" className="font-luckiest-guy text-sm uppercase tracking-wider text-zinc-400">
            From amount ({inputToken})
          </label>
          <div className="flex gap-2">
            <Input
              id="swap-amount"
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
              disabled={!connected || balancesLoading || isPending}
            >
              Max
            </Button>
          </div>
          <p className="text-xs font-semibold text-zinc-500">
            Wallet: {publicBalances[inputToken]} {inputToken} · Shielded:{" "}
            {privateBalances[inputToken]} {inputToken}
          </p>
        </div>

        <div className="rounded-xl border-2 border-black bg-zinc-50 p-4 text-sm font-semibold">
          <div className="flex justify-between gap-4">
            <span className="text-zinc-500">Rate</span>
            <span className="text-right text-black font-bold">
              {isLoading && !rateLabel
                ? "Updating…"
                : (rateLabel ?? "Enter an amount")}
            </span>
          </div>
          <div className="mt-2 flex justify-between gap-4">
            <span className="text-zinc-500">Estimated output</span>
            <span className="text-right text-black font-bold">
              {estimatedOut ? `${estimatedOut} ${outputToken}` : "--"}
            </span>
          </div>
          {quote ? (
            <>
              <div className="mt-2 flex justify-between gap-4">
                <span className="text-zinc-500">Price impact</span>
                <span className="text-right text-black font-bold">
                  {formatPercent(quote.priceImpactPct)}
                </span>
              </div>
              <div className="mt-2 flex justify-between gap-4">
                <span className="text-zinc-500">Max slippage</span>
                <span className="text-right text-black font-bold">
                  {(slippageBps / 100).toFixed(2)}%
                </span>
              </div>
            </>
          ) : null}
          {secondsAgo !== null ? (
            <p className="mt-2 text-xs font-semibold text-zinc-400">
              Updated {secondsAgo}s ago{isStale ? " · stale" : ""}
            </p>
          ) : null}
          {quoteError ? (
            <p className="mt-2 text-xs font-bold text-red-500">{quoteError}</p>
          ) : null}
        </div>

        <Button
          type="button"
          className="w-full"
          onClick={() => void handleSwap()}
          disabled={
            !connected ||
            isPending ||
            !amount ||
            !quote ||
            !inputSwapAllowed
          }
        >
          <PendingLabel
            pending={isPending}
            pendingText="Swapping…"
            idleText="Execute Private Swap"
          />
        </Button>
      </CardContent>
    </Card>
  );
}