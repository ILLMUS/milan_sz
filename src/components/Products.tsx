import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingBag, ThumbsUp, ThumbsDown, Minus, Plus } from "lucide-react";
import { products, formatPrice } from "@/data/products";
import { useCart } from "@/context/CartContext";
import { toast } from "sonner";

const trackEvent = (action: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, { event_category: "products" });
  }
};

const Products = () => {
  const { addItem, setOpen, reactions, react } = useCart();
  const [qtys, setQtys] = useState<Record<string, number>>(() =>
    Object.fromEntries(products.map((p) => [p.id, p.moq]))
  );

  const changeQty = (id: string, delta: number, moq: number) =>
    setQtys((prev) => ({ ...prev, [id]: Math.max(moq, (prev[id] ?? moq) + delta) }));

  return (
    <section id="products" className="bg-background py-20 md:py-28">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => {
            const reaction = reactions[product.id] ?? null;
            const qty = qtys[product.id] ?? product.moq;
            return (
              <motion.article
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: (i % 3) * 0.1, duration: 0.5 }}
                className="group flex flex-col overflow-hidden border border-border bg-card transition-shadow hover:shadow-luxury"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                  <img
                    src={product.image}
                    alt={product.title}
                    width={1024}
                    height={1280}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <span className="absolute left-4 top-4 bg-background/90 px-3 py-1 font-body text-[10px] uppercase tracking-luxury text-foreground">
                    {product.range}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-heading text-xl font-medium uppercase tracking-wide text-foreground">
                    {product.title}
                  </h3>
                  <p className="mt-2 flex-1 font-body text-sm font-light leading-relaxed text-muted-foreground">
                    {product.description}
                  </p>

                  <div className="mt-5 flex items-end justify-between border-t border-border pt-5">
                    <div>
                      <p className="font-heading text-2xl font-medium text-foreground">{formatPrice(product.price)}</p>
                      <p className="font-body text-xs text-muted-foreground">
                        {product.unit} · min. {product.moq}
                      </p>
                    </div>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => react(product.id, "like")}
                        aria-label={`Like ${product.title}`}
                        aria-pressed={reaction === "like"}
                        className={`flex h-9 w-9 items-center justify-center border transition-colors ${
                          reaction === "like"
                            ? "border-gold bg-gold text-accent-foreground"
                            : "border-border text-muted-foreground hover:border-gold hover:text-gold"
                        }`}
                      >
                        <ThumbsUp size={15} />
                      </button>
                      <button
                        onClick={() => react(product.id, "dislike")}
                        aria-label={`Dislike ${product.title}`}
                        aria-pressed={reaction === "dislike"}
                        className={`flex h-9 w-9 items-center justify-center border transition-colors ${
                          reaction === "dislike"
                            ? "border-destructive bg-destructive text-destructive-foreground"
                            : "border-border text-muted-foreground hover:border-destructive hover:text-destructive"
                        }`}
                      >
                        <ThumbsDown size={15} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-5 flex items-center justify-between border border-border px-2 py-1.5">
                    <button
                      onClick={() => changeQty(product.id, -product.step, product.moq)}
                      aria-label={`Decrease quantity of ${product.title}`}
                      className="px-2 py-1 text-muted-foreground hover:text-foreground"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="font-body text-sm text-foreground">
                      {qty} <span className="text-muted-foreground">units</span>
                    </span>
                    <button
                      onClick={() => changeQty(product.id, product.step, product.moq)}
                      aria-label={`Increase quantity of ${product.title}`}
                      className="px-2 py-1 text-muted-foreground hover:text-foreground"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="mt-3 flex flex-col gap-3">
                    <button
                      onClick={() => {
                        addItem(
                          {
                            id: product.id,
                            title: product.title,
                            price: product.price,
                            unit: product.unit,
                            image: product.image,
                            step: product.step,
                            moq: product.moq,
                          },
                          qty
                        );
                        trackEvent("add_to_cart");
                        toast.success(`${qty} × ${product.title} added to your order`, {
                          action: { label: "View", onClick: () => setOpen(true) },
                        });
                      }}
                      className="flex w-full items-center justify-center gap-2 bg-primary py-3.5 font-body text-xs font-medium uppercase tracking-luxury text-primary-foreground transition-opacity hover:opacity-90"
                    >
                      <ShoppingBag size={14} />
                      Add to Order · {formatPrice(product.price * qty)}
                    </button>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Products;
