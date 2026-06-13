export type CanonicalSymbol = "SOL" | "USDC";

export type CanonicalToken = {
  symbol: CanonicalSymbol;
  mint: string;
  decimals: number;
};

export const TOKENS: Record<CanonicalSymbol, CanonicalToken> = {
  SOL: {
    symbol: "SOL",
    mint: "So11111111111111111111111111111111111111112",
    decimals: 9,
  },
  USDC: {
    symbol: "USDC",
    mint: "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU",
    decimals: 6,
  },
};

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