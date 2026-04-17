import Link from "next/link";
import { LoginForm } from "./login-form";
import { brand } from "@/lib/brand";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string; sent?: string }>;
}) {
  const params = await searchParams;
  return (
    <div className="flex min-h-screen flex-1 items-center justify-center bg-muted/30 p-6">
      <div className="w-full max-w-md">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2 font-semibold">
          <span className="inline-block size-7 rounded-md bg-gradient-to-br from-emerald-400 to-teal-600" />
          <span className="tracking-tight">
            {brand.name}
            <span className="ml-1 text-muted-foreground">· {brand.nameZh}</span>
          </span>
        </Link>
        <div className="rounded-xl border bg-background p-8 shadow-sm">
          <h1 className="text-2xl font-bold tracking-tight">登入</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            我們會寄一個 magic link 到您信箱，點擊就自動登入。
            <span className="block text-xs">無密碼 · 無綁信用卡 · 14 天免費試用</span>
          </p>
          <div className="mt-6">
            <LoginForm nextPath={params.next} sent={params.sent === "1"} error={params.error} />
          </div>
          <div className="mt-6 border-t pt-4 text-center text-xs text-muted-foreground">
            還沒看過產品？{" "}
            <Link href="/" className="underline-offset-2 hover:underline">
              先回首頁逛逛
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
