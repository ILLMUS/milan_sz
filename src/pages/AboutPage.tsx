import { useEffect } from "react";
import Layout from "@/components/Layout";
import PageHeader from "@/components/PageHeader";
import About from "@/components/About";
import Reviews from "@/components/Reviews";

const AboutPage = () => {
  useEffect(() => {
    document.title = "About Milan_sz | Hospitality Amenities Supplier, Eswatini";
  }, []);

  return (
    <Layout>
      <PageHeader
        eyebrow="About Milan_sz"
        title="Thoughtful Amenities"
        description="A locally owned bulk supplier equipping Eswatini's hospitality businesses with dependable, presentation-ready guest amenities."
      />
      <About />
      <Reviews />
    </Layout>
  );
};

export default AboutPage;
