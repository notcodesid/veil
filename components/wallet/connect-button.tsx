"use client";

import { useWallet } from "@solana/wallet-adapter-react";
import { useWalletModal } from "@solana/wallet-adapter-react-ui";

import { Button } from "@/components/ui/button";
import { truncateAddress } from "@/lib/solana/format";

export function ConnectButton() {
  const { publicKey, disconnect, connected, connecting } = useWallet();
  const { setVisible } = useWalletModal();

  if (connected && publicKey) {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={() => disconnect()}
        title={publicKey.toBase58()}
      >
        {truncateAddress(publicKey)}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      onClick={() => setVisible(true)}
      disabled={connecting}
    >
      {connecting ? "Connecting…" : "Connect Wallet"}
    </Button>
  );
}