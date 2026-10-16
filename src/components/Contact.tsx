import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

// Your WhatsApp number in international format: digits only, no +, spaces or dashes
const WHATSAPP_NUMBER = "26876259378";

const trackEvent = (action: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, { event_category: "conversion" });
  }
};

const establishmentTypes = [
  "Guesthouse",
  "Airbnb",
  "Lodge",
  "Hotel",
  "Bed & Breakfast",
  "Resort",
  "Other",
];

const contactSchema = z.object({
  fullName: z.string().trim().min(2, "Name must be at least 2 characters").max(100, "Name is too long"),
  businessName: z.string().trim().min(2, "Business name must be at least 2 characters").max(150, "Business name is too long"),
  phone: z.string().trim().min(7, "Phone number is too short").max(20, "Phone number is too long").regex(/^[+\d\s()-]+$/, "Invalid phone number format"),
  email: z.string().trim().email("Invalid email address").max(255, "Email is too long"),
  establishmentType: z.string().min(1, "Please select an establishment type"),
  productsInterested: z.string().max(500, "Too long").optional().default(""),
  estimatedQuantity: z.string().max(100, "Too long").optional().default(""),
  message: z.string().max(2000, "Message is too long").optional().default(""),
});

type ContactForm = z.infer<typeof contactSchema>;

const emptyForm: ContactForm = {
  fullName: "",
  businessName: "",
  phone: "",
  email: "",
  establishmentType: "",
  productsInterested: "",
  estimatedQuantity: "",
  message: "",
};

const buildWhatsAppMessage = (data: ContactForm) =>
  [
    "*New Quote Request*",
    "",
    `*Name:* ${data.fullName}`,
    `*Business:* ${data.businessName}`,
    `*Type:* ${data.establishmentType}`,
    `*Phone:* ${data.phone}`,
    `*Email:* ${data.email}`,
    data.productsInterested && `*Products:* ${data.productsInterested}`,
    data.estimatedQuantity && `*Quantity:* ${data.estimatedQuantity}`,
    data.message && `*Message:* ${data.message}`,
  ]
    .filter(Boolean)
    .join("\n");

const Contact = () => {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState<ContactForm>(emptyForm);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Honeypot check – bots fill hidden fields
    if (honeypot) return;

    const result = contactSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Partial<Record<keyof ContactForm, string>> = {};
      result.error.errors.forEach((err) => {
        const field = err.path[0] as keyof ContactForm;
        if (!fieldErrors[field]) fieldErrors[field] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    // Open WhatsApp synchronously (before any await) so mobile browsers don't block it
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      buildWhatsAppMessage(result.data)
    )}`;
    window.open(url, "_blank", "noopener,noreferrer");

    // Backup: still log the lead to Airtable in the background.
    // Delete this block if you want WhatsApp only.
    supabase.functions
      .invoke("submit-quote", { body: result.data })
      .then(({ error }) => {
        if (error) console.error("Backup submission failed:", error);
      })
      .catch((err) => console.error("Backup submission failed:", err));

    trackEvent("whatsapp_quote_submission");
    toast({
      title: "Opening WhatsApp…",
      description: "Tap Send in WhatsApp to deliver your quote request.",
    });
    setForm(emptyForm);
  };

  const inputClass =
    "w-full rounded-sm border border-border bg-background px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold transition-colors";

  const errorClass = "text-xs text-destructive mt-1 font-body";

  return (
    <section id="contact" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-6">
        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="relative mx-auto max-w-2xl space-y-5"
          noValidate
        >
          {/* Honeypot field – hidden from real users */}
          <div className="absolute opacity-0 h-0 overflow-hidden" aria-hidden="true">
            <input
              type="text"
              name="bot-field"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <div>
              <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name *" className={`${inputClass} ${errors.fullName ? "border-destructive" : ""}`} />
              {errors.fullName && <p className={errorClass}>{errors.fullName}</p>}
            </div>
            <div>
              <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Business Name *" className={`${inputClass} ${errors.businessName ? "border-destructive" : ""}`} />
              {errors.businessName && <p className={errorClass}>{errors.businessName}</p>}
            </div>
            <div>
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" type="tel" className={`${inputClass} ${errors.phone ? "border-destructive" : ""}`} />
              {errors.phone && <p className={errorClass}>{errors.phone}</p>}
            </div>
            <div>
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address *" type="email" className={`${inputClass} ${errors.email ? "border-destructive" : ""}`} />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>
          </div>

          <div>
            <select name="establishmentType" value={form.establishmentType} onChange={handleChange} className={`${inputClass} ${errors.establishmentType ? "border-destructive" : ""}`}>
              <option value="">Type of Establishment *</option>
              {establishmentTypes.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
            {errors.establishmentType && <p className={errorClass}>{errors.establishmentType}</p>}
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <input name="productsInterested" value={form.productsInterested} onChange={handleChange} placeholder="Products Interested In" className={inputClass} />
            <input name="estimatedQuantity" value={form.estimatedQuantity} onChange={handleChange} placeholder="Estimated Quantity" className={inputClass} />
          </div>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Additional Message"
            rows={4}
            className={inputClass + " resize-none"}
          />

          <button
            type="submit"
            className="gradient-gold flex w-full items-center justify-center gap-2 rounded-sm py-4 font-body text-sm font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:shadow-gold"
          >
            <MessageCircle size={16} />
            Send via WhatsApp
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;