import { Phone, Mail, MessageCircle } from "lucide-react";

const Footer = () => (
  <footer className="gradient-dark border-t border-border/10 py-16">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {/* Brand */}
        <div>
          <h3 className="font-heading text-2xl font-bold text-gold">Milan_sz</h3>
          <p className="mt-3 font-body text-sm leading-relaxed text-primary-foreground/60">
            Premium accommodation amenities supplier serving guesthouses, Airbnbs, lodges and hotels across Eswatini.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-primary-foreground">Quick Links</h4>
          <nav className="mt-4 flex flex-col gap-3">
            {["Home", "Products", "About", "Reviews", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="font-body text-sm text-primary-foreground/50 transition-colors hover:text-gold"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-heading text-sm font-semibold uppercase tracking-widest text-primary-foreground">Contact</h4>
          <div className="mt-4 flex flex-col gap-3">
            <a href="tel:+26876259378" className="flex items-center gap-2 font-body text-sm text-primary-foreground/50 transition-colors hover:text-gold">
              <Phone size={14} /> +268 7625 9378/ 79853826
            </a>
            <a href="mailto:milantradings@gmail.com " className="flex items-center gap-2 font-body text-sm text-primary-foreground/50 transition-colors hover:text-gold">
              <Mail size={14} /> milantradings@gmail.com 
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
          © {new Date().getFullYear()} Milan_trading. All rights reserved. Built by RST Sealed Eswatini.
        </p>
      </div>
    </div>
  </footer>
);

export default Footer;
