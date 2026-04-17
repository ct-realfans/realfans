import { DashboardHeader } from "@/components/dashboard/header";
import { getStore } from "@/lib/data";
import { SettingsForm } from "./settings-form";
import { createServerSupabase } from "@/lib/supabase/server";
import { getActiveStoreId } from "@/lib/data";

export default async function SettingsPage() {
  const store = await getStore();

  // Fetch line token (we only show masked preview, never raw)
  const supabase = await createServerSupabase();
  const storeId = await getActiveStoreId();
  const { data } = await supabase
    .from("stores")
    .select("line_channel_access_token, line_oa_id")
    .eq("id", storeId)
    .single();
  const lineTokenMasked = data?.line_channel_access_token
    ? "•".repeat(12) +
      (data.line_channel_access_token as string).slice(-6)
    : null;

  return (
    <>
      <DashboardHeader title="設定" subtitle="門店資料 · 品牌語氣 · 整合" />
      <div className="flex-1 p-6">
        <SettingsForm
          initial={{
            name: store.name,
            industry: store.industry,
            brandVoice: store.brandVoice,
            googleReviewLink: store.linkReview,
            lineOaId: data?.line_oa_id ?? "",
          }}
          lineTokenMasked={lineTokenMasked}
        />
      </div>
    </>
  );
}
