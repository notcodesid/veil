import { PublicKey } from "@solana/web3.js";

import { CLUSTER, MAGICBLOCK_API } from "@/lib/magicblock/config";
import { getBaseConnection } from "@/lib/solana/connection";

export async function getPublicTokenBalance(
  owner: string,
  mint: string,
): Promise<string> {
  const connection = getBaseConnection();
  const accounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(owner),
    { mint: new PublicKey(mint) },
  );
  const balance = accounts.value[0]?.account.data.parsed.info.tokenAmount
    .amount as string | undefined;
  return balance ?? "0";
}

export type PrivateBalance = {
  address: string;
  mint: string;
  ata: string;
  location: "base" | "ephemeral";
  balance: string;
};

export async function getPrivateTokenBalance(args: {
  address: string;
  mint: string;
  token: string;
}): Promise<PrivateBalance> {
  const params = new URLSearchParams({
    address: args.address,
    mint: args.mint,
    cluster: CLUSTER,
  });
  const res = await fetch(
    `${MAGICBLOCK_API}/v1/spl/private-balance?${params}`,
    { headers: { Authorization: `Bearer ${args.token}` } },
  );
  if (res.status === 401) {
    throw new Error("AUTH_EXPIRED");
  }
  if (!res.ok) throw new Error(`Private balance failed: ${res.status}`);
  return res.json() as Promise<PrivateBalance>;
}