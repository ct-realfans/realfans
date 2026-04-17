import { gateway } from "@ai-sdk/gateway";
import { generateText } from "ai";
import type { Channel } from "./types";

export interface InviteContext {
  customerName: string;
  channel: Channel;
  storeName: string;
  brandVoice: string;
  visitNotes?: string;
  tags?: string[];
  totalVisits: number;
  reviewLink: string;
  language?: "zh-TW" | "en";
}

const channelHint: Record<Channel, string> = {
  line: "LINE 訊息，可加 1–2 個 emoji，用隨興親切的口吻，不要太長，約 80–140 字。",
  sms: "SMS 簡訊，不超過 70 個全形字，不要放 emoji，訊息開頭標註店名，附上一個短連結。",
  email: "Email，可以稍長（150–220 字），有稱謂、收尾簽名，但不要過度官方。",
};

export function buildInvitePrompt(ctx: InviteContext): string {
  const lang = ctx.language ?? "zh-TW";
  const visitKind =
    ctx.totalVisits === 1
      ? "第一次來訪的新客"
      : ctx.totalVisits >= 10
        ? "超過十次的熟客"
        : `已經來過 ${ctx.totalVisits} 次的回頭客`;

  return [
    `你是「${ctx.storeName}」的真人店長助理，語言：${lang === "zh-TW" ? "繁體中文（台灣）" : "English"}。`,
    `品牌語氣指引：${ctx.brandVoice}`,
    "",
    "任務：寫一則「邀請真實顧客在 Google 留下評論」的個人化訊息。",
    "絕對禁止：",
    " - 不可以提示顧客只留好評（例如不要說「如果您願意留五星」），這違反 Google 政策。",
    " - 不可使用模板化句型（如「親愛的顧客您好」），要像真人傳訊息。",
    " - 不可捏造顧客沒做過的行為。只能根據提供的備註。",
    "必須包含：",
    " - 自然地提及至少 1 個與該顧客相關的具體細節（根據備註/標籤）。",
    " - 留評連結：" + ctx.reviewLink,
    " - 清楚說明「花 30 秒留下真實感受」，不強迫、不誘導正面評價。",
    "",
    `通路格式：${channelHint[ctx.channel]}`,
    "",
    "顧客資料：",
    `- 姓名：${ctx.customerName}`,
    `- 客戶類型：${visitKind}`,
    ctx.tags?.length ? `- 標籤：${ctx.tags.join("、")}` : "",
    ctx.visitNotes ? `- 本次/歷次備註：${ctx.visitNotes}` : "",
    "",
    "只輸出訊息本文，不要加引號、不要加前綴「訊息：」。",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function generateInviteMessage(ctx: InviteContext) {
  const prompt = buildInvitePrompt(ctx);
  const hasKey = !!process.env.AI_GATEWAY_API_KEY;

  if (!hasKey) {
    return {
      message: mockInvite(ctx),
      model: "mock",
      prompt,
    };
  }

  const { text } = await generateText({
    model: gateway("anthropic/claude-sonnet-4-6"),
    prompt,
    temperature: 0.8,
  });
  return { message: text.trim(), model: "anthropic/claude-sonnet-4-6", prompt };
}

function mockInvite(ctx: InviteContext): string {
  const detail = ctx.visitNotes?.split(/[。,.]/)[0] ?? "今天的餐點";
  const emoji = ctx.channel === "line" ? " ☺" : "";
  if (ctx.channel === "sms") {
    return `【${ctx.storeName}】${ctx.customerName}您好，謝謝您今天來訪！方便花 30 秒留下真實心得嗎？${ctx.reviewLink}`;
  }
  if (ctx.channel === "email") {
    return `${ctx.customerName} 您好，\n\n感謝您今天造訪${ctx.storeName}。我們注意到${detail}，希望您用餐愉快。\n\n如果方便的話，想邀請您花 30 秒在 Google 分享真實感受，不論好或需要改進的地方，對我們都很重要：\n${ctx.reviewLink}\n\n再次謝謝您！\n${ctx.storeName} 團隊`;
  }
  return `${ctx.customerName}～謝謝您今天又來${ctx.storeName}${emoji}（${detail}）如果今天體驗還可以，方便花 30 秒留個 Google 心得嗎？您的真實感受對小店非常重要：${ctx.reviewLink}`;
}
