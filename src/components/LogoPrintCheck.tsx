import { useEffect, useState } from "react";
import { Sparkles, CheckCircle2, AlertTriangle, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

type Check = { label: string; status: "pass" | "warn" | "fail"; note: string };
type Assessment = {
  score: number;
  verdict: "ready" | "minor-fixes" | "needs-work";
  summary: string;
  checks: Check[];
  recommendations: string[];
  bestTube: "white" | "transparent" | "both";
};

const readDataUrl = (file: Blob) =>
  new Promise<string>((res, rej) => {
    const r = new FileReader();
    r.onload = () => res(r.result as string);
    r.onerror = rej;
    r.readAsDataURL(file);
  });

const loadImage = (src: string) =>
  new Promise<HTMLImageElement>((res, rej) => {
    const img = new Image();
    img.onload = () => res(img);
    img.onerror = rej;
    img.src = src;
  });

/** Prepares the file for the AI: SVG is rasterised to PNG, large images are downscaled. */
async function prepare(file: File) {
  if (file.type === "application/pdf") {
    return { dataUrl: await readDataUrl(file), preview: "", meta: `PDF, ${(file.size / 1024).toFixed(0)}KB` };
  }
  const src = await readDataUrl(file);
  const img = await loadImage(src);
  const w = img.naturalWidth || 1000;
  const h = img.naturalHeight || 1000;
  const isSvg = file.type === "image/svg+xml";
  const scale = Math.min(1, 1600 / Math.max(w, h));
  const outW = isSvg ? 1200 : Math.round(w * scale);
  const outH = isSvg ? Math.round((1200 * h) / w) : Math.round(h * scale);
  const canvas = document.createElement("canvas");
  canvas.width = outW;
  canvas.height = outH;
  canvas.getContext("2d")!.drawImage(img, 0, 0, outW, outH);
  const dataUrl = canvas.toDataURL("image/png");
  const meta = isSvg
    ? "SVG vector file (rasterised for review)"
    : `${file.type}, ${w}x${h}px original, ${(file.size / 1024).toFixed(0)}KB`;
  return { dataUrl, preview: src, meta };
}

const statusIcon = {
  pass: <CheckCircle2 size={15} className="shrink-0 text-gold" />,
  warn: <AlertTriangle size={15} className="shrink-0 text-muted-foreground" />,
  fail: <XCircle size={15} className="shrink-0 text-destructive" />,
};

const verdictLabel = { ready: "Print ready", "minor-fixes": "Minor fixes advised", "needs-work": "Needs work" };

const Tube = ({ logo, clear }: { logo: string; clear?: boolean }) => (
  <div className="flex flex-col items-center gap-2">
    <div
      className={`relative flex h-36 w-16 flex-col items-center overflow-hidden rounded-t-[2rem] rounded-b-md border border-border shadow-sm ${
        clear ? "bg-secondary/40 backdrop-blur" : "bg-background"
      }`}
    >
      <div className="flex flex-1 items-center justify-center px-2">
        {logo ? (
          <img src={logo} alt="Logo on tube" className="max-h-14 w-full object-contain" />
        ) : (
          <span className="font-heading text-[10px] uppercase text-muted-foreground">PDF</span>
        )}
      </div>
      <span className="mb-1 font-body text-[7px] uppercase tracking-widest text-muted-foreground">35ml</span>
      <div className="h-5 w-full bg-foreground/80" />
    </div>
    <span className="font-body text-[10px] uppercase tracking-luxury text-muted-foreground">
      {clear ? "Transparent" : "White"}
    </span>
  </div>
);

const LogoPrintCheck = ({ file }: { file: File }) => {
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Assessment | null>(null);

  useEffect(() => {
    setResult(null);
    setError("");
    setPreview("");
    if (file.type !== "application/pdf") readDataUrl(file).then(setPreview).catch(() => {});
  }, [file]);

  const run = async () => {
    setLoading(true);
    setError("");
    try {
      const { dataUrl, meta } = await prepare(file);
      const { data, error: fnError } = await supabase.functions.invoke("assess-logo", {
        body: { dataUrl, fileName: file.name, meta },
      });
      if (fnError) {
        let msg = "Assessment failed. Please try again later.";
        try { msg = (await (fnError as { context?: Response }).context?.json())?.error || msg; } catch { /* ignore */ }
        throw new Error(msg);
      }
      if (!data?.assessment) throw new Error(data?.error || "Assessment failed.");
      setResult(data.assessment);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Assessment failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-3 space-y-4 border border-border bg-secondary/30 p-4">
      <div className="flex items-center justify-between gap-3">
        <p className="font-heading text-lg uppercase tracking-wide text-foreground">Print Preview</p>
        <button
          type="button"
          onClick={run}
          disabled={loading}
          className="flex items-center gap-2 border border-gold px-3 py-2 font-body text-xs uppercase tracking-widest text-foreground transition-colors hover:bg-gold/10 disabled:opacity-50"
        >
          {loading ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} className="text-gold" />}
          {loading ? "Checking…" : result ? "Re-check" : "Check print readiness"}
        </button>
      </div>

      <div className="flex items-end justify-center gap-8 py-2">
        <Tube logo={preview} />
        <Tube logo={preview} clear />
      </div>

      {error && <p className="font-body text-xs text-destructive">{error}</p>}

      {result && (
        <div className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="font-body text-sm font-semibold text-foreground">{verdictLabel[result.verdict] ?? result.verdict}</span>
            <span className="font-heading text-2xl text-gold">{Math.round(result.score)}/100</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden bg-border">
            <div className="h-full bg-gold" style={{ width: `${Math.max(0, Math.min(100, result.score))}%` }} />
          </div>
          <p className="font-body text-sm text-muted-foreground">{result.summary}</p>
          <ul className="space-y-1.5">
            {result.checks?.map((c, i) => (
              <li key={i} className="flex gap-2 font-body text-xs text-foreground">
                {statusIcon[c.status] ?? statusIcon.warn}
                <span><strong className="font-semibold">{c.label}:</strong> {c.note}</span>
              </li>
            ))}
          </ul>
          {result.recommendations?.length > 0 && (
            <div className="font-body text-xs text-muted-foreground">
              <p className="mb-1 uppercase tracking-luxury">Suggestions</p>
              <ul className="list-disc space-y-1 pl-4">
                {result.recommendations.map((r, i) => <li key={i}>{r}</li>)}
              </ul>
            </div>
          )}
          <p className="font-body text-xs text-muted-foreground">
            Best on: <span className="text-foreground">{result.bestTube === "both" ? "white and transparent tubes" : `${result.bestTube} tubes`}</span>. Our team confirms final artwork before printing.
          </p>
        </div>
      )}
    </div>
  );
};

export default LogoPrintCheck;
