"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import { Badge } from "@/components/ui/badge";
import { truncateAddress } from "@/lib/solana/format";

export function WalletStatus() {
  const { connected, publicKey, connecting } = useWallet();

  if (connecting) {
    return (
      <Badge variant="secondary" className="font-normal">
        Connecting wallet…
      </Badge>
    );
  }

  if (!connected || !publicKey) {
    return (
      <Badge variant="outline" className="font-normal">
        Devnet · wallet not connected
      </Badge>
    );
  }

  return (
    <Badge variant="secondary" className="font-normal">
      Devnet · {truncateAddress(publicKey)}
    </Badge>
  );
}