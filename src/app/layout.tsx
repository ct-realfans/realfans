import type { Metadata } from "next";
import { Noto_Sans_TC, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sans = Noto_Sans_TC({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "900"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "RealFans 真粉 — AI 驅動的真實口碑成長引擎",
  description:
    "不買假粉、不刷假評論。RealFans 用 AI 幫小商家把既有顧客變成五星評論與回頭客，合法、可驗證、更便宜。",
  openGraph: {
    title: "RealFans 真粉",
    description: "AI 驅動的真實口碑引擎 — 粉絲多的合法替代品",
    locale: "zh_TW",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="zh-Hant-TW"
      className={`${sans.variable} ${mono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground">
        {children}
      </body>
    </html>
  );
}
