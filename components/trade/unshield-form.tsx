"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Phase 6 — unshield SPL via POST /v1/spl/withdraw
export function UnshieldForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Unshield</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Withdraw SPL back to Solana. Coming in Phase 6.
      </CardContent>
    </Card>
  );
}