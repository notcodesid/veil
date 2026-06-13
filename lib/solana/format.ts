import type { PublicKey } from "@solana/web3.js";

export function truncateAddress(
  key: PublicKey | string,
  chars = 4,
): string {
  const address = typeof key === "string" ? key : key.toBase58();
  if (address.length <= chars * 2 + 1) return address;
  return `${address.slice(0, chars)}…${address.slice(-chars)}`;
}