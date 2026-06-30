export async function sendSignedTransaction(args: {
  transactionBase64: string;
  sendTo?: "base" | "ephemeral";
  authToken?: string | null;
}): Promise<string> {
  const res = await fetch("/api/send-transaction", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      transaction: args.transactionBase64,
      sendTo: args.sendTo ?? "base",
      authToken: args.authToken ?? undefined,
    }),
  });

  const data = (await res.json()) as { signature?: string; error?: string };
  if (!res.ok || !data.signature) {
    throw new Error(data.error ?? `Transaction failed (${res.status})`);
  }

  return data.signature;
}