"use client";

// Phase 2+ — shared sign + send helper wired to wallet adapter
export function useVeilTx() {
  return {
    execute: async (_transactionBase64: string, _sendTo: "base" | "ephemeral") => {
      throw new Error("Transaction execution not implemented yet (Phase 2)");
    },
    isPending: false,
    lastSig: null as string | null,
    error: null as string | null,
  };
}