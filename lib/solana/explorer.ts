import { IS_DEVNET } from "@/lib/magicblock/config";

export function txUrl(signature: string): string {
  const base = `https://solscan.io/tx/${signature}`;
  return IS_DEVNET ? `${base}?cluster=devnet` : base;
}

/** @deprecated Use txUrl */
export function devnetTxUrl(signature: string): string {
  return txUrl(signature);
}