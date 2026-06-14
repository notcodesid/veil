import { MAGICBLOCK_API } from "@/lib/magicblock/config";

function formatSwapApiError(status: number, detail: string, action: string): string {
  try {
    const body = JSON.parse(detail) as { error?: string; errorCode?: string };
    if (body.errorCode === "TOKEN_NOT_TRADABLE") {
      return "Devnet USDC is not tradable on Jupiter. Swap from SOL instead.";
    }
    if (body.error) return `${action} failed: ${body.error}`;
  } catch {
    // keep fallback below
  }
  return `${action} failed (${status}): ${detail}`;
}

export type SwapQuote = {
  inputMint: string;
  inAmount: string;
  outputMint: string;
  outAmount: string;
  otherAmountThreshold: string;
  swapMode: string;
  slippageBps: number;
  priceImpactPct: string;
  routePlan: unknown[];
};

export async function getSwapQuote(args: {
  inputMint: string;
  outputMint: string;
  amount: string;
  slippageBps?: number;
}): Promise<SwapQuote> {
  const params = new URLSearchParams({
    inputMint: args.inputMint,
    outputMint: args.outputMint,
    amount: args.amount,
    slippageBps: String(args.slippageBps ?? 50),
  });
  const res = await fetch(`${MAGICBLOCK_API}/v1/swap/quote?${params}`);
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(formatSwapApiError(res.status, detail, "Quote"));
  }
  return res.json() as Promise<SwapQuote>;
}

export type PrivateSwapResponse = {
  swapTransaction: string;
  lastValidBlockHeight?: number;
  privateTransfer?: {
    stashAta: string;
    hydraCrankPda: string;
    shuttleId: number;
  };
};

export async function buildPrivateSwap(args: {
  userPublicKey: string;
  quoteResponse: SwapQuote;
}): Promise<PrivateSwapResponse> {
  const res = await fetch(`${MAGICBLOCK_API}/v1/swap/swap`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userPublicKey: args.userPublicKey,
      quoteResponse: args.quoteResponse,
      visibility: "private",
      destination: args.userPublicKey,
      minDelayMs: "0",
      maxDelayMs: "60000",
      split: 1,
      wrapAndUnwrapSol: true,
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    throw new Error(formatSwapApiError(res.status, detail, "Private swap build"));
  }
  return res.json() as Promise<PrivateSwapResponse>;
}