import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { brand } from "@/lib/brand";

export function SiteNav() {
  return (
    <header className="sticky top-0 z-40 border-b border-border/50 bg-background/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src="/brand/line-avatar-512.png"
            alt={brand.name}
            width={24}
            height={24}
            className="size-6 rounded-md"
            priority
          />
          <span className="tracking-tight">
            {brand.name}
            <span className="ml-1 text-muted-foreground">· {brand.nameZh}</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-6 text-sm text-muted-foreground md:flex">
          <Link href="/#why" className="hover:text-foreground">為什麼合法</Link>
          <Link href="/#compare" className="hover:text-foreground">對比粉絲多</Link>
          <Link href="/#how" className="hover:text-foreground">運作方式</Link>
          <Link href="/#pricing" className="hover:text-foreground">定價</Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" render={<Link href="/dashboard" />}>
            登入
          </Button>
          <Button size="sm" render={<Link href="/dashboard" />}>
            免費試用 14 天
          </Button>
        </div>
      </div>
    </header>
  );
}
