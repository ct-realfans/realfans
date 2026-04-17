import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";

export const runtime = "nodejs";

const schema = z.object({ reply: z.string().min(5).max(1000) });

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "invalid_body", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: updated, error } = await supabase
    .from("reviews")
    .update({
      ai_reply: parsed.data.reply,
      replied_at: new Date().toISOString(),
    })
    .eq("id", id)
    .select("id, store_id, ai_reply, replied_at")
    .single();

  if (error || !updated) {
    return NextResponse.json(
      { error: "update_failed", detail: error?.message },
      { status: 400 },
    );
  }

  await supabase.from("compliance_events").insert({
    store_id: updated.store_id,
    actor: user.email ?? user.id,
    kind: "review_reply_sent",
    payload: { review_id: id, reply: parsed.data.reply },
  });

  return NextResponse.json({
    reviewId: id,
    repliedAt: updated.replied_at,
  });
}
