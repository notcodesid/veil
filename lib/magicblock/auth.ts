const TOKEN_KEY = "veil:magicblock:token";

export async function getChallenge(pubkey: string): Promise<string> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MAGICBLOCK_API}/v1/spl/challenge?pubkey=${pubkey}`,
  );
  if (!res.ok) throw new Error(`Challenge failed: ${res.status}`);
  const data = (await res.json()) as { challenge: string };
  return data.challenge;
}

export async function login(
  pubkey: string,
  challenge: string,
  signature: string,
): Promise<string> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_MAGICBLOCK_API}/v1/spl/login`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pubkey, challenge, signature }),
    },
  );
  if (!res.ok) throw new Error(`Login failed: ${res.status}`);
  const data = (await res.json()) as { token: string };
  return data.token;
}

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setStoredToken(token: string): void {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearStoredToken(): void {
  sessionStorage.removeItem(TOKEN_KEY);
}