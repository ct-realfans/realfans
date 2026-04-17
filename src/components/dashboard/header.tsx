import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Bell, Plus } from "lucide-react";
import { demoStore } from "@/lib/mock-data";

export function DashboardHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-6 backdrop-blur">
      <div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{demoStore.name}</span>
          <span>·</span>
          <span>{demoStore.industry}</span>
        </div>
        <h1 className="mt-0.5 text-lg font-semibold tracking-tight">{title}</h1>
        {subtitle && (
          <p className="text-xs text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <div className="flex items-center gap-2">
        {action ?? (
          <>
            <Button size="icon" variant="ghost">
              <Bell className="size-4" />
            </Button>
            <Button size="sm" render={<Link href="/dashboard/invites/new" />}>
              <Plus className="mr-1 size-4" />
              新邀評
            </Button>
          </>
        )}
      </div>
    </header>
  );
}
