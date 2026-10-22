
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import heroBg from "@/assets/hero-bg.png";

const trackEvent = (action: string) => {
  if (
    typeof window !== "undefined" &&
    typeof (window as any).gtag === "function"
  ) {
    (window as any).gtag("event", action, {
      event_category: "engagement",
    });
  }
};

const Hero = () => {
  return (
    <section
      id="home"
      className="relative flex min-h-screen items-center overflow-hidden"
    >
      {/* Background image and overlay */}
      <div className="absolute inset-0">
        <img
          src={heroBg}
          alt="Premium accommodation amenities prepared for a memorable guest experience"
          className="h-full w-full object-cover"
          loading="eager"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/75 to-primary/35" />

        {/* Bottom gradient for a more polished finish */}
        <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-primary/10" />
      </div>

      {/* Hero content */}
      <div className="container relative z-10 mx-auto px-6 pb-32 pt-32 md:pb-40 md:pt-36 lg:pb-44">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <span className="font-body text-[11px] font-light uppercase tracking-luxury text-primary-foreground/80 md:text-xs">
            Accommodation Supplies · Eswatini
          </span>

          <h1 className="mt-6 max-w-4xl font-heading text-4xl font-normal uppercase leading-[1.08] tracking-wide text-primary-foreground sm:text-5xl md:text-6xl lg:text-7xl">
            Your Brand.
            <br />
            Your Logo.
            <br />
            Every Guest Experience.
          </h1>

          <p className="mt-7 max-w-2xl font-body text-base font-light leading-relaxed text-primary-foreground/90 md:text-xl">
            Make every detail feel unmistakably yours. We help
            guesthouses, Airbnbs, lodges and hotels source
            accommodation essentials branded with their own
            logo — turning everyday products into a lasting
            impression your guests remember.
          </p>

          <p className="mt-4 max-w-xl font-body text-sm font-light leading-relaxed text-primary-foreground/75 md:text-base">
            Build a more professional guest experience with
            personalised amenities that put your business name
            in the details.
          </p>

          {/* Calls to action */}
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a
              href="#contact"
              onClick={() => trackEvent("hero_get_quote_click")}
              className="bg-background px-8 py-4 text-center font-body text-xs font-medium uppercase tracking-luxury text-foreground transition-opacity hover:opacity-90 md:px-10"
            >
              Brand Your Amenities
            </a>

            <a
              href="#products"
              onClick={() => trackEvent("hero_shop_products_click")}
              className="border border-primary-foreground/50 px-8 py-4 text-center font-body text-xs font-light uppercase tracking-luxury text-primary-foreground transition-colors hover:bg-primary-foreground/10 md:px-10"
            >
              Explore Products
            </a>
          </div>

          {/* Supporting value proposition */}
          <div className="mt-12 border-t border-primary-foreground/25 pt-6 md:mt-16 md:pt-8">
            <p className="max-w-2xl font-body text-xs font-light uppercase leading-loose tracking-[0.16em] text-primary-foreground/80 md:text-sm">
              Personalised presentation. A consistent brand.
              A more memorable stay.
            </p>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-7 left-1/2 -translate-x-1/2 md:bottom-9"
        animate={{ y: [0, 8, 0] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      >
        <ChevronDown
          className="text-primary-foreground/70"
          size={26}
          aria-hidden="true"
        />
      </motion.div>
    </section>
  );
};

export default Hero;
