import { NextRequest, NextResponse } from "next/server";
import { generateReviewReply } from "@/lib/ai";
import { createServerSupabase } from "@/lib/supabase/server";
import { getStore } from "@/lib/data";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: review, error } = await supabase
    .from("reviews")
    .select("id, rating, content, author_name")
    .eq("id", id)
    .single();

  if (error || !review) {
    return NextResponse.json({ error: "review_not_found" }, { status: 404 });
  }

  const store = await getStore();
  const result = await generateReviewReply({
    rating: review.rating,
    reviewContent: review.content ?? "",
    reviewerName: review.author_name ?? undefined,
    storeName: store.name,
    brandVoice: store.brandVoice,
  });

  return NextResponse.json({
    reply: result.reply,
    model: result.model,
    reviewId: id,
  });
}
