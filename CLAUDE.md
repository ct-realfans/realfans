# RealFans 真粉 — Session Handoff

AI 驅動的**真實口碑成長引擎**，對打並合法取代台灣灰產「粉絲多 Fansdoor」(<https://fansdoor.com/>)。

本文件是給下一次打開這專案的自己（或另一個 Claude session）看的 — 不用重探索。

---

## 產品一句話

給台灣 80 萬家 SMB 的 AI 真實口碑 SaaS：用 AI 把店家**既有的真顧客**
轉成 Google 五星 / LINE 回購，合規、可稽核、比買假的便宜 10 倍。

## 當前狀態

**MVP 全功能上線、真實閉環已實測**（2026-04-17）：

- LINE 加好友 → webhook 自動建 customer
- dashboard 選顧客 → AI 生成邀評 → 真 LINE Push API 送到手機
- 評論進來（mock）→ AI 回覆代理人（≤3 星強制審核）
- 月度品牌健康度 PDF 下載

**目前 AI 走 mock fallback** — Vercel AI Gateway 需綁信用卡才開放免費額度。
code 邏輯已正確，加卡後自動切真 Claude Sonnet 4.6 無須改碼。

---

## 部署環境

| 資源 | 連結 / ID |
|---|---|
| GitHub repo | <https://github.com/ct-realfans/realfans> (public) |
| Vercel 專案 | `yazelins-projects/realfans` (`prj_mwdIlkzrZcYyKmBapKnoXrs0VRYE`) |
| 正式站 | <https://realfans-yazelins-projects.vercel.app/> (SSO 已關) |
| 舊別名（仍有效） | <https://fans-umber.vercel.app/> |
| 投資人 pitch deck | <https://ct-realfans.github.io/realfans/> |
| Supabase 專案 | `realfans` / ID `hrldaioxhgutlozwekhx` / region `ap-northeast-1` |
| Supabase URL | <https://hrldaioxhgutlozwekhx.supabase.co> |
| LINE OA | `@249ptlsz` (bot 名稱 "realfans") |

## 技術棧

- **Framework**: Next.js 16.2.4 App Router + React 19（Turbopack dev）
- **Styling**: Tailwind v4 + shadcn/ui (`base-nova` preset with `@base-ui/react`，
  注意：**用 `render={<Link />}` 而非 `asChild`**)
- **AI**: Vercel AI Gateway (`@ai-sdk/gateway` + `ai@^6`)，預設模型
  `anthropic/claude-sonnet-4.6`（**注意是點不是 dash**）
- **DB**: Supabase (Postgres 17) + `@supabase/supabase-js` + `@supabase/ssr`
- **Auth**: Supabase email OTP (magic link)，session 走 cookie
- **PDF**: `html2canvas-pro` (支援 Tailwind v4 的 oklch) + `jspdf`，client-side rasterize
- **LINE**: Messaging API Push + Webhook（已實測）
- **Deploy**: Vercel Fluid Compute（Node.js 24）

---

## 關鍵 Routes 與檔案

```
src/app/
├─ page.tsx                         行銷首頁（對打粉絲多）
├─ login/
│  ├─ page.tsx                      登入頁
│  └─ login-form.tsx                magic link client form
├─ auth/
│  ├─ callback/route.ts             OTP → session
│  └─ actions.ts                    signOut server action
├─ dashboard/
│  ├─ layout.tsx                    保護路由 (redirect /login if no user)
│  ├─ page.tsx                      總覽（stats + 最新評論 + AI 週建議）
│  ├─ customers/page.tsx            顧客列表
│  ├─ invites/page.tsx              邀評歷史
│  ├─ invites/new/page.tsx          AI 邀評生成器（核心 MVP 功能）
│  ├─ reviews/page.tsx              評論 + AI 回覆代理人
│  ├─ reports/page.tsx              月度 PDF 報告
│  └─ settings/
│     ├─ page.tsx                   設定頁（編輯式表單）
│     ├─ settings-form.tsx          client form
│     └─ actions.ts                 saveStoreSettings server action
└─ api/
   ├─ invites/generate/route.ts     AI 邀評生成
   ├─ invites/send/route.ts         LINE Push 真送 + 寫 DB + audit
   ├─ reviews/[id]/reply/generate/route.ts   AI 回覆草稿
   ├─ reviews/[id]/reply/send/route.ts       寫回 + audit
   └─ line/webhook/[storeId]/route.ts        LINE webhook (follow/unfollow/message)

src/components/
├─ site/nav.tsx, footer.tsx         行銷頁元件
├─ dashboard/
│  ├─ sidebar.tsx                   左側 nav + 登出
│  ├─ header.tsx                    頁首（async, 讀 store）
│  ├─ stat-card.tsx
│  ├─ invite-composer.tsx           邀評生成/預覽/發送
│  ├─ review-card.tsx               AI 回覆代理人 UI
│  └─ report-view.tsx               報告 + PDF 下載按鈕
└─ ui/                              shadcn (base-nova) 元件

src/lib/
├─ supabase.ts                      舊版 anon client（保留，data.ts fallback 用）
├─ supabase/
│  ├─ server.ts                     createServerSupabase() 讀 cookies
│  └─ client.ts                     createBrowserSupabase()
├─ data.ts                          getStore/getCustomers/getInvites/getReviews (+ React cache)
├─ types.ts                         Customer/Store/ReviewInvite/ReviewRecord
├─ brand.ts                         品牌常數
├─ mock-data.ts                     env 缺配置時的 fallback
├─ onboarding.ts                    ensureUserStore() — 首次登入 clone demo
├─ ai.ts                            prompt 模板 + generateInviteMessage / generateReviewReply / generateMonthlyInsights
├─ reports.ts                       computeMonthlyStats + parseMonth
└─ line.ts                          pushLineText / verifyLineSignature / fetchLineProfile / replyLineText

src/middleware.ts                   刷新 Supabase session cookies
supabase/migrations/0001_init.sql   原始 schema（更新版在 Supabase 專案內）
docs/                               GitHub Pages pitch deck
public/brand/line-avatar*.png       logo（nanobanana 生成）
```

---

## Supabase Schema（7 個 migration 已 applied）

```
stores (owner_user_id uuid, line_channel_access_token, line_channel_secret, ...)
customers (store_id, line_id, tags[], notes, total_spend_twd, ...)
review_invites (channel enum, status enum, message, ai_model, ...)
reviews (rating, content, invite_id, ai_reply, replied_at, ...)
compliance_events (actor, kind, payload jsonb)  ← AI 稽核軌跡
```

**RLS 策略**（0004 + 0006）：
- 預設：owner-scoped `store_id in (select id from stores where owner_user_id = auth.uid())`
- demo store UUID `00000000-0000-0000-0000-000000000001`：narrow public SELECT 政策
- LINE webhook 走 `SECURITY DEFINER` RPCs (`line_webhook_*`) 繞過 RLS

**重要資料**：
- Demo store id: `00000000-0000-0000-0000-000000000001`（seed 資料，未來可清）
- 測試使用者: `yaze.lin.j303@gmail.com`（id 見 auth.users）
- 該使用者 store id: `12de0202-2dd9-4279-a206-45c439396e26`

---

## 環境變數

**Vercel production** 已設：
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
VERCEL_OIDC_TOKEN（Vercel 自動注入）
```

**本地 `.env.local`**（gitignore）已設以上 + `vercel env pull` 拉的 OIDC token。

**尚未設定**：
- `AI_GATEWAY_API_KEY`（不需要，OIDC 就夠；但 AI Gateway 還需帳上綁卡）
- LINE token 存 `stores.line_channel_access_token`（不是 env）

---

## 合規紅線（硬規則）

`src/lib/ai.ts` 的 prompt 都已內建以下護欄，**改動不得移除**：

1. **不誘導好評** — Google Review Policy §2.3
2. **不捏造顧客行為** — 只能用 store 的 notes
3. **含留評連結 + 退訂** — 不可遺漏
4. **個人化避免罐頭** — 必須引用真實顧客標籤/備註
5. **負評（≤3 星）強制人工審核** — `review-card.tsx` 的 `needsHumanReview` flag

違反任一條 = 整個產品商業模式崩潰（法律 + 平台封鎖）。

---

## 已知狀態與未解

| 狀態 | 說明 |
|---|---|
| ⚠️ AI 走 mock | Vercel AI Gateway 需綁卡。加卡後自動切真 Claude |
| ⚠️ Next.js 16 warning | `middleware.ts` 檔名該改 `proxy.ts`（功能照常） |
| ⏸️ SMS / Email 發送 | API route 回 501 未實作 — 之後接 Twilio / Resend |
| ⏸️ Supabase Auth Redirect URLs | 使用者需手動到 Supabase dashboard 加入 prod URL |
| ⏸️ POS 整合 | iCHEF / Square 尚未接 |
| ⏸️ LINE channel secret 驗證 | 欄位存在但 UI 未放出來 — 驗簽目前可選 |

---

## 核心指令

```bash
npm run dev        # Turbopack dev
npm run build      # 產線 build（驗證）
npm run typecheck  # tsc --noEmit
vercel deploy --prod --yes       # 部署
```

**部署流程**：`git push` → Vercel 自動 preview；`vercel deploy --prod --yes`
手動推 production。

---

## 相關文件（下次開 session 必讀）

- [`ROADMAP.md`](./ROADMAP.md) — P0-P3 功能佇列 + 投資人里程碑對應
- [`GTM.md`](./GTM.md) — 顧客怎麼進、邀評怎麼送、3 種垂直 GTM 劇本、成本模型
- [`docs/index.html`](./docs/index.html) — 投資人 pitch deck（GitHub Pages）

下次繼續開發優先做 `ROADMAP.md` 的 P0 五項（合計 2 天）。

---

## 品牌語氣

繁體中文（台灣）、對小商家有同理、對假粉絲不客氣、直接講數字。
