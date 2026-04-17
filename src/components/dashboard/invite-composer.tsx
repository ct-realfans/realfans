"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Send,
  Loader2,
  Copy,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import type { Channel, Customer } from "@/lib/types";

export function InviteComposer({
  customers,
  initialCustomerId,
}: {
  customers: Customer[];
  initialCustomerId: string;
}) {
  const router = useRouter();
  const [customerId, setCustomerId] = useState(initialCustomerId);
  const [channel, setChannel] = useState<Channel>("line");
  const [extraNote, setExtraNote] = useState("");
  const [message, setMessage] = useState("");
  const [model, setModel] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [sending, startSending] = useTransition();
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [sendError, setSendError] = useState<{
    code: string;
    hint?: string;
  } | null>(null);

  const customer = customers.find((c) => c.id === customerId)!;

  function generate() {
    setSent(false);
    startTransition(async () => {
      const res = await fetch("/api/invites/generate", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ customerId, channel, extraNote }),
      });
      const data = await res.json();
      if (data.message) {
        setMessage(data.message);
        setModel(data.model);
      } else {
        setMessage("⚠️ 生成失敗：" + (data.error ?? "unknown"));
      }
    });
  }

  async function copy() {
    await navigator.clipboard.writeText(message);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  function send() {
    setSendError(null);
    startSending(async () => {
      const res = await fetch("/api/invites/send", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ customerId, channel, message, aiModel: model }),
      });
      const data = await res.json();
      if (data.ok) {
        setSent(true);
        router.refresh();
      } else {
        setSendError({ code: data.error ?? "unknown", hint: data.hint });
      }
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
      <Card>
        <CardContent className="space-y-5 pt-6">
          <div>
            <Label className="mb-2 block">選擇顧客</Label>
            <Select
              value={customerId}
              onValueChange={(v) => v && setCustomerId(v)}
            >
              <SelectTrigger className="w-full">
                <span className="truncate">
                  {customer.name} · {customer.visits} 次 · NT$
                  {customer.totalSpend.toLocaleString()}
                </span>
              </SelectTrigger>
              <SelectContent>
                {customers.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name} · {c.visits} 次 · NT$
                    {c.totalSpend.toLocaleString()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border border-border/60 bg-muted/30 p-3 text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">{customer.name}</span>
              {customer.tags.map((t) => (
                <Badge key={t} variant="secondary" className="text-xs">
                  {t}
                </Badge>
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              最後造訪 {customer.lastVisitAt} · {customer.visits} 次 · NT$
              {customer.totalSpend.toLocaleString()}
            </div>
            {customer.notes && (
              <div className="mt-2 text-xs text-muted-foreground">
                <span className="font-medium text-foreground">店家備註：</span>
                {customer.notes}
              </div>
            )}
          </div>

          <div>
            <Label className="mb-2 block">發送通路</Label>
            <Tabs
              value={channel}
              onValueChange={(v) => setChannel(v as Channel)}
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="line">LINE</TabsTrigger>
                <TabsTrigger value="sms">SMS</TabsTrigger>
                <TabsTrigger value="email">Email</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div>
            <Label className="mb-2 block">本次補充（可選）</Label>
            <Textarea
              rows={3}
              value={extraNote}
              onChange={(e) => setExtraNote(e.target.value)}
              placeholder="例如：今天點了新品抹茶鬆餅，說拍起來很漂亮"
              className="resize-none"
            />
          </div>

          <Button
            className="w-full"
            onClick={generate}
            disabled={isPending}
            size="lg"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 size-4 animate-spin" />
                AI 思考中…
              </>
            ) : (
              <>
                <Sparkles className="mr-2 size-4" />
                {message ? "重新生成" : "AI 生成邀評訊息"}
              </>
            )}
          </Button>
          <p className="text-center text-xs text-muted-foreground">
            ✓ 合規護欄：不誘導好評、不捏造、不模板化
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm font-semibold">生成預覽</div>
              <div className="text-xs text-muted-foreground">
                {model
                  ? `模型：${model}`
                  : "尚未生成 — 點擊左側「AI 生成」"}
              </div>
            </div>
            {message && (
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={copy}>
                  {copied ? (
                    <CheckCircle2 className="mr-1 size-3 text-emerald-500" />
                  ) : (
                    <Copy className="mr-1 size-3" />
                  )}
                  {copied ? "已複製" : "複製"}
                </Button>
                <Button size="sm" onClick={send} disabled={sent || sending}>
                  {sent ? (
                    <>
                      <CheckCircle2 className="mr-1 size-3" />
                      已送出
                    </>
                  ) : sending ? (
                    <>
                      <Loader2 className="mr-1 size-3 animate-spin" />
                      送出中…
                    </>
                  ) : (
                    <>
                      <Send className="mr-1 size-3" />
                      {channel === "line" ? "送 LINE" : "發送"}
                    </>
                  )}
                </Button>
              </div>
            )}
          </div>

          {message ? (
            <ChannelPreview channel={channel} message={message} />
          ) : (
            <EmptyPreview />
          )}

          {sendError && (
            <div className="mt-3 rounded-md border border-rose-500/40 bg-rose-500/5 p-3 text-sm">
              <div className="flex items-center gap-1 font-medium text-rose-700 dark:text-rose-300">
                <AlertTriangle className="size-3.5" />
                送出失敗 · {sendError.code}
              </div>
              {sendError.hint && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {sendError.hint}
                </p>
              )}
              {sendError.code === "line_not_configured" && (
                <Link
                  href="/dashboard/settings"
                  className="mt-2 inline-block text-xs text-rose-700 underline-offset-2 hover:underline dark:text-rose-300"
                >
                  → 到設定頁填 LINE Token
                </Link>
              )}
            </div>
          )}

          {message && (
            <div className="mt-4 space-y-2 rounded-md border border-emerald-500/30 bg-emerald-500/5 p-4 text-xs">
              <div className="font-semibold text-emerald-700 dark:text-emerald-300">
                ✓ AI 合規檢查通過
              </div>
              <ul className="space-y-1 text-muted-foreground">
                <li>• 未誘導正面評價（Google Policy §2.3）</li>
                <li>• 未捏造顧客行為（依據店家備註）</li>
                <li>• 包含留評連結與可退訂選項</li>
                <li>• 個人化細節：{customer.tags.slice(0, 2).join("、")}</li>
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyPreview() {
  return (
    <div className="flex min-h-[280px] flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-border/60 bg-muted/20 p-10 text-center">
      <Sparkles className="size-8 text-muted-foreground/50" />
      <div className="text-sm text-muted-foreground">
        選擇顧客與通路後，AI 會根據過往消費記錄
        <br />
        產出一封「不會被誤認為罐頭」的邀評訊息。
      </div>
    </div>
  );
}

function ChannelPreview({
  channel,
  message,
}: {
  channel: Channel;
  message: string;
}) {
  if (channel === "line") {
    return (
      <div className="rounded-2xl bg-[#00B900]/5 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          <span className="inline-block size-4 rounded-sm bg-[#00B900]" />
          LINE 官方帳號
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-white p-3 text-sm text-zinc-900 shadow-sm dark:bg-zinc-100">
          {message}
        </div>
      </div>
    );
  }
  if (channel === "sms") {
    return (
      <div className="rounded-2xl bg-sky-500/5 p-4">
        <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
          📱 SMS 簡訊 · {message.length} 字
        </div>
        <div className="max-w-[90%] rounded-2xl bg-sky-500 p-3 text-sm text-white">
          {message}
        </div>
      </div>
    );
  }
  return (
    <div className="rounded-lg border bg-background p-4">
      <div className="mb-3 border-b pb-2 text-xs text-muted-foreground">
        <div>
          <span className="font-medium text-foreground">寄件者：</span>
          小春日和 Cafe &lt;hello@realfans.tw&gt;
        </div>
        <div>
          <span className="font-medium text-foreground">主旨：</span>
          一點心得，就能幫到我們一整週 ☕
        </div>
      </div>
      <div className="whitespace-pre-wrap text-sm">{message}</div>
    </div>
  );
}
