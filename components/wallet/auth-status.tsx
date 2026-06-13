"use client";

import { useWallet } from "@solana/wallet-adapter-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useMagicBlockAuth } from "@/hooks/use-magicblock-auth";

export function AuthStatus() {
  const { connected } = useWallet();
  const { isAuthenticated, isAuthenticating, error, authenticate } =
    useMagicBlockAuth();

  if (!connected) return null;

  if (isAuthenticating) {
    return (
      <Badge variant="outline" className="font-normal">
        Signing MagicBlock auth…
      </Badge>
    );
  }

  if (isAuthenticated) {
    return (
      <Badge variant="secondary" className="font-normal">
        Private ER authenticated
      </Badge>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <Badge variant="destructive" className="font-normal">
        {error ?? "MagicBlock auth required"}
      </Badge>
      <Button type="button" size="sm" variant="outline" onClick={() => authenticate()}>
        Retry auth
      </Button>
    </div>
  );
}