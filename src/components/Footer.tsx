import { Phone, Mail, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import logoImg from "@/assets/milan-logo.png";

const Footer = () => (
  <footer className="gradient-dark border-t border-border/10 py-16">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <div className="flex items-center gap-3">
            <img src={logoImg} alt="Milan Accommodation Amenities logo" className="h-14 w-14 object-contain" />
            <span className="font-heading text-2xl font-medium uppercase tracking-luxury text-primary-foreground">Milan</span>
          </div>
          <p className="mt-4 font-body text-sm font-light leading-relaxed text-primary-foreground/60">
            Thoughtful amenities. Memorable stays. Premium accommodation amenities supplied to guesthouses, Airbnbs, lodges and hotels across Eswatini.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-primary-foreground">Quick Links</h4>
          <nav className="mt-4 flex flex-col gap-3">
            {[
              { label: "Home", to: "/" },
              { label: "Products", to: "/products" },
              { label: "About", to: "/about" },
              { label: "Reviews", to: "/about#reviews" },
              { label: "Contact", to: "/contact" },
            ].map((link) => (
              <Link
                key={link.label}
                to={link.to}
                className="font-body text-sm text-primary-foreground/50 transition-colors hover:text-gold"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-primary-foreground">Contact</h4>
          <div className="mt-4 flex flex-col gap-3">
            <a href="tel:+26876259378" className="flex items-center gap-2 font-body text-sm text-primary-foreground/50 transition-colors hover:text-gold">
              <Phone size={14} /> +268 7625 9378
            </a>
            <a href="mailto:info@milansz.com" className="flex items-center gap-2 font-body text-sm text-primary-foreground/50 transition-colors hover:text-gold">
              <Mail size={14} /> info@milansz.com
            </a>
            <a
              href="https://wa.me/26876259378"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-body text-sm text-primary-foreground/50 transition-colors hover:text-gold"
            >
              <MessageCircle size={14} /> WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 border-t border-primary-foreground/10 pt-8 text-center">
        <p className="font-body text-xs text-primary-foreground/30">
          © {new Date().getFullYear()} Milan_sz. All rights reserved. Eswatini.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
