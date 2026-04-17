import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileDown, TrendingUp, Target } from "lucide-react";

export default function ReportsPage() {
  return (
    <>
      <DashboardHeader
        title="報告"
        subtitle="品牌健康度 · 每月自動產出"
      />
      <div className="flex-1 p-6">
        <Card className="mb-6 border-emerald-500/30 bg-emerald-500/5">
          <CardContent className="pt-6">
            <div className="flex items-start justify-between">
              <div>
                <Badge className="mb-2 bg-emerald-500 text-white">
                  2026 年 4 月 · 最新
                </Badge>
                <h2 className="text-2xl font-bold tracking-tight">
                  4 月品牌健康度報告
                </h2>
                <p className="mt-2 max-w-xl text-sm text-muted-foreground">
                  AI 已完成本月口碑、流量、競品、下月行動分析。
                  可匯出 PDF 給老闆、股東或直接印出貼布告欄。
                </p>
              </div>
              <Button>
                <FileDown className="mr-1 size-4" />
                下載 PDF
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-4 md:grid-cols-2">
          {[
            {
              icon: TrendingUp,
              title: "口碑趨勢",
              items: [
                "本月新增 18 則真實五星評論（+138% MoM）",
                "平均星等從 4.3 升至 4.7",
                "「抹茶蛋糕」成為前三大關鍵字",
              ],
            },
            {
              icon: Target,
              title: "下月行動建議",
              items: [
                "上線線上候位系統（解決 3 星抱怨）",
                "IG Reels 主打抹茶甜點（聲量機會）",
                "邀評發送時間調整為週二 15:00 / 週五 17:00",
                "與隔街 @meowbrew 合作互推（競品雷達）",
              ],
            },
          ].map(({ icon: Icon, title, items }) => (
            <Card key={title}>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="size-4 text-emerald-600" />
                  <div className="font-semibold">{title}</div>
                </div>
                <ul className="space-y-2 text-sm">
                  {items.map((t) => (
                    <li
                      key={t}
                      className="flex gap-2 border-l-2 border-emerald-500/30 pl-3 text-muted-foreground"
                    >
                      {t}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["2026-03", "2026-02", "2026-01"].map((m) => (
            <Card key={m} className="border-border/60">
              <CardContent className="pt-6">
                <div className="text-xs text-muted-foreground">
                  過往報告
                </div>
                <div className="mt-1 text-lg font-semibold">{m}</div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 h-8 px-2 text-xs"
                >
                  <FileDown className="mr-1 size-3" /> 下載
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
