import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { getActiveStoreId } from "@/lib/data";
import { pushLineText } from "@/lib/line";

export const runtime = "nodejs";
export const maxDuration = 60;

const schema = z.object({
  customerId: z.string().min(1),
  channel: z.enum(["line", "sms", "email"]),
  message: z.string().min(10).max(5000),
  aiModel: z.string().optional(),
});

export async function POST(req: NextRequest) {
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

  const storeId = await getActiveStoreId();

  const { customerId, channel, message, aiModel } = parsed.data;

  const [{ data: customer }, { data: store }] = await Promise.all([
    supabase
      .from("customers")
      .select("id, name, phone, email, line_id, store_id")
      .eq("id", customerId)
      .single(),
    supabase
      .from("stores")
      .select("line_channel_access_token")
      .eq("id", storeId)
      .single(),
  ]);

  if (!customer || customer.store_id !== storeId) {
    return NextResponse.json(
      { error: "customer_not_found" },
      { status: 404 },
    );
  }

  let deliveryOk = false;
  let deliveryDetail: string | null = null;
  let status: "sent" | "draft" = "draft";

  if (channel === "line") {
    if (!store?.line_channel_access_token) {
      return NextResponse.json(
        {
          error: "line_not_configured",
          hint: "請先到設定頁填入 LINE Channel Access Token",
        },
        { status: 412 },
      );
    }
    if (!customer.line_id) {
      return NextResponse.json(
        {
          error: "customer_no_line_id",
          hint: `顧客 ${customer.name} 還沒有 LINE 使用者 ID。請顧客先加你的 LINE OA 為好友，系統會自動綁定`,
        },
        { status: 412 },
      );
    }
    const result = await pushLineText({
      channelAccessToken: store.line_channel_access_token,
      to: customer.line_id,
      text: message,
    });
    deliveryOk = result.ok;
    deliveryDetail = result.ok
      ? `messageId=${result.messageId}`
      : result.error ?? null;
    status = result.ok ? "sent" : "draft";
  } else {
    // SMS / Email not implemented yet in this MVP — mark as draft and tell UI
    return NextResponse.json(
      {
        error: "channel_not_implemented",
        hint: `${channel.toUpperCase()} 發送尚未接通，目前只支援 LINE。可以先複製訊息手動寄出。`,
      },
      { status: 501 },
    );
  }

  const { data: invite, error: insertErr } = await supabase
    .from("review_invites")
    .insert({
      store_id: storeId,
      customer_id: customerId,
      channel,
      platform: "google",
      status,
      message,
      ai_model: aiModel ?? null,
      sent_at: status === "sent" ? new Date().toISOString() : null,
    })
    .select("id, created_at, sent_at, status")
    .single();

  if (insertErr) {
    return NextResponse.json(
      { error: "db_insert_failed", detail: insertErr.message },
      { status: 500 },
    );
  }

  await supabase.from("compliance_events").insert({
    store_id: storeId,
    actor: user.email ?? user.id,
    kind: "invite_sent",
    payload: {
      invite_id: invite.id,
      customer_id: customerId,
      channel,
      delivery_ok: deliveryOk,
      delivery_detail: deliveryDetail,
    },
  });

  if (!deliveryOk) {
    return NextResponse.json(
      {
        error: "delivery_failed",
        detail: deliveryDetail,
        invite,
      },
      { status: 502 },
    );
  }

  return NextResponse.json({
    ok: true,
    inviteId: invite.id,
    sentAt: invite.sent_at,
    status: invite.status,
  });
}
