import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

export function StatCard({
  label,
  value,
  delta,
  hint,
}: {
  label: string;
  value: string;
  delta?: number;
  hint?: string;
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <div className="text-3xl font-bold tracking-tight">{value}</div>
          {delta !== undefined && (
            <div
              className={cn(
                "flex items-center gap-0.5 text-xs font-medium",
                up ? "text-emerald-600" : "text-rose-600",
              )}
            >
              {up ? (
                <ArrowUpRight className="size-3" />
              ) : (
                <ArrowDownRight className="size-3" />
              )}
              {Math.abs(delta)}%
            </div>
          )}
        </div>
        {hint && (
          <div className="mt-1 text-xs text-muted-foreground">{hint}</div>
        )}
      </CardContent>
    </Card>
  );
}
