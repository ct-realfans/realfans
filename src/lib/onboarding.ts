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
      "id, name, phone, email, line_id, tags, notes, total_spend_twd, visits, last_visit_at",
    )
    .eq("store_id", DEMO_STORE_ID);

  const customerIdMap = new Map<string, string>();
  if (demoCustomers?.length) {
    const { data: inserted } = await supabase
      .from("customers")
      .insert(
        demoCustomers.map((c) => {
          const { id: _omit, ...rest } = c;
          return { ...rest, store_id: storeId };
        }),
      )
      .select("id, name");
    if (inserted) {
      for (const row of inserted) {
        const src = demoCustomers.find((c) => c.name === row.name);
        if (src) customerIdMap.set(src.id, row.id);
      }
    }
  }

  const { data: demoInvites } = await supabase
    .from("review_invites")
    .select(
      "id, customer_id, channel, platform, status, message, ai_model, created_at, sent_at, reviewed_at, rating",
    )
    .eq("store_id", DEMO_STORE_ID);

  const inviteIdMap = new Map<string, string>();
  if (demoInvites?.length) {
    const rows = demoInvites
      .map((i) => {
        const newCustomerId = customerIdMap.get(i.customer_id);
        if (!newCustomerId) return null;
        const { id: _omit, customer_id: _cust, ...rest } = i;
        return { ...rest, store_id: storeId, customer_id: newCustomerId };
      })
      .filter((r): r is NonNullable<typeof r> => r !== null);
    if (rows.length) {
      const { data: inserted } = await supabase
        .from("review_invites")
        .insert(rows)
        .select("id, customer_id, created_at");
      if (inserted) {
        for (const row of inserted) {
          const src = demoInvites.find(
            (i) =>
              customerIdMap.get(i.customer_id) === row.customer_id &&
              i.created_at === row.created_at,
          );
          if (src) inviteIdMap.set(src.id, row.id);
        }
      }
    }
  }

  const { data: demoReviews } = await supabase
    .from("reviews")
    .select(
      "platform, author_name, rating, content, invite_id, ai_reply, replied_at, platform_review_id, created_at",
    )
    .eq("store_id", DEMO_STORE_ID);

  if (demoReviews?.length) {
    const rows = demoReviews.map((r) => ({
      store_id: storeId,
      platform: r.platform,
      author_name: r.author_name,
      rating: r.rating,
      content: r.content,
      invite_id: r.invite_id ? (inviteIdMap.get(r.invite_id) ?? null) : null,
      ai_reply: r.ai_reply,
      replied_at: r.replied_at,
      platform_review_id:
        r.platform_review_id ? `${r.platform_review_id}_${storeId.slice(0, 8)}` : null,
      created_at: r.created_at,
    }));
    await supabase.from("reviews").insert(rows);
  }

  return storeId;
}
