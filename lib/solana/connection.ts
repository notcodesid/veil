import { Connection } from "@solana/web3.js";

import { SOLANA_RPC } from "@/lib/magicblock/config";

export function getBaseConnection(): Connection {
  return new Connection(SOLANA_RPC, "confirmed");
}