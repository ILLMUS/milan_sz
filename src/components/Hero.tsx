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
    <section id="home" className="relative flex min-h-screen items-center overflow-hidden">
      <div className="absolute inset-0">
        <img src={heroBg} alt="Premium accommodation amenities in a guest bathroom" className="h-full w-full object-cover" loading="eager" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-primary/30" />
      </div>

      <div className="container relative z-10 mx-auto px-6 pt-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <span className="font-body text-[11px] font-light uppercase tracking-luxury text-primary-foreground/80">
            Accommodation Amenities · Eswatini
          </span>

          <h1 className="mt-6 font-heading text-4xl font-normal uppercase leading-[1.1] tracking-wide text-primary-foreground md:text-6xl lg:text-7xl">
            Guest Amenities Designed for Comfort, Care &amp; Consistency
          </h1>

          <p className="mt-6 max-w-xl font-body text-base font-light leading-relaxed text-primary-foreground/80 md:text-lg">
            Premium bulk amenities for guesthouses, Airbnbs, lodges and hotels — locally delivered, reliably restocked.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contact"
              onClick={() => trackEvent("hero_get_quote_click")}
              className="bg-background px-10 py-4 text-center font-body text-xs font-medium uppercase tracking-luxury text-foreground transition-opacity hover:opacity-90"
            >
              Request a Quote
            </a>
            <a
              href="#products"
              className="border border-primary-foreground/40 px-10 py-4 text-center font-body text-xs font-light uppercase tracking-luxury text-primary-foreground transition-colors hover:bg-primary-foreground/10"
            >
              Shop Products
            </a>
          </div>
        </motion.div>
      </div>

      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
      >
        <ChevronDown className="text-primary-foreground/60" size={26} />
      </motion.div>
    </section>
  );
};

export default Hero;
