import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TrustIndicators from "@/components/TrustIndicators";
import Products from "@/components/Products";
import About from "@/components/About";
import Reviews from "@/components/Reviews";
import Contact from "@/components/Contact";
import FloatingMenu from "@/components/FloatingMenu";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <TrustIndicators />
      <Products />
      <About />
      <Reviews />
      <Contact />
      <Footer />
      <FloatingMenu />
    </div>
  );
};

export default Index;
