import { CLUSTER, MAGICBLOCK_API } from "@/lib/magicblock/config";

export type TokenBalance = {
  address: string;
  mint: string;
  ata: string;
  location: "base" | "ephemeral";
  balance: string;
};

async function fetchTokenBalance(
  address: string,
  mint: string,
  authToken?: string,
): Promise<TokenBalance> {
  const params = new URLSearchParams({
    address,
    mint,
    cluster: CLUSTER,
  });
  const headers: HeadersInit = {};
  if (authToken) {
    headers.Authorization = `Bearer ${authToken}`;
  }

  const path = authToken ? "/v1/spl/private-balance" : "/v1/spl/balance";
  const res = await fetch(`${MAGICBLOCK_API}${path}?${params}`, { headers });

  if (authToken && res.status === 401) {
    throw new Error("AUTH_EXPIRED");
  }
  if (!res.ok) {
    throw new Error(`Balance failed (${res.status})`);
  }
  return res.json() as Promise<TokenBalance>;
}

/** Public wallet balance via MagicBlock (avoids browser RPC rate limits). */
export async function getPublicTokenBalance(
  owner: string,
  mint: string,
): Promise<string> {
  const data = await fetchTokenBalance(owner, mint);
  return data.balance;
}

export type PrivateBalance = TokenBalance;

export async function getPrivateTokenBalance(args: {
  address: string;
  mint: string;
  token: string;
}): Promise<PrivateBalance> {
  return fetchTokenBalance(args.address, args.mint, args.token);
}