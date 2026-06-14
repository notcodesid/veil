import { Connection } from "@solana/web3.js";

import { SOLANA_RPC } from "@/lib/magicblock/config";

let cached: Connection | null = null;

export function getBaseConnection(): Connection {
  if (!cached) {
    cached = new Connection(SOLANA_RPC, "confirmed");
  }
  return cached;
}