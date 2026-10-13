import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Printer, Clock, Palette } from "lucide-react";
import BrandingQuoteDialog from "./BrandingQuoteDialog";

const highlights = [
  {
    icon: Printer,
    title: "Your Logo, Printed",
    desc: "Amenities printed with your hotel or guesthouse logo — white or transparent tubes and bottles.",
  },
  {
    icon: Palette,
    title: "Tailored to Your Brand",
    desc: "Choose the colours and finish that match your property's identity across the full amenity range.",
  },
  {
    icon: BadgeCheck,
    title: "Guest Trust",
    desc: "A branded amenity in every room tells guests your property is established, consistent and professional.",
  },
  {
    icon: Clock,
    title: "14 Working Days",
    desc: "From approved artwork to delivery. Your first branded order arrives ready for your guests.",
  },
];

const CustomBranding = () => {
  const [quoteOpen, setQuoteOpen] = useState(false);

  return (
  <section id="custom-branding" className="bg-card py-20 md:py-28">
    <div className="container mx-auto px-6">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-body text-xs font-light tracking-[0.3em] uppercase text-gold">
            Custom Branding
          </span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-5xl">
            Your Logo in Every Room
          </h2>
          <p className="font-heading mt-4 text-2xl font-light italic text-muted-foreground md:text-3xl">
            “Luxury in Every Detail”
          </p>
          <p className="mx-auto mt-6 max-w-2xl font-body text-base font-light leading-relaxed text-muted-foreground md:text-lg">
            Put your own logo on your amenities. Guests see your brand from the moment they open
            the bathroom door — a branded soap, shampoo and body wash say your property cares
            about every detail, and they stay in the guest's memory long after checkout.
          </p>
        </motion.div>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="border border-border bg-background p-6"
          >
            <div className="mb-4 flex h-12 w-12 items-center justify-center border border-gold/20">
              <item.icon className="text-gold" size={22} />
            </div>
            <h3 className="font-heading text-lg font-semibold uppercase tracking-wide text-foreground">
              {item.title}
            </h3>
            <p className="mt-2 font-body text-sm font-light leading-relaxed text-muted-foreground">
              {item.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
        className="mx-auto mt-12 max-w-3xl border border-gold/25 bg-background p-8 text-center"
      >
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <p className="font-heading text-4xl font-medium text-foreground">E 2,000</p>
            <p className="mt-1 font-body text-xs uppercase tracking-luxury text-muted-foreground">
              Once-off branding setup
            </p>
          </div>
          <div>
            <p className="font-heading text-4xl font-medium text-foreground">14 days</p>
            <p className="mt-1 font-body text-xs uppercase tracking-luxury text-muted-foreground">
              Production &amp; delivery
            </p>
          </div>
        </div>
        <p className="mx-auto mt-6 max-w-xl font-body text-sm font-light text-muted-foreground">
          The setup fee is charged once — every reorder after that ships in your branded
          packaging at standard bulk prices.
        </p>
        <button
          type="button"
          onClick={() => setQuoteOpen(true)}
          className="mt-8 inline-block border border-gold bg-transparent px-8 py-3 font-body text-xs uppercase tracking-luxury text-foreground transition-colors hover:bg-gold hover:text-accent-foreground"
        >
          Request a Branding Quote
        </button>
      </motion.div>
    </div>
    <BrandingQuoteDialog open={quoteOpen} onOpenChange={setQuoteOpen} />
  </section>
  );
};

export default CustomBranding;
