import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getStore } from "@/lib/data";
import { ShieldCheck } from "lucide-react";

export default async function SettingsPage() {
  const store = await getStore();
  return (
    <>
      <DashboardHeader title="設定" subtitle="門店資料 · 品牌語氣 · 整合" />
      <div className="flex-1 space-y-6 p-6">
        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="text-sm font-semibold">門店資料</div>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label>店名</Label>
                <Input defaultValue={store.name} className="mt-1" />
              </div>
              <div>
                <Label>產業</Label>
                <Input defaultValue={store.industry} className="mt-1" />
              </div>
              <div className="md:col-span-2">
                <Label>Google 留評連結</Label>
                <Input defaultValue={store.linkReview} className="mt-1" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-3 pt-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold">AI 品牌語氣</div>
                <div className="text-xs text-muted-foreground">
                  所有 AI 生成的邀評與回覆都會遵循這段指引
                </div>
              </div>
              <Badge className="bg-emerald-500 text-white">
                <ShieldCheck className="mr-1 size-3" />
                合規護欄啟用中
              </Badge>
            </div>
            <Textarea
              rows={5}
              defaultValue={store.brandVoice}
              className="resize-none"
            />
            <Button size="sm">儲存並套用</Button>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="space-y-4 pt-6">
            <div className="text-sm font-semibold">整合</div>
            {[
              { name: "LINE Messaging API", status: "已連線", ok: true },
              { name: "Google Business Profile", status: "已連線", ok: true },
              { name: "Meta (Facebook / Instagram)", status: "已連線", ok: true },
              { name: "iCHEF POS", status: "未連線", ok: false },
              { name: "Square", status: "未連線", ok: false },
            ].map((it) => (
              <div
                key={it.name}
                className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
              >
                <div className="text-sm font-medium">{it.name}</div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={it.ok ? "default" : "outline"}
                    className={
                      it.ok ? "bg-emerald-500 text-white" : undefined
                    }
                  >
                    {it.status}
                  </Badge>
                  <Button size="sm" variant="outline">
                    {it.ok ? "設定" : "連線"}
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
