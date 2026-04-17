"use client";

import { useState, useTransition } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Bot, Loader2, Send, Pencil, CheckCircle2, AlertTriangle } from "lucide-react";
import type { ReviewRecord } from "@/lib/types";
import { useRouter } from "next/navigation";

export function ReviewCard({ review }: { review: ReviewRecord }) {
  const router = useRouter();
  const [draft, setDraft] = useState<string | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);
  const [generating, startGen] = useTransition();
  const [sending, startSend] = useTransition();
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const needsHumanReview = review.rating <= 3;
  const alreadyReplied = !!review.aiReply && !draft;

  function generate() {
    setError(null);
    setSent(false);
    startGen(async () => {
      const res = await fetch(
        `/api/reviews/${review.id}/reply/generate`,
        { method: "POST" },
      );
      const data = await res.json();
      if (data.reply) {
        setDraft(data.reply);
        setModel(data.model);
        setEditing(false);
      } else {
        setError(data.error ?? "generate_failed");
      }
    });
  }

  function send() {
    if (!draft) return;
    setError(null);
    startSend(async () => {
      const res = await fetch(`/api/reviews/${review.id}/reply/send`, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ reply: draft }),
      });
      const data = await res.json();
      if (data.repliedAt) {
        setSent(true);
        router.refresh();
      } else {
        setError(data.error ?? "send_failed");
      }
    });
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium">{review.author}</span>
            <Badge variant="secondary" className="text-xs">
              {review.platform}
            </Badge>
            {review.source === "invited" && (
              <Badge
                variant="outline"
                className="border-emerald-500/40 text-xs text-emerald-700 dark:text-emerald-300"
              >
                AI 邀評
              </Badge>
            )}
            <span className="text-xs text-muted-foreground">
              {review.createdAt.slice(0, 10)}
            </span>
          </div>
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={
                  i < review.rating
                    ? "size-4 fill-amber-400 text-amber-400"
                    : "size-4 text-muted-foreground/30"
                }
              />
            ))}
          </div>
        </div>

        <p className="mt-3 text-sm">{review.content}</p>

        {alreadyReplied ? (
          <RepliedPanel
            aiReply={review.aiReply!}
            repliedAt={review.repliedAt}
          />
        ) : (
          <ReplyComposer
            draft={draft}
            setDraft={setDraft}
            editing={editing}
            setEditing={setEditing}
            generate={generate}
            send={send}
            generating={generating}
            sending={sending}
            sent={sent}
            model={model}
            error={error}
            needsHumanReview={needsHumanReview}
          />
        )}
      </CardContent>
    </Card>
  );
}

function RepliedPanel({
  aiReply,
  repliedAt,
}: {
  aiReply: string;
  repliedAt?: string;
}) {
  return (
    <div className="mt-3 rounded-md border-l-2 border-emerald-500 bg-emerald-500/5 p-3 text-sm">
      <div className="mb-1 flex items-center gap-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
        <Bot className="size-3.5" /> AI 已回覆
        {repliedAt && <span>· {repliedAt.slice(0, 10)}</span>}
      </div>
      <p className="text-muted-foreground">{aiReply}</p>
    </div>
  );
}

function ReplyComposer({
  draft,
  setDraft,
  editing,
  setEditing,
  generate,
  send,
  generating,
  sending,
  sent,
  model,
  error,
  needsHumanReview,
}: {
  draft: string | null;
  setDraft: (v: string) => void;
  editing: boolean;
  setEditing: (v: boolean) => void;
  generate: () => void;
  send: () => void;
  generating: boolean;
  sending: boolean;
  sent: boolean;
  model: string | null;
  error: string | null;
  needsHumanReview: boolean;
}) {
  if (!draft) {
    return (
      <div className="mt-3 flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={generate}
          disabled={generating}
        >
          {generating ? (
            <>
              <Loader2 className="mr-1 size-3.5 animate-spin" /> AI 草擬中…
            </>
          ) : (
            <>
              <Bot className="mr-1 size-3.5" /> AI 草擬回覆
            </>
          )}
        </Button>
        {needsHumanReview && (
          <span className="flex items-center gap-1 text-xs text-amber-600 dark:text-amber-400">
            <AlertTriangle className="size-3.5" />
            低星評論 · AI 草稿需要人工審核後再送出
          </span>
        )}
        {error && (
          <span className="text-xs text-rose-600">錯誤：{error}</span>
        )}
      </div>
    );
  }

  return (
    <div className="mt-3 space-y-3 rounded-md border-l-2 border-sky-500 bg-sky-500/5 p-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-xs font-medium text-sky-700 dark:text-sky-300">
          <Bot className="size-3.5" /> AI 草稿{" "}
          {model && (
            <span className="ml-1 font-mono text-[10px] text-muted-foreground">
              ({model.slice(0, 60)})
            </span>
          )}
        </div>
        {!editing && (
          <button
            type="button"
            className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            onClick={() => setEditing(true)}
          >
            <Pencil className="size-3" /> 編輯
          </button>
        )}
      </div>

      {editing ? (
        <Textarea
          rows={4}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          className="resize-none bg-background"
        />
      ) : (
        <p className="whitespace-pre-wrap text-sm">{draft}</p>
      )}

      {needsHumanReview && !editing && (
        <div className="flex items-center gap-1 rounded-md bg-amber-500/10 px-2 py-1 text-xs text-amber-700 dark:text-amber-300">
          <AlertTriangle className="size-3" />
          低星評論 — 建議先編輯調整再送出
        </div>
      )}

      {error && (
        <div className="text-xs text-rose-600">送出失敗：{error}</div>
      )}

      <div className="flex flex-wrap gap-2">
        <Button size="sm" onClick={send} disabled={sending || sent}>
          {sent ? (
            <>
              <CheckCircle2 className="mr-1 size-3.5" /> 已送出
            </>
          ) : sending ? (
            <>
              <Loader2 className="mr-1 size-3.5 animate-spin" /> 送出中…
            </>
          ) : (
            <>
              <Send className="mr-1 size-3.5" /> 送出回覆
            </>
          )}
        </Button>
        <Button size="sm" variant="ghost" onClick={generate} disabled={generating}>
          {generating ? (
            <>
              <Loader2 className="mr-1 size-3.5 animate-spin" /> 重新生成…
            </>
          ) : (
            <>
              <Bot className="mr-1 size-3.5" /> 重新生成
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
