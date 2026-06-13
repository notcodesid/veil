import { BalanceStrip } from "@/components/trade/balance-strip";
import { ShieldForm } from "@/components/trade/shield-form";
import { SwapForm } from "@/components/trade/swap-form";
import { UnshieldForm } from "@/components/trade/unshield-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function TradePage() {
  return (
    <main className="mx-auto flex w-full max-w-lg flex-1 flex-col gap-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Trade</h1>
        <p className="text-sm text-muted-foreground">
          Shield, swap, and unshield SPL tokens privately.
        </p>
      </div>
      <Tabs defaultValue="shield">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="shield">Shield</TabsTrigger>
          <TabsTrigger value="swap">Swap</TabsTrigger>
          <TabsTrigger value="unshield">Unshield</TabsTrigger>
        </TabsList>
        <TabsContent value="shield">
          <ShieldForm />
        </TabsContent>
        <TabsContent value="swap">
          <SwapForm />
        </TabsContent>
        <TabsContent value="unshield">
          <UnshieldForm />
        </TabsContent>
      </Tabs>
      <BalanceStrip />
    </main>
  );
}