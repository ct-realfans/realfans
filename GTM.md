# Go-to-Market Playbook

怎麼讓這個產品實際跑起來 — 顧客資料從哪來、邀評什麼時候送、不同產業怎麼切入。

---

## 核心流程拆解

```
                ┌──────────────┐
                │  1. 拿到顧客   │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │  2. 抓到時機   │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │  3. 送出通路   │
                └──────┬───────┘
                       ↓
                ┌──────────────┐
                │  4. 轉成評論   │
                └──────────────┘
```

---

## 1. 顧客資料進系統的管道

### 🟢 目前已實作

| 來源 | 自動化程度 | 檔案 |
|---|---|---|
| LINE 加好友 | ✅ 全自動 | `src/app/api/line/webhook/[storeId]/route.ts` |
| 手動新增 | ❌ UI 未做 | — |
| CSV 匯入 | ❌ 未做 | — |

### 🔴 待建（按 ROI 排序）

| 來源 | 為什麼關鍵 | 工程量 |
|---|---|---|
| **桌卡 / 收據 QR → LIFF 加 LINE** | 現場最即時、可帶桌號/店員 context | 0.5 天 |
| **CSV 匯入 + 手動新增** | 第一天 onboarding 解法 | 0.5 天 |
| **iCHEF / Square / iPOS webhook** | 結帳自動進 + 帶金額（台灣餐飲 60% 用 iCHEF） | 2-3 天 |
| **Google Business 訂位資料** | 帶電話，美容 / 診所最大來源 | 1 天 |
| **Shopify / 蝦皮訂單** | 電商垂直必備 | 2 天 |
| **預約系統（Booky、FastBooky）** | 美容、醫療、補教必備 | 1-2 天/家 |

---

## 2. 邀評觸發時機（決定轉換率的關鍵）

### 黃金時窗

| 產業 | 最佳時機 | 原因 | 觸發來源 |
|---|---|---|---|
| 餐飲 | 離店後 **2-4 hr** | 味覺記憶還新鮮、不打擾用餐 | POS 結帳事件 |
| 咖啡廳 | 當天 **20:00-22:00** | 不在工作時段、睡前滑手機 | POS 或手動 |
| 美髮 / 美容 | **隔天早上** | 讓顧客照鏡子確認滿意 | 預約系統完成事件 |
| 診所 | 治療後 **24-48 hr** | 確認治療效果穩定 | 看診系統 |
| 補習班 | 課程結束 **當天晚上** | 家長/學生心情還在 | 排課系統 |
| 健身房 | 訓練後 **1 hr** | 多巴胺高峰 | 打卡系統 |
| 電商 | 收到貨 **+3 天** | 確認商品沒瑕疵 | 物流 webhook |

### ⚠️ 目前送出是即時的，要做延遲排程

三個方案（擇一）：
- **Vercel Cron**（每小時掃 DB 找到期 invite）— 最簡單
- **Vercel Queues**（原生延遲排程）— 最正統
- **Supabase `pg_cron` extension** — 不離開 DB

---

## 3. 送出通路對比

| 通路 | 觸及率 | 成本 | 目前狀態 |
|---|---|---|---|
| **LINE 訊息** | 95%（已加 OA） | $0 免費 500/月、付費 NT$800 / 4K 則 | ✅ 實作完成 |
| **SMS** | 98% | ~NT$0.7/則（Twilio TW） | ❌ 回 501 |
| **Email** | 30-40% 開信 | ~NT$0.002/封（Resend 免費 3K/月） | ❌ 未做 |
| **Google Business DM** | N/A | $0 | 2025 API 開放，未接 |

---

## 4. 三個真實情境（GTM 劇本）

### 情境 A — 單店咖啡廳（小春日和這型）

```
桌卡印 QR 「加 LINE 享第二杯折 20」
    ↓
客人掃 → LIFF → 加 OA 好友
    ↓ webhook 事件
我們自動建 customer（帶 table=5, staff=ben 參數）
    ↓ 延遲 2 hr
AI 邀評訊息 LINE 送達
    ↓
客人點留評連結 → Google 五星
```

