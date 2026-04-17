import { DashboardHeader } from "@/components/dashboard/header";
import { InviteComposer } from "@/components/dashboard/invite-composer";
import { demoCustomers } from "@/lib/mock-data";

export default async function NewInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { customerId } = await searchParams;
  const initial = customerId
    ? demoCustomers.find((c) => c.id === customerId)
    : demoCustomers[0];

  return (
    <>
      <DashboardHeader
        title="新增 AI 邀評"
        subtitle="選擇顧客 → AI 生成個人化訊息 → 一鍵發送"
        action={null}
      />
      <div className="flex-1 p-6">
        <InviteComposer
          customers={demoCustomers}
          initialCustomerId={initial?.id ?? demoCustomers[0].id}
        />
      </div>
    </>
  );
}
