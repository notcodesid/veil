import bs58 from "bs58";

import { CLUSTER, MAGICBLOCK_API } from "@/lib/magicblock/config";

const TOKEN_KEY = "veil:magicblock:token";
const PUBKEY_KEY = "veil:magicblock:pubkey";

export class MagicBlockAuthError extends Error {
  constructor(
    message: string,
    readonly status?: number,
  ) {
    super(message);
    this.name = "MagicBlockAuthError";
  }
}

export async function getChallenge(pubkey: string): Promise<string> {
  const params = new URLSearchParams({ pubkey, cluster: CLUSTER });
  const res = await fetch(`${MAGICBLOCK_API}/v1/spl/challenge?${params}`);
  if (!res.ok) {
    throw new MagicBlockAuthError(`Challenge failed: ${res.status}`, res.status);
  }
  const data = (await res.json()) as { challenge: string };
  return data.challenge;
}

export async function login(
  pubkey: string,
  challenge: string,
  signature: string,
): Promise<string> {
  const res = await fetch(`${MAGICBLOCK_API}/v1/spl/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      pubkey,
      challenge,
      signature,
      cluster: CLUSTER,
    }),
  });
  if (!res.ok) {
    throw new MagicBlockAuthError(`Login failed: ${res.status}`, res.status);
  }
  const data = (await res.json()) as { token: string };
  return data.token;
}

export async function authenticateWallet(args: {
  publicKey: string;
  signMessage: (message: Uint8Array) => Promise<Uint8Array>;
}): Promise<string> {
  const challenge = await getChallenge(args.publicKey);
  const message = new TextEncoder().encode(challenge);
  const signatureBytes = await args.signMessage(message);
  const signature = bs58.encode(signatureBytes);
  const token = await login(args.publicKey, challenge, signature);
  setStoredToken(token, args.publicKey);
  return token;
}

export function getStoredToken(pubkey?: string): string | null {
  if (typeof window === "undefined") return null;
  const token = localStorage.getItem(TOKEN_KEY);
  const storedPubkey = localStorage.getItem(PUBKEY_KEY);
  if (!token || !storedPubkey) return null;
  if (pubkey && storedPubkey !== pubkey) return null;
  return token;
}

export function setStoredToken(token: string, pubkey: string): void {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(PUBKEY_KEY, pubkey);
}

export function clearStoredToken(): void {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(PUBKEY_KEY);
}

export function getAuthHeader(): Record<string, string> | undefined {
  const token = getStoredToken();
  if (!token) return undefined;
  return { Authorization: `Bearer ${token}` };
}