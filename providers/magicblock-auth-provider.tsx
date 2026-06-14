"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useWallet } from "@solana/wallet-adapter-react";

import {
  authenticateWallet,
  clearStoredToken,
  getStoredToken,
  MagicBlockAuthError,
} from "@/lib/magicblock/auth";

type MagicBlockAuthContextValue = {
  token: string | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  error: string | null;
  authenticate: () => Promise<string | null>;
  clearAuth: () => void;
};

const MagicBlockAuthContext = createContext<MagicBlockAuthContextValue | null>(
  null,
);

export function MagicBlockAuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { publicKey, connected, signMessage } = useWallet();
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const authAttempted = useRef<string | null>(null);
  const wasConnected = useRef(false);

  const clearAuth = useCallback(() => {
    clearStoredToken();
    setToken(null);
    setError(null);
    authAttempted.current = null;
  }, []);

  const authenticate = useCallback(async (): Promise<string | null> => {
    if (!publicKey) {
      setError("Connect your wallet first");
      return null;
    }
    if (!signMessage) {
      setError("This wallet cannot sign messages");
      return null;
    }

    setIsAuthenticating(true);
    setError(null);

    try {
      const nextToken = await authenticateWallet({
        publicKey: publicKey.toBase58(),
        signMessage: (message) => signMessage(message),
      });
      setToken(nextToken);
      return nextToken;
    } catch (err) {
      const message =
        err instanceof MagicBlockAuthError
          ? err.message
          : err instanceof Error
            ? err.message
            : "Authentication failed";
      setError(message);
      return null;
    } finally {
      setIsAuthenticating(false);
    }
  }, [publicKey, signMessage]);

  useEffect(() => {
    if (!connected || !publicKey) {
      if (wasConnected.current) {
        clearAuth();
      }
      wasConnected.current = false;
      return;
    }

    wasConnected.current = true;
    const address = publicKey.toBase58();
    const existing = getStoredToken(address);
    if (existing) {
      setToken(existing);
      authAttempted.current = address;
      return;
    }

    setToken(null);
    if (!signMessage) return;
    if (authAttempted.current === address) return;

    authAttempted.current = address;
    void authenticate();
  }, [connected, publicKey, signMessage, authenticate, clearAuth]);

  const value = useMemo(
    () => ({
      token,
      isAuthenticated: Boolean(token),
      isAuthenticating,
      error,
      authenticate,
      clearAuth,
    }),
    [token, isAuthenticating, error, authenticate, clearAuth],
  );

  return (
    <MagicBlockAuthContext.Provider value={value}>
      {children}
    </MagicBlockAuthContext.Provider>
  );
}

export function useMagicBlockAuth(): MagicBlockAuthContextValue {
  const context = useContext(MagicBlockAuthContext);
  if (!context) {
    throw new Error(
      "useMagicBlockAuth must be used within MagicBlockAuthProvider",
    );
  }
  return context;
}