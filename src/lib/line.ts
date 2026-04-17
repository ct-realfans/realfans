/**
 * LINE Messaging API — push message only (MVP).
 * Docs: https://developers.line.biz/en/reference/messaging-api/#send-push-message
 *
 * The `to` parameter must be a LINE User ID (starts with "U..."), which you
 * receive via webhook events (friend add, message) — NOT the @handle the user
 * sees in the LINE app.
 */

export interface LinePushResult {
  ok: boolean;
  status: number;
  messageId?: string;
  sentMessages?: Array<{ id: string; quotaConsumption: number }>;
  error?: string;
}

export async function pushLineText(params: {
  channelAccessToken: string;
  to: string;
  text: string;
}): Promise<LinePushResult> {
  const { channelAccessToken, to, text } = params;

  if (!to.startsWith("U") || to.length < 20) {
    return {
      ok: false,
      status: 400,
      error: "invalid_user_id: LINE 使用者 ID 必須以 U 開頭（不是 @handle）",
    };
  }
  if (text.length > 5000) {
    return { ok: false, status: 400, error: "message_too_long" };
  }

  try {
    const res = await fetch("https://api.line.me/v2/bot/message/push", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${channelAccessToken}`,
      },
      body: JSON.stringify({
        to,
        messages: [{ type: "text", text }],
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      return {
        ok: false,
        status: res.status,
        error: `line_api_${res.status}: ${body.slice(0, 200)}`,
      };
    }
    const data = (await res.json()) as {
      sentMessages?: Array<{ id: string; quotaConsumption: number }>;
    };
    return {
      ok: true,
      status: res.status,
      sentMessages: data.sentMessages,
      messageId: data.sentMessages?.[0]?.id,
    };
  } catch (err) {
    return {
      ok: false,
      status: 0,
      error: err instanceof Error ? err.message : String(err),
    };
  }
}
