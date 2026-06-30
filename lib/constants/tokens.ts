import { IS_DEVNET } from "@/lib/magicblock/config";

export type CanonicalSymbol = "SOL" | "USDC";

/** Circle devnet faucet USDC — devnet shield/deposit only. */
export const DEVNET_USDC_MINT =
  "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";

/** Mainnet USDC — shield, swap, and Jupiter routes. */
export const MAINNET_USDC_MINT =
  "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";

const USDC_MINT = IS_DEVNET ? DEVNET_USDC_MINT : MAINNET_USDC_MINT;

export type CanonicalToken = {
  symbol: CanonicalSymbol;
  mint: string;
  swapMint: string;
  decimals: number;
};

export const TOKENS: Record<CanonicalSymbol, CanonicalToken> = {
  SOL: {
    symbol: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    swapMint: "So11111111111111111111111111111111111111112",
    decimals: 9,
  },
  USDC: {
    symbol: "USDC",
    mint: USDC_MINT,
    swapMint: IS_DEVNET ? MAINNET_USDC_MINT : USDC_MINT,
    decimals: 6,
  },
};

export function getWalletMint(symbol: CanonicalSymbol): string {
  return TOKENS[symbol].mint;
}

export function getSwapMint(symbol: CanonicalSymbol): string {
  return TOKENS[symbol].swapMint;
}

/** Devnet faucet USDC cannot be quoted or swapped via Jupiter. */
export function isSwapInputAllowed(
  symbol: CanonicalSymbol,
  cluster: string,
): boolean {
  return !(cluster === "devnet" && symbol === "USDC");
}

export function getDevnetSwapHint(): string {
  return "Jupiter does not list devnet USDC. Use SOL as input for private swaps; shield devnet USDC separately.";
}

export function toBaseUnits(amount: string, decimals: number): bigint {
  const [whole, fraction = ""] = amount.split(".");
  const padded = (fraction + "0".repeat(decimals)).slice(0, decimals);
  return BigInt(whole + padded);
}

export function fromBaseUnits(amount: bigint | string, decimals: number): string {
  const raw = typeof amount === "bigint" ? amount.toString() : amount;
  if (raw === "0" || raw === "") return "0";
  const padded = raw.padStart(decimals + 1, "0");
  const whole = padded.slice(0, -decimals) || "0";
  const fraction = padded.slice(-decimals).replace(/0+$/, "");
  return fraction ? `${whole}.${fraction}` : whole;
}