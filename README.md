# RealFans 真粉

> AI 驅動的真實口碑成長引擎 — 粉絲多 Fansdoor 的合法替代品。

不買假粉、不刷假評論。**把既有真顧客，變成會推薦你的五星聲量。**

## 產品

- 🔥 **白帽評論引擎**：AI 根據顧客歷史生成個人化邀評訊息（LINE / SMS / Email），合規不誘導
- 🤖 **AI 回覆代理人**：Google / FB / IG 留言 24/7 自動回應，符合你的品牌語氣
- 📈 **內容工廠**：每週 30 則社群貼文 + 短影音腳本
- 🎯 **在地 SEO 雷達**：監控方圓 3km 同業與關鍵字
- 📊 **每月品牌健康度 PDF**：可直接給老闆看的 AI 報告

## 技術棧

Next.js 16 · React 19 · Tailwind v4 · shadcn/ui · Vercel AI Gateway · Supabase

## 本地開發

```bash
cp .env.example .env.local   # 填入 AI_GATEWAY_API_KEY 才會真正呼叫 LLM
npm install
npm run dev
```

沒填 `AI_GATEWAY_API_KEY` 也可以試 — 會使用內建 mock 回應。

打開 <http://localhost:3000> 看行銷頁，<http://localhost:3000/dashboard>
看後台。

## 首月體驗路徑

1. 首頁 → 14 天試用
2. 上傳客戶 CSV（或接 iCHEF / Square）
3. AI 自動打標、生成邀評
4. 排程發送 → 追蹤 → AI 自動回覆評論
5. 每月 AI 報告

## 為什麼合法

- 使用 Google 官方 Review Request 精神：只邀請**真實**顧客
- AI 訊息不含「請留五星」這類誘導語
- 所有邀評、回覆都有 `compliance_events` 稽核軌跡
- 顧客可隨時退訂
