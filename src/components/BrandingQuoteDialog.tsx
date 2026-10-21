import { useState } from "react";
import { Check, Send, ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const brandingSchema = z.object({
  propertyName: z
    .string()
    .trim()
    .min(2, "Property name must be at least 2 characters")
    .max(150, "Property name is too long"),

  contactName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  email: z
    .string()
    .trim()
    .email("Invalid email address")
    .max(255, "Email is too long"),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(/^[+\d\s()-]+$/, "Invalid phone number format"),

  quantities: z
    .string()
    .trim()
    .min(3, "Tell us which products and how many you need")
    .max(500, "Too long"),

  notes: z
    .string()
    .max(1000, "Too long")
    .optional()
    .default(""),
});

type BrandingForm = z.infer<typeof brandingSchema>;

const WHATSAPP_NUMBER = "26876259378";

/**
 * Build a professionally formatted WhatsApp quotation request.
 *
 * The logo is intentionally NOT included in the WhatsApp message.
 * The customer is instructed to send/upload the logo separately
 * after submitting the WhatsApp message.
 */
const buildWhatsappMessage = (d: BrandingForm) => {
  const ref = `BQ-${Date.now().toString().slice(-6)}`;
  const date = new Date().toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  // Keep customer-entered quantities readable without inventing prices.
  const cleanText = (value: string) =>
    value
      .replace(/\r\n/g, "\n")
      .replace(/[ \t]+\n/g, "\n")
      .trim();

  const quantities = cleanText(d.quantities);
  const notes = cleanText(d.notes ?? "");

  const line = "━━━━━━━━━━━━━━━━━━━━";

  return [
    "*MILAN_SZ | BRANDING QUOTATION REQUEST*",
    line,
    `*Request Reference:* ${ref}`,
    `*Date:* ${date}`,
    line,
    "",
    "*CLIENT DETAILS*",
    `• *Property:* ${cleanText(d.propertyName)}`,
    `• *Contact person:* ${cleanText(d.contactName)}`,
    `• *Phone:* ${cleanText(d.phone)}`,
    `• *Email:* ${cleanText(d.email)}`,
    "",
    "*PRODUCTS & QUANTITIES REQUESTED*",
    quantities,
    "",
    "*ADDITIONAL REQUIREMENTS*",
    notes || "No additional requirements provided.",
    "",
    line,
    "*QUOTATION REQUEST*",
    "Please review the requested products and quantities and send me a formal quotation showing:",
    "• Unit prices and applicable bulk-pricing tiers",
    "• Any branding or setup charges",
    "• The total estimated order cost",
    "• Available product and packaging options",
    "• Production and delivery lead time",
    "",
    "I understand that final pricing and the production schedule will be confirmed by your team.",
    "",
    "*LOGO IMAGE - NEXT STEP*",
    "I will attach and send my property's logo image separately in this same WhatsApp chat, right after this message.",
    "",
    line,
    "Thank you. I look forward to your response.",
    "_Milan_sz_",
  ].join("\n");
};
interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BrandingQuoteDialog = ({ open, onOpenChange }: Props) => {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState<
    Partial<Record<keyof BrandingForm, string>>
  >({});

  const [honeypot, setHoneypot] = useState("");

  const [submittedWhatsapp, setSubmittedWhatsapp] = useState<string | null>(
    null
  );

  const [form, setForm] = useState<BrandingForm>({
    propertyName: "",
    contactName: "",
    email: "",
    phone: "",
    quantities: "",
    notes: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof BrandingForm]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const reset = () => {
    setForm({
      propertyName: "",
      contactName: "",
      email: "",
      phone: "",
      quantities: "",
      notes: "",
    });

    setErrors({});
    setSubmittedWhatsapp(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (honeypot) return;

    const result = brandingSchema.safeParse(form);

    if (!result.success) {
      const fieldErrors: Partial<Record<keyof BrandingForm, string>> = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof BrandingForm;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      });

      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    // Prepare WhatsApp first so an online-save failure does not trap the customer.
    const waMessage = buildWhatsappMessage(result.data);
    setSubmittedWhatsapp(waMessage);

    try {
      const { data, error: fnError } = await supabase.functions.invoke(
        "submit-quote",
        {
          body: {
            fullName: result.data.contactName,
            businessName: result.data.propertyName,
            phone: result.data.phone,
            email: result.data.email,
            establishmentType: "Custom Branding Request",
            productsInterested: "Custom-branded amenities (logo printing)",
            estimatedQuantity: result.data.quantities,
            message: [
              "Branding quotation request",
              `Property: ${result.data.propertyName}`,
              `Contact: ${result.data.contactName}`,
              `Phone: ${result.data.phone}`,
              `Email: ${result.data.email}`,
              `Products and quantities: ${result.data.quantities}`,
              result.data.notes
                ? `Additional requirements: ${result.data.notes}`
                : "",
              "Logo image will be sent separately through WhatsApp by the customer.",
            ]
              .filter(Boolean)
              .join("\n\n"),
            requestType: "branding-quote",
            // Kept empty for compatibility with older function versions.
            logoPath: "",
          },
        }
      );

      if (fnError) {
        // Silent for the customer: WhatsApp is the main channel. Log for the site owner.
        let detail = fnError.message || "The quote endpoint returned an error.";
        try {
          const context = (fnError as { context?: Response }).context;
          if (context && typeof context.clone === "function") {
            const responseText = await context.clone().text();
            if (responseText) detail = responseText;
          }
        } catch {
          // keep original message
        }
        console.error("submit-quote function failed:", detail, fnError, data);
      }

      toast({
        title: "Quote request ready",
        description:
          "Tap “Send via WhatsApp” to complete it, then attach your logo image in the same chat.",
      });
    } catch (err) {
      // Silent for the customer: WhatsApp is the main channel.
      console.error("Unexpected submit-quote error:", err);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Open WhatsApp with the formatted message.
   */
  const handleSendWhatsApp = () => {
    if (!submittedWhatsapp) {
      toast({
        title: "WhatsApp message is not ready",
        description: "Please complete the quote form again before opening WhatsApp.",
        variant: "destructive",
      });
      return;
    }

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(submittedWhatsapp)}`;

    // Navigate directly from the button click. This avoids popup blockers
    // that can prevent window.open() from launching WhatsApp.
    window.location.assign(whatsappUrl);
  };

  const inputClass =
    "w-full rounded-sm border border-border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";

  const errorClass =
    "text-xs text-destructive mt-1 font-body";

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) {
          reset();
        }

        onOpenChange(o);
      }}
    >
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-heading text-2xl">
            Request a Branding Quote
          </DialogTitle>

          <DialogDescription className="font-body text-sm">
            Enter your property and order details. After sending the quotation message through WhatsApp, attach your property's logo image separately in the same chat.
          </DialogDescription>
        </DialogHeader>

        {submittedWhatsapp ? (
          <div className="space-y-6 py-4 text-center">

            {/* Success icon */}
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
              <Check
                size={24}
                className="text-gold"
              />
            </div>

            {/* Success message */}
            <div className="space-y-2">
              <h3 className="font-heading text-xl">
                Your quote is ready to send!
              </h3>

              <p className="font-body text-sm text-muted-foreground">
                Your quotation request is ready. Tap the button below to send it to us on WhatsApp, then attach your logo image in the same chat. We reply within 24 hours.
              </p>
            </div>

            {/* WhatsApp button */}
            <button
              type="button"
              onClick={handleSendWhatsApp}
              className="flex w-full items-center justify-center gap-2 bg-primary py-3.5 font-body text-xs font-medium uppercase tracking-luxury text-primary-foreground transition-opacity hover:opacity-90"
            >
              <Send size={16} />

              Send via WhatsApp
            </button>

            {/* Logo instruction */}
            <div className="border border-border bg-background p-4 text-left">
              <div className="mb-2 flex items-center gap-2">
                <ImageIcon
                  size={18}
                  className="text-gold"
                />

                <span className="font-body text-sm font-semibold">
                  Important: Send Your Logo
                </span>
              </div>

              <p className="font-body text-xs leading-5 text-muted-foreground">
                After WhatsApp opens, send the pre-filled quotation message first. Then use WhatsApp's attachment button to select and send your property's logo image in the same chat. The logo is not uploaded through this website form.
              </p>

              <p className="mt-2 font-body text-xs leading-5 text-muted-foreground">
                Preferred formats: PNG, JPG, SVG or PDF.
              </p>
            </div>

            {/* Done */}
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
          <form
            onSubmit={handleSubmit}
            className="space-y-4"
            noValidate
          >
            {/* Honeypot */}
            <div
              className="absolute h-0 overflow-hidden opacity-0"
              aria-hidden="true"
            >
              <input
                type="text"
                name="bot-field"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) =>
                  setHoneypot(e.target.value)
                }
              />
            </div>

            {/* Property name */}
            <div>
              <input
                name="propertyName"
                value={form.propertyName}
                onChange={handleChange}
                placeholder="Hotel / Guesthouse Name *"
                className={`${inputClass} ${
                  errors.propertyName
                    ? "border-destructive"
                    : ""
                }`}
              />

              {errors.propertyName && (
                <p className={errorClass}>
                  {errors.propertyName}
                </p>
              )}
            </div>

            {/* Name + phone */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <input
                  name="contactName"
                  value={form.contactName}
                  onChange={handleChange}
                  placeholder="Your Name *"
                  className={`${inputClass} ${
                    errors.contactName
                      ? "border-destructive"
                      : ""
                  }`}
                />

                {errors.contactName && (
                  <p className={errorClass}>
                    {errors.contactName}
                  </p>
                )}
              </div>

              <div>
                <input
                  name="phone"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="Phone Number *"
                  className={`${inputClass} ${
                    errors.phone
                      ? "border-destructive"
                      : ""
                  }`}
                />

                {errors.phone && (
                  <p className={errorClass}>
                    {errors.phone}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email Address *"
                className={`${inputClass} ${
                  errors.email
                    ? "border-destructive"
                    : ""
                }`}
              />

              {errors.email && (
                <p className={errorClass}>
                  {errors.email}
                </p>
              )}
            </div>

            {/* Products & quantities */}
            <div>
              <textarea
                name="quantities"
                value={form.quantities}
                onChange={handleChange}
                placeholder="Products & quantities, e.g. 500 x 35ml Body Wash, 300 x Bar Soap *"
                rows={3}
                className={`${inputClass} resize-none ${
                  errors.quantities
                    ? "border-destructive"
                    : ""
                }`}
              />

              {errors.quantities && (
                <p className={errorClass}>
                  {errors.quantities}
                </p>
              )}
            </div>

            {/* Additional notes */}
            <textarea
              name="notes"
              value={form.notes}
              onChange={handleChange}
              placeholder="Anything else — colours, tube style (white or transparent), deadlines…"
              rows={3}
              className={`${inputClass} resize-none`}
            />

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="gradient-gold flex w-full items-center justify-center gap-2 rounded-sm py-4 font-body text-sm font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:shadow-gold disabled:opacity-50"
            >
              <Send size={16} />

              {loading
                ? "Sending..."
                : "Prepare Branding Quote"}
            </button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default BrandingQuoteDialog;