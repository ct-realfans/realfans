import { redirect } from "next/navigation";
import { DashboardSidebar } from "@/components/dashboard/sidebar";
import { createServerSupabase } from "@/lib/supabase/server";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login?next=/dashboard");

  return (
    <div className="flex flex-1">
      <DashboardSidebar userEmail={user.email ?? ""} />
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
