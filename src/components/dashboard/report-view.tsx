"use client";

import { useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  FileDown,
  Loader2,
  Sparkles,
  TrendingUp,
  TrendingDown,
  Minus,
  Star,
  AlertTriangle,
  Target,
} from "lucide-react";
import type { MonthlyStats, MonthlyInsights } from "@/lib/ai";
import type { MonthKey } from "@/lib/reports";

export function ReportView({
  monthKey,
  monthLabel,
  stats,
  insights,
  model,
  availableMonths,
}: {
  monthKey: string;
  monthLabel: string;
  stats: MonthlyStats;
  insights: MonthlyInsights;
  model: string;
  availableMonths: MonthKey[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const printRef = useRef<HTMLDivElement>(null);
  const [downloading, startDownload] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function onMonthChange(m: string | null) {
    if (!m) return;
    const params = new URLSearchParams(searchParams.toString());
    params.set("month", m);
    router.push(`/dashboard/reports?${params.toString()}`);
  }

  async function downloadPdf() {
    setError(null);
    startDownload(async () => {
      try {
        const [{ default: html2canvas }, jsPDFMod] = await Promise.all([
          import("html2canvas-pro"),
          import("jspdf"),
        ]);
        if (!printRef.current) return;

        const canvas = await html2canvas(printRef.current, {
          backgroundColor: "#ffffff",
          scale: 2,
          useCORS: true,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDFMod.jsPDF({
          orientation: "portrait",
          unit: "pt",
          format: "a4",
        });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const imgW = pageW;
        const imgH = (canvas.height * imgW) / canvas.width;

        let heightLeft = imgH;
        let position = 0;
        pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
        heightLeft -= pageH;
        while (heightLeft > 0) {
          position = heightLeft - imgH;
          pdf.addPage();
          pdf.addImage(imgData, "PNG", 0, position, imgW, imgH);
          heightLeft -= pageH;
        }
        pdf.save(`realfans_${stats.storeName}_${monthKey}.pdf`);
      } catch (err) {
        setError(err instanceof Error ? err.message : "pdf_failed");
      }
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Select value={monthKey} onValueChange={onMonthChange}>
            <SelectTrigger className="w-44">
              <span>{monthLabel}</span>
            </SelectTrigger>
            <SelectContent>
              {availableMonths.map((m) => (
                <SelectItem key={m} value={m}>
                  {m.replace("-", " 年 ")} 月
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Badge variant="outline" className="font-mono text-[10px]">
            {model.slice(0, 40)}
          </Badge>
        </div>
        <Button onClick={downloadPdf} disabled={downloading}>
          {downloading ? (
            <>
              <Loader2 className="mr-1 size-4 animate-spin" /> 產生 PDF…
            </>
          ) : (
            <>
              <FileDown className="mr-1 size-4" /> 下載 PDF
            </>
          )}
        </Button>
      </div>
      {error && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/5 p-3 text-sm text-rose-700 dark:text-rose-300">
          PDF 下載錯誤：{error}
        </div>
      )}

      <div
        ref={printRef}
        className="rounded-xl bg-white p-10 text-zinc-900 shadow-sm dark:shadow-none"
      >
        <ReportDocument stats={stats} insights={insights} monthLabel={monthLabel} />
      </div>
    </div>
  );
}

function ReportDocument({
  stats,
  insights,
  monthLabel,
}: {
  stats: MonthlyStats;
  insights: MonthlyInsights;
  monthLabel: string;
}) {
  const trend =
    stats.prevAvgRating !== null
      ? stats.avgRating > stats.prevAvgRating
        ? "up"
        : stats.avgRating < stats.prevAvgRating
          ? "down"
          : "flat"
      : "flat";
  const trendDiff =
    stats.prevAvgRating !== null
      ? (stats.avgRating - stats.prevAvgRating).toFixed(1)
      : null;

  return (
    <>
      <div className="flex items-start justify-between border-b border-zinc-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-medium tracking-widest text-emerald-600">
            <span className="inline-block size-4 rounded-md bg-gradient-to-br from-emerald-400 to-teal-600" />
            REALFANS · 品牌健康度報告
          </div>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            {stats.storeName}
          </h1>
          <div className="text-sm text-zinc-500">
            {stats.industry} · {monthLabel}
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs text-zinc-500">產出日期</div>
          <div className="font-mono text-sm">
            {new Date().toISOString().slice(0, 10)}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="rounded-xl bg-emerald-50 p-6">
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-emerald-700">
            <Sparkles className="size-3.5" /> AI 敘事
          </div>
          <p className="mt-2 text-2xl font-bold leading-snug tracking-tight text-emerald-900">
            {insights.headline}
          </p>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-4 gap-4">
        <Stat
          label="本月評論"
          value={String(stats.totalReviews)}
          sub={
            stats.prevTotalReviews
              ? `上月 ${stats.prevTotalReviews}`
              : "無去年資料"
          }
        />
        <Stat
          label="平均星等"
          value={stats.avgRating.toFixed(1)}
          sub={
            trendDiff
              ? `${trend === "up" ? "▲" : trend === "down" ? "▼" : "—"} ${Math.abs(Number(trendDiff)).toFixed(1)}`
              : "新起步"
          }
          tone={trend === "up" ? "up" : trend === "down" ? "down" : "flat"}
        />
        <Stat
          label="五星評論"
          value={String(stats.fiveStarCount)}
          sub={`佔比 ${stats.totalReviews ? Math.round((stats.fiveStarCount / stats.totalReviews) * 100) : 0}%`}
        />
        <Stat
          label="邀評轉換"
          value={`${stats.conversionRate.toFixed(0)}%`}
          sub={`${stats.invitesReviewed} / ${stats.invitesSent}`}
        />
      </div>

      <div className="mt-8 grid grid-cols-2 gap-6">
        <Section icon={TrendingUp} title="做得好" tone="positive">
          {insights.wentWell}
        </Section>
        <Section icon={AlertTriangle} title="需要改進" tone="warning">
          {insights.toImprove}
        </Section>
      </div>

      <div className="mt-8">
        <Section icon={Target} title="下月行動清單" tone="action">
          <ol className="mt-2 space-y-2">
            {insights.nextMonthActions.map((action, i) => (
              <li
                key={i}
                className="flex gap-3 rounded-md bg-emerald-50/50 p-3 text-sm text-zinc-800"
              >
                <span className="font-mono font-bold text-emerald-600">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span>{action}</span>
              </li>
            ))}
          </ol>
        </Section>
      </div>

      {(stats.topPositiveQuote || stats.topConcernQuote) && (
        <div className="mt-8 grid grid-cols-2 gap-6">
          {stats.topPositiveQuote && (
            <Quote
              tone="positive"
              label="本月最有感的五星評論"
              content={stats.topPositiveQuote}
            />
          )}
          {stats.topConcernQuote && (
            <Quote
              tone="concern"
              label="本月需留意的批評"
              content={stats.topConcernQuote}
            />
          )}
        </div>
      )}

      <div className="mt-10 border-t border-zinc-200 pt-4 text-center text-xs text-zinc-400">
        本報告由 RealFans 真粉 AI 自動生成 · 資料來自真實顧客留評 · 零假粉絲
      </div>
    </>
  );
}

function Stat({
  label,
  value,
  sub,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  tone?: "up" | "down" | "flat";
}) {
  const toneColor =
    tone === "up"
      ? "text-emerald-600"
      : tone === "down"
        ? "text-rose-600"
        : "text-zinc-500";
  return (
    <div className="rounded-lg border border-zinc-200 bg-white p-4">
      <div className="text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </div>
      <div className="mt-1 text-3xl font-bold tracking-tight">{value}</div>
      <div className={`mt-1 text-xs ${toneColor}`}>{sub}</div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  tone,
  children,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tone: "positive" | "warning" | "action";
  children: React.ReactNode;
}) {
  const accent =
    tone === "positive"
      ? "text-emerald-700 border-l-emerald-500"
      : tone === "warning"
        ? "text-amber-700 border-l-amber-500"
        : "text-sky-700 border-l-sky-500";
  return (
    <div className={`border-l-4 pl-4 ${accent}`}>
      <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
        <Icon className="size-4" />
        {title}
      </div>
      <div className="text-sm leading-relaxed text-zinc-700">{children}</div>
    </div>
  );
}

function Quote({
  tone,
  label,
  content,
}: {
  tone: "positive" | "concern";
  label: string;
  content: string;
}) {
  const accent =
    tone === "positive"
      ? "bg-emerald-50 border-emerald-200"
      : "bg-amber-50 border-amber-200";
  return (
    <div className={`rounded-lg border p-4 ${accent}`}>
      <div className="mb-2 flex items-center gap-1 text-xs font-medium text-zinc-500">
        <Star className="size-3" />
        {label}
      </div>
      <blockquote className="text-sm italic leading-relaxed text-zinc-800">
        「{content}」
      </blockquote>
    </div>
  );
}
