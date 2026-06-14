"use client";

import Link from "next/link";
import { RefreshCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { usePrivateBalances } from "@/hooks/use-private-balances";

export function ShieldedBalances() {
  const { rows, hasShielded, isLoading, refresh } = usePrivateBalances();

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between gap-4 space-y-0">
        <div>
          <CardTitle>Shielded balances</CardTitle>
          <CardDescription>
            Private ER holdings — hidden from public explorers.
          </CardDescription>
        </div>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={() => void refresh({ force: true })}
          disabled={isLoading}
        >
          <RefreshCw
            className={`mr-2 size-3.5 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-lg border border-border">
          <div className="grid grid-cols-3 gap-2 border-b border-border bg-muted/40 px-3 py-2 text-xs font-medium text-muted-foreground">
            <span>Token</span>
            <span className="text-right">Shielded</span>
            <span className="text-right">Wallet</span>
          </div>
          {rows.map((row) => (
            <div
              key={row.symbol}
              className="grid grid-cols-3 gap-2 border-b border-border px-3 py-3 text-sm last:border-b-0"
            >
              <span className="font-medium">{row.symbol}</span>
              <span className="text-right font-mono tabular-nums">
                {isLoading ? "…" : row.shielded}
              </span>
              <span className="text-right font-mono tabular-nums text-muted-foreground">
                {isLoading ? "…" : row.wallet}
              </span>
            </div>
          ))}
        </div>

        {!isLoading && !hasShielded ? (
          <p className="mt-4 text-sm text-muted-foreground">
            No shielded tokens yet.{" "}
            <Link href="/trade" className="text-foreground underline">
              Shield on Trade
            </Link>
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}