import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import FloatingMenu from "@/components/FloatingMenu";
import CartDrawer from "@/components/CartDrawer";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const el = document.querySelector(hash);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash]);

  return (
    <div className="min-h-screen">
      <Navbar />
      {children}
      <Footer />
      <FloatingMenu />
      <CartDrawer />
    </div>
  );
};

export default Layout;
