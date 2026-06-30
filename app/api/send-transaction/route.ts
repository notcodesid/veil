import {
  Connection,
  Transaction,
  VersionedTransaction,
} from "@solana/web3.js";
import { NextRequest, NextResponse } from "next/server";

import { getRpcUrl } from "@/lib/magicblock/tx";

type SendTransactionBody = {
  transaction: string;
  sendTo?: "base" | "ephemeral";
  authToken?: string;
};

export async function POST(request: NextRequest) {
  let body: SendTransactionBody;
  try {
    body = (await request.json()) as SendTransactionBody;
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (!body.transaction) {
    return NextResponse.json(
      { error: "transaction is required" },
      { status: 400 },
    );
  }

  const sendTo = body.sendTo ?? "base";
  const rpc = getRpcUrl(sendTo, body.authToken);

  try {
    const bytes = Buffer.from(body.transaction, "base64");
    let signed: Transaction | VersionedTransaction;
    try {
      signed = VersionedTransaction.deserialize(bytes);
    } catch {
      signed = Transaction.from(bytes);
    }

    const connection = new Connection(rpc, "confirmed");
    const raw =
      signed instanceof VersionedTransaction
        ? signed.serialize()
        : signed.serialize();

    const signature = await connection.sendRawTransaction(raw, {
      skipPreflight: false,
      preflightCommitment: "confirmed",
    });
    await connection.confirmTransaction(signature, "confirmed");

    return NextResponse.json({ signature });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Transaction submission failed";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}