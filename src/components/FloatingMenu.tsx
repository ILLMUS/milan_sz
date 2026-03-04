import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Phone, Mail, MessageCircle, Search, FileText, ArrowUp } from "lucide-react";

const trackEvent = (action: string) => {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag("event", action, { event_category: "floating_menu" });
  }
};

const menuItems = [
  { icon: Phone, label: "Call Us", href: "tel:+26800000000", event: "phone_click" },
  { icon: Mail, label: "Email Us", href: "mailto:info@milansz.com", event: "email_click" },
  { icon: MessageCircle, label: "WhatsApp Order", href: "https://wa.me/26800000000?text=Hi%20Milan_sz%2C%20I'd%20like%20to%20place%20an%20order.", event: "whatsapp_click" },
  { icon: Search, label: "Search Product", href: "#products", event: "search_product_click" },
  { icon: FileText, label: "Get Free Quote", href: "#contact", event: "floating_quote_click" },
];

const FloatingMenu = () => {
  const [open, setOpen] = useState(false);
  const [showArrow, setShowArrow] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Arrow animation every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (!open) {
        setShowArrow(true);
        setTimeout(() => setShowArrow(false), 2000);
      }
    }, 10000);
    // Show once initially after 3s
    const initial = setTimeout(() => {
      if (!open) {
        setShowArrow(true);
        setTimeout(() => setShowArrow(false), 2000);
      }
    }, 3000);
    return () => {
      clearInterval(interval);
      clearTimeout(initial);
    };
  }, [open]);

  // Click outside
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={menuRef} className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Arrow hint */}
      <AnimatePresence>
        {showArrow && !open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.6 }}
            className="mb-2 flex flex-col items-center"
          >
            <span className="mb-1 font-body text-xs font-semibold tracking-wider text-gold">Quick Order</span>
            <ArrowUp className="text-gold" size={18} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Menu items */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="mb-3 flex flex-col gap-2"
          >
            {menuItems.map((item, i) => (
              <motion.a
                key={item.label}
                href={item.href}
                target={item.href.startsWith("http") ? "_blank" : undefined}
                rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => {
                  trackEvent(item.event);
                  setOpen(false);
                }}
                className="flex items-center gap-3 rounded-sm bg-primary px-4 py-3 shadow-lg transition-all hover:shadow-gold"
              >
                <item.icon className="text-gold" size={16} />
                <span className="whitespace-nowrap font-body text-xs font-semibold tracking-wider text-primary-foreground">
                  {item.label}
                </span>
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        onClick={() => {
          setOpen(!open);
          trackEvent("floating_button_click");
        }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-gold shadow-gold transition-all"
        aria-label="Quick order menu"
      >
        <motion.div animate={{ rotate: open ? 45 : 0 }} transition={{ duration: 0.2 }}>
          <Plus className="text-accent-foreground" size={24} />
        </motion.div>
      </motion.button>
    </div>
  );
};

export default FloatingMenu;
