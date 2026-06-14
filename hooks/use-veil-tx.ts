"use client";

import { useCallback, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { Connection, VersionedTransaction } from "@solana/web3.js";

import { getStoredToken } from "@/lib/magicblock/auth";
import {
  decodeTransaction,
  getRpcUrl,
  sendAndConfirm,
} from "@/lib/magicblock/tx";
import { getBaseConnection } from "@/lib/solana/connection";
import { persistLastTxSig } from "@/lib/veil/session";

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
        const rpc = getRpcUrl(sendTo, getStoredToken());
        const connection = new Connection(rpc, "confirmed");
        const sig = await sendAndConfirm(connection, signed);
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
        const connection = getBaseConnection();
        const sig = await sendAndConfirm(connection, signed);
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