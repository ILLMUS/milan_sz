import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

// ✅ EXACT file names from your assets folder
import productShowerCap from "@/assets/showercap.png";
import productLotion from "@/assets/lotion.png";
import productShampooConditioner from "@/assets/shampooconditioner.png";
import productShowerGel from "@/assets/shower-gel.png";
import productSoap from "@/assets/soap.png";

const trackEvent = (action: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, { event_category: "products" });
  }
};

const products = [
  {
    title: "Shower Cap",
    description:
      "Individually packaged shower caps designed for hygiene and convenience — ideal for hotels and guest accommodations.",
    image: productShowerCap,
    whatsappMsg:
      "Hi Milan_trading, I'd like to request a bulk quote for Shower Caps. Please send details.",
  },
  {
    title: "Hand & Body Lotion",
    description:
      "Hydrating lotion formulated to keep skin soft and moisturized — suitable for all skin types.",
    image: productLotion,
    whatsappMsg:
      "Hi Milan_trading, I'd like to request a bulk quote for Lotion. Please send details.",
  },
  {
    title: "Shampoo & Conditioner",
    description:
      "Nourishing 2-in-1 formula that cleans and conditions hair — perfect for guest comfort and efficiency.",
    image: productShampooConditioner,
    whatsappMsg:
      "Hi Milan_trading, I'd like to request a bulk quote for Shampoo & Conditioner. Please send details.",
  },
  {
    title: "Shower Gel",
    description:
      "Refreshing shower gel designed for daily use — gentle on skin and ideal for hospitality environments.",
    image: productShowerGel,
    whatsappMsg:
      "Hi Milan_trading, I'd like to request a bulk quote for Shower Gel. Please send details.",
  },
  {
    title: "Soap",
    description:
      "High-quality cleansing soap with a smooth finish — ideal for hotels, lodges, and guest houses.",
    image: productSoap,
    whatsappMsg:
      "Hi Milan_trading, I'd like to request a bulk quote for Soap. Please send details.",
  },
];

const Products = () => (
  <section id="products" className="bg-background py-20 md:py-28">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <span className="font-body text-xs font-light tracking-[0.3em] uppercase text-gold">
          Our Products
        </span>

        <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-5xl">
          Premium Hospitality Supplies
        </h2>

        <p className="mx-auto mt-4 max-w-xl font-body text-muted-foreground">
          Quality products designed for the accommodation industry — available in bulk with competitive pricing.
        </p>
      </motion.div>

      {/* ✅ Responsive grid for 5 products */}
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {products.map((product, i) => (
          <motion.div
            key={product.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.15, duration: 0.5 }}
            className="group overflow-hidden rounded-sm border border-border bg-card shadow-luxury transition-all hover:shadow-gold"
          >
            <div className="relative aspect-square overflow-hidden">
              <img
                src={product.image}
                alt={product.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />
            </div>

            <div className="p-6">
              <h3 className="font-heading text-xl font-semibold text-foreground">
                {product.title}
              </h3>

              <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">
                {product.description}
              </p>

              <div className="mt-6 flex flex-col gap-3">
                <a
                  href="#contact"
                  onClick={() => trackEvent("product_quote_click")}
                  className="block w-full rounded-sm bg-primary py-3 text-center font-body text-xs font-semibold uppercase tracking-widest text-primary-foreground transition-all hover:bg-primary/90"
                >
                  Request Bulk Quote
                </a>

                <a
                  href={`https://wa.me/26876259378?text=${encodeURIComponent(
                    product.whatsappMsg
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("whatsapp_product_click")}
                  className="flex w-full items-center justify-center gap-2 rounded-sm border border-gold/30 py-3 font-body text-xs font-semibold uppercase tracking-widest text-foreground transition-all hover:border-gold hover:text-gold"
                >
                  <MessageCircle size={14} />
                  Order via WhatsApp
                </a>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Products;