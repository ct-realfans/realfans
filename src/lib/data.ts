import { cache } from "react";
import { createServerSupabase } from "./supabase/server";
import { DEMO_STORE_ID, isSupabaseConfigured } from "./supabase";
import { ensureUserStore } from "./onboarding";
import type {
  Customer,
  ReviewInvite,
  ReviewRecord,
  Store,
  Channel,
  InviteStatus,
} from "./types";
import {
  demoCustomers,
  demoInvites,
  demoReviews,
  demoStore,
} from "./mock-data";

const DEMO = !isSupabaseConfigured;

type StoreRow = {
  id: string;
  name: string;
  industry: string | null;
  brand_voice: string | null;
  google_place_id: string | null;
  google_review_link: string | null;
};

type CustomerRow = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  line_id: string | null;
  tags: string[];
  notes: string | null;
  total_spend_twd: number;
  visits: number;
  last_visit_at: string | null;
};

type InviteRow = {
  id: string;
  customer_id: string;
  channel: Channel;
  status: InviteStatus;
  platform: "google" | "facebook" | "line";
  message: string;
  created_at: string;
  sent_at: string | null;
  reviewed_at: string | null;
  rating: number | null;
  customer: { name: string } | null;
};

type ReviewRow = {
  id: string;
  platform: "google" | "facebook" | "line";
  author_name: string | null;
  rating: number;
  content: string | null;
  ai_reply: string | null;
  replied_at: string | null;
  created_at: string;
  invite_id: string | null;
};

/**
 * Resolve which store the current request should see.
 * - Logged-in user: their own store (auto-created on first visit with demo data cloned)
 * - Anonymous: the shared demo store (read-only via RLS)
 */
export const getActiveStoreId = cache(async (): Promise<string> => {
  if (DEMO) return DEMO_STORE_ID;
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return DEMO_STORE_ID;
  return await ensureUserStore(user.id);
});

export const getStore = cache(async (): Promise<Store> => {
  if (DEMO) return demoStore;
  const storeId = await getActiveStoreId();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("stores")
    .select(
      "id, name, industry, brand_voice, google_place_id, google_review_link",
    )
    .eq("id", storeId)
    .single<StoreRow>();
  if (error || !data) return demoStore;
  return {
    id: data.id,
    name: data.name,
    industry: data.industry ?? "",
    brandVoice: data.brand_voice ?? "",
    googlePlaceId: data.google_place_id ?? undefined,
    linkReview: data.google_review_link ?? "",
  };
});

export const getCustomers = cache(async (): Promise<Customer[]> => {
  if (DEMO) return demoCustomers;
  const storeId = await getActiveStoreId();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("customers")
    .select(
      "id, name, phone, email, line_id, tags, notes, total_spend_twd, visits, last_visit_at",
    )
    .eq("store_id", storeId)
    .order("last_visit_at", { ascending: false })
    .returns<CustomerRow[]>();
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    name: r.name,
    phone: r.phone ?? undefined,
    email: r.email ?? undefined,
    lineId: r.line_id ?? undefined,
    tags: r.tags ?? [],
    notes: r.notes ?? undefined,
    totalSpend: r.total_spend_twd,
    visits: r.visits,
    lastVisitAt: (r.last_visit_at ?? "").slice(0, 10),
  }));
});

export const getInvites = cache(async (): Promise<ReviewInvite[]> => {
  if (DEMO) return demoInvites;
  const storeId = await getActiveStoreId();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("review_invites")
    .select(
      `id, customer_id, channel, status, platform, message, created_at, sent_at, reviewed_at, rating,
       customer:customers!inner(name)`,
    )
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .returns<InviteRow[]>();
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    customerId: r.customer_id,
    customerName: r.customer?.name ?? "—",
    channel: r.channel,
    status: r.status,
    platform: r.platform,
    message: r.message,
    createdAt: r.created_at,
    sentAt: r.sent_at ?? undefined,
    reviewedAt: r.reviewed_at ?? undefined,
    rating: r.rating ?? undefined,
  }));
});

export const getReviews = cache(async (): Promise<ReviewRecord[]> => {
  if (DEMO) return demoReviews;
  const storeId = await getActiveStoreId();
  const supabase = await createServerSupabase();
  const { data, error } = await supabase
    .from("reviews")
    .select(
      "id, platform, author_name, rating, content, ai_reply, replied_at, created_at, invite_id",
    )
    .eq("store_id", storeId)
    .order("created_at", { ascending: false })
    .returns<ReviewRow[]>();
  if (error || !data) return [];
  return data.map((r) => ({
    id: r.id,
    platform: r.platform,
    author: r.author_name ?? "匿名",
    rating: r.rating,
    content: r.content ?? "",
    aiReply: r.ai_reply ?? undefined,
    repliedAt: r.replied_at ?? undefined,
    createdAt: r.created_at,
    source: r.invite_id ? "invited" : "organic",
  }));
});

export async function getCustomerById(id: string): Promise<Customer | null> {
  const customers = await getCustomers();
  return customers.find((c) => c.id === id) ?? null;
}
