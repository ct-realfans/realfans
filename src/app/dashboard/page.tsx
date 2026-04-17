import { DashboardHeader } from "@/components/dashboard/header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { demoInvites, demoReviews } from "@/lib/mock-data";
import Link from "next/link";
import { Star, ArrowRight } from "lucide-react";

export default function DashboardPage() {
  const totalReviewed = demoInvites.filter((i) => i.status === "reviewed")
    .length;
  const rate = Math.round((totalReviewed / demoInvites.length) * 100);
  const avgRating = (
    demoReviews.reduce((a, r) => a + r.rating, 0) / demoReviews.length
  ).toFixed(1);

  return (
    <>
      <DashboardHeader
        title="總覽"
        subtitle="過去 30 天 · 本月聲量快照"
      />
      <div className="flex-1 space-y-6 p-6">
        <div className="grid gap-4 md:grid-cols-4">
          <StatCard
            label="AI 邀評已送出"
            value={String(demoInvites.length)}
            delta={42}
            hint="相較上月"
          />
          <StatCard
            label="留評轉換率"
            value={`${rate}%`}
            delta={18}
            hint="平均業界 2–4%"
          />
          <StatCard
            label="平均星等"
            value={avgRating}
            delta={3}
            hint="Google 5 星滿"
          />
          <StatCard
            label="AI 省下時間"
            value="14.5 hr"
            delta={8}
            hint="本月 / 門店"
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardContent className="pt-6">
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold">最新真實評論</div>
                  <div className="text-xs text-muted-foreground">
                    AI 已自動草擬回覆，點擊審核
                  </div>
                </div>
                <Link
                  href="/dashboard/reviews"
                  className="inline-flex items-center gap-1 text-xs text-emerald-600 hover:underline"
                >
                  全部評論 <ArrowRight className="size-3" />
                </Link>
              </div>
              <div className="space-y-4">
                {demoReviews.map((r) => (
                  <div
                    key={r.id}
                    className="rounded-lg border border-border/60 bg-muted/30 p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{r.author}</span>
                        <Badge variant="secondary" className="text-xs">
                          {r.platform}
                        </Badge>
                        {r.source === "invited" && (
                          <Badge
                            variant="outline"
                            className="border-emerald-500/40 text-xs text-emerald-700 dark:text-emerald-300"
                          >
                            AI 邀評
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={
                              i < r.rating
                                ? "size-3.5 fill-amber-400 text-amber-400"
                                : "size-3.5 text-muted-foreground/30"
                            }
                          />
                        ))}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-foreground/90">
                      {r.content}
                    </p>
                    {r.aiReply && (
                      <div className="mt-3 rounded-md border-l-2 border-emerald-500 bg-emerald-500/5 p-3 text-sm">
                        <div className="mb-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                          AI 回覆（已送出）
                        </div>
                        <p className="text-muted-foreground">{r.aiReply}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="mb-4">
                <div className="text-sm font-semibold">本週 AI 建議</div>
                <div className="text-xs text-muted-foreground">
                  依據競品雷達 + 在地關鍵字
                </div>
              </div>
              <ul className="space-y-3 text-sm">
                <li className="rounded-md bg-amber-500/10 p-3">
                  <div className="font-medium">📸 抹茶蛋糕有聲量</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    最近 3 則五星都提到抹茶蛋糕，建議本週 IG Reels 主打。
                  </div>
                </li>
                <li className="rounded-md bg-rose-500/10 p-3">
                  <div className="font-medium">⚠️ 假日候位抱怨 +2</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    路過食客 3 星留言提及，建議上線候位通知。
                  </div>
                </li>
                <li className="rounded-md bg-sky-500/10 p-3">
                  <div className="font-medium">🎯 邀評時機優化</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    下午 3 點發送的開信率比晚上 9 點高 2.1 倍。
                  </div>
                </li>
                <li className="rounded-md bg-violet-500/10 p-3">
                  <div className="font-medium">🔍 競品動態</div>
                  <div className="mt-1 text-xs text-muted-foreground">
                    隔壁 2 家咖啡廳本月各多 5 則評論，你落後但仍可追上。
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
