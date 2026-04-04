import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
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
  fullName: z.string().trim().min(2).max(100),
  businessName: z.string().trim().min(2).max(150),
  phone: z.string().trim().min(7).max(20),
  email: z.string().trim().email().max(255),
  establishmentType: z.string().min(1),
  productsInterested: z.string().optional().default(""),
  estimatedQuantity: z.string().optional().default(""),
  message: z.string().optional().default(""),
});

type ContactForm = z.infer<typeof contactSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [errors, setErrors] = useState<Partial<Record<keyof ContactForm, string>>>({});
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    const data = result.data;

    // 🔥 WhatsApp message format (your new "form backend")
    const message = `
Hi, I’d like to place an order:

📌 Full Name: ${data.fullName}
🏢 Business Name: ${data.businessName}
📞 Phone: ${data.phone}
📧 Email: ${data.email}
🏨 Establishment Type: ${data.establishmentType}

🛍️ Products: ${data.productsInterested || "-"}
📦 Quantity: ${data.estimatedQuantity || "-"}

📝 Message:
${data.message || "-"}
`;

    const encodedMessage = encodeURIComponent(message);

    // 👉 YOUR WHATSAPP NUMBER (FIX THIS)
    const whatsappNumber = "26876259378";

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;

    trackEvent("whatsapp_click");

    // Open WhatsApp
    window.open(whatsappUrl, "_blank");

    toast({
      title: "Redirecting to WhatsApp",
      description: "Complete your order by sending the message.",
    });
  };

  const inputClass =
    "w-full rounded-sm border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold";

  const errorClass = "text-xs text-destructive mt-1";

  return (
    <section id="contact" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-6">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="mb-16 text-center"
        >
          <span className="text-xs tracking-[0.3em] uppercase text-gold">
            Order Instantly
          </span>

          <h2 className="mt-3 text-3xl font-bold md:text-5xl">
            Place Your Order on WhatsApp
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Fill in your details and continue instantly on WhatsApp to confirm your order.
          </p>

          <div className="mt-3 flex justify-center gap-2 text-xs text-muted-foreground">
            <Shield size={14} className="text-gold" />
            <span>Fast response. Direct communication. No delays.</span>
          </div>
        </motion.div>

        {/* FORM */}
        <motion.form
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl space-y-5"
        >
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
              <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" className={`${inputClass} ${errors.phone ? "border-destructive" : ""}`} />
              {errors.phone && <p className={errorClass}>{errors.phone}</p>}
            </div>

            <div>
              <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address *" className={`${inputClass} ${errors.email ? "border-destructive" : ""}`} />
              {errors.email && <p className={errorClass}>{errors.email}</p>}
            </div>
          </div>

          <select name="establishmentType" value={form.establishmentType} onChange={handleChange} className={`${inputClass} ${errors.establishmentType ? "border-destructive" : ""}`}>
            <option value="">Type of Establishment *</option>
            {establishmentTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <input name="productsInterested" value={form.productsInterested} onChange={handleChange} placeholder="Products Interested" className={inputClass} />
            <input name="estimatedQuantity" value={form.estimatedQuantity} onChange={handleChange} placeholder="Estimated Quantity" className={inputClass} />
          </div>

          <textarea
            name="message"
            value={form.message}
            onChange={handleChange}
            placeholder="Additional Message"
            rows={4}
            className={inputClass}
          />

          {/* 🔥 CTA BUTTON */}
          <button
            type="submit"
            className="gradient-gold w-full py-4 text-sm font-semibold uppercase tracking-widest flex items-center justify-center gap-2 hover:shadow-gold"
          >
            <Send size={16} />
            Continue to WhatsApp
          </button>
        </motion.form>
      </div>
    </section>
  );
};

export default Contact;