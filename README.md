# RealFans 真粉

> **AI 驅動的真實口碑成長引擎** — 台灣灰產「粉絲多 Fansdoor」的合法替代品。

不買假粉、不刷假評論。**用 AI 把店家既有真顧客，變成會推薦你的五星聲量。**

### 連結

- 🌐 **產品 Demo**：<https://realfans-yazelins-projects.vercel.app/>
- 📊 **投資人 Pitch Deck**：<https://ct-realfans.github.io/realfans/>
- 💻 **原始碼**：這個 repo

### 內部文件（給開發者與下次自己）

- [`CLAUDE.md`](./CLAUDE.md) — 技術狀態與 session handoff
- [`VALUE.md`](./VALUE.md) — 客戶價值邏輯 + 投資人 Q&A（每數字標證據等級）
- [`POC.md`](./POC.md) — 3 家商家試跑計劃（驗證假設數字）
- [`GTM.md`](./GTM.md) — 顧客怎麼進、邀評怎麼送、垂直 GTM 劇本
- [`ROADMAP.md`](./ROADMAP.md) — P0-P3 功能佇列 + 里程碑

---

## 為什麼存在

台灣 80 萬家小商家夾在兩個壞選擇之間：

| 選項 | 問題 |
|---|---|
| 自己求顧客留評 | 轉換率 &lt; 2%，老闆沒時間 |
| **買假評論（粉絲多）** | 違法（公平法第 21 條）、假粉不買單、帳號隨時被封 |

**RealFans 提供第三條路**：AI 自動寫個人化邀評訊息給你的**真顧客**，
透過 LINE/SMS/Email 發送，合規、可稽核、效果好 5-10 倍。

---

## 產品功能（皆已實作並上線）

- ✅ **AI 白帽邀評引擎** — Claude Sonnet 4.6 根據顧客歷史個人化，LINE/SMS/Email 通路
- ✅ **AI 回覆代理人** — 24/7 自動回評論，低星強制人工審核
- ✅ **LINE 整合** — Messaging API Push + Webhook 自動綁好友成顧客
- ✅ **月度品牌健康度 PDF** — AI 產 headline + 分析 + 行動清單，一鍵下載
- ✅ **Supabase Auth + Magic Link** — 信箱登入，首次登入自動 clone demo 資料
- ✅ **嚴格多租戶 RLS** — 每家店資料完全隔離
- ✅ **合規稽核** — 每次 AI 操作寫 `compliance_events`

---

## 技術棧

| 層 | 選型 |
|---|---|
| Framework | Next.js 16 App Router + React 19 + Turbopack |
| UI | Tailwind v4 + shadcn/ui (base-nova + `@base-ui/react`) |
| AI | Vercel AI Gateway (`@ai-sdk/gateway`) + Claude Sonnet 4.6 |
| DB | Supabase Postgres 17 + RLS |
| Auth | Supabase email OTP + `@supabase/ssr` |
| PDF | html2canvas-pro + jspdf（client-side） |
| LINE | Messaging API（Push + Webhook） |
| Deploy | Vercel Fluid Compute |

---

## 本地開發

```bash
# 1. Clone + install
git clone https://github.com/ct-realfans/realfans.git
cd realfans
npm install

# 2. 拉環境變數（需 vercel link 過）
vercel env pull .env.local --yes

# 3. 啟動 dev server
npm run dev   # http://localhost:3000
```

沒 `AI_GATEWAY_API_KEY` 也能跑 — AI 會走 mock 回應，UI 不壞。

打開 <http://localhost:3000> 看行銷頁，
<http://localhost:3000/dashboard> 要登入（magic link 寄到你信箱）。

### 要測試 LINE 實送

1. 到 LINE Developers Console 建 Messaging API channel → 拿 Channel Access Token
2. `/dashboard/settings` → LINE 區塊貼入 → 儲存
3. Webhook URL 填：
   ```
   https://realfans-yazelins-projects.vercel.app/api/line/webhook/<你的 store id>
   ```
4. 顧客加 OA 為好友 → 自動綁定 → 去邀評頁選他 → 送 LINE

---

## 架構要點

```
使用者 → Next.js (Vercel Fluid Compute)
           ↓ cookie
       Supabase Auth
           ↓ RLS
       Postgres (stores / customers / review_invites / reviews / compliance_events)
           ↑ SECURITY DEFINER RPCs
LINE OA ──webhook──→ /api/line/webhook/[storeId] → 建 customer
                        ↑ 送邀評
                     /api/invites/send
                        ↑ 生成
                     /api/invites/generate → Claude via AI Gateway
```

- **Dashboard 所有 page.tsx 都 async** — 透過 `src/lib/data.ts` 的
  `getStore/getCustomers/getInvites/getReviews`（React `cache()` 去重複查詢）
- **AI prompts 在 `src/lib/ai.ts`** — 含合規護欄、mock fallback
- **AI 月報 JSON parsing** — 防呆解析，parse 失敗自動 fallback
- **LINE webhook 用 SECURITY DEFINER RPCs** 繞 RLS，而非洩露 service role key

---

## 部署

Git push 到 main → Vercel 自動部 preview。
推 production：

```bash
vercel deploy --prod --yes
```

GitHub Pages（投資人 deck）自動建置 `docs/` 資料夾。

---

## 商業模式

三層訂閱制：

| 方案 | 月費 | 目標客戶 |
|---|---|---|
| Starter | NT$990 | 單店 |
| **Pro** | **NT$3,990** | 成長期（主力） |
| 旗艦 | NT$9,990 | 連鎖 / 多門店 |

目標：Year 3 達 5,000 家付費商家 = NT$180M ARR。

完整 pitch：<https://ct-realfans.github.io/realfans/>

---

## 合規聲明

RealFans 嚴守以下紅線 — prompt 層已硬性阻擋：

1. 不誘導正面評價（Google Review Policy §2.3）
2. 不捏造顧客行為
3. 所有訊息含退訂選項
4. 所有 AI 操作留 `compliance_events` 稽核軌跡
5. 負評（≤3 星）強制人工審核

## License

All rights reserved · 2026 RealFans
