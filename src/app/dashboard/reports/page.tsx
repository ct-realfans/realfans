import { DashboardHeader } from "@/components/dashboard/header";
import { computeMonthlyStats, listRecentMonths, parseMonth } from "@/lib/reports";
import { generateMonthlyInsights } from "@/lib/ai";
import { ReportView } from "@/components/dashboard/report-view";

export default async function ReportsPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>;
}) {
  const params = await searchParams;
  const { key, label } = parseMonth(params.month);
  const stats = await computeMonthlyStats(key);
  const { insights, model } = await generateMonthlyInsights(stats);
  const months = listRecentMonths(6);

  return (
    <>
      <DashboardHeader
        title="品牌健康度報告"
        subtitle={`${label} · AI 自動生成 · 可下載 PDF 轉發`}
      />
      <div className="flex-1 p-6">
        <ReportView
          monthKey={key}
          monthLabel={label}
          stats={stats}
          insights={insights}
          model={model}
          availableMonths={months}
        />
      </div>
    </>
  );
}
