export function formatBalance(value: string | number): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "--";
  if (Object.is(n, -0) || n === 0) return "0";
  return formatAmount(n);
}

export function formatAmount(value: number): string {
  if (!Number.isFinite(value)) return "--";
  if (value === 0) return "0";
  if (value >= 1) {
    return value.toLocaleString(undefined, { maximumFractionDigits: 6 });
  }
  return value.toLocaleString(undefined, { maximumSignificantDigits: 6 });
}

export function formatPercent(value: string | number): string {
  const n = typeof value === "string" ? Number(value) : value;
  if (!Number.isFinite(n)) return "--";
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })}%`;
}