import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { 
  Phone, 
  Mail, 
  MessageCircle, 
  ArrowUpRight, 
  Instagram, 
  Facebook, 
  Linkedin, 
  Twitter, 
  Heart,
  Send
} from "lucide-react";
import logoImg from "@/assets/milan-logo.png";

const socialLinks = [
  { name: "Instagram", href: "https://www.instagram.com/milansz_/", icon: Instagram },
  { name: "Facebook", href: "https://www.facebook.com/profile.php?id=61563182469879", icon: Facebook },
  { name: "WhatsApp", href: "https://wa.me/26876259378", icon: MessageCircle },
];

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Products", to: "/products" },
  { label: "About", to: "/#about" },
  { label: "Reviews", to: "/#reviews" },
  { label: "Contact", to: "/contact" },
];

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="relative bg-[#FDFBF7] text-[#1A1A1A] pt-20 pb-10 border-t border-[#E8E2D5] overflow-hidden">
      {/* Background Subtle Accent Gradients */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-amber-200/20 blur-[100px] rounded-full" />

      <div className="container mx-auto px-6 max-w-7xl relative z-10">



        {/* Main Grid Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 pb-16 border-b border-[#E8E2D5]">
          {/* Brand Info */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-3"
            >
              <img src={logoImg} alt="Milan Accommodation Amenities" className="h-14 w-14 object-contain filter drop-shadow-sm" />
              <div className="flex flex-col">
                <span className="font-heading text-2xl font-black uppercase tracking-widest text-[#1A1A1A]">
                  Milan_SZ
                </span>
                <span className="text-[10px] uppercase tracking-widest font-bold text-amber-700/80 -mt-1">
                  Accommodation Amenities
                </span>
              </div>
            </motion.div>

            <p className="font-body text-sm text-neutral-600 leading-relaxed max-w-sm font-light">
              Thoughtful amenities. Memorable stays. Premium accommodation luxury supplies designed for guesthouses, Airbnbs, lodges, and hotels across Eswatini.
            </p>

            {/* Social Media Links */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">Follow Our Journey</span>
              <div className="flex items-center gap-3">
                {socialLinks.map((social) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={social.name}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ y: -4, scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      aria-label={social.name}
                      className="w-10 h-10 rounded-full bg-white border border-[#E8E2D5] flex items-center justify-center text-neutral-700 shadow-sm transition-colors hover:border-teal-600 hover:bg-teal-600 hover:text-white"
                    >
                      <Icon size={18} />
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-l-2 border-teal-600 pl-3">
              Explore
            </h4>
            <nav className="flex flex-col gap-2.5 pt-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  to={link.to}
                  className="group flex items-center justify-between text-sm font-medium text-neutral-600 hover:text-teal-700 transition-colors w-max"
                >
                  <span>{link.label}</span>
                  <ArrowUpRight size={14} className="opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200 text-teal-600" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Direct Contact Info */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-900 border-l-2 border-teal-600 pl-3">
              Get in Touch
            </h4>
            <div className="flex flex-col gap-3.5 pt-1">
              <a 
                href="tel:+26876259378" 
                className="group flex items-center gap-3 text-sm text-neutral-700 hover:text-teal-700 transition-colors bg-white/60 hover:bg-white p-3 rounded-xl border border-[#E8E2D5] shadow-xs"
              >
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Phone size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium uppercase">Call Us Directly</p>
                  <p className="font-semibold text-xs text-neutral-900">+268 7625 9378</p>
                </div>
              </a>

              <a 
                href="mailto:info@milansz.com" 
                className="group flex items-center gap-3 text-sm text-neutral-700 hover:text-teal-700 transition-colors bg-white/60 hover:bg-white p-3 rounded-xl border border-[#E8E2D5] shadow-xs"
              >
                <div className="p-2 rounded-lg bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white transition-colors">
                  <Mail size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium uppercase">Email Inquiries</p>
                  <p className="font-semibold text-xs text-neutral-900">milantradings@gmail.com</p>
                </div>
              </a>

              <a 
                href="https://wa.me/26876259378" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group flex items-center gap-3 text-sm text-neutral-700 hover:text-teal-700 transition-colors bg-white/60 hover:bg-white p-3 rounded-xl border border-[#E8E2D5] shadow-xs"
              >
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <MessageCircle size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-neutral-400 font-medium uppercase">Instant WhatsApp</p>
                  <p className="font-semibold text-xs text-neutral-900">Chat with Support</p>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar & Back To Top */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-medium">
          <p className="flex items-center gap-1 text-center md:text-left">
            © {new Date().getFullYear()} Milan_sz. Crafted with <Heart size={12} className="text-red-500 fill-red-500 inline" /> in Eswatini.
          </p>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-neutral-600 hover:text-teal-700 transition-colors cursor-pointer group"
          >
            <span className="uppercase tracking-wider text-[11px] font-bold">Back to top</span>
            <div className="p-1.5 rounded-full bg-white border border-[#E8E2D5] group-hover:-translate-y-1 transition-transform">
              <ArrowUpRight size={14} className="-rotate-45" />
            </div>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;