import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { demoInvites } from "@/lib/mock-data";
import Link from "next/link";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InviteStatus } from "@/lib/types";

const statusColor: Record<InviteStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  scheduled: "bg-sky-500/15 text-sky-700 dark:text-sky-300",
  sent: "bg-blue-500/15 text-blue-700 dark:text-blue-300",
  opened: "bg-amber-500/15 text-amber-700 dark:text-amber-300",
  reviewed: "bg-emerald-500/15 text-emerald-700 dark:text-emerald-300",
  declined: "bg-rose-500/15 text-rose-700 dark:text-rose-300",
};

const statusLabel: Record<InviteStatus, string> = {
  draft: "草稿",
  scheduled: "已排程",
  sent: "已送出",
  opened: "已讀",
  reviewed: "已留評",
  declined: "未回應",
};

export default function InvitesPage() {
  return (
    <>
      <DashboardHeader
        title="邀評"
        subtitle={`共 ${demoInvites.length} 則 · AI 產生`}
        action={
          <Button size="sm" render={<Link href="/dashboard/invites/new" />}>
            <Plus className="mr-1 size-4" />
            新增邀評
          </Button>
        }
      />
      <div className="flex-1 p-6">
        <div className="space-y-3">
          {demoInvites.map((i) => (
            <Card key={i.id} className="border-border/60">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{i.customerName}</span>
                      <Badge variant="outline" className="text-xs uppercase">
                        {i.channel}
                      </Badge>
                      <span
                        className={cn(
                          "rounded-full px-2 py-0.5 text-xs font-medium",
                          statusColor[i.status],
                        )}
                      >
                        {statusLabel[i.status]}
                      </span>
                      {i.rating && (
                        <span className="text-xs text-amber-600">
                          ★ {i.rating}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 whitespace-pre-wrap text-sm text-muted-foreground">
                      {i.message}
                    </p>
                    <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                      <span>建立 {i.createdAt.slice(0, 16).replace("T", " ")}</span>
                      {i.sentAt && (
                        <span>
                          送出 {i.sentAt.slice(0, 16).replace("T", " ")}
                        </span>
                      )}
                      {i.reviewedAt && (
                        <span className="text-emerald-600">
                          留評 {i.reviewedAt.slice(0, 16).replace("T", " ")}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
