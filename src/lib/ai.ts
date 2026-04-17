import { generateText } from "ai";
import type { Channel } from "./types";

const MODEL = "anthropic/claude-sonnet-4.6";

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

  try {
    const { text } = await generateText({
      model: MODEL,
      prompt,
      temperature: 0.8,
      providerOptions: {
        gateway: {
          tags: ["feature:invite-generate", "app:realfans"],
        },
      },
    });
    return { message: text.trim(), model: MODEL, prompt };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    return {
      message: mockInvite(ctx),
      model: `mock (gateway unavailable: ${reason.slice(0, 80)})`,
      prompt,
    };
  }
}

export interface ReplyContext {
  rating: number;
  reviewContent: string;
  reviewerName?: string;
  storeName: string;
  brandVoice: string;
  language?: "zh-TW" | "en";
}

function buildReplyPrompt(ctx: ReplyContext): string {
  const lang = ctx.language ?? "zh-TW";
  const toneHint =
    ctx.rating >= 4
      ? "這是正面評論。以真誠感謝開頭，針對顧客提到的具體細節回應。不要過度誇張、不要推銷新產品。"
      : ctx.rating === 3
        ? "這是中性評論（3 星）。先感謝回饋、承認對方觀察正確、具體說明會如何改進或已經在做什麼，不要防衛。"
        : "這是負評。絕對不可以防衛或找藉口。先認真道歉、承認問題、說明會採取的具體行動（若適用），並邀請私下聯絡以補償。";

  return [
    `你是「${ctx.storeName}」的真人店長，語言：${lang === "zh-TW" ? "繁體中文（台灣）" : "English"}。`,
    `品牌語氣指引：${ctx.brandVoice}`,
    "",
    "任務：對一則顧客在 Google 留下的公開評論，寫一段**會公開顯示**的回覆。",
    "",
    "嚴格規則：",
    " - 直接寫「回覆本文」，不要加任何前綴（如「回覆：」「Reply:」）。",
    " - 長度：60–150 字，要像真人寫的，不要罐頭。",
    " - 可以用 1 個 emoji，但不強制。",
    " - 不要暗示對方修改評論、不要要求改星等 — 違反 Google 政策。",
    " - 不要複製顧客原話，用自己的話回應要點。",
    " - 不可以洩露內部資訊（員工姓名、競品比較、價格）。",
    "",
    `情境：${toneHint}`,
    "",
    "顧客評論內容：",
    `- 作者：${ctx.reviewerName ?? "顧客"}`,
    `- 星等：${ctx.rating} / 5`,
    `- 內文：${ctx.reviewContent}`,
    "",
    "只輸出回覆本文。",
  ].join("\n");
}

export async function generateReviewReply(ctx: ReplyContext) {
  const prompt = buildReplyPrompt(ctx);
  try {
    const { text } = await generateText({
      model: MODEL,
      prompt,
      temperature: 0.7,
      providerOptions: {
        gateway: { tags: ["feature:review-reply", "app:realfans"] },
      },
    });
    return { reply: text.trim(), model: MODEL, prompt };
  } catch (err) {
    const reason = err instanceof Error ? err.message : String(err);
    return {
      reply: mockReply(ctx),
      model: `mock (gateway unavailable: ${reason.slice(0, 80)})`,
      prompt,
    };
  }
}

function mockReply(ctx: ReplyContext): string {
  const who = ctx.reviewerName ?? "您";
  if (ctx.rating >= 4) {
    return `${who}您好～謝謝您撥空留下這段心得，看到被認可的細節，我們整個團隊會開心一整週 😊 下次再來，我們繼續把您記得的那份溫度準備好。`;
  }
  if (ctx.rating === 3) {
    return `${who}您好，謝謝您坦白的回饋。您提到的問題我們有認真記下，會立刻跟夥伴檢視流程，下次您光臨時希望能給您不一樣的感受 🙏`;
  }
  return `${who}您好，非常抱歉這次的體驗沒有達到您的期待。我們想更仔細了解並直接處理 — 可以請您私訊我們 Google Business 訊息或寫信到 hello@realfans.tw 嗎？我們想親自補償。`;
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
