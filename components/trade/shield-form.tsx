"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Phase 4 — shield SPL via POST /v1/spl/deposit
export function ShieldForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Shield</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Deposit SPL tokens into the Private ER. Coming in Phase 4.
      </CardContent>
    </Card>
  );
}