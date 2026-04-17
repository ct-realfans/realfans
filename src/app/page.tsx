import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { SiteNav } from "@/components/site/nav";
import { SiteFooter } from "@/components/site/footer";
import {
  ShieldCheck,
  Sparkles,
  MessageSquare,
  LineChart,
  Bot,
  AlertTriangle,
  Check,
  X,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  return (
    <>
      <SiteNav />
      <main className="flex-1">
        <Hero />
        <SocialProof />
        <Why />
        <Compare />
        <How />
        <Features />
        <Pricing />
        <Cta />
      </main>
      <SiteFooter />
    </>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-border/50">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 10%, rgba(16,185,129,0.15), transparent 40%), radial-gradient(circle at 80% 30%, rgba(20,184,166,0.12), transparent 45%)",
        }}
      />
      <div className="relative mx-auto max-w-6xl px-6 py-24 md:py-32">
        <Badge
          variant="secondary"
          className="mb-6 rounded-full border border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        >
          <ShieldCheck className="mr-1 size-3.5" />
          粉絲多的合法替代品 · 不買假粉、不刷假評論
        </Badge>
        <h1 className="max-w-3xl text-5xl font-black tracking-tight md:text-6xl">
          把你<span className="bg-gradient-to-r from-emerald-500 to-teal-500 bg-clip-text text-transparent">既有的真顧客</span>
          ，變成會推薦你的<br />五星聲量。
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-muted-foreground">
          RealFans 真粉是給台灣小商家的 AI 口碑成長引擎：自動發送個人化邀評、
          AI 代筆回覆留言、每週生成在地社群內容。
          <span className="text-foreground font-medium"> 同樣的預算，做真的事，效果還比假的好 5–10 倍。</span>
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Button size="lg" render={<Link href="/dashboard" />}>
            免費試用 14 天 <ArrowRight className="ml-1 size-4" />
          </Button>
          <Button size="lg" variant="outline" render={<Link href="#compare" />}>
            對比粉絲多 →
          </Button>
          <span className="text-sm text-muted-foreground">首月 NT$99 · 無須綁卡</span>
        </div>
        <div className="mt-12 grid grid-cols-2 gap-6 md:grid-cols-4">
          {[
            ["平均留評率", "12x", "相較自然留評"],
            ["客單價 LTV", "+38%", "VIP 回購增加"],
            ["節省時間", "15hr", "每月 / 門店"],
            ["合規率", "100%", "Google / Meta / 公平會"],
          ].map(([k, v, d]) => (
            <div key={k} className="border-l-2 border-emerald-500/50 pl-4">
              <div className="text-3xl font-bold tracking-tight">{v}</div>
              <div className="text-sm font-medium">{k}</div>
              <div className="text-xs text-muted-foreground">{d}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialProof() {
  return (
    <section className="border-b border-border/50 bg-muted/30 py-8">
      <div className="mx-auto max-w-6xl px-6">
        <p className="text-center text-xs uppercase tracking-widest text-muted-foreground">
          服務涵蓋產業
        </p>
        <div className="mt-4 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 text-sm font-medium text-muted-foreground">
          <span>☕ 咖啡早午餐</span>
          <span>🍜 餐飲小館</span>
          <span>💇 美髮美容</span>
          <span>🏥 牙科／診所</span>
          <span>🏫 補習班／才藝</span>
          <span>🏋️ 健身工作室</span>
          <span>🛍️ 在地零售</span>
        </div>
      </div>
    </section>
  );
}

function Why() {
  return (
    <section id="why" className="border-b border-border/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Badge variant="outline" className="mb-4">
          為什麼要替代粉絲多
        </Badge>
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          買假粉絲、假評論的代價，比你想的高。
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              icon: AlertTriangle,
              title: "違法風險",
              body: "台灣《公平交易法》第 21 條禁止不實表示；美國 FTC 2024 起可罰每則假評論 USD $51,744。",
              tag: "法律",
            },
            {
              icon: X,
              title: "平台封鎖",
              body: "Google / Meta / TikTok 演算法偵測能力連年升級，買粉帳號隨時被降權、下架。",
              tag: "平台",
            },
            {
              icon: LineChart,
              title: "ROI 幻覺",
              body: "假粉絲不買單、假評論不帶客，數字好看但營收沒動；真實顧客才是回購與口碑來源。",
              tag: "商業",
            },
          ].map(({ icon: Icon, title, body, tag }) => (
            <Card key={title} className="border-border/60">
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center gap-2">
                  <Icon className="size-5 text-rose-500" />
                  <Badge variant="secondary" className="text-xs">{tag}</Badge>
                </div>
                <div className="text-lg font-semibold">{title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Compare() {
  const rows: Array<
    [string, { value: string; ok: boolean }, { value: string; ok: boolean }]
  > = [
    [
      "Google 五星評論",
      { value: "向 IP 農場買，違法+封店", ok: false },
      { value: "AI 自動邀請真實顧客，合規", ok: true },
    ],
    [
      "FB / IG 粉絲",
      { value: "假帳號人頭，0 互動", ok: false },
      { value: "AI 內容工廠吸引真人追蹤", ok: true },
    ],
    [
      "顧客留言 / 訊息",
      { value: "不處理", ok: false },
      { value: "AI 代筆回覆，24/7 品牌語氣一致", ok: true },
    ],
    [
      "合規與法律",
      { value: "違反公平會、平台 ToS", ok: false },
      { value: "使用 Google Review Request API", ok: true },
    ],
    [
      "資料所有權",
      { value: "顧客名單留在工作室", ok: false },
      { value: "全部在你自己的 Supabase", ok: true },
    ],
    [
      "報表可解釋",
      { value: "只有數字，無法稽核", ok: false },
      { value: "每月 AI 品牌健康度 PDF", ok: true },
    ],
    [
      "月費（小商家）",
      { value: "NT$3,000–15,000+ 按項計費", ok: false },
      { value: "NT$990 起 · 首月 NT$99", ok: true },
    ],
  ];
  return (
    <section id="compare" className="border-b border-border/50 bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Badge variant="outline" className="mb-4">對比</Badge>
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          粉絲多 vs RealFans 真粉
        </h2>
        <p className="mt-3 text-muted-foreground">
          同樣解決「沒人氣、沒評論」痛點，但一個靠詐欺、一個靠 AI+真實顧客。
        </p>
        <Card className="mt-8 overflow-hidden">
          <div className="grid grid-cols-3 border-b bg-background text-sm font-medium">
            <div className="px-6 py-4">項目</div>
            <div className="border-l px-6 py-4 text-rose-600 dark:text-rose-400">
              粉絲多 Fansdoor
            </div>
            <div className="border-l px-6 py-4 text-emerald-600 dark:text-emerald-400">
              RealFans 真粉
            </div>
          </div>
          {rows.map(([label, a, b]) => (
            <div
              key={label}
              className="grid grid-cols-3 border-b text-sm last:border-0"
            >
              <div className="px-6 py-4 font-medium">{label}</div>
              <div className="flex items-start gap-2 border-l px-6 py-4 text-muted-foreground">
                {a.ok ? (
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                ) : (
                  <X className="mt-0.5 size-4 shrink-0 text-rose-500" />
                )}
                <span>{a.value}</span>
              </div>
              <div className="flex items-start gap-2 border-l px-6 py-4">
                {b.ok ? (
                  <Check className="mt-0.5 size-4 shrink-0 text-emerald-500" />
                ) : (
                  <X className="mt-0.5 size-4 shrink-0 text-rose-500" />
                )}
                <span>{b.value}</span>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </section>
  );
}

function How() {
  const steps = [
    {
      n: "01",
      title: "匯入顧客 / 串 POS",
      body: "CSV 上傳、LINE OA 綁定、或接 iCHEF / iPOS / Square。AI 自動打標 (VIP、新客、過敏、生日)。",
    },
    {
      n: "02",
      title: "AI 生成個人化邀評",
      body: "根據每位顧客的消費記錄、偏好、回訪次數，產出 LINE / SMS / Email 訊息，一秒 50 則。",
    },
    {
      n: "03",
      title: "發送 → 追蹤 → 回覆",
      body: "自動排程發送、追蹤開信 / 點擊 / 留評。新評論一進來，AI 用你的品牌語氣即時回覆。",
    },
    {
      n: "04",
      title: "每月品牌健康度報告",
      body: "AI 產出 PDF：星等趨勢、客群變化、競品對比、下月可執行行動清單。",
    },
  ];
  return (
    <section id="how" className="border-b border-border/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Badge variant="outline" className="mb-4">運作方式</Badge>
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          從結帳到好評，只剩 30 秒的距離。
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-4">
          {steps.map((s) => (
            <Card key={s.n} className="border-border/60">
              <CardContent className="pt-6">
                <div className="font-mono text-xs text-emerald-600 dark:text-emerald-400">
                  STEP {s.n}
                </div>
                <div className="mt-2 text-lg font-semibold">{s.title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{s.body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  const features = [
    {
      icon: Sparkles,
      title: "白帽評論引擎",
      body: "根據每位真實顧客的消費資料，AI 客製專屬邀評訊息。結帳後 2 小時自動發送。",
    },
    {
      icon: Bot,
      title: "AI 回覆代理人",
      body: "Google / FB / IG 留言與私訊，24/7 用你品牌的口吻回應，負評先由你預覽再回。",
    },
    {
      icon: MessageSquare,
      title: "內容工廠",
      body: "每週 30 則 IG / TikTok / FB 貼文與短影音腳本，套用在地爆款公式。",
    },
    {
      icon: LineChart,
      title: "在地 SEO 雷達",
      body: "監控 Google Business 關鍵字、方圓 3km 同業動態，每週行動清單直接推給你。",
    },
  ];
  return (
    <section className="border-b border-border/50 bg-muted/30 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Badge variant="outline" className="mb-4">功能</Badge>
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          一個平台，取代一整團的行銷代操。
        </h2>
        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {features.map(({ icon: Icon, title, body }) => (
            <Card key={title} className="border-border/60">
              <CardContent className="pt-6">
                <div className="mb-3 inline-flex size-10 items-center justify-center rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <Icon className="size-5" />
                </div>
                <div className="text-lg font-semibold">{title}</div>
                <p className="mt-2 text-sm text-muted-foreground">{body}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Pricing() {
  const tiers = [
    {
      name: "Starter",
      price: "NT$990",
      suffix: "/月",
      highlight: false,
      tagline: "單店小商家",
      items: [
        "每月 300 封 AI 邀評",
        "Google / FB 評論管理",
        "AI 自動回覆（上限 300）",
        "基礎儀表板",
      ],
    },
    {
      name: "Pro",
      price: "NT$3,990",
      suffix: "/月",
      highlight: true,
      tagline: "成長期商家",
      items: [
        "每月 2,000 封 AI 邀評",
        "LINE OA 深度整合",
        "AI 內容工廠（每週 30 則）",
        "在地 SEO 雷達 + 競品監控",
        "每月品牌健康度 PDF",
      ],
    },
    {
      name: "旗艦",
      price: "NT$9,990",
      suffix: "/月",
      highlight: false,
      tagline: "多門店 / 連鎖",
      items: [
        "無上限邀評與回覆",
        "多門店管理 + SSO",
        "API 與 POS 深度串接",
        "專屬成長顧問（月一會）",
        "白牌報告",
      ],
    },
  ];
  return (
    <section id="pricing" className="border-b border-border/50 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <Badge variant="outline" className="mb-4">定價</Badge>
        <h2 className="max-w-3xl text-3xl font-bold tracking-tight md:text-4xl">
          比買 100 個假粉絲還便宜，效果卻是 10 倍。
        </h2>
        <p className="mt-3 text-sm text-muted-foreground">
          所有方案皆含 14 天免費試用。年繳 20% off。
        </p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <Card
              key={t.name}
              className={
                t.highlight
                  ? "relative border-emerald-500 shadow-lg shadow-emerald-500/10"
                  : "border-border/60"
              }
            >
              {t.highlight && (
                <div className="absolute -top-3 left-6 rounded-full bg-emerald-500 px-3 py-1 text-xs font-semibold text-white">
                  最熱門
                </div>
              )}
              <CardContent className="pt-6">
                <div className="text-sm text-muted-foreground">{t.tagline}</div>
                <div className="mt-1 text-xl font-semibold">{t.name}</div>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold tracking-tight">
                    {t.price}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {t.suffix}
                  </span>
                </div>
                <Button
                  className="mt-6 w-full"
                  variant={t.highlight ? "default" : "outline"}
                  render={<Link href="/dashboard" />}
                >
                  選擇 {t.name}
                </Button>
                <ul className="mt-6 space-y-2 text-sm">
                  {t.items.map((it) => (
                    <li key={it} className="flex items-start gap-2">
                      <Check className="mt-0.5 size-4 text-emerald-500" />
                      <span>{it}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function Cta() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-4xl px-6 text-center">
        <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
          停止用假粉絲騙自己。
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          試用 14 天，如果沒有多出 5 則真實五星評論，全額退費。
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Button size="lg" render={<Link href="/dashboard" />}>
            免費開始 <ArrowRight className="ml-1 size-4" />
          </Button>
          <Button
            size="lg"
            variant="outline"
            render={<Link href="mailto:hello@realfans.tw" />}
          >
            預約 Demo
          </Button>
        </div>
      </div>
    </section>
  );
}
