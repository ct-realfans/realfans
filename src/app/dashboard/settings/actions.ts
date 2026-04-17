"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createServerSupabase } from "@/lib/supabase/server";
import { getActiveStoreId } from "@/lib/data";

const schema = z.object({
  name: z.string().min(1).max(80).optional(),
  industry: z.string().max(80).optional(),
  brandVoice: z.string().max(800).optional(),
  googleReviewLink: z.string().url().or(z.literal("")).optional(),
  lineChannelAccessToken: z.string().max(400).optional(),
  lineOaId: z.string().max(80).optional(),
});

export type StoreSettingsInput = z.infer<typeof schema>;

export async function saveStoreSettings(
  raw: StoreSettingsInput,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "invalid_input" };
  }
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "unauthorized" };

  const storeId = await getActiveStoreId();
  const patch: Record<string, string | null> = {};
  if (parsed.data.name !== undefined) patch.name = parsed.data.name;
  if (parsed.data.industry !== undefined)
    patch.industry = parsed.data.industry;
  if (parsed.data.brandVoice !== undefined)
    patch.brand_voice = parsed.data.brandVoice;
  if (parsed.data.googleReviewLink !== undefined)
    patch.google_review_link = parsed.data.googleReviewLink || null;
  if (parsed.data.lineChannelAccessToken !== undefined)
    patch.line_channel_access_token = parsed.data.lineChannelAccessToken || null;
  if (parsed.data.lineOaId !== undefined)
    patch.line_oa_id = parsed.data.lineOaId || null;

  if (Object.keys(patch).length === 0) return { ok: true };

  const { error } = await supabase
    .from("stores")
    .update(patch)
    .eq("id", storeId);
  if (error) return { ok: false, error: error.message };

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { ok: true };
}
