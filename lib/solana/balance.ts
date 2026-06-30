import { getPublicTokenBalance } from "@/lib/magicblock/balance";
import { TOKENS } from "@/lib/constants/tokens";

/**
 * Native SOL lamports (what Phantom shows). Browser RPC calls often 403 —
 * fetch via server route, then fall back to MagicBlock WSOL ATA balance.
 */
export async function getNativeSolLamports(owner: string): Promise<string> {
  try {
    const res = await fetch(
      `/api/native-sol?address=${encodeURIComponent(owner)}`,
    );
    if (res.ok) {
      const data = (await res.json()) as { lamports: string };
      if (data.lamports) return data.lamports;
    }
  } catch {
    // fall through to WSOL balance
  }

  return getPublicTokenBalance(owner, TOKENS.SOL.mint);
}