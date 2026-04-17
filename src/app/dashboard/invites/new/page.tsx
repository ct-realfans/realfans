import { DashboardHeader } from "@/components/dashboard/header";
import { InviteComposer } from "@/components/dashboard/invite-composer";
import { getCustomers } from "@/lib/data";

export default async function NewInvitePage({
  searchParams,
}: {
  searchParams: Promise<{ customerId?: string }>;
}) {
  const { customerId } = await searchParams;
  const customers = await getCustomers();
  const initial = customerId
    ? customers.find((c) => c.id === customerId)
    : customers[0];

  return (
    <>
      <DashboardHeader
        title="新增 AI 邀評"
        subtitle="選擇顧客 → AI 生成個人化訊息 → 一鍵發送"
        action={null}
      />
      <div className="flex-1 p-6">
        <InviteComposer
          customers={customers}
          initialCustomerId={initial?.id ?? customers[0].id}
        />
      </div>
    </>
  );
}
