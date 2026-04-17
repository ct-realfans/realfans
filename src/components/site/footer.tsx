import Image from "next/image";
import { brand } from "@/lib/brand";

export function SiteFooter() {
  return (
    <footer className="border-t border-border/50 bg-background">
      <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 md:grid-cols-4">
        <div>
          <div className="flex items-center gap-2 font-semibold">
            <Image
              src="/brand/line-avatar-512.png"
              alt={brand.name}
              width={24}
              height={24}
              className="size-6 rounded-md"
            />
            {brand.name} · {brand.nameZh}
          </div>
          <p className="mt-3 text-sm text-muted-foreground">
            {brand.tagline}
          </p>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-medium">產品</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>白帽評論引擎</li>
            <li>AI 內容工廠</li>
            <li>回覆代理人</li>
            <li>在地 SEO 雷達</li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-medium">合規</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>Google 留評政策遵循</li>
            <li>Meta 平台 ToS</li>
            <li>公平交易法合規</li>
            <li>個資法聲明</li>
          </ul>
        </div>
        <div className="text-sm">
          <div className="mb-3 font-medium">聯絡</div>
          <ul className="space-y-2 text-muted-foreground">
            <li>{brand.contact.email}</li>
            <li>LINE {brand.contact.line}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border/50 py-4 text-center text-xs text-muted-foreground">
        © 2026 {brand.name}. 不買假粉、不刷假評論 — 因為你值得真的。
      </div>
    </footer>
  );
}
