import { MAGICBLOCK_API, CLUSTER } from "@/lib/magicblock/config";

export type UnsignedTxResponse = {
  kind: string;
  version: string;
  transactionBase64: string;
  sendTo: "base" | "ephemeral";
  recentBlockhash: string;
  lastValidBlockHeight: number;
  instructionCount: number;
  requiredSigners: string[];
  validator?: string;
};

export async function buildShieldTx(args: {
  owner: string;
  mint: string;
  amount: number;
}): Promise<UnsignedTxResponse> {
  const res = await fetch(`${MAGICBLOCK_API}/v1/spl/deposit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      owner: args.owner,
      mint: args.mint,
      amount: args.amount,
      cluster: CLUSTER,
      initIfMissing: true,
      initVaultIfMissing: true,
      initAtasIfMissing: true,
      idempotent: true,
    }),
  });
  if (!res.ok) throw new Error(`Shield build failed: ${res.status}`);
  return res.json() as Promise<UnsignedTxResponse>;
}