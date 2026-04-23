import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.jpg";

const trackEvent = (action: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, { event_category: "engagement" });
  }
};

const Hero = () => {
  return (
    <section id="home" className="relative flex min-h-screen items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src={heroBg} alt="Premium accommodation amenities" className="h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-primary/80" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <div className="mb-6 inline-block border border-gold/30 px-4 py-1">
            <span className="font-body text-xs font-light tracking-[0.3em] uppercase text-gold">
              Eswatini's Premier Supplier
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl font-heading text-4xl font-bold leading-tight text-primary-foreground md:text-6xl lg:text-7xl">
           Hotel, Guesthouse & Airbnb {" "}
            <span className="text-gradient-gold">Amenities Supplier</span> in Eswatini
          </h1>

          <p className="mx-auto mt-6 max-w-2xl font-body text-lg font-light leading-relaxed text-primary-foreground/70 md:text-xl">
            Bulk supply available. Fast local delivery. Reliable restocking.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <a
              href="#contact"
              onClick={() => trackEvent("hero_get_quote_click")}
              className="gradient-gold rounded-sm px-10 py-4 font-body text-sm font-semibold uppercase tracking-widest text-accent-foreground transition-all hover:shadow-gold"
            >
              Get Free Quote
            </a>
            <a
              href="#products"
              className="rounded-sm border border-gold/40 px-10 py-4 font-body text-sm font-light uppercase tracking-widest text-primary-foreground transition-all hover:border-gold hover:text-gold"
            >
              View Products
            </a>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <ChevronDown className="text-gold/50" size={28} />
        </motion.div>
      </div>
    </section>
  );
};

export default Hero;
