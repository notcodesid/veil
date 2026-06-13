"use client";

// Phase 3 — implement challenge → sign → login flow
export function useMagicBlockAuth() {
  return {
    token: null as string | null,
    isAuthenticating: false,
    authenticate: async () => {
      throw new Error("MagicBlock auth not implemented yet (Phase 3)");
    },
  };
}