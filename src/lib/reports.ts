import { createServerSupabase } from "./supabase/server";
import { getActiveStoreId, getStore } from "./data";
import type { MonthlyStats } from "./ai";

export type MonthKey = `${number}-${number}`;

export function parseMonth(month?: string): {
  key: MonthKey;
  label: string;
  start: Date;
  end: Date;
  prevStart: Date;
  prevEnd: Date;
} {
  const now = new Date();
  let year = now.getFullYear();
  let mon = now.getMonth() + 1;
  if (month && /^\d{4}-\d{2}$/.test(month)) {
    const [y, m] = month.split("-").map(Number);
    year = y;
    mon = m;
  }
  const start = new Date(Date.UTC(year, mon - 1, 1));
  const end = new Date(Date.UTC(year, mon, 1));
  const prevStart = new Date(Date.UTC(year, mon - 2, 1));
  const prevEnd = new Date(Date.UTC(year, mon - 1, 1));
  const key = `${year}-${String(mon).padStart(2, "0")}` as MonthKey;
  const label = `${year} 年 ${mon} 月`;
  return { key, label, start, end, prevStart, prevEnd };
}

export function listRecentMonths(count = 6): MonthKey[] {
  const out: MonthKey[] = [];
  const now = new Date();
  for (let i = 0; i < count; i++) {
    const d = new Date(Date.UTC(now.getFullYear(), now.getMonth() - i, 1));
    const key = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}` as MonthKey;
    out.push(key);
  }
  return out;
}

export async function computeMonthlyStats(month?: string): Promise<MonthlyStats> {
  const { key, start, end, prevStart, prevEnd } = parseMonth(month);
  const supabase = await createServerSupabase();
  const storeId = await getActiveStoreId();
  const store = await getStore();

  const [cur, prev, invitesAll] = await Promise.all([
    supabase
      .from("reviews")
      .select("rating, content")
      .eq("store_id", storeId)
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString()),
    supabase
      .from("reviews")
      .select("rating")
      .eq("store_id", storeId)
      .gte("created_at", prevStart.toISOString())
      .lt("created_at", prevEnd.toISOString()),
    supabase
      .from("review_invites")
      .select("status, created_at")
      .eq("store_id", storeId)
      .gte("created_at", start.toISOString())
      .lt("created_at", end.toISOString()),
  ]);

  const reviews = cur.data ?? [];
  const prevReviews = prev.data ?? [];
  const invites = invitesAll.data ?? [];

  const totalReviews = reviews.length;
  const avgRating =
    totalReviews > 0
      ? reviews.reduce((a, r) => a + (r.rating ?? 0), 0) / totalReviews
      : 0;
  const prevTotalReviews = prevReviews.length;
  const prevAvgRating =
    prevTotalReviews > 0
      ? prevReviews.reduce((a, r) => a + (r.rating ?? 0), 0) / prevTotalReviews
      : null;

  const fiveStarCount = reviews.filter((r) => r.rating === 5).length;
  const lowStarCount = reviews.filter((r) => (r.rating ?? 5) <= 3).length;
  const invitesSent = invites.filter(
    (i) => i.status !== "draft" && i.status !== "scheduled",
  ).length;
  const invitesReviewed = invites.filter((i) => i.status === "reviewed").length;
  const conversionRate =
    invitesSent > 0 ? (invitesReviewed / invitesSent) * 100 : 0;

  const fivePos = [...reviews]
    .filter((r) => r.rating === 5 && r.content)
    .sort((a, b) => (b.content?.length ?? 0) - (a.content?.length ?? 0))[0];
  const topConcern = [...reviews]
    .filter((r) => (r.rating ?? 5) <= 3 && r.content)
    .sort((a, b) => (b.content?.length ?? 0) - (a.content?.length ?? 0))[0];

  return {
    month: key,
    totalReviews,
    avgRating,
    fiveStarCount,
    lowStarCount,
    invitesSent,
    invitesReviewed,
    conversionRate,
    prevAvgRating,
    prevTotalReviews: prevTotalReviews > 0 ? prevTotalReviews : null,
    topPositiveQuote: fivePos?.content ?? undefined,
    topConcernQuote: topConcern?.content ?? undefined,
    industry: store.industry,
    storeName: store.name,
    brandVoice: store.brandVoice,
  };
}
