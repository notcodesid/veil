import { toBaseUnits } from "@/lib/constants/tokens";

export function parseAmountToNumber(amount: string, decimals: number): number {
  const trimmed = amount.trim();
  if (!trimmed || Number.isNaN(Number(trimmed))) {
    throw new Error("Enter a valid amount");
  }

  const units = toBaseUnits(trimmed, decimals);
  if (units <= BigInt(0)) {
    throw new Error("Amount must be greater than zero");
  }

  const asNumber = Number(units);
  if (!Number.isSafeInteger(asNumber)) {
    throw new Error("Amount is too large");
  }

  return asNumber;
}