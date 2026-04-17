"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  EyeOff,
  Eye,
} from "lucide-react";
import { saveStoreSettings } from "./actions";

export function SettingsForm({
  initial,
  lineTokenMasked,
}: {
  initial: {
    name: string;
    industry: string;
    brandVoice: string;
    googleReviewLink: string;
    lineOaId: string;
  };
  lineTokenMasked: string | null;
}) {
  const router = useRouter();
  const [form, setForm] = useState(initial);
  const [token, setToken] = useState("");
  const [showToken, setShowToken] = useState(false);
  const [saving, startSaving] = useTransition();
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function save(partial?: Partial<typeof form & { lineChannelAccessToken: string }>) {
    setSaved(false);
    setError(null);
    startSaving(async () => {
      const payload = {
        name: form.name,
        industry: form.industry,
        brandVoice: form.brandVoice,
        googleReviewLink: form.googleReviewLink,
        lineOaId: form.lineOaId,
        ...partial,
      };
      const res = await saveStoreSettings(payload);
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 2500);
        router.refresh();
      } else {
        setError(res.error);
      }
    });
  }

  function saveToken() {
    if (!token.trim()) return;
    save({ lineChannelAccessToken: token.trim() });
    setToken("");
  }

  function clearToken() {
    save({ lineChannelAccessToken: "" });
    setToken("");
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold">門店資料</div>
            <SaveStatus saving={saving} saved={saved} error={error} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label>店名</Label>
              <Input
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>產業</Label>
              <Input
                value={form.industry}
                onChange={(e) => setForm({ ...form, industry: e.target.value })}
                className="mt-1"
              />
            </div>
            <div className="md:col-span-2">
              <Label>Google 留評連結</Label>
              <Input
                value={form.googleReviewLink}
                onChange={(e) =>
                  setForm({ ...form, googleReviewLink: e.target.value })
                }
                placeholder="https://g.page/r/xxx/review"
                className="mt-1"
              />
            </div>
          </div>
          <Button size="sm" onClick={() => save()} disabled={saving}>
            儲存
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-3 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">AI 品牌語氣</div>
              <div className="text-xs text-muted-foreground">
                所有 AI 生成的邀評與回覆都會遵循這段指引
              </div>
            </div>
            <Badge className="bg-emerald-500 text-white">
              <ShieldCheck className="mr-1 size-3" />
              合規護欄啟用中
            </Badge>
          </div>
          <Textarea
            rows={5}
            value={form.brandVoice}
            onChange={(e) => setForm({ ...form, brandVoice: e.target.value })}
            className="resize-none"
          />
          <Button size="sm" onClick={() => save()} disabled={saving}>
            儲存並套用
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div>
            <div className="flex items-center gap-2 text-sm font-semibold">
              LINE Messaging API
              {lineTokenMasked ? (
                <Badge className="bg-emerald-500 text-white">已連線</Badge>
              ) : (
                <Badge variant="outline">未連線</Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              連上 LINE 官方帳號後，AI 邀評可直接用 LINE 推送給顧客
            </div>
          </div>

          <div>
            <Label>LINE OA 帳號（顯示用）</Label>
            <Input
              value={form.lineOaId}
              onChange={(e) => setForm({ ...form, lineOaId: e.target.value })}
              placeholder="@realfans"
              className="mt-1"
            />
          </div>

          <div>
            <Label className="flex items-center justify-between">
              <span>Channel Access Token（Long-lived）</span>
              {lineTokenMasked && (
                <button
                  type="button"
                  onClick={clearToken}
                  className="text-xs text-rose-600 underline-offset-2 hover:underline"
                >
                  移除
                </button>
              )}
            </Label>
            <div className="mt-1 flex gap-2">
              <Input
                type={showToken ? "text" : "password"}
                value={token || lineTokenMasked || ""}
                onChange={(e) => setToken(e.target.value)}
                placeholder={lineTokenMasked ? lineTokenMasked : "從 LINE Developers 複製"}
                className="font-mono"
              />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setShowToken(!showToken)}
              >
                {showToken ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={saveToken}
                disabled={saving || !token.trim()}
              >
                儲存 Token
              </Button>
            </div>
            <div className="mt-2 flex items-start gap-1 text-xs text-muted-foreground">
              <AlertTriangle className="mt-0.5 size-3 shrink-0 text-amber-500" />
              <span>
                Token 會加密儲存於 Supabase，RLS 確保只有你能讀取。
                取得步驟：
                <a
                  href="https://developers.line.biz/console/"
                  target="_blank"
                  rel="noreferrer"
                  className="ml-1 inline-flex items-center gap-0.5 underline-offset-2 hover:underline"
                >
                  LINE Developers Console <ExternalLink className="size-3" />
                </a>{" "}
                → 選 Provider → Messaging API → Issue → 複製
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="text-sm font-semibold">其他整合</div>
          {[
            { name: "Google Business Profile", status: "未連線", ok: false },
            { name: "Meta (Facebook / Instagram)", status: "未連線", ok: false },
            { name: "iCHEF POS", status: "未連線", ok: false },
            { name: "Square", status: "未連線", ok: false },
          ].map((it) => (
            <div
              key={it.name}
              className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
            >
              <div className="text-sm font-medium">{it.name}</div>
              <Badge variant="outline">{it.status}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

function SaveStatus({
  saving,
  saved,
  error,
}: {
  saving: boolean;
  saved: boolean;
  error: string | null;
}) {
  if (saving) {
    return (
      <span className="flex items-center gap-1 text-xs text-muted-foreground">
        <Loader2 className="size-3 animate-spin" /> 儲存中…
      </span>
    );
  }
  if (saved) {
    return (
      <span className="flex items-center gap-1 text-xs text-emerald-600">
        <CheckCircle2 className="size-3" /> 已儲存
      </span>
    );
  }
  if (error) {
    return <span className="text-xs text-rose-600">錯誤：{error}</span>;
  }
  return null;
}
