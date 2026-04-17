# 詞彙對照表 · Glossary

給看這個 repo 但不熟新創 / SaaS 術語的人。每個縮寫都附 RealFans 的實際數字當範例。

---

## 1. 商業與市場

### SMB · Small and Medium-sized Business
**中小企業**。台灣 8 成以上公司是 SMB。我們的目標客戶就是 SMB（獨立咖啡廳、美容工作室、小診所等）。

### GTM · Go-to-Market
**上市策略 / 怎麼賣**。不是產品開發，是「做好了怎麼把客戶找來」。
見 [`GTM.md`](./GTM.md)。

### B2B / B2C
- **B2B** = Business to Business，我們是 B2B（賣軟體給商家）
- **B2C** = Business to Consumer，直接賣給個人消費者（我們**不是**）

### SaaS · Software as a Service
**訂閱制軟體**。客戶每月付錢用雲端服務，而非一次買斷。
Netflix、Shopify、Salesforce 都是 SaaS。我們也是。

### KOL / KOC
- **KOL** = Key Opinion Leader，網紅大咖
- **KOC** = Key Opinion Consumer，素人推薦者（影響力較小但可信度高）

---

## 2. 市場規模三層 — TAM / SAM / SOM

這三個是評估「市場有多大」的標準框架。從大到小：

### TAM · Total Addressable Market
**總體潛在市場**。假設你這個產業全世界 100% 被你拿下，最多值多少錢。

> **RealFans 的 TAM**：
> 台灣中小企業共 **1.66 萬家**（國發會 2024）
> → 每家每月理論上可付 NT$3,000
> → 年度 TAM ≈ NT$60 億

### SAM · Serviceable Addressable Market
**可服務市場**。扣掉你「做不到的」後，實際上你的產品能服務的範圍。

> **RealFans 的 SAM**：
> TAM 裡**有 Google Business + 在意評論**的實體商家
> → 約 **30 萬家**（F&B / 美容 / 診所 / 補教 / 零售）
> → 年度 SAM ≈ NT$108 億

### SOM · Serviceable Obtainable Market
**可實際拿下的市場**。3-5 年內你**合理預期**拿下多少。

> **RealFans 的 SOM**（Year 3 目標）：
> SAM 的 1.67% ≈ **5,000 家付費商家**
> → 年度 SOM ≈ NT$1.8 億（= NT$180M ARR）

投資人用這三個數字評估「你的天花板在哪」。TAM 越大越誘人，但 SOM 要務實。

---

## 3. SaaS 財務指標

### ARPA · Average Revenue Per Account
**每客戶月均貢獻**。總營收 ÷ 客戶數。

> RealFans 目標 ARPA：**NT$3,000/月**（假設 60% 選 Pro NT$3,990 / 30% Starter / 10% 旗艦）

### MRR · Monthly Recurring Revenue
**月度經常性收入**。訂閱收入 × 客戶數。

> 500 家付費 × NT$3,000 = **MRR NT$1.5M**

### ARR · Annual Recurring Revenue
**年度經常性收入** = MRR × 12。投資人最看這個。

> 500 家 × NT$36K/年 = **ARR NT$18M**（Year 1 目標）

### CAC · Customer Acquisition Cost
**獲客成本**。拿一個客戶總共花多少（廣告 + 業務薪水 + 工具 ÷ 新客數）。

> RealFans 目標 CAC：**NT$3,800/客戶**

### LTV · Lifetime Value
**客戶終身價值**。一個客戶從頭到退訂，總共付給你多少（扣成本後）。

> RealFans 目標 LTV：**NT$108K**（30 個月壽命 × NT$3,000 × 88% 毛利）

### LTV/CAC
**關鍵指標**。比值越高越健康。
- &lt; 1：虧錢，倒閉倒數
- 1-3：勉強
- 3-5：健康
- &gt; 5：優秀

> RealFans 目標：**28×**（這是我們的 🔴 預估模型值，Podium 類比約 5-8×）

### Payback Period
**回本期**。花 CAC 拿到一個客戶，多久 MRR 回收 CAC。

> 目標：**1.3 個月**（NT$3,800 ÷ NT$3,000 毛利）

### Churn Rate
**流失率**。每月退訂比例。
- 健康 SaaS &lt; 5% 月流失
- 優秀 &lt; 3%

> RealFans 目標：&lt; **5%/月**

### MoM / YoY
- **MoM** = Month over Month，月比（本月 vs 上月）
- **YoY** = Year over Year，年比（今年同月 vs 去年同月）

### Burn Rate / Runway
- **Burn Rate**：每月燒多少錢（支出 - 收入）
- **Runway**：剩多少錢 ÷ Burn Rate = 能活多久

> RealFans Seed NT$8M / 預估月燒 NT$670K = **12 個月 runway**

---

## 4. 募資與投資人

