import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

type Req = {
  id: string; created_at: string; property_name: string; contact_name: string; phone: string;
  email: string; quantities: string; notes: string; logo_path: string; status: string; admin_notes: string;
};

const STATUSES = ["new", "contacted", "quoted", "in production", "delivered", "closed"];
const input = "w-full rounded-sm border border-border bg-background px-4 py-3 font-body text-sm focus:border-gold focus:outline-none";

const Login = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"in" | "up">("in");
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = mode === "in"
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password, options: { emailRedirectTo: `${window.location.origin}/dashboard` } });
    if (error) toast({ title: "Error", description: error.message, variant: "destructive" });
    else if (mode === "up") toast({ title: "Check your email", description: "Confirm your address, then sign in." });
  };
  return (
    <form onSubmit={submit} className="mx-auto mt-24 max-w-sm space-y-4 px-6">
      <h1 className="font-heading text-3xl uppercase tracking-luxury">Dashboard</h1>
      <input className={input} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input className={input} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button className="w-full bg-primary py-3 font-body text-xs uppercase tracking-luxury text-primary-foreground">
        {mode === "in" ? "Sign in" : "Create account"}
      </button>
      <button type="button" onClick={() => setMode(mode === "in" ? "up" : "in")} className="w-full font-body text-xs text-muted-foreground">
        {mode === "in" ? "No account? Create one" : "Have an account? Sign in"}
      </button>
    </form>
  );
};

const RequestCard = ({ r, onSave }: { r: Req; onSave: (id: string, patch: Partial<Req>) => void }) => {
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState(r.admin_notes);
  useEffect(() => {
    if (!r.logo_path) return;
    supabase.storage.from("branding-logos").createSignedUrl(r.logo_path, 3600).then(({ data }) => setLogoUrl(data?.signedUrl ?? null));
  }, [r.logo_path]);
  const isPdf = r.logo_path.toLowerCase().endsWith(".pdf");
  return (
    <div className="grid gap-6 border border-border bg-card p-6 md:grid-cols-[160px_1fr]">
      <div className="flex h-40 w-40 items-center justify-center border border-border bg-background">
        {!r.logo_path ? <span className="font-body text-xs text-muted-foreground">No logo</span>
          : logoUrl ? (isPdf
            ? <a href={logoUrl} target="_blank" rel="noreferrer" className="font-body text-xs underline">Open PDF</a>
            : <a href={logoUrl} target="_blank" rel="noreferrer"><img src={logoUrl} alt={`${r.property_name} logo`} className="max-h-36 max-w-36 object-contain" /></a>)
          : <span className="font-body text-xs text-muted-foreground">Loading…</span>}
      </div>
      <div className="space-y-3 font-body text-sm">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="font-heading text-2xl">{r.property_name}</h2>
            <p className="text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
          </div>
          <select value={r.status} onChange={(e) => onSave(r.id, { status: e.target.value })}
            className="rounded-sm border border-border bg-background px-3 py-2 text-xs uppercase tracking-luxury">
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <p>{r.contact_name} · <a href={`tel:${r.phone}`} className="underline">{r.phone}</a> · <a href={`mailto:${r.email}`} className="underline">{r.email}</a></p>
        <p><span className="text-muted-foreground">Quantities: </span>{r.quantities}</p>
        {r.notes && <p className="whitespace-pre-line text-muted-foreground">{r.notes}</p>}
        <div className="flex gap-2">
          <input className={input} placeholder="Your follow-up notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
          <button onClick={() => onSave(r.id, { admin_notes: notes })} className="bg-primary px-4 text-xs uppercase tracking-luxury text-primary-foreground">Save</button>
        </div>
      </div>
    </div>
  );
};

const DashboardPage = () => {
  const { toast } = useToast();
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [rows, setRows] = useState<Req[]>([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) return;
    (async () => {
      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", session.user.id);
      const admin = !!roles?.some((r) => r.role === "admin");
      setIsAdmin(admin);
      if (admin) {
        const { data } = await supabase.from("branding_requests").select("*").order("created_at", { ascending: false });
        setRows((data as Req[]) ?? []);
      }
    })();
  }, [session]);

  const save = async (id: string, patch: Partial<Req>) => {
    const { error } = await supabase.from("branding_requests").update(patch).eq("id", id);
    if (error) return toast({ title: "Save failed", description: error.message, variant: "destructive" });
    setRows((p) => p.map((r) => (r.id === id ? { ...r, ...patch } : r)));
    toast({ title: "Saved" });
  };

  if (!ready) return null;
  if (!session) return <Login />;
  if (isAdmin === null) return null;

  const shown = filter === "all" ? rows : rows.filter((r) => r.status === filter);

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <h1 className="font-heading text-3xl uppercase tracking-luxury">Branding Requests</h1>
        <button onClick={() => supabase.auth.signOut()} className="font-body text-xs uppercase tracking-luxury text-muted-foreground">Sign out</button>
      </div>
      {!isAdmin ? (
        <p className="font-body text-sm text-muted-foreground">Signed in as {session.user.email}, but this account doesn't have dashboard access yet.</p>
      ) : (
        <>
          <div className="mb-6 flex flex-wrap gap-2">
            {["all", ...STATUSES].map((s) => (
              <button key={s} onClick={() => setFilter(s)}
                className={`border px-3 py-1.5 font-body text-xs uppercase tracking-luxury ${filter === s ? "border-primary bg-primary text-primary-foreground" : "border-border"}`}>
                {s} ({s === "all" ? rows.length : rows.filter((r) => r.status === s).length})
              </button>
            ))}
          </div>
          <div className="space-y-4">
            {shown.length === 0 && <p className="font-body text-sm text-muted-foreground">No requests yet.</p>}
            {shown.map((r) => <RequestCard key={r.id} r={r} onSave={save} />)}
          </div>
        </>
      )}
    </main>
  );
};

export default DashboardPage;