**需補**：LIFF QR generator + 延遲排程（合計 0.5-1 天）
**首客難度**：低 — 一家咖啡廳 3 天內 onboard

### 情境 B — 美髮工作室（預約制）

```
設計師在 Google Calendar 標「已服務完成」
    ↓ 手動或 webhook
我們把該預約匹配到 customer
    ↓ 排程隔天 10:00
SMS 或 LINE（依綁定狀況）送出邀評
    ↓
客人點連結 → Google 五星
```

**需補**：Google Calendar OAuth + SMS（Twilio 台灣）
**首客難度**：中 — 需手動教設計師操作

### 情境 C — iCHEF 餐廳（最大量）

```
客人結帳（iCHEF POS）
    ↓ iCHEF OpenAPI webhook
我們建 customer（含金額、桌號、品項）
    ↓ 延遲 4 hr 排程
LINE（有綁）or SMS（有電話）
    ↓
客人點連結 → Google 五星
```

**需補**：iCHEF OpenAPI 整合（他們 2023 開放）
**首客難度**：高 — 但打下就是量販路線

---

## 下一步優先順序（對拿下首批客戶最有用）

1. **LIFF 桌卡 QR generator**（0.5 天）
   - 老闆在 dashboard 印 QR code（帶店家/桌號參數）
   - 顧客掃 → LIFF 頁面 → 自動加 LINE OA 為好友
   - Webhook 把參數寫進 customer.notes

2. **延遲排程**（0.5 天）
   - `review_invites.scheduled_at` 欄位已存在
   - 新增 Vercel Cron hourly：掃「scheduled_at ≤ now() AND status = 'scheduled'」然後送出
   - 或用 Vercel Queues

3. **CSV 匯入 + 手動新增**（0.5 天）
   - Dashboard 加「新增顧客」按鈕 + 表單
   - `/dashboard/customers` 加 CSV drag-drop upload
   - server action 解析 + 寫 DB

4. **SMS 通路**（0.5 天）
   - 接 Twilio API（台灣要開 A2P 10DLC）
   - Settings 加 Twilio token 欄位
   - `/api/invites/send` 補 SMS 分支

5. **iCHEF OpenAPI**（2-3 天）
   - 需跟 iCHEF 申請合作夥伴
   - 他們給 webhook + API key
   - 我們接收 checkout 事件寫 customer

---

## 成本模型（Pro 方案：NT$3,990/月 / 2,000 封邀評）

| 項目 | 月成本 |
|---|---|
| Claude Sonnet（2,000 次 × NT$1.5） | NT$3,000 |
| LINE Push（若爆 500/月改付費 4K 方案） | NT$800 |
| Vercel 託管 | NT$300 |
| Supabase | NT$0（Free tier 撐到 ~300 店） |
| **邊際成本合計** | **NT$4,100（高估）** |

嗯... Pro 方案 NT$3,990 毛利有問題。**實際上**：

- LINE 免費額度 500 封 / 月 對「主動送」已夠 — 真邀評送 300-400 即可
- Claude 實際每次 < NT$1（短 prompt）
- 未採用顧客不計成本

修正後 Pro 毛利：NT$3,990 - NT$800（AI + LINE 加購）= **NT$3,190**（80% 毛利）

Starter NT$990 方案限 300 封，幾乎無需付費 LINE，毛利 &gt;90%。

---

## 投資人會問的困難問題

| 問題 | 回答要點 |
|---|---|
| 為什麼店家要裝桌卡 QR？ | 「加好友折 20」的 hook，店家自己有動機（再行銷） |
| LINE 加好友後，顧客會封鎖不？ | 會，但我們用 LINE 官方精準推送（avg 推 2-3 次/月），不刷洗 |
| iCHEF 不給 API 怎辦？ | Plan B：POS 螢幕拍收據 OCR / 手動輸入 / email 解析訂位通知 |
| 店家懶得接整合怎辦？ | LIFF QR 就能跑 MVP，POS 整合是「升級路徑」 |
| 為什麼不直接做 Google Business？ | Google Review Request API 限制嚴格、個人化無空間；我們走 LINE/SMS 更彈性 |
