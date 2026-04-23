import { Helmet } from "react-helmet-async";

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
  const siteUrl = "https://www.milanszsupplies.com";
  const ogImage = `${siteUrl}/og-cover.png`;
  const logoImage = `${siteUrl}/logo.png`;

  return (
    <div className="min-h-screen">
      <Helmet>
        {/* =========================
            CORE SEO
        ========================= */}
        <html lang="en" />
        <title>
          Milan_sz | Premium Hotel Amenities Supplier in Eswatini
        </title>

        <meta
          name="description"
          content="Milan_sz  is a premium supplier of hotel, guesthouse, Airbnb and lodge amenities in Eswatini. Bulk soap, lotion, shampoo, shower caps, shower gel and reliable restocking."
        />

        <meta
          name="keywords"
          content="Milan_sz, hotel amenities Eswatini, guesthouse supplies Eswatini, Airbnb toiletries supplier, lodge amenities, hotel soap wholesale, shower cap supplier, hospitality products Eswatini"
        />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large"
        />

        <meta name="author" content="Milan SZ Supplies" />
        <meta name="theme-color" content="#050505" />
        <meta name="format-detection" content="telephone=no" />

        <link rel="canonical" href={siteUrl} />

        {/* =========================
            OPEN GRAPH
            Facebook / WhatsApp / LinkedIn
        ========================= */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.milanszsupplies.com/" />
        <meta property="og:site_name" content="Milan_sz Supplies" />

        <meta
          property="og:title"
          content="Milan_sz | Premium Hotel Amenities Supplier in Eswatini"
        />

        <meta
          property="og:description"
          content="Luxury hospitality toiletries and amenities for hotels, guesthouses, lodges and Airbnbs in Eswatini. Bulk supply available."
        />

        <meta property="og:image" content={ogImage} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type"  content="https://www.milanszsupplies.com/og-cover.png"
        />

        {/* =========================
            TWITTER / X
        ========================= */}
        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Milan_sz | Hotel Amenities Supplier"
        />

        <meta
          name="twitter:description"
          content="Bulk hospitality supplies for hotels, lodges, guesthouses and Airbnbs in Eswatini."
        />

        <meta name="twitter:image" content="https://www.milanszsupplies.com/og-cover.png" />

        {/* =========================
            LOCAL SEO
        ========================= */}
        <meta name="geo.region" content="SZ" />
        <meta name="geo.country" content="Eswatini" />
        <meta name="geo.placename" content="Eswatini" />

        {/* =========================
            ICONS
        ========================= */}
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* =========================
            SCHEMA - LOCAL BUSINESS
        ========================= */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${siteUrl}/#business`,
            name: "Milan SZ Supplies",
            url: siteUrl,
            image: ogImage,
            logo: logoImage,
            description:
              "Premium accommodation amenities supplier serving hotels, lodges, guesthouses and Airbnbs across Eswatini.",
            telephone: "+26876259378",
            email: "milantradings@gmail.com",
            priceRange: "$$",
            areaServed: {
              "@type": "Country",
              name: "Eswatini",
            },
            address: {
              "@type": "PostalAddress",
              addressCountry: "SZ",
            },
            sameAs: [
              "https://wa.me/26876259378"
            ],
          })}
        </script>

        {/* =========================
            SCHEMA - ORGANIZATION
        ========================= */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Milan SZ Supplies",
            url: siteUrl,
            logo: logoImage,
            image: ogImage,
          })}
        </script>

        {/* =========================
            SCHEMA - PRODUCTS
        ========================= */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Hospitality Amenities",
            itemListElement: [
              {
                "@type": "Product",
                position: 1,
                name: "Shower Cap",
              },
              {
                "@type": "Product",
                position: 2,
                name: "Soap",
              },
              {
                "@type": "Product",
                position: 3,
                name: "Hand & Body Lotion",
              },
              {
                "@type": "Product",
                position: 4,
                name: "Shampoo & Conditioner",
              },
              {
                "@type": "Product",
                position: 5,
                name: "Shower Gel",
              },
            ],
          })}
        </script>
      </Helmet>

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