import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  fetchLineProfile,
  replyLineText,
  verifyLineSignature,
  type LineWebhookEvent,
} from "@/lib/line";

export const runtime = "nodejs";

// Webhook runs without user session; SECURITY DEFINER RPCs (0006_line_webhook_rpcs)
// perform scoped inserts bypassing RLS. The path-level storeId functions
// as a pre-shared secret and X-Line-Signature proves the payload came
// from LINE (verified with channel_secret when set).

function supabaseAnon() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  );
}

type StoreRow = {
  id: string;
  name: string;
  line_channel_access_token: string | null;
  line_channel_secret: string | null;
  brand_voice: string | null;
};

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ storeId: string }> },
) {
  const { storeId } = await params;
  const rawBody = await req.text();
  const signature = req.headers.get("x-line-signature");

  const supabase = supabaseAnon();
  const { data } = await supabase.rpc("line_webhook_get_store", {
    p_store_id: storeId,
  });
  const stores = data as StoreRow[] | null;
  const store = stores?.[0];

  if (!store || !store.line_channel_access_token) {
    return NextResponse.json(
      { error: "store_or_token_not_found" },
      { status: 404 },
    );
  }

  if (store.line_channel_secret) {
    if (!verifyLineSignature(rawBody, signature, store.line_channel_secret)) {
      await supabase.rpc("line_webhook_log", {
        p_store_id: storeId,
        p_kind: "webhook_signature_invalid",
        p_payload: { signature_present: !!signature },
      });
      return NextResponse.json(
        { error: "signature_invalid" },
        { status: 401 },
      );
    }
  }

  let body: { events?: LineWebhookEvent[] };
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  for (const ev of body.events ?? []) {
    const userId = ev.source?.userId;
    if (!userId) continue;

    if (ev.type === "follow") {
      const profile = await fetchLineProfile({
        channelAccessToken: store.line_channel_access_token,
        userId,
      });
      const displayName = profile?.displayName ?? "LINE 好友";

      await supabase.rpc("line_webhook_follow", {
        p_store_id: storeId,
        p_user_id: userId,
        p_display_name: displayName,
      });

      if (ev.replyToken) {
        await replyLineText({
          channelAccessToken: store.line_channel_access_token,
          replyToken: ev.replyToken,
          text: `${displayName} 您好～謝謝您加入${store.name}的 LINE！用餐後我們會在這裡傳個人化心得邀請，也會不定期分享小通知 🙌 回覆任何訊息也會被收到。`,
        });
      }

      await supabase.rpc("line_webhook_log", {
        p_store_id: storeId,
        p_kind: "line_follow",
        p_payload: { user_id: userId, display_name: displayName },
      });
    } else if (ev.type === "unfollow") {
      await supabase.rpc("line_webhook_unfollow", {
        p_store_id: storeId,
        p_user_id: userId,
      });
      await supabase.rpc("line_webhook_log", {
        p_store_id: storeId,
        p_kind: "line_unfollow",
        p_payload: { user_id: userId },
      });
    } else if (ev.type === "message" && ev.replyToken) {
      await replyLineText({
        channelAccessToken: store.line_channel_access_token,
        replyToken: ev.replyToken,
        text: "收到您的訊息了 🙏 如果是訂位或店家詢問，小編會在營業時間內親自回覆。",
      });
      await supabase.rpc("line_webhook_log", {
        p_store_id: storeId,
        p_kind: "line_message",
        p_payload: {
          user_id: userId,
          message_type: ev.message?.type,
          text: ev.message?.text?.slice(0, 200),
        },
      });
    }
  }

  return NextResponse.json({ ok: true });
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
