# Roadmap

功能開發優先順序。每個 item 標註工程量、優先級、理由。

---

## P0 · 對「拿下首批付費客戶」最關鍵

| # | 功能 | 工程量 | 狀態 | 理由 |
|---|---|---|---|---|
| 1 | **LIFF 桌卡 QR** | 0.5 天 | ❌ | 餐飲 GTM 劇本 A 的缺口，沒這個店家跑不了 |
| 2 | **延遲排程（Cron）** | 0.5 天 | ❌ | 所有產業的「黃金時窗」都需要；送出時機比訊息內容更決定轉換率 |
| 3 | **CSV 匯入 + 手動新增顧客** | 0.5 天 | ❌ | Onboarding 第一天就要用 |
| 4 | **SMS 通路（Twilio）** | 0.5 天 | ❌ 回 501 | 美容/診所客戶沒 LINE 的比例高 |
| 5 | **Middleware → Proxy 改名** | 15 分 | ⚠️ warning | Next.js 16 deprecation warning |

**合計 P0：2 天可交付**

---

## P1 · 規模化的關鍵整合

| # | 功能 | 工程量 | 狀態 | 理由 |
|---|---|---|---|---|
| 6 | **iCHEF OpenAPI 整合** | 2-3 天 | ❌ | 台灣餐飲 60% 市佔，打通後量販 |
| 7 | **Google Business Profile API** | 1 天 | ❌ | 未來評論直接抓回、訂位資料帶入 |
| 8 | **Email 通路（Resend）** | 0.5 天 | ❌ | 電商垂直必備 |
| 9 | **Supabase Auth URLs 自動化** | 0.5 天 | ❌ | 降低 onboarding 手動步驟 |
| 10 | **多店管理 / 切換** | 1 天 | ❌ | 連鎖與顧問型客戶必備 |

---

## P2 · 商業化與擴展

| # | 功能 | 工程量 | 理由 |
|---|---|---|
| 11 | Stripe 訂閱計費 | 2 天 | 收錢 |
| 12 | 管理員後台（看所有 tenant） | 1 天 | 客戶成功團隊用 |
| 13 | Admin metrics dashboard | 1 天 | 內部看 MRR、churn、usage |
| 14 | 自訂網域 `realfans.tw` | 0.5 天 | 銷售用 |
| 15 | Shopify / 蝦皮 integration | 2-3 天 | 電商垂直 |
| 16 | Google Calendar webhook | 1 天 | 美容 / 醫療垂直 |

---

## P3 · 產品深度

| # | 功能 | 工程量 | 理由 |
|---|---|---|
| 17 | AI 內容工廠（週 30 則 IG/TikTok 貼文） | 3 天 | Pro 方案賣點 |
| 18 | 在地 SEO 雷達（方圓 3km 競品） | 3 天 | 旗艦方案賣點 |
| 19 | 月報 email 自動寄送 | 1 天 | 黏著度 |
| 20 | A/B test AI prompts | 2 天 | 轉換率優化 |

---

## 技術債

| 項目 | 影響 | 解法 |
|---|---|---|
| ⚠️ `middleware.ts` 檔名 | Next.js 16 deprecation warning | 改 `proxy.ts` |
| ⚠️ LINE token 明文 | 安全 | 改用 `pgsodium` 加密或 Vercel env per-tenant |
| ⚠️ mock-data.ts 還在 import 鏈 | 死碼 | 確認 Supabase env 都設好後移除 |
| ⚠️ AI Gateway 走 mock | 真 Claude 還沒啟用 | Vercel AI Gateway 綁卡 |
| ⚠️ 只有 demo store 有 seed | 新用戶 onboarding 體驗 | onboarding clone 已做，但要壓測 |

---

## 投資人里程碑對應

| 里程碑 | 工期 | 需完成的功能 |
|---|---|---|
| **首批 10 家付費店家** | 1 個月 | P0 全做完 + 有 sales deck |
| **100 家付費** | 3 個月 | P0 + P1 部分 + Stripe 計費 + email 月報 |
| **500 家付費（投 A 輪）** | 12 個月 | P0 + P1 + P2 全做完 |
| **5,000 家（ARR NT$180M）** | 36 個月 | P0-P3 + 海外試點 |

---

## 做法筆記（給未來自己）

- 盡量不要一次做太多 P1 — 先把 P0 那 5 個做完跑 10 家客戶再說
- 任何新功能上線前：typecheck + build + 手動在 prod 測一次 send
- 每次有新整合（iCHEF / Twilio / Resend），記得加到 `settings/actions.ts`
  讓使用者可自助設定 token
- 合規護欄改動前務必讀 `CLAUDE.md` 合規紅線章節
