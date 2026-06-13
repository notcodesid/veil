import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PortfolioPage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Portfolio</h1>
        <p className="text-sm text-muted-foreground">
          Hidden shielded balances inside Veil.
        </p>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Shielded balances</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          Private balance view coming in Phase 7.
        </CardContent>
      </Card>
    </main>
  );
}