### Seed / Series A / B / C
輪次越後期，公司越成熟、金額越大。
- **Seed**：天使 / 種子輪，產品剛出來（我們現在）
- **Series A**：有 Product-Market Fit 證據，開始擴張
- **Series B+**：營收起飛後的成長資金
- **IPO**：上市

### PMF · Product-Market Fit
**產品市場契合**。客戶主動找你買、付錢、推薦給別人。
PMF 是 Series A 的門票。

### Term Sheet
**投資條件書**。投資人給你的正式 offer（估值、持股、條款）。

### Dilution
**稀釋**。每輪募資你的持股 % 會被稀釋。Seed 通常 15-25%，A 輪再加 15-25%。

### MOIC / IRR
- **MOIC** = Multiple on Invested Capital，投資人投 1 塊拿回幾塊
- **IRR** = Internal Rate of Return，年化報酬率

---

## 5. 產品與技術

### MVP · Minimum Viable Product
**最小可行產品**。能用、能收反饋的最少功能版本（不是最終版）。

> 我們的 MVP = 登入 + AI 邀評 + LINE 真送 + 月報 PDF（已完成 ✅）

### POC · Proof of Concept
**概念驗證**。試水溫、驗證假設。

> 我們的 POC 計劃 = 3 家商家免費試 3 個月，驗證 ROI 數字
> 見 [`POC.md`](./POC.md)

### Onboarding
**初次使用導引**。新客戶註冊後怎麼從零到會用。

### LINE OA · LINE Official Account
**LINE 官方帳號**。商家用來群發訊息給好友的帳號。

### LIFF · LINE Front-end Framework
**LINE 內嵌網頁**。在 LINE 內開網頁不跳離 app。
我們桌卡 QR 就用 LIFF。

### RLS · Row Level Security
**列級安全**。Supabase 的多租戶隔離機制 — 每個 row 自動依 user 過濾。
保證 A 商家看不到 B 商家的資料。

### OIDC · OpenID Connect
**聯邦認證**。免 API key 的認證方式。Vercel 上 AI Gateway 用這個。

### API · Application Programming Interface
**應用介面**。程式之間溝通的接口。LINE API、Google API、Stripe API…

### Webhook
**被動通知**。外部服務有事件發生時主動打我們的 URL。
LINE 加好友 → webhook → 我們建 customer。

### SDK · Software Development Kit
**軟體開發套件**。第三方給的函式庫。我們用 `@supabase/supabase-js` SDK。

### SSR / CSR
- **SSR** = Server-Side Rendering，伺服器端算好 HTML 給瀏覽器
- **CSR** = Client-Side Rendering，瀏覽器用 JS 渲染

Next.js 都做。

---

## 6. 本專案特有

### 粉絲多 · Fansdoor
<https://fansdoor.com> — 台灣地下賣假粉絲 / 假評論的業者。
我們要合法取代的對象。

### 邀評
給顧客傳 LINE/SMS/Email 邀請他們去 Google 留評論的訊息。

### Demo Store
Supabase 裡 ID = `00000000-0000-0000-0000-000000000001` 的示範店家。
新用戶登入時會 clone 這家店的資料到他自己的 store。

### Compliance Events
`compliance_events` 資料表。所有 AI 操作（邀評、回覆、發送）都寫一筆，
之後公平會或 Google 查帳能直接匯出稽核軌跡。

### 合規護欄
AI prompt 裡硬寫的規則：不誘導好評、不捏造、含退訂等。
詳見 [`CLAUDE.md`](./CLAUDE.md) 合規紅線章節。

---

## 7. AI 相關

### LLM · Large Language Model
**大型語言模型**。Claude、GPT、Gemini 都是。

### Prompt
**提示詞**。給 AI 的指令。寫 prompt 是門藝術（prompt engineering）。

### Token
AI 計費單位。大約 1 token = 0.75 個英文字 / 1 個中文字。
Claude Sonnet 4.6 輸入 token $3/M，輸出 $15/M。

### Fallback
AI 失敗時的後備機制。我們的 code 若 Claude 失敗，自動走預寫的 mock 文字。

### Context Window
AI 一次能吃多少文字。Claude Sonnet 4.6 = 200K tokens（約 15 萬中文字）。

---

## 一頁看完 · Cheat Sheet

```
市場三層：TAM (總) → SAM (可服務) → SOM (可拿下) = 1.66M / 300K / 5,000 店

SaaS 五大指標：
  ARPA = 單客月貢獻      目標 NT$3K
  ARR  = 年度訂閱收入    目標 Year 3 NT$180M
  CAC  = 獲客成本        目標 NT$3.8K
  LTV  = 客戶終身價值    目標 NT$108K
  LTV/CAC = 投報比       目標 28× (🔴 預估)

產品階段：MVP (有了) → POC (進行中) → PMF (目標) → Series A
```
