import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getCustomers } from "@/lib/data";
import Link from "next/link";
import { Upload, Sparkles } from "lucide-react";

export default async function CustomersPage() {
  const customers = await getCustomers();
  return (
    <>
      <DashboardHeader
        title="顧客"
        subtitle={`${customers.length} 位 · 已 AI 自動打標`}
        action={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Upload className="mr-1 size-4" />
              匯入 CSV
            </Button>
            <Button size="sm" render={<Link href="/dashboard/invites/new" />}>
              <Sparkles className="mr-1 size-4" />
              AI 批次邀評
            </Button>
          </div>
        }
      />
      <div className="flex-1 p-6">
        <Card>
          <CardContent className="p-0">
            <div className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr] border-b bg-muted/30 px-6 py-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              <div>顧客</div>
              <div>最後造訪</div>
              <div>消費總額</div>
              <div>AI 標籤</div>
              <div>動作</div>
            </div>
            {customers.map((c) => (
              <div
                key={c.id}
                className="grid grid-cols-[2fr_1fr_1fr_2fr_1fr] items-center border-b px-6 py-4 text-sm last:border-0 hover:bg-muted/30"
              >
                <div>
                  <div className="font-medium">{c.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.phone ?? c.email} · {c.visits} 次造訪
                  </div>
                </div>
                <div className="text-muted-foreground">{c.lastVisitAt}</div>
                <div className="font-mono">
                  NT${c.totalSpend.toLocaleString()}
                </div>
                <div className="flex flex-wrap gap-1">
                  {c.tags.map((t) => (
                    <Badge key={t} variant="secondary" className="text-xs">
                      {t}
                    </Badge>
                  ))}
                </div>
                <div>
                  <Button
                    size="sm"
                    variant="outline"
                    render={
                      <Link href={`/dashboard/invites/new?customerId=${c.id}`} />
                    }
                  >
                    <Sparkles className="mr-1 size-3" />
                    邀評
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
