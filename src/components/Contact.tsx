
import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";

const WHATSAPP_NUMBER = "26876259378";

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
  fullName: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name is too long"),

  businessName: z
    .string()
    .trim()
    .min(2, "Business name must be at least 2 characters")
    .max(150, "Business name is too long"),

  phone: z
    .string()
    .trim()
    .min(7, "Phone number is too short")
    .max(20, "Phone number is too long")
    .regex(
      /^[+\d\s()-]+$/,
      "Invalid phone number format"
    ),

  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .max(255, "Email is too long"),

  establishmentType: z
    .string()
    .min(1, "Please select an establishment type")
    .refine(
      (value) => establishmentTypes.includes(value),
      "Please select a valid establishment type"
    ),

  productsInterested: z
    .string()
    .max(500, "Products information is too long")
    .optional()
    .default(""),

  estimatedQuantity: z
    .string()
    .max(100, "Quantity information is too long")
    .optional()
    .default(""),

  message: z
    .string()
    .max(2000, "Message is too long")
    .optional()
    .default(""),
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

const trackEvent = (action: string) => {
  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    (window as any).gtag("event", action, {
      event_category: "conversion",
    });
  }
};

/**
 * Creates a professionally formatted WhatsApp quotation request.
 * Optional fields are included only when the customer fills them in.
 */
const buildWhatsAppMessage = (data: ContactForm) => {
  const optionalSections: string[] = [];

  if (data.productsInterested?.trim()) {
    optionalSections.push(
      "*PRODUCTS INTERESTED IN*\n" +
        data.productsInterested.trim()
    );
  }

  if (data.estimatedQuantity?.trim()) {
    optionalSections.push(
      "*ESTIMATED QUANTITY*\n" +
        data.estimatedQuantity.trim()
    );
  }

  if (data.message?.trim()) {
    optionalSections.push(
      "*ADDITIONAL MESSAGE*\n" +
        data.message.trim()
    );
  }

  const orderRequirements = optionalSections.length
    ? optionalSections.join("\n\n")
    : "No additional product requirements provided.";

  return [
    "━━━━━━━━━━━━━━━━━━━━",
    "MILAN SZ SUPPLIES",
    "NEW QUOTATION REQUEST",
    "━━━━━━━━━━━━━━━━━━━━",
    "",
    "Hello Milan SZ Supplies,",
    "",
    "I would like to request a quotation for accommodation supplies.",
    "",
    "1. CUSTOMER INFORMATION",
    "────────────────────",
    `Full Name: ${data.fullName}`,
    `Business Name: ${data.businessName}`,
    `Establishment Type: ${data.establishmentType}`,
    `Contact Number: ${data.phone}`,
    `Email Address: ${data.email}`,
    "",
    "2. ORDER REQUIREMENTS",
    "────────────────────",
    orderRequirements,
    "",
    "3. QUOTATION REQUEST",
    "────────────────────",
    "Please provide your available products, pricing, and estimated delivery information.",
    "",
    "Thank you. I look forward to your response.",
    "",
    "━━━━━━━━━━━━━━━━━━━━",
    "Source: milanszsupplies.com",
    "Milan SZ Supplies | Accommodation Supplies",
  ].join("\n");
};

