import { DashboardHeader } from "@/components/dashboard/header";
import { ReviewCard } from "@/components/dashboard/review-card";
import { getReviews } from "@/lib/data";
import { Card, CardContent } from "@/components/ui/card";
import { Inbox } from "lucide-react";

export default async function ReviewsPage() {
  const reviews = await getReviews();
  const avg = reviews.length
    ? (reviews.reduce((a, r) => a + r.rating, 0) / reviews.length).toFixed(1)
    : "0.0";
  const replied = reviews.filter((r) => r.aiReply).length;
  const pending = reviews.length - replied;
  return (
    <>
      <DashboardHeader
        title="評論"
        subtitle={`本月 ${reviews.length} 則 · 平均 ${avg} 星 · 待回覆 ${pending}`}
      />
      <div className="flex-1 space-y-4 p-6">
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
              <Inbox className="size-10 text-muted-foreground/40" />
              <div className="text-sm text-muted-foreground">
                還沒有評論進來 — 去
                <span className="mx-1 font-medium text-foreground">邀評</span>
                頁面發送 AI 邀評，顧客回來留言就會出現在這裡。
              </div>
            </CardContent>
          </Card>
        ) : (
          reviews.map((r) => <ReviewCard key={r.id} review={r} />)
        )}
      </div>
    </>
  );
}
