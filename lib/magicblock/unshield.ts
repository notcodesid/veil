import { MAGICBLOCK_API, CLUSTER } from "@/lib/magicblock/config";
import type { UnsignedTxResponse } from "@/lib/magicblock/shield";

export async function buildUnshieldTx(args: {
  owner: string;
  mint: string;
  amount: number;
}): Promise<UnsignedTxResponse> {
  const res = await fetch(`${MAGICBLOCK_API}/v1/spl/withdraw`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      owner: args.owner,
      mint: args.mint,
      amount: args.amount,
      cluster: CLUSTER,
      idempotent: true,
    }),
  });
  if (!res.ok) throw new Error(`Unshield build failed: ${res.status}`);
  return res.json() as Promise<UnsignedTxResponse>;
}