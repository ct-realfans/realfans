"use client";

import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createBrowserSupabase } from "@/lib/supabase/client";
import { Mail, Loader2, CheckCircle2 } from "lucide-react";

export function LoginForm({
  nextPath,
  sent,
  error,
}: {
  nextPath?: string;
  sent?: boolean;
  error?: string;
}) {
  const [email, setEmail] = useState("");
  const [sentLocal, setSentLocal] = useState(false);
  const [err, setErr] = useState<string | null>(error ?? null);
  const [pending, startTransition] = useTransition();

  const showSent = sent || sentLocal;

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    startTransition(async () => {
      const supabase = createBrowserSupabase();
      const redirectTo = `${location.origin}/auth/callback${nextPath ? `?next=${encodeURIComponent(nextPath)}` : ""}`;
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
        },
      });
      if (error) {
        setErr(error.message);
      } else {
        setSentLocal(true);
      }
    });
  }

  if (showSent) {
    return (
      <div className="rounded-lg border border-emerald-500/40 bg-emerald-500/5 p-4 text-sm">
        <div className="flex items-center gap-2 font-medium text-emerald-700 dark:text-emerald-300">
          <CheckCircle2 className="size-4" />
          Magic link 已送出
        </div>
        <p className="mt-2 text-muted-foreground">
          請到 <span className="font-medium text-foreground">{email}</span> 查收，
          點連結即可登入。如果 1 分鐘內沒收到，記得看垃圾信件夾。
        </p>
        <button
          type="button"
          className="mt-3 text-xs text-emerald-700 underline-offset-2 hover:underline dark:text-emerald-300"
          onClick={() => setSentLocal(false)}
        >
          ← 換一個 email 試試
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          autoComplete="email"
          className="mt-1"
        />
      </div>
      {err && (
        <div className="rounded-md border border-rose-500/40 bg-rose-500/5 p-3 text-xs text-rose-700 dark:text-rose-300">
          {err}
        </div>
      )}
      <Button type="submit" className="w-full" size="lg" disabled={pending || !email}>
        {pending ? (
          <>
            <Loader2 className="mr-2 size-4 animate-spin" /> 寄送中…
          </>
        ) : (
          <>
            <Mail className="mr-2 size-4" /> 寄送登入連結
          </>
        )}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        我們不會寄行銷信。只會寄登入連結。
      </p>
    </form>
  );
}
