#!/usr/bin/env node
/**
 * Devnet E2E verification — requires a funded devnet keypair.
 * Usage: KEYPAIR_PATH=/path/to/keypair.json node scripts/verify-e2e.mjs
 */

import fs from "node:fs";
import bs58 from "bs58";
import nacl from "tweetnacl";
import {
  Connection,
  Keypair,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";

const API = process.env.NEXT_PUBLIC_MAGICBLOCK_API ?? "https://payments.magicblock.app";
const CLUSTER = process.env.NEXT_PUBLIC_CLUSTER ?? "devnet";
const SOLANA_RPC =
  process.env.NEXT_PUBLIC_SOLANA_RPC ?? "https://api.devnet.solana.com";
const TEE_RPC =
  process.env.NEXT_PUBLIC_TEE_RPC ?? "https://devnet-tee.magicblock.app";
const KEYPAIR_PATH =
  process.env.KEYPAIR_PATH ??
  "/Users/siddharth/projects/kirat-bootcamp/programs/my-new-keypair.json";

const SOL_MINT = "So11111111111111111111111111111111111111112";
const SHIELD_LAMPORTS = 1_000_000; // 0.001 SOL

function loadKeypair(path) {
  const raw = JSON.parse(fs.readFileSync(path, "utf8"));
  return Keypair.fromSecretKey(Uint8Array.from(raw));
}

async function apiGet(path, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(`${API}${path}`, { headers });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* ignore */
  }
  return { res, text, json };
}

async function apiPost(path, body, token) {
  const headers = { "Content-Type": "application/json" };
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch {
    /* ignore */
  }
  return { res, text, json };
}

function rpcUrl(sendTo, token) {
  if (sendTo === "base") return SOLANA_RPC;
  return token ? `${TEE_RPC}?token=${token}` : TEE_RPC;
}

async function signAndSend(connection, keypair, built) {
  const bytes = Buffer.from(built.transactionBase64, "base64");
  const tx =
    built.version === "v0"
      ? VersionedTransaction.deserialize(bytes)
      : Transaction.from(bytes);

  if (tx instanceof VersionedTransaction) {
    tx.sign([keypair]);
  } else {
    tx.partialSign(keypair);
  }

  const raw =
    tx instanceof VersionedTransaction ? tx.serialize() : tx.serialize();
  const sig = await connection.sendRawTransaction(raw, {
    skipPreflight: false,
    preflightCommitment: "confirmed",
  });
  await connection.confirmTransaction(sig, "confirmed");
  return sig;
}

async function authenticate(keypair) {
  const owner = keypair.publicKey.toBase58();
  const challengeRes = await apiGet(
    `/v1/spl/challenge?pubkey=${owner}&cluster=${CLUSTER}`,
  );
  if (!challengeRes.json?.challenge) {
    throw new Error(`Challenge failed: ${challengeRes.text}`);
  }

  const message = new TextEncoder().encode(challengeRes.json.challenge);
  const signature = nacl.sign.detached(message, keypair.secretKey);

  const loginRes = await apiPost("/v1/spl/login", {
    pubkey: owner,
    challenge: challengeRes.json.challenge,
    signature: bs58.encode(signature),
    cluster: CLUSTER,
  });

  if (!loginRes.json?.token) {
    throw new Error(`Login failed: ${loginRes.text}`);
  }

  return loginRes.json.token;
}

