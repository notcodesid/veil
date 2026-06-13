import {
  Connection,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

import { SOLANA_RPC, TEE_RPC } from "@/lib/magicblock/config";

export function getRpcUrl(
  sendTo: "base" | "ephemeral",
  authToken?: string | null,
): string {
  if (sendTo === "base") return SOLANA_RPC;
  return authToken ? `${TEE_RPC}?token=${authToken}` : TEE_RPC;
}

export function decodeTransaction(
  transactionBase64: string,
  version: "legacy" | "v0" = "legacy",
): Transaction | VersionedTransaction {
  const bytes = Buffer.from(transactionBase64, "base64");
  if (version === "v0") {
    return VersionedTransaction.deserialize(bytes);
  }
  return Transaction.from(bytes);
}

export async function sendAndConfirm(
  connection: Connection,
  signed: Transaction | VersionedTransaction,
): Promise<string> {
  const raw =
    signed instanceof VersionedTransaction
      ? signed.serialize()
      : signed.serialize();
  const sig = await connection.sendRawTransaction(raw, {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  });
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}