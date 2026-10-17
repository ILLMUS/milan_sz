import { useRef, useState } from "react";
import { Check, Send, Upload, X, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import LogoPrintCheck from "@/components/LogoPrintCheck";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const brandingSchema = z.object({
  propertyName: z.string().trim().min(2, "Property name must be at least 2 characters").max(150, "Property name is too long"),
  contactName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  email: z.string().trim().email("Invalid email address").max(255, "Email is too long"),
  phone: z.string().trim().min(7, "Phone number is too short").max(20, "Phone number is too long").regex(/^[+\d\s()-]+$/, "Invalid phone number format"),
  quantities: z.string().trim().min(3, "Tell us which products and how many you need").max(500, "Too long"),
  notes: z.string().max(1000, "Too long").optional().default(""),
});

type BrandingForm = z.infer<typeof brandingSchema>;

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/svg+xml", "application/pdf"];
const WHATSAPP_NUMBER = "26876259378";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BrandingQuoteDialog = ({ open, onOpenChange }: Props) => {
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof BrandingForm, string>>>({});
  const [honeypot, setHoneypot] = useState("");
  const [submittedWhatsapp, setSubmittedWhatsapp] = useState<string | null>(null);
  const [form, setForm] = useState<BrandingForm>({
    propertyName: "",
    contactName: "",
    email: "",
    phone: "",
    quantities: "",
    notes: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof BrandingForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setFileError("");
    if (!file) {
      setLogoFile(null);
      return;
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError("Please upload a PNG, JPG, WebP, SVG or PDF file.");
      e.target.value = "";
      return;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError("File must be smaller than 10MB.");
      e.target.value = "";
      return;
    }
    setLogoFile(file);
  };

  const reset = () => {
    setForm({ propertyName: "", contactName: "", email: "", phone: "", quantities: "", notes: "" });
    setLogoFile(null);
    setErrors({});
    setFileError("");
    setSubmittedWhatsapp(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;

    const result = brandingSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BrandingForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof BrandingForm;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      let logoPath = "";
      if (logoFile) {
        const ext = logoFile.name.split(".").pop()?.toLowerCase() || "png";
        const safeName = form.propertyName.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40);
        logoPath = `${Date.now()}-${safeName}.${ext}`;
        const { error: uploadError } = await supabase.storage
          .from("branding-logos")
          .upload(logoPath, logoFile, { contentType: logoFile.type });
        if (uploadError) throw new Error("Logo upload failed. Please try again.");
      }

      const { error: fnError } = await supabase.functions.invoke("submit-quote", {
        body: {
          fullName: result.data.contactName,
          businessName: result.data.propertyName,
          phone: result.data.phone,
          email: result.data.email,
          establishmentType: "Custom Branding Request",
          productsInterested: "Custom-branded amenities (logo printing)",
          estimatedQuantity: result.data.quantities,
          message: [
            result.data.notes,
            logoPath ? `Logo artwork uploaded: ${logoPath}` : "No logo artwork attached yet.",
          ].filter(Boolean).join("\n\n"),
          requestType: "branding-quote",
          logoPath,
        },
      });

      if (fnError) throw new Error("Submission failed");

      // Build the WhatsApp message the buyer can send to Milan's number
      const waMessage = [
        "*Custom Branding Quote Request — Milan_sz*",
        "",
        `Property: ${result.data.propertyName}`,
        `Contact: ${result.data.contactName}`,
        `Phone: ${result.data.phone}`,
        `Email: ${result.data.email}`,
        "",
        `Products & quantities: ${result.data.quantities}`,
        "",
        `Notes: ${result.data.notes || "—"}`,
        "",
        logoFile
          ? `Logo artwork: "${logoFile.name}" was uploaded through the website (secured on our side — we'll collect it and reply with pricing).`
          : "Logo artwork: not attached yet.",
      ].join("\n");
      setSubmittedWhatsapp(waMessage);

      toast({
        title: "Branding Quote Requested!",
        description: "We've received your artwork and details — expect a reply within 24 hours.",
      });
    } catch (err) {
      toast({
        title: "Something went wrong",
        description: err instanceof Error ? err.message : "Please try again or reach us on WhatsApp.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-sm border border-border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";
  const errorClass = "text-xs text-destructive mt-1 font-body";

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) reset(); onOpenChange(o); }}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">Request a Branding Quote</DialogTitle>
          <DialogDescription className="font-body text-sm">
            Share your property details, the quantities you need and your logo artwork — we'll
            come back within 24 hours with pricing.
          </DialogDescription>
        </DialogHeader>

        {submittedWhatsapp ? (
          <div className="space-y-6 py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
              <Check size={24} className="text-gold" />
            </div>
            <div className="space-y-2">
              <h3 className="font-heading text-xl">Request received!</h3>
              <p className="font-body text-sm text-muted-foreground">
                We've saved your details{logoFile ? " and artwork" : ""}. For the fastest
                reply, send the same request straight to our WhatsApp:
              </p>
            </div>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(submittedWhatsapp)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 bg-primary py-3.5 font-body text-xs font-medium uppercase tracking-luxury text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Send size={16} />
              Send via WhatsApp
            </a>
            <button
              type="button"
              onClick={() => {
                reset();
                onOpenChange(false);
              }}
              className="w-full py-2 font-body text-xs uppercase tracking-luxury text-muted-foreground transition-colors hover:text-foreground"
            >
              Done
            </button>
          </div>
        ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Honeypot */}
          <div className="absolute h-0 overflow-hidden opacity-0" aria-hidden="true">
            <input
              type="text"
              name="bot-field"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div>
            <input name="propertyName" value={form.propertyName} onChange={handleChange} placeholder="Hotel / Guesthouse Name *" className={`${inputClass} ${errors.propertyName ? "border-destructive" : ""}`} />
            {errors.propertyName && <p className={errorClass}>{errors.propertyName}</p>}
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <input name="contactName" value={form.contactName} onChange={handleChange} placeholder="Your Name *" className={`${inputClass} ${errors.contactName ? "border-destructive" : ""}`} />
              {errors.contactName && <p className={errorClass}>{errors.contactName}</p>}
            </div>
            <div>
              <input name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="Phone Number *" className={`${inputClass} ${errors.phone ? "border-destructive" : ""}`} />
              {errors.phone && <p className={errorClass}>{errors.phone}</p>}
            </div>
          </div>

          <div>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="Email Address *" className={`${inputClass} ${errors.email ? "border-destructive" : ""}`} />
            {errors.email && <p className={errorClass}>{errors.email}</p>}
          </div>

          <div>
            <textarea
              name="quantities"
              value={form.quantities}
              onChange={handleChange}
              placeholder="Products & quantities, e.g. 500 x 35ml Body Wash, 300 x Bar Soap *"
              rows={3}
              className={`${inputClass} resize-none ${errors.quantities ? "border-destructive" : ""}`}
            />
            {errors.quantities && <p className={errorClass}>{errors.quantities}</p>}
          </div>

          {/* Logo upload */}
          <div>
            <label className="mb-2 block font-body text-xs uppercase tracking-luxury text-muted-foreground">
              Your Logo Artwork (optional)
            </label>
            {logoFile ? (
              <div className="flex items-center justify-between border border-border bg-background px-4 py-3">
                <div className="flex min-w-0 items-center gap-3">
                  <ImageIcon size={18} className="shrink-0 text-gold" />
                  <span className="truncate font-body text-sm text-foreground">{logoFile.name}</span>
                  <span className="shrink-0 font-body text-xs text-muted-foreground">
                    {(logoFile.size / 1024 / 1024).toFixed(1)}MB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => { setLogoFile(null); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                  className="ml-3 shrink-0 text-muted-foreground transition-colors hover:text-foreground"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex w-full items-center justify-center gap-2 border border-dashed border-border bg-background px-4 py-6 font-body text-sm text-muted-foreground transition-colors hover:border-gold hover:text-foreground"
              >
                <Upload size={16} />
                Upload logo — PNG, JPG, WebP, SVG or PDF (max 10MB)
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept=".png,.jpg,.jpeg,.webp,.svg,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
            {fileError && <p className={errorClass}>{fileError}</p>}
            {logoFile && <LogoPrintCheck file={logoFile} />}
          </div>

          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            placeholder="Anything else — colours, tube style (white or transparent), deadlines…"
            rows={3}
            className={`${inputClass} resize-none`}
          />

          <button
            type="submit"
            disabled={loading}
            className="gradient-gold flex w-full items-center justify-center gap-2 rounded-sm py-4 font-body text-sm font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:shadow-gold disabled:opacity-50"
          >
            <Send size={16} />
            {loading ? "Sending..." : "Send Branding Quote Request"}
          </button>
        </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BrandingQuoteDialog;
