const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

const PROMPT = `You are a print pre-press specialist for a hotel amenities supplier. The attached logo will be printed (screen/pad print) on small 35ml white or transparent plastic tubes (print area about 25mm x 40mm), and on bar-soap wrappers.
Assess print readiness. Consider: resolution/sharpness, vector vs raster, transparent background, colour count and contrast, thin lines or tiny text that will not survive at small size, legibility on white AND on clear tubes.
Return ONLY a JSON object, no markdown, with this exact shape:
{"score": number 0-100, "verdict": "ready" | "minor-fixes" | "needs-work", "summary": string (max 30 words), "checks": [{"label": string, "status": "pass" | "warn" | "fail", "note": string (max 18 words)}] (4-6 items), "recommendations": [string] (max 3, each max 18 words), "bestTube": "white" | "transparent" | "both"}`;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const apiKey = Deno.env.get("LOVABLE_API_KEY");
  if (!apiKey) return json({ error: "AI is not configured" }, 500);

  let body: { dataUrl?: string; fileName?: string; meta?: string };
  try { body = await req.json(); } catch { return json({ error: "Invalid request" }, 400); }

  const dataUrl = body.dataUrl ?? "";
  if (!/^data:(image\/(png|jpeg|webp)|application\/pdf);base64,/.test(dataUrl)) {
    return json({ error: "Unsupported file type" }, 400);
  }
  if (dataUrl.length > 14_000_000) return json({ error: "File too large" }, 400);

  const isPdf = dataUrl.startsWith("data:application/pdf");
  const filePart = isPdf
    ? { type: "input_file", filename: (body.fileName || "logo.pdf").slice(0, 100), file_data: dataUrl }
    : { type: "input_image", image_url: dataUrl };

  const runId = req.headers.get("X-Lovable-AIG-Run-ID") ?? undefined;
  const upstream = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    signal: req.signal,
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
      ...(runId ? { "X-Lovable-AIG-Run-ID": runId } : {}),
    },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      stream: true,
      store: false,
      reasoning: { effort: "low", summary: "auto" },
      include: ["reasoning.encrypted_content"],
      input: [{
        role: "user",
        content: [
          { type: "input_text", text: `${PROMPT}\n\nFile facts measured in browser: ${String(body.meta ?? "").slice(0, 300)}` },
          filePart,
        ],
      }],
    }),
  }).catch(() => null);

  if (!upstream) return json({ error: "Could not reach the AI service" }, 502);
  if (!upstream.ok || !upstream.body) {
    let message = "Assessment failed";
    try { const e = await upstream.json(); message = e?.error?.message || e?.message || message; } catch { /* ignore */ }
    if (upstream.status === 402) message = "AI credits are used up. Please top up to continue.";
    if (upstream.status === 429) message = "Too many requests — please try again in a minute.";
    return json({ error: message }, upstream.status);
  }

  // Consume the stream server-side and assemble the final text.
  const reader = upstream.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let failed = "";
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      if (!line.startsWith("data:")) continue;
      const data = line.slice(5).trim();
      if (!data || data === "[DONE]") continue;
      try {
        const evt = JSON.parse(data);
        if (evt.type === "response.output_text.delta") text += evt.delta ?? "";
        if (evt.type === "error" || evt.type === "response.failed") failed = evt.error?.message || evt.response?.error?.message || "Assessment failed";
      } catch { /* partial */ }
    }
  }
  if (failed) return json({ error: failed }, 502);

  const match = text.match(/\{[\s\S]*\}/);
  if (!match) return json({ error: "The AI could not assess this file." }, 422);
  try {
    return json({ assessment: JSON.parse(match[0]) });
  } catch {
    return json({ error: "The AI returned an unreadable result." }, 422);
  }
});
