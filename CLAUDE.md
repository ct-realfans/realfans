# RealFans 真粉

AI 驅動的真實口碑成長引擎 — 合法替代「粉絲多 Fansdoor」。

## 核心產品

白帽評論引擎：幫小商家把既有真實顧客轉成 Google 五星評論，使用
AI 產生個人化邀評訊息（LINE / SMS / Email），合規不誘導。

## 技術棧

- Next.js 16 App Router + React 19（Turbopack dev）
- Tailwind v4 + shadcn/ui（neutral base）
- Vercel AI Gateway（`@ai-sdk/gateway`）— 預設模型 `anthropic/claude-sonnet-4-6`
- Supabase（Postgres + RLS）— 尚未連接，目前用 mock data
- Vercel（Fluid Compute + Cron + Queues 未來）

## 目錄

- `src/app/` — 路由
  - `/` 行銷首頁（對打粉絲多）
  - `/dashboard` 儀表板
  - `/api/invites/generate` AI 邀評生成 API
- `src/components/site` — 行銷頁元件
- `src/components/dashboard` — 儀表板元件
- `src/components/ui` — shadcn/ui
- `src/lib/ai.ts` — AI SDK 包裝 + prompt 模板
- `src/lib/mock-data.ts` — 目前 demo 資料
- `supabase/migrations/` — 之後要 apply 的 schema

## 合規紅線（硬規則）

在 `src/lib/ai.ts` 的 prompt 已包含合規護欄：
1. **不誘導好評**（Google Policy §2.3、Meta、FTC）
2. **不捏造顧客行為**（只能用 store 的備註）
3. **含留評連結與退訂**
4. **個人化避免模板**

改動 AI 訊息生成時，這些護欄不得移除。違反會讓整個產品商業模式崩潰。

## Dev

```bash
npm run dev     # Turbopack dev server
npm run build   # 產線 build
npm run typecheck
```

## 競品

對標：<https://fansdoor.com/> — 台灣「買假粉/假評論」服務。
我們用 AI 幫助小商家產生**真實**聲量、合規、可稽核。

## 品牌語氣

繁體中文（台灣）、直接、對小商家有同理、對假粉絲不客氣。
