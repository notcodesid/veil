import { Connection, PublicKey } from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

import { SOLANA_RPC } from "@/lib/magicblock/config";

export async function GET(request: NextRequest) {
  const address = request.nextUrl.searchParams.get("address");
  if (!address) {
    return NextResponse.json({ error: "address is required" }, { status: 400 });
  }

  try {
    new PublicKey(address);
  } catch {
    return NextResponse.json({ error: "invalid address" }, { status: 400 });
  }

  try {
    const connection = new Connection(SOLANA_RPC, "confirmed");
    const lamports = await connection.getBalance(
      new PublicKey(address),
      "confirmed",
    );
    return NextResponse.json({ lamports: String(lamports) });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch native SOL balance";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}