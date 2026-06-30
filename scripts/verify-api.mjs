#!/usr/bin/env node
/**
 * Pre-deploy API smoke test — no wallet required.
 * Run: node scripts/verify-api.mjs
 */

const API = process.env.NEXT_PUBLIC_MAGICBLOCK_API ?? "https://payments.magicblock.app";
const CLUSTER = process.env.NEXT_PUBLIC_CLUSTER ?? "devnet";
const TEST_PUBKEY = "3rXKwQ1kpjBd5tdcco32qsvqUh1BnZjcYnS5kYrP7AYE";
const SOL_MINT = "So11111111111111111111111111111111111111112";
const USDC_SWAP_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const DEVNET_USDC_MINT = "4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU";
const MAINNET_USDC_MINT = "EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v";
const USDC_MINT = CLUSTER === "devnet" ? DEVNET_USDC_MINT : MAINNET_USDC_MINT;

const results = [];

function pass(name, detail = "") {
  results.push({ name, ok: true, detail });
  console.log(`✅ ${name}${detail ? ` — ${detail}` : ""}`);
}

function fail(name, detail = "") {
  results.push({ name, ok: false, detail });
  console.error(`❌ ${name}${detail ? ` — ${detail}` : ""}`);
}

async function get(path) {
  const res = await fetch(`${API}${path}`);
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { res, text, json };
}

async function post(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = null;
  }
  return { res, text, json };
}

async function main() {
  console.log(`\nVeil API smoke test`);
  console.log(`API: ${API}`);
  console.log(`Cluster: ${CLUSTER}\n`);

  // Health (optional — path may vary by API version)
  try {
    const { res } = await get("/health");
    if (res.ok) pass("Health", `HTTP ${res.status}`);
    else console.log(`ℹ️  Health endpoint skipped (HTTP ${res.status})`);
  } catch (e) {
    console.log(`ℹ️  Health endpoint skipped (${e.message})`);
  }

  // Challenge
  const challengeRes = await get(
    `/v1/spl/challenge?pubkey=${TEST_PUBKEY}&cluster=${CLUSTER}`,
  );
  if (challengeRes.res.ok && challengeRes.json?.challenge) {
    pass("Auth challenge", "returns challenge string");
  } else {
    fail("Auth challenge", `${challengeRes.res.status}: ${challengeRes.text.slice(0, 120)}`);
  }

  // Public balance
  const balRes = await get(
    `/v1/spl/balance?address=${TEST_PUBKEY}&mint=${SOL_MINT}&cluster=${CLUSTER}`,
  );
  if (balRes.res.ok && balRes.json?.balance !== undefined) {
    pass("Public balance", `SOL balance field present`);
  } else {
    fail("Public balance", `${balRes.res.status}: ${balRes.text.slice(0, 120)}`);
  }

  // Shield tx build
  const depositRes = await post("/v1/spl/deposit", {
    owner: TEST_PUBKEY,
    mint: USDC_MINT,
    amount: 1,
    cluster: CLUSTER,
    initIfMissing: true,
    initVaultIfMissing: true,
    initAtasIfMissing: true,
    idempotent: true,
  });
  if (
    depositRes.res.ok &&
    depositRes.json?.transactionBase64 &&
    depositRes.json?.sendTo
  ) {
    pass(
      "Shield tx build",
      `sendTo=${depositRes.json.sendTo}, version=${depositRes.json.version ?? "legacy"}`,
    );
  } else {
    fail("Shield tx build", `${depositRes.res.status}: ${depositRes.text.slice(0, 200)}`);
  }

  // Unshield tx build
  const withdrawRes = await post("/v1/spl/withdraw", {
    owner: TEST_PUBKEY,
    mint: USDC_MINT,
    amount: 1,
    cluster: CLUSTER,
    initIfMissing: true,
    initAtasIfMissing: true,
    idempotent: true,
  });
  if (
    withdrawRes.res.ok &&
    withdrawRes.json?.transactionBase64 &&
    withdrawRes.json?.sendTo
  ) {
    pass(
      "Unshield tx build",
      `sendTo=${withdrawRes.json.sendTo}`,
    );
  } else {
    fail("Unshield tx build", `${withdrawRes.res.status}: ${withdrawRes.text.slice(0, 200)}`);
  }

  // Swap quote
  const quoteParams = new URLSearchParams({
    inputMint: SOL_MINT,
    outputMint: USDC_SWAP_MINT,
    amount: "1000000000",
    slippageBps: "50",
  });
  const quoteRes = await get(`/v1/swap/quote?${quoteParams}`);
  if (quoteRes.res.ok && quoteRes.json?.outAmount) {
    pass("Swap quote", `1 SOL ≈ ${Number(quoteRes.json.outAmount) / 1e6} USDC`);
  } else {
    fail("Swap quote", `${quoteRes.res.status}: ${quoteRes.text.slice(0, 200)}`);
  }

  // Private swap build (needs quote)
  if (quoteRes.json) {
    const swapRes = await post("/v1/swap/swap", {
      userPublicKey: TEST_PUBKEY,
      quoteResponse: quoteRes.json,
      visibility: "private",
      destination: TEST_PUBKEY,
      minDelayMs: "0",
      maxDelayMs: "60000",
      split: 1,
      wrapAndUnwrapSol: true,
    });
    if (swapRes.res.ok && swapRes.json?.swapTransaction) {
      pass("Private swap tx build", "swapTransaction returned");
    } else {
      fail("Private swap tx build", `${swapRes.res.status}: ${swapRes.text.slice(0, 200)}`);
    }
  }

  const passed = results.filter((r) => r.ok).length;
  const failed = results.filter((r) => !r.ok).length;
  console.log(`\n--- Summary: ${passed} passed, ${failed} failed ---\n`);

  if (failed > 0) process.exit(1);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});