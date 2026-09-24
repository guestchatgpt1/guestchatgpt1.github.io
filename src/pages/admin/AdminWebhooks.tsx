/**
 * Private backend settings page for webhook links.
 *
 * Not linked anywhere on the public site, blocked from search engines and
 * only usable by a signed-in account that holds the `admin` role.
 */
import { useCallback, useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, Plus, RefreshCw, Save, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import type { Session } from "@supabase/supabase-js";

interface Row {
  id: string;
  key: string;
  label: string;
  url: string;
  method: string;
  enabled: boolean;
  notes: string | null;
  updated_at: string;
}

const emptyDraft = { key: "", label: "", url: "", method: "POST" };

const SignIn = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [mode, setMode] = useState<"signin" | "signup">("signin");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (mode === "signup" && email.trim().toLowerCase() !== "quantumailab2@gmail.com") {
      toast({ variant: "destructive", title: "This account is not eligible", description: "Use the designated administrator email." });
      return;
    }
    setBusy(true);
    const fn =
      mode === "signin"
        ? supabase.auth.signInWithPassword({ email, password })
        : supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/admin/webhooks` } });
    const { data, error } = await fn;
    setBusy(false);
    if (error) {
      toast({ variant: "destructive", title: "Sign-in failed", description: error.message });
      return;
    }
    if (mode === "signup" && !data.session) {
      toast({ title: "Check your email", description: "Confirm your address, then sign in here." });
      setMode("signin");
    }
  };

  return (
    <div className="mx-auto max-w-sm px-4 py-24">
      <h1 className="text-2xl font-display mb-2">Backend settings</h1>
      <p className="text-sm text-muted-foreground mb-6">Private area. Sign in to manage webhook links.</p>
      <form onSubmit={submit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="admin-email">Email</Label>
          <Input id="admin-email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </div>
        <div className="space-y-2">
          <Label htmlFor="admin-password">Password</Label>
          <Input id="admin-password" type="password" required minLength={8} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
        </div>
        <Button type="submit" className="w-full" disabled={busy}>
          {busy ? <Loader2 className="animate-spin" size={16} /> : mode === "signin" ? "Sign in" : "Create admin account"}
        </Button>
        <button
          type="button"
          className="w-full text-xs text-muted-foreground underline underline-offset-2"
          onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
        >
          {mode === "signin" ? "First time? Create the admin account" : "Already have an account? Sign in"}
        </button>
      </form>
    </div>
  );
};

const AdminWebhooks = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [checking, setChecking] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [draft, setDraft] = useState(emptyDraft);

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setChecking(false);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const loadRows = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("webhook_settings").select("*").order("key");
    setLoading(false);
    if (error) {
      toast({ variant: "destructive", title: "Could not load settings", description: error.message });
      return;
    }
    setRows((data ?? []) as Row[]);
  }, [toast]);

  useEffect(() => {
    if (!session) {
      setIsAdmin(false);
      return;
    }
    (async () => {
      const { data } = await supabase.rpc("claim_admin");
      setIsAdmin(Boolean(data));
      if (data) {
        await supabase.from("profiles").upsert({ user_id: session.user.id, display_name: "QuantumAI Lab Administrator" });
        loadRows();
      }
    })();
  }, [session, loadRows]);

  const patch = (id: string, changes: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...changes } : r)));

  const save = async (row: Row) => {
    setSavingId(row.id);
    const { error } = await supabase
      .from("webhook_settings")
      .update({ url: row.url.trim(), method: row.method, enabled: row.enabled, label: row.label.trim(), updated_by: session?.user.id })
      .eq("id", row.id);
    setSavingId(null);
    if (error) {
      toast({ variant: "destructive", title: "Save failed", description: error.message });
      return;
    }
    toast({ title: "Saved", description: `${row.label} updated.` });
  };

  const remove = async (row: Row) => {
    const { error } = await supabase.from("webhook_settings").delete().eq("id", row.id);
    if (error) {
      toast({ variant: "destructive", title: "Delete failed", description: error.message });
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  const addRow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      new URL(draft.url.trim());
    } catch {
      toast({ variant: "destructive", title: "Invalid URL", description: "Enter a complete URL beginning with https://." });
      return;
    }
    if (!/^[a-z0-9_]+$/i.test(draft.key.trim())) {
      toast({ variant: "destructive", title: "Invalid key", description: "Use letters, numbers, and underscores only." });
      return;
    }
    const { data, error } = await supabase
      .from("webhook_settings")
      .insert({ key: draft.key.trim(), label: draft.label.trim(), url: draft.url.trim(), method: draft.method })
      .select()
      .single();
    if (error) {
      toast({ variant: "destructive", title: "Could not add", description: error.message });
      return;
    }
    setRows((prev) => [...prev, data as Row].sort((a, b) => a.key.localeCompare(b.key)));
    setDraft(emptyDraft);
  };

  const noIndex = (
    <Helmet>
      <meta name="robots" content="noindex, nofollow" />
      <title>Backend settings</title>
    </Helmet>
  );

  if (checking) {
    return (
      <>
        {noIndex}
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="animate-spin" />
        </div>
      </>
    );
  }

  if (!session) return (<>{noIndex}<SignIn /></>);

  if (!isAdmin) {
    return (
      <>
        {noIndex}
        <div className="mx-auto max-w-md px-4 py-24 text-center space-y-4">
          <h1 className="text-2xl font-display">No access</h1>
          <p className="text-sm text-muted-foreground">This account is not an administrator.</p>
          <Button variant="outline" onClick={() => supabase.auth.signOut()}>Sign out</Button>
        </div>
      </>
    );
  }

  return (
    <>
      {noIndex}
      <div className="mx-auto max-w-4xl px-4 py-16 space-y-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-display">Webhook settings</h1>
            <p className="text-sm text-muted-foreground">Private backend configuration. Changes apply to the live site.</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={loadRows} disabled={loading}>
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Refresh
            </Button>
            <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()}>Sign out</Button>
          </div>
        </header>

        <div className="space-y-4">
          {rows.map((row) => (
            <div key={row.id} className="rounded-xl border border-border bg-card/50 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{row.label}</p>
                  <p className="text-xs text-muted-foreground font-mono">{row.key}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Label htmlFor={`en-${row.id}`} className="text-xs text-muted-foreground">Active</Label>
                  <Switch id={`en-${row.id}`} checked={row.enabled} onCheckedChange={(v) => patch(row.id, { enabled: v })} />
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-[1fr_120px]">
                <div className="space-y-1">
                  <Label htmlFor={`url-${row.id}`} className="text-xs">URL</Label>
                  <Input id={`url-${row.id}`} value={row.url} onChange={(e) => patch(row.id, { url: e.target.value })} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor={`m-${row.id}`} className="text-xs">Method</Label>
                  <select
                    id={`m-${row.id}`}
                    value={row.method}
                    onChange={(e) => patch(row.id, { method: e.target.value })}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center justify-between gap-2">
                <p className="text-xs text-muted-foreground">
                  Updated {new Date(row.updated_at).toLocaleString()}
                </p>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => remove(row)} aria-label={`Delete ${row.label}`}>
                    <Trash2 size={16} />
                  </Button>
                  <Button size="sm" onClick={() => save(row)} disabled={savingId === row.id}>
                    {savingId === row.id ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />} Save
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={addRow} className="rounded-xl border border-dashed border-border p-4 space-y-3">
          <p className="font-medium">Add another link</p>
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <Label htmlFor="new-key" className="text-xs">Key</Label>
              <Input id="new-key" required value={draft.key} onChange={(e) => setDraft({ ...draft, key: e.target.value })} placeholder="careers" />
            </div>
            <div className="space-y-1">
              <Label htmlFor="new-label" className="text-xs">Name</Label>
              <Input id="new-label" required value={draft.label} onChange={(e) => setDraft({ ...draft, label: e.target.value })} placeholder="Careers form" />
            </div>
            <div className="space-y-1 sm:col-span-2">
              <Label htmlFor="new-url" className="text-xs">URL</Label>
              <Input id="new-url" required type="url" value={draft.url} onChange={(e) => setDraft({ ...draft, url: e.target.value })} placeholder="https://..." />
            </div>
          </div>
          <Button type="submit" size="sm" variant="outline"><Plus size={16} /> Add</Button>
        </form>
      </div>
    </>
  );
};

export default AdminWebhooks;
