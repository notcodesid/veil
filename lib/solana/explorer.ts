export function devnetTxUrl(signature: string): string {
  return `https://solscan.io/tx/${signature}?cluster=devnet`;
}