const Contact = () => {
  const { toast } = useToast();

  const [form, setForm] = useState<ContactForm>({
    ...emptyForm,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ContactForm, string>>
  >({});

  const [honeypot, setHoneypot] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (name in errors) {
      setErrors((previous) => ({
        ...previous,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Silently ignore submissions that trigger the hidden bot field.
    if (honeypot.trim()) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    const result = contactSchema.safeParse(form);

    if (!result.success) {
      const nextErrors: Partial<
        Record<keyof ContactForm, string>
      > = {};

      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ContactForm;

        if (!nextErrors[field]) {
          nextErrors[field] = issue.message;
        }
      });

      setErrors(nextErrors);

      toast({
        title: "Please check your information",
        description:
          "Correct the highlighted fields before continuing.",
        variant: "destructive",
      });

      return;
    }

    const validatedData = result.data;
    const message = buildWhatsAppMessage(validatedData);

    const whatsappUrl =
      `https://wa.me/${WHATSAPP_NUMBER}?text=` +
      encodeURIComponent(message);

    setIsSubmitting(true);

    // Open WhatsApp directly from the submit interaction.
    // The customer must press Send inside WhatsApp to deliver the message.
    window.open(
      whatsappUrl,
      "_blank",
      "noopener,noreferrer"
    );

    trackEvent("whatsapp_quote_submission");

    // Optional lead backup in Supabase.
    // This records the website form submission, not proof that
    // the customer actually sent the WhatsApp message.
    void supabase.functions
      .invoke("submit-quote", {
        body: {
          ...validatedData,
          source: "website_whatsapp",
        },
      })
      .then(({ error }) => {
        if (error) {
          console.error(
            "Quote backup could not be saved:",
            error.message
          );
        }
      })
      .catch((error) => {
        console.error(
          "Quote backup failed:",
          error
        );
      });

    toast({
      title: "Your quotation request is ready",
      description:
        "WhatsApp should open with your organised message. Review it and tap Send to submit your request.",
    });

    setForm({ ...emptyForm });
    setErrors({});
    setHoneypot("");
    setIsSubmitting(false);
  };

  const inputClass =
    "w-full border border-border bg-background px-4 py-3 " +
    "text-foreground placeholder:text-muted-foreground " +
    "outline-none transition-colors focus:border-gold " +
    "focus:ring-1 focus:ring-gold";

  const labelClass =
    "mb-2 block text-sm font-medium text-foreground";

  const renderError = (field: keyof ContactForm) => {
    if (!errors[field]) {
      return null;
    }

    return (
      <p
        className="mt-1 text-sm text-destructive"
        role="alert"
      >
        {errors[field]}
      </p>
    );
  };

  return (
    <section
      id="contact"
      className="bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl"
        >
          <div className="mb-10 text-center">
            <span className="mb-3 inline-block text-sm font-semibold uppercase tracking-[0.2em] text-gold">
              Get in Touch
            </span>

            <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
              Request a Quotation
            </h2>

            <p className="mx-auto max-w-xl text-muted-foreground">
              Tell us about your establishment and the
              accommodation supplies you need. Your details
              will be organised into a WhatsApp message so
              we can assist you with your quotation.
            </p>
          </div>

          <motion.form
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
            noValidate
          >
            {/* Hidden spam-prevention field */}
            <div
              className="absolute h-0 w-0 overflow-hidden opacity-0"
              aria-hidden="true"
            >
              <label htmlFor="contact-website">
                Leave this field empty
              </label>

              <input
                id="contact-website"
                type="text"
                name="website"
                autoComplete="off"
                tabIndex={-1}
                value={honeypot}
                onChange={(event) =>
                  setHoneypot(event.target.value)
                }
              />
            </div>

            {/* Customer information */}
            <div className="border border-border p-5 sm:p-6">
              <h3 className="mb-5 text-lg font-semibold text-foreground">
                1. Customer Information
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label
                    className={labelClass}
                    htmlFor="fullName"
                  >
                    Full Name *
                  </label>

                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="Your full name"
                    value={form.fullName}
                    onChange={handleChange}
                    className={inputClass}
                    aria-invalid={Boolean(errors.fullName)}
                    aria-describedby={
                      errors.fullName
                        ? "fullName-error"
                        : undefined
                    }
                    required
                  />

                  {errors.fullName && (
                    <p
                      id="fullName-error"
                      className="mt-1 text-sm text-destructive"
                      role="alert"
                    >
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    className={labelClass}
                    htmlFor="businessName"
                  >
                    Business Name *
                  </label>

                  <input
                    id="businessName"
                    name="businessName"
                    type="text"
                    autoComplete="organization"
                    placeholder="Your establishment's name"
                    value={form.businessName}
                    onChange={handleChange}
                    className={inputClass}
                    aria-invalid={Boolean(
                      errors.businessName
                    )}
                    required
                  />

                  {renderError("businessName")}
                </div>

                <div>
                  <label
                    className={labelClass}
                    htmlFor="establishmentType"
                  >
                    Establishment Type *
                  </label>

                  <select
                    id="establishmentType"
                    name="establishmentType"
                    value={form.establishmentType}
                    onChange={handleChange}
                    className={inputClass}
                    aria-invalid={Boolean(
                      errors.establishmentType
                    )}
                    required
                  >
                    <option value="">
                      Select establishment type
                    </option>

                    {establishmentTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>

                  {renderError("establishmentType")}
                </div>

                <div>
                  <label
                    className={labelClass}
                    htmlFor="phone"
                  >
                    Contact Number *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+268 ..."
                    value={form.phone}
                    onChange={handleChange}
                    className={inputClass}
                    aria-invalid={Boolean(errors.phone)}
                    required
                  />

                  {renderError("phone")}
                </div>

                <div className="sm:col-span-2">
                  <label
                    className={labelClass}
                    htmlFor="email"
                  >
                    Email Address *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={handleChange}
                    className={inputClass}
                    aria-invalid={Boolean(errors.email)}
                    required
                  />

                  {renderError("email")}
                </div>
              </div>
            </div>

            {/* Order requirements */}
            <div className="border border-border p-5 sm:p-6">
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                2. Order Requirements
              </h3>

              <p className="mb-5 text-sm text-muted-foreground">
                Provide as much detail as possible to help
                us prepare an accurate quotation.
              </p>

              <div className="space-y-5">
                <div>
                  <label
                    className={labelClass}
                    htmlFor="productsInterested"
                  >
                    Products Interested In
                  </label>

                  <textarea
                    id="productsInterested"
                    name="productsInterested"
                    rows={3}
                    maxLength={500}
                    placeholder="e.g. Lotion, Towels, Soap, Shower Cap ..."
                    value={form.productsInterested}
                    onChange={handleChange}
                    className={inputClass}
                    aria-invalid={Boolean(
                      errors.productsInterested
                    )}
                  />

                  <div className="mt-1 flex justify-between gap-3">
                    {renderError("productsInterested")}

                    <span className="ml-auto text-xs text-muted-foreground">
                      {form.productsInterested.length}/500
                    </span>
                  </div>
                </div>

                <div>
                  <label
                    className={labelClass}
                    htmlFor="estimatedQuantity"
                  >
                    Estimated Quantity
                  </label>

                  <input
                    id="estimatedQuantity"
                    name="estimatedQuantity"
                    type="text"
                    placeholder="e.g. 288 Soaps, 250 Shower Caps"
                    value={form.estimatedQuantity}
                    onChange={handleChange}
                    className={inputClass}
                    aria-invalid={Boolean(
                      errors.estimatedQuantity
                    )}
                  />

                  {renderError("estimatedQuantity")}
                </div>

                <div>
                  <label
                    className={labelClass}
                    htmlFor="message"
                  >
                    Additional Message
                  </label>

                  <textarea
                    id="message"
                    name="message"
                    rows={4}
                    maxLength={2000}
                    placeholder="Tell us about your requirements, preferred delivery date, or any special requests..."
                    value={form.message}
                    onChange={handleChange}
                    className={inputClass}
                    aria-invalid={Boolean(errors.message)}
                  />

                  <div className="mt-1 flex justify-between gap-3">
                    {renderError("message")}

                    <span className="ml-auto text-xs text-muted-foreground">
                      {form.message.length}/2000
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* WhatsApp submission */}
            <div className="space-y-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center gap-3 bg-gradient-to-r from-gold to-gold/80 px-6 py-4 font-semibold text-accent-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <MessageCircle size={21} />

                {isSubmitting
                  ? "Preparing Your Request..."
                  : "Send Quote Request via WhatsApp"}
              </button>

              <p className="text-center text-sm text-muted-foreground">
                WhatsApp will open with your information
                neatly arranged. Review the message and tap
                Send to submit your quotation request.
              </p>

              <p className="text-center text-xs text-muted-foreground">
                Your contact details are included to help us
                respond to your enquiry.
              </p>
            </div>
          </motion.form>
        </motion.div>
      </div>
    </section>
  );
};

export default Contact;
