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
          Milan_sz Supplies | Premium Hotel Amenities Supplier in Eswatini
        </title>

        <meta
          name="description"
          content="Milan_sz Supplies is a premium supplier of hotel, guesthouse, Airbnb and lodge amenities in Eswatini. Bulk soap, lotion, shampoo, shower caps, shower gel and reliable restocking."
        />

        <meta
          name="keywords"
          content="Milan_sz Supplies, hotel amenities Eswatini, guesthouse supplies Eswatini, Airbnb toiletries supplier, lodge amenities, hotel soap wholesale, shower cap supplier, hospitality products Eswatini"
        />

        <meta
          name="robots"
          content="index, follow, max-image-preview:large"
        />

        <meta name="author" content="Milan_sz Supplies" />
        <meta name="theme-color" content="#050505" />
        <meta name="format-detection" content="telephone=no" />

        <link rel="canonical" href={`${siteUrl}/`} />

        {/* =========================
            OPEN GRAPH
            Facebook / WhatsApp / LinkedIn
        ========================= */}
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`${siteUrl}/`} />
        <meta property="og:site_name" content="Milan_sz Supplies" />

        <meta
          property="og:title"
          content="Milan_sz Supplies | Premium Hotel Amenities Supplier in Eswatini"
        />

        <meta
          property="og:description"
          content="Luxury hospitality toiletries and amenities for hotels, guesthouses, lodges and Airbnbs in Eswatini. Bulk supply available."
        />

        <meta property="og:image" content={ogImage} />
        <meta property="og:image:secure_url" content={ogImage} />
        <meta property="og:image:type" content="image/jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Milan_sz Supplies premium hotel amenities in Eswatini"
        />

        {/* =========================
            TWITTER / X
        ========================= */}
        <meta name="twitter:card" content="summary_large_image" />

        <meta
          name="twitter:title"
          content="Milan_sz Supplies | Hotel Amenities Supplier"
        />

        <meta
          name="twitter:description"
          content="Bulk hospitality supplies for hotels, lodges, guesthouses and Airbnbs in Eswatini."
        />

        <meta name="twitter:image" content={ogImage} />

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
            url: `${siteUrl}/`,
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
            ]
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
            url: `${siteUrl}/`,
            logo: logoImage,
            image: ogImage
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
      image: `${siteUrl}/products/showercap.png`,
      description: "Disposable premium shower caps for hotels, guesthouses and lodges.",
      brand: {
        "@type": "Brand",
        name: "Milan_sz Supplies"
      },
      sku: "MSZ-SC-001",
      offers: {
        "@type": "Offer",
        priceCurrency: "SZL",
        price: "2.68",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/`
        /* shippingDetails: Add later */
        /* hasMerchantReturnPolicy: Add later */
      }
    },
    {
      "@type": "Product",
      position: 2,
      name: "Soap",
      image: `${siteUrl}/products/soap.png`,
      description: "Premium guest soap bars for hospitality use.",
      brand: {
        "@type": "Brand",
        name: "Milan_sz Supplies"
      },
      sku: "MSZ-SP-002",
      offers: {
        "@type": "Offer",
        priceCurrency: "SZL",
        price: "2.50",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/`
      }
    },
    {
      "@type": "Product",
      position: 3,
      name: "Hand & Body Lotion",
      image: `${siteUrl}/products/lotion.png`,
      description: "Luxury lotion amenities for hotels and Airbnbs.",
      brand: {
        "@type": "Brand",
        name: "Milan_sz Supplies"
      },
      sku: "MSZ-HBL-003",
      offers: {
        "@type": "Offer",
        priceCurrency: "SZL",
        price: "4.15",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/`
      }
    },
    {
      "@type": "Product",
      position: 4,
      name: "Shampoo & Conditioner",
      image: `${siteUrl}/products/shampooconditioner.png`,
      description: "Premium shampoo and conditioner amenities for guest accommodation.",
      brand: {
        "@type": "Brand",
        name: "Milan_sz Supplies"
      },
      sku: "MSZ-SC-004",
      offers: {
        "@type": "Offer",
        priceCurrency: "SZL",
        price: "3.10",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/`
      }
    },
    {
      "@type": "Product",
      position: 5,
      name: "Shower Gel",
      image: `${siteUrl}/products/shower-gel.png`,
      description: "Refreshing shower gel amenities for hotels and lodges.",
      brand: {
        "@type": "Brand",
        name: "Milan_sz Supplies"
      },
      sku: "MSZ-SG-005",
      offers: {
        "@type": "Offer",
        priceCurrency: "SZL",
        price: "3.10",
        availability: "https://schema.org/InStock",
        url: `${siteUrl}/`
      }
    }
  ]
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