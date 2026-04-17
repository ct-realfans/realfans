import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!(url && anonKey);

let cached: SupabaseClient | null = null;

export function supabase(): SupabaseClient {
  if (!isSupabaseConfigured) {
    throw new Error(
      "Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.",
    );
  }
  if (!cached) {
    cached = createClient(url!, anonKey!, {
      auth: { persistSession: false },
    });
  }
  return cached;
}

export const DEMO_STORE_ID = "00000000-0000-0000-0000-000000000001";
