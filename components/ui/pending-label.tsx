import { Loader2 } from "lucide-react";

export function PendingLabel({
  pending,
  pendingText,
  idleText,
}: {
  pending: boolean;
  pendingText: string;
  idleText: string;
}) {
  if (!pending) return idleText;

  return (
    <>
      <Loader2 className="size-4 animate-spin" aria-hidden />
      {pendingText}
    </>
  );
}