"use client";

import { useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { VersionedTransaction } from "@solana/web3.js";

import { getStoredToken } from "@/lib/magicblock/auth";
import { decodeTransaction } from "@/lib/magicblock/tx";
import { sendSignedTransaction } from "@/lib/solana/send-transaction";
import { persistLastTxSig } from "@/lib/veil/session";

function serializeSigned(
  signed: ReturnType<typeof decodeTransaction>,
): string {
  const raw =
    signed instanceof VersionedTransaction
      ? signed.serialize()
      : signed.serialize();
  return Buffer.from(raw).toString("base64");
}

export function useVeilTx() {
  const wallet = useWallet();
  const [isPending, setIsPending] = useState(false);
  const [lastSig, setLastSig] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(
    async (
      transactionBase64: string,
      sendTo: "base" | "ephemeral",
      version: "legacy" | "v0" = "legacy",
    ) => {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Connect your wallet first");
      }

      setIsPending(true);
      setError(null);

      try {
        const tx = decodeTransaction(transactionBase64, version);
        const signed = await wallet.signTransaction(tx);
        const sig = await sendSignedTransaction({
          transactionBase64: serializeSigned(signed),
          sendTo,
          authToken: getStoredToken(),
        });
        setLastSig(sig);
        persistLastTxSig(sig);
        return sig;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Transaction failed";
        setError(message);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [wallet],
  );

  const executeSwap = useCallback(
    async (swapTransactionBase64: string) => {
      if (!wallet.publicKey || !wallet.signTransaction) {
        throw new Error("Connect your wallet first");
      }

      setIsPending(true);
      setError(null);

      try {
        const bytes = Buffer.from(swapTransactionBase64, "base64");
        const tx = VersionedTransaction.deserialize(bytes);
        const signed = await wallet.signTransaction(tx);
        const sig = await sendSignedTransaction({
          transactionBase64: serializeSigned(signed),
          sendTo: "base",
        });
        setLastSig(sig);
        persistLastTxSig(sig);
        return sig;
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Swap failed";
        setError(message);
        throw err;
      } finally {
        setIsPending(false);
      }
    },
    [wallet],
  );

  return {
    publicKey: wallet.publicKey?.toBase58() ?? null,
    connected: wallet.connected,
    execute,
    executeSwap,
    isPending,
    lastSig,
    error,
  };
}