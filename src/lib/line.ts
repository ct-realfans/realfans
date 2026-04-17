import { createHmac, timingSafeEqual } from "node:crypto";

/**
 * LINE Messaging API wrappers.
 * - pushLineText: send a message to a user who has added the OA as friend
 * - verifyLineSignature: validate webhook authenticity
 * - fetchLineProfile: resolve display name for a new follower
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

export function verifyLineSignature(
  rawBody: string,
  signatureHeader: string | null,
  channelSecret: string,
): boolean {
  if (!signatureHeader) return false;
  const expected = createHmac("sha256", channelSecret)
    .update(rawBody)
    .digest("base64");
  const a = Buffer.from(signatureHeader);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export interface LineProfile {
  userId: string;
  displayName: string;
  pictureUrl?: string;
  statusMessage?: string;
  language?: string;
}

export async function fetchLineProfile(params: {
  channelAccessToken: string;
  userId: string;
}): Promise<LineProfile | null> {
  try {
    const res = await fetch(
      `https://api.line.me/v2/bot/profile/${encodeURIComponent(params.userId)}`,
      {
        headers: { Authorization: `Bearer ${params.channelAccessToken}` },
      },
    );
    if (!res.ok) return null;
    return (await res.json()) as LineProfile;
  } catch {
    return null;
  }
}

export interface LineWebhookEvent {
  type: string;
  source?: { type: string; userId?: string };
  message?: { type: string; text?: string; id: string };
  replyToken?: string;
  timestamp?: number;
}

export async function replyLineText(params: {
  channelAccessToken: string;
  replyToken: string;
  text: string;
}): Promise<void> {
  await fetch("https://api.line.me/v2/bot/message/reply", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${params.channelAccessToken}`,
    },
    body: JSON.stringify({
      replyToken: params.replyToken,
      messages: [{ type: "text", text: params.text }],
    }),
  });
}
