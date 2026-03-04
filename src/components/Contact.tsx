import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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

const Contact = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
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
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    // Airtable integration placeholder
    // Replace with your Airtable API endpoint and key
    try {
      // const response = await fetch('https://api.airtable.com/v0/YOUR_BASE_ID/YOUR_TABLE', {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': 'Bearer YOUR_API_KEY',
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({ fields: form }),
      // });

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
        </motion.div>

        <motion.form
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          onSubmit={handleSubmit}
          className="mx-auto max-w-2xl space-y-5"
        >
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <input name="fullName" value={form.fullName} onChange={handleChange} placeholder="Full Name *" required className={inputClass} />
            <input name="businessName" value={form.businessName} onChange={handleChange} placeholder="Business Name *" required className={inputClass} />
            <input name="phone" value={form.phone} onChange={handleChange} placeholder="Phone Number *" required type="tel" className={inputClass} />
            <input name="email" value={form.email} onChange={handleChange} placeholder="Email Address *" required type="email" className={inputClass} />
          </div>

          <select name="establishmentType" value={form.establishmentType} onChange={handleChange} required className={inputClass}>
            <option value="">Type of Establishment *</option>
            {establishmentTypes.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

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