async function main() {
  console.log("\nVeil devnet E2E verification\n");

  const keypair = loadKeypair(KEYPAIR_PATH);
  const owner = keypair.publicKey.toBase58();
  console.log(`Wallet: ${owner}`);

  const baseConn = new Connection(SOLANA_RPC, "confirmed");
  const solBefore = await baseConn.getBalance(keypair.publicKey);
  console.log(`SOL balance: ${solBefore / 1e9}\n`);

  if (solBefore < 50_000_000) {
    console.error("Need at least 0.05 SOL on devnet for fees + shield test.");
    process.exit(1);
  }

  // 1. Auth
  console.log("1. MagicBlock auth…");
  const token = await authenticate(keypair);
  console.log("   ✅ Bearer token received\n");

  // 2. Public balance via API
  console.log("2. Public balance API…");
  const pubBal = await apiGet(
    `/v1/spl/balance?address=${owner}&mint=${SOL_MINT}&cluster=${CLUSTER}`,
  );
  if (!pubBal.json?.balance) throw new Error(`Public balance failed: ${pubBal.text}`);
  console.log(`   ✅ Public SOL balance: ${pubBal.json.balance} lamports\n`);

  // 3. Shield
  console.log(`3. Shield ${SHIELD_LAMPORTS} lamports SOL…`);
  const deposit = await apiPost("/v1/spl/deposit", {
    owner,
    mint: SOL_MINT,
    amount: SHIELD_LAMPORTS,
    cluster: CLUSTER,
    initIfMissing: true,
    initVaultIfMissing: true,
    initAtasIfMissing: true,
    idempotent: true,
  });
  if (!deposit.json?.transactionBase64) {
    throw new Error(`Deposit build failed: ${deposit.text}`);
  }

  const shieldConn = new Connection(
    rpcUrl(deposit.json.sendTo, token),
    "confirmed",
  );
  const shieldSig = await signAndSend(shieldConn, keypair, deposit.json);
  console.log(`   ✅ Shield confirmed: ${shieldSig}\n`);

  // 4. Private balance
  console.log("4. Private balance after shield…");
  await new Promise((r) => setTimeout(r, 3000));
  const privBal = await apiGet(
    `/v1/spl/private-balance?address=${owner}&mint=${SOL_MINT}&cluster=${CLUSTER}`,
    token,
  );
  if (!privBal.json?.balance) {
    throw new Error(`Private balance failed: ${privBal.text}`);
  }
  const shielded = BigInt(privBal.json.balance);
  console.log(`   ✅ Shielded SOL: ${privBal.json.balance} lamports\n`);
  if (shielded <= 0n) {
    throw new Error("Shielded balance did not increase after deposit");
  }

  // 5. Unshield
  console.log(`5. Unshield ${SHIELD_LAMPORTS} lamports SOL…`);
  const withdraw = await apiPost("/v1/spl/withdraw", {
    owner,
    mint: SOL_MINT,
    amount: SHIELD_LAMPORTS,
    cluster: CLUSTER,
    initIfMissing: true,
    initAtasIfMissing: true,
    idempotent: true,
  });
  if (!withdraw.json?.transactionBase64) {
    throw new Error(`Withdraw build failed: ${withdraw.text}`);
  }

  const unshieldConn = new Connection(
    rpcUrl(withdraw.json.sendTo, token),
    "confirmed",
  );
  const unshieldSig = await signAndSend(unshieldConn, keypair, withdraw.json);
  console.log(`   ✅ Unshield confirmed: ${unshieldSig}\n`);

  // 6. Swap quote + build (no submit — devnet execution often mismatches Jupiter mainnet routes)
  console.log("6. Private swap quote + tx build (build only)…");
  const quoteParams = new URLSearchParams({
    inputMint: SOL_MINT,
    outputMint: "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v",
    amount: "100000000",
    slippageBps: "50",
  });
  const quoteRes = await apiGet(`/v1/swap/quote?${quoteParams}`);
  if (!quoteRes.json?.outAmount) {
    throw new Error(`Quote failed: ${quoteRes.text}`);
  }
  const swapBuild = await apiPost("/v1/swap/swap", {
    userPublicKey: owner,
    quoteResponse: quoteRes.json,
    visibility: "private",
    destination: owner,
    minDelayMs: "0",
    maxDelayMs: "60000",
    split: 1,
    wrapAndUnwrapSol: true,
  });
  if (!swapBuild.json?.swapTransaction) {
    throw new Error(`Swap build failed: ${swapBuild.text}`);
  }
  console.log("   ✅ Private swap tx builds successfully");
  console.log("   ℹ️  Swap execution on devnet not submitted (Jupiter routes are mainnet)\n");

  console.log("--- E2E PASSED: auth, shield, private balance, unshield, swap build ---\n");
}

main().catch((err) => {
  console.error("\n❌ E2E FAILED:", err.message ?? err);
  process.exit(1);
});