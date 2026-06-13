"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Phase 5 — private swap with live price stream
export function SwapForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Swap</CardTitle>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        Private SPL swap with live quotes. Coming in Phase 5.
      </CardContent>
    </Card>
  );
}