import { DashboardHeader } from "@/components/dashboard/header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { demoReviews } from "@/lib/mock-data";
import { Star, Bot } from "lucide-react";

export default function ReviewsPage() {
  const avg = (
    demoReviews.reduce((a, r) => a + r.rating, 0) / demoReviews.length
  ).toFixed(1);
  return (
    <>
      <DashboardHeader
        title="評論"
        subtitle={`本月 ${demoReviews.length} 則 · 平均 ${avg} 星`}
      />
      <div className="flex-1 space-y-4 p-6">
        {demoReviews.map((r) => (
          <Card key={r.id}>
            <CardContent className="pt-6">
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
                  <span className="text-xs text-muted-foreground">
                    {r.createdAt.slice(0, 10)}
                  </span>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={
                        i < r.rating
                          ? "size-4 fill-amber-400 text-amber-400"
                          : "size-4 text-muted-foreground/30"
                      }
                    />
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm">{r.content}</p>
              {r.aiReply ? (
                <div className="mt-3 rounded-md border-l-2 border-emerald-500 bg-emerald-500/5 p-3 text-sm">
                  <div className="mb-1 flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
                    <Bot className="size-3.5" /> AI 已回覆 ·{" "}
                    {r.repliedAt?.slice(0, 10)}
                  </div>
                  <p className="text-muted-foreground">{r.aiReply}</p>
                </div>
              ) : (
                <div className="mt-3 flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    <Bot className="mr-1 size-3.5" />
                    AI 草擬回覆
                  </Button>
                  <Button size="sm" variant="ghost">
                    手動回覆
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
