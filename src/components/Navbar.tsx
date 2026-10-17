import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import { Link } from "react-router-dom";
import logoImg from "@/assets/milan-logo.png";
import { useCart } from "@/context/CartContext";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Catalogue", href: "/catalogue" },
  { label: "Branding", href: "/showcase" },
  { label: "About", href: "/about" },
  { label: "Reviews", href: "/about#reviews" },
  { label: "Contact", href: "/contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, setOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed left-0 right-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? "border-b border-border bg-background/95 backdrop-blur-md" : "bg-background/80 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6 py-3">
        <Link to="/" className="flex items-center gap-3" aria-label="Milan Accommodation Amenities home">
          <img src={logoImg} alt="Milan Accommodation Amenities logo" className="h-14 w-14 object-contain" />
          <span className="flex flex-col leading-none">
            <span className="font-heading text-xl font-medium uppercase tracking-luxury text-foreground">Milan</span>
            <span className="font-body text-[9px] uppercase tracking-luxury text-muted-foreground">
              Accommodation Amenities
            </span>
          </span>
        </Link>

        {/* Desktop */}
        <div className="hidden items-center gap-5 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              className="font-body text-xs font-light uppercase tracking-luxury text-foreground transition-colors hover:text-gold"
            >
              {item.label}
            </Link>
          ))}
          <Link
            to="/contact"
            className="bg-primary px-6 py-2.5 font-body text-[10px] font-medium uppercase tracking-luxury text-primary-foreground transition-opacity hover:opacity-90"
          >
            Get Quote
          </Link>
          <button onClick={() => setOpen(true)} aria-label="Open cart" className="relative text-foreground hover:text-gold">
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 font-body text-[10px] text-accent-foreground">
                {count}
              </span>
            )}
          </button>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-5 lg:hidden">
          <button onClick={() => setOpen(true)} aria-label="Open cart" className="relative text-foreground">
            <ShoppingBag size={19} />
            {count > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-gold px-1 font-body text-[10px] text-accent-foreground">
                {count}
              </span>
            )}
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)} className="text-foreground" aria-label="Toggle menu">
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-t border-border bg-background lg:hidden"
          >
            <div className="flex flex-col items-center gap-6 px-6 py-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setMobileOpen(false)}
                  className="font-body text-xs uppercase tracking-luxury text-foreground transition-colors hover:text-gold"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/contact"
                onClick={() => setMobileOpen(false)}
                className="bg-primary px-8 py-3 font-body text-[10px] font-medium uppercase tracking-luxury text-primary-foreground"
              >
                Get Quote
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
