"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut } from "@/app/auth/actions";
import {
  LayoutDashboard,
  Users,
  Send,
  Star,
  FileText,
  Settings,
  Home,
  LogOut,
} from "lucide-react";

const nav = [
  { href: "/dashboard", label: "總覽", icon: LayoutDashboard },
  { href: "/dashboard/customers", label: "顧客", icon: Users },
  { href: "/dashboard/invites", label: "邀評", icon: Send },
  { href: "/dashboard/reviews", label: "評論", icon: Star },
  { href: "/dashboard/reports", label: "報告", icon: FileText },
  { href: "/dashboard/settings", label: "設定", icon: Settings },
];

export function DashboardSidebar({ userEmail }: { userEmail: string }) {
  const pathname = usePathname();
  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border/60 bg-sidebar px-3 py-5 md:flex">
      <Link
        href="/"
        className="mb-6 flex items-center gap-2 px-2 font-semibold"
      >
        <Image
          src="/brand/line-avatar-512.png"
          alt="RealFans"
          width={24}
          height={24}
          className="size-6 rounded-md"
          priority
        />
        <span className="tracking-tight">
          RealFans
          <span className="ml-1 text-xs text-muted-foreground">真粉</span>
        </span>
      </Link>
      <nav className="flex flex-1 flex-col gap-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === "/dashboard"
              ? pathname === href
              : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-sm transition",
                active
                  ? "bg-sidebar-accent font-medium text-sidebar-accent-foreground"
                  : "text-muted-foreground hover:bg-sidebar-accent/50 hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
      <div className="mt-auto space-y-2 border-t border-border/60 pt-4">
        <div className="rounded-md bg-emerald-500/10 px-3 py-2 text-xs text-emerald-700 dark:text-emerald-300">
          <div className="font-medium">試用期剩 12 天</div>
          <Link href="#" className="underline-offset-2 hover:underline">
            升級 Pro →
          </Link>
        </div>
        <div className="rounded-md bg-muted/60 px-3 py-2 text-xs">
          <div className="truncate font-medium" title={userEmail}>
            {userEmail || "—"}
          </div>
          <div className="mt-1 flex items-center gap-3">
            <Link
              href="/"
              className="flex items-center gap-1 text-muted-foreground hover:text-foreground"
            >
              <Home className="size-3" /> 首頁
            </Link>
            <form action={signOut}>
              <button
                type="submit"
                className="flex items-center gap-1 text-muted-foreground hover:text-rose-600"
              >
                <LogOut className="size-3" /> 登出
              </button>
            </form>
          </div>
        </div>
      </div>
    </aside>
  );
}
