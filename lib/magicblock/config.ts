export const MAGICBLOCK_API =
  process.env.NEXT_PUBLIC_MAGICBLOCK_API ?? "https://payments.magicblock.app";

export const CLUSTER = process.env.NEXT_PUBLIC_CLUSTER ?? "mainnet";

export const IS_DEVNET = CLUSTER === "devnet";

export const SOLANA_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC ??
  (IS_DEVNET
    ? "https://api.devnet.solana.com"
    : "https://api.mainnet-beta.solana.com");

export const TEE_RPC =
  process.env.NEXT_PUBLIC_TEE_RPC ??
  (IS_DEVNET
    ? "https://devnet-tee.magicblock.app"
    : "https://tee.magicblock.app");

export function clusterLabel(): string {
  return IS_DEVNET ? "Devnet" : "Mainnet";
}