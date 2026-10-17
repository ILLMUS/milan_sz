import { useEffect } from "react";
import Layout from "@/components/Layout";
import Contact from "@/components/Contact";

const ContactPage = () => {
  useEffect(() => {
    document.title = "Contact Milan_sz | Request a Bulk Amenities Quote";
  }, []);

  return (
    <Layout>
      <Contact />
    </Layout>
  );
};

export default ContactPage;
