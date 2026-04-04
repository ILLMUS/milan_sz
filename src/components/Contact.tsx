import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

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

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
  const [honeypot, setHoneypot] = useState("");
  const [form, setForm] = useState<ContactForm>({
    fullName: "",
    businessName: "",
    phone: "",
    email: "",
    establishmentType: "",
    productsInterested: "",
    estimatedQuantity: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof ContactForm]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
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

    setLoading(true);
    setErrors({});

    try {
      // Submit to edge function (Airtable integration)
      const { error: fnError } = await supabase.functions.invoke("submit-quote", {
        body: result.data,
      });

      if (fnError) {
        console.error("Edge function error:", fnError);
        throw new Error("Submission failed");
      }

      // Also submit to Netlify Forms (if deployed on Netlify)
      try {
        const formData = new URLSearchParams();
        formData.append("form-name", "quote-request");
        Object.entries(result.data).forEach(([key, value]) => {
          formData.append(key, value);
        });
        await fetch("/", {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: formData.toString(),
        });
      } catch {
        // Netlify submission is optional — don't block on failure
        console.log("Netlify Forms submission skipped (not on Netlify)");
      }

      trackEvent("form_submission");
      toast({
        title: "Quote Request Sent!",
        description: "We'll get back to you within 24 hours.",
      });
      setForm({
        fullName: "",
        businessName: "",
        phone: "",
        email: "",
        establishmentType: "",
        productsInterested: "",
        estimatedQuantity: "",
        message: "",
      });
    } catch {
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly.",
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
    <section id="contact" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <span className="font-body text-xs font-light tracking-[0.3em] uppercase text-gold">Get In Touch</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-5xl">Request a Free Quote</h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-muted-foreground">
            Fill out the form below and we'll respond within 24 hours with a tailored bulk pricing proposal.
          </p>
          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            <Shield size={14} className="text-gold" />
            <span>Your data is secure and never shared with third parties.</span>
          </div>
        </motion.div>

        {/* Hidden Netlify form for bot detection */}
        <form name="quote-request" data-netlify="true" data-netlify-honeypot="bot-field" hidden>
          <input type="text" name="fullName" />
          <input type="text" name="businessName" />
          <input type="tel" name="phone" />
          <input type="email" name="email" />
          <select name="establishmentType"><option value=""></option></select>
          <input type="text" name="productsInterested" />
          <input type="text" name="estimatedQuantity" />
          <textarea name="message"></textarea>
        </form>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl space-y-5"
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
            disabled={loading}
            className="gradient-gold flex w-full items-center justify-center gap-2 rounded-sm py-4 font-body text-sm font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:shadow-gold disabled:opacity-50"
          >
            <Send size={16} />
            {loading ? "Sending..." : "Submit Quote Request"}
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;
