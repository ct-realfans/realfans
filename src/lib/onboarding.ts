import { createServerSupabase } from "./supabase/server";
import { DEMO_STORE_ID } from "./supabase";

/**
 * Find or create a store for the given user.
 * First-time users get a cloned copy of the demo store (customers, invites, reviews)
 * so they have something to play with immediately.
 */
export async function ensureUserStore(userId: string): Promise<string> {
  const supabase = await createServerSupabase();

  const { data: existing } = await supabase
    .from("stores")
    .select("id")
    .eq("owner_user_id", userId)
    .limit(1)
    .maybeSingle();
  if (existing) return existing.id;

  const { data: demo } = await supabase
    .from("stores")
    .select("name, industry, brand_voice, google_place_id, google_review_link")
    .eq("id", DEMO_STORE_ID)
    .single();

  const { data: newStore, error: storeErr } = await supabase
    .from("stores")
    .insert({
      owner_user_id: userId,
      name: demo?.name ?? "我的店",
      industry: demo?.industry ?? "",
      brand_voice:
        demo?.brand_voice ??
        "溫暖、親切、對老客人像朋友。避免罐頭感與官方腔。",
      google_place_id: demo?.google_place_id ?? null,
      google_review_link:
        demo?.google_review_link ?? "https://g.page/r/change-me/review",
      plan: "starter",
    })
    .select("id")
    .single();

  if (storeErr || !newStore) {
    throw new Error(
      `Failed to create store: ${storeErr?.message ?? "unknown"}`,
    );
  }

  const storeId = newStore.id;

  const { data: demoCustomers } = await supabase
    .from("customers")
    .select(
      "name, phone, email, line_id, tags, notes, total_spend_twd, visits, last_visit_at",
    )
    .eq("store_id", DEMO_STORE_ID);

  if (demoCustomers?.length) {
    await supabase.from("customers").insert(
      demoCustomers.map((c) => ({ ...c, store_id: storeId })),
    );
  }

  return storeId;
}
