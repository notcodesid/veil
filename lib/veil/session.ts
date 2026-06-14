export const VEIL_LAST_TX_KEY = "veil:lastTxSig";
export const VEIL_BALANCES_EVENT = "veil:balances-invalidated";

export function persistLastTxSig(sig: string) {
  if (typeof window === "undefined") return;
  sessionStorage.setItem(VEIL_LAST_TX_KEY, sig);
  window.dispatchEvent(new Event(VEIL_BALANCES_EVENT));
}

export function getLastTxSig(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(VEIL_LAST_TX_KEY);
}