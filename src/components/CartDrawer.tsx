import { X, Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useCart } from "@/context/CartContext";
import { formatPrice } from "@/data/products";

const CartDrawer = () => {
  const { items, isOpen, setOpen, setQty, removeItem, total, clear } = useCart();

  const whatsappMessage = () =>
    encodeURIComponent(
      `Hi Milan_sz, I'd like to order:\n\n${items
        .map((i) => `• ${i.title} — ${i.qty} x ${formatPrice(i.price)} = ${formatPrice(i.price * i.qty)}`)
        .join("\n")}\n\nEstimated total: ${formatPrice(total)}\n\nPlease confirm bulk pricing and delivery.`
    );


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-primary/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.35, ease: "easeInOut" }}
            className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-background shadow-luxury"
            aria-label="Shopping cart"
          >
            <header className="flex items-center justify-between border-b border-border px-6 py-5">
              <h2 className="font-heading text-xl font-medium uppercase tracking-luxury text-foreground">
                Your Order
              </h2>
              <button onClick={() => setOpen(false)} aria-label="Close cart" className="text-muted-foreground hover:text-foreground">
                <X size={20} />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-6 py-6">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <ShoppingBag className="text-muted-foreground/40" size={40} />
                  <p className="mt-4 font-body text-sm text-muted-foreground">Your order list is empty.</p>
                </div>
              ) : (
                <ul className="flex flex-col gap-6">
                  {items.map((item) => (
                    <li key={item.id} className="flex gap-4">
                      <img src={item.image} alt={item.title} className="h-20 w-20 rounded-sm object-cover" loading="lazy" />
                      <div className="flex-1">
                        <p className="font-heading text-base font-medium text-foreground">{item.title}</p>
                        <p className="font-body text-xs text-muted-foreground">{item.unit}</p>
                        <div className="mt-3 flex items-center justify-between">
                          <div className="flex items-center border border-border">
                            <button
                              onClick={() => setQty(item.id, item.qty - (item.step ?? 1))}
                              aria-label={`Decrease ${item.title}`}
                              className="px-2 py-1 text-muted-foreground hover:text-foreground"
                            >
                              <Minus size={13} />
                            </button>
                            <span className="min-w-8 text-center font-body text-sm text-foreground">{item.qty}</span>
                            <button
                              onClick={() => setQty(item.id, item.qty + (item.step ?? 1))}
                              aria-label={`Increase ${item.title}`}
                              className="px-2 py-1 text-muted-foreground hover:text-foreground"
                            >
                              <Plus size={13} />
                            </button>
                          </div>

                          <span className="font-body text-sm font-medium text-foreground">
                            {formatPrice(item.price * item.qty)}
                          </span>
                          <button
                            onClick={() => removeItem(item.id)}
                            aria-label={`Remove ${item.title}`}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {items.length > 0 && (
              <footer className="border-t border-border px-6 py-6">
                <div className="flex items-center justify-between">
                  <span className="font-body text-xs uppercase tracking-luxury text-muted-foreground">Estimated total</span>
                  <span className="font-heading text-2xl font-medium text-foreground">{formatPrice(total)}</span>
                </div>
                <p className="mt-2 font-body text-xs text-muted-foreground">
                  Final pricing confirmed on quote. Bulk discounts applied per volume.
                </p>
                <div className="mt-5 flex flex-col gap-3">
                  <a
                    href={`https://wa.me/26876259378?text=${whatsappMessage()}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full bg-primary py-3.5 text-center font-body text-xs font-medium uppercase tracking-luxury text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Send Order via WhatsApp
                  </a>
                  <a
                    href="#contact"
                    onClick={() => setOpen(false)}
                    className="block w-full border border-border py-3.5 text-center font-body text-xs font-medium uppercase tracking-luxury text-foreground transition-colors hover:border-gold hover:text-gold"
                  >
                    Request Formal Quote
                  </a>
                  <button
                    onClick={clear}
                    className="font-body text-xs uppercase tracking-luxury text-muted-foreground hover:text-destructive"
                  >
                    Clear list
                  </button>
                </div>
              </footer>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default CartDrawer;
