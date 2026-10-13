import { useState } from "react";
import { motion } from "framer-motion";
import { BadgeCheck, Clock, Sparkles } from "lucide-react";
import Layout from "@/components/Layout";
import BrandingQuoteDialog from "@/components/BrandingQuoteDialog";
import bathroomScene from "@/assets/hotel-bathroom-scene.jpg";

const tubeTiers = [
  { range: "250 – 499 units", price: 10.5 },
  { range: "500 – 999 units", price: 9.75 },
  { range: "1,000+ units", price: 9.25 },
];

const tubeProducts = ["Hand & Body Lotion 35ml", "2-in-1 Shampoo & Conditioner 35ml", "Shower Gel / Body Wash 35ml"];

const extras = [
  { name: "Branded Bar Soap", price: "E 5.00", unit: "per bar", note: "minimum 288 units" },
  { name: "Branded Shower Cap", price: "E 6.00", unit: "per cap", note: "minimum 200 units" },
];

const exampleOrder = [
  { item: "500 x 35ml branded tubes (any mix)", calc: "500 x E 9.75", total: 4875 },
  { item: "288 x branded bar soap", calc: "288 x E 5.00", total: 1440 },
  { item: "200 x branded shower caps", calc: "200 x E 6.00", total: 1200 },
  { item: "Once-off branding setup fee", calc: "first order only", total: 2000 },
];
const exampleTotal = exampleOrder.reduce((s, r) => s + r.total, 0);

const fmt = (n: number) => `E ${n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const ShowcasePage = () => {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <Layout>
      {/* Full-width hotel room scene */}
      <section className="relative">
        <div className="relative h-[70vh] min-h-[480px] w-full overflow-hidden">
          <img
            src={bathroomScene}
            alt="Branded 35ml amenity tubes and a soap box on a marble hotel bathroom vanity, with the hotel room reflected in the mirror"
            className="h-full w-full object-cover"
            width={1920}
            height={1152}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 pb-14">
            <div className="container mx-auto px-6 text-center">
              <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
                <p className="font-body text-[10px] uppercase tracking-luxury text-gold">See It In The Room</p>
                <h1 className="mt-4 font-heading text-4xl font-medium uppercase tracking-luxury text-foreground md:text-6xl">
                  Your Logo, In Every Bathroom
                </h1>
                <p className="mx-auto mt-5 max-w-2xl font-body text-sm font-light leading-relaxed text-muted-foreground">
                  This is what your guests see: amenities printed with your own property's logo, arranged on the vanity
                  like a five-star hotel. Branded tubes, soaps and shower caps turn a simple stay into a memorable,
                  trustworthy experience — and your brand travels home with every guest.
                </p>
              </motion.div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-center font-body text-[10px] uppercase tracking-luxury text-muted-foreground">
          Example branding shown — your tubes carry your own logo and property name
        </p>
      </section>

      {/* Full pricing breakdown */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="font-body text-[10px] uppercase tracking-luxury text-gold">Branded Pricing</p>
            <h2 className="mt-4 font-heading text-3xl font-medium uppercase tracking-luxury text-foreground md:text-4xl">
              Full Pricing Breakdown
            </h2>
            <p className="mt-4 font-body text-sm font-light text-muted-foreground">
              All 35ml tubes — hand &amp; body lotion, 2-in-1 shampoo &amp; conditioner, and shower gel — printed with
              your logo on white or transparent tubes. Mix products freely within one order; the volume tier applies to
              your total tube count.
            </p>
          </div>

          {/* Tube tiers */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            {tubeTiers.map((tier, i) => (
              <motion.div
                key={tier.range}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border border-border bg-card p-8 text-center"
              >
                <p className="font-body text-[10px] uppercase tracking-luxury text-muted-foreground">{tier.range}</p>
                <p className="mt-4 font-heading text-4xl font-medium text-foreground">{fmt(tier.price)}</p>
                <p className="mt-2 font-body text-xs font-light text-muted-foreground">per 35ml branded tube</p>
              </motion.div>
            ))}
          </div>
          <div className="mx-auto mt-4 max-w-4xl border border-border bg-card px-8 py-5">
            <p className="font-body text-[10px] uppercase tracking-luxury text-muted-foreground">Applies to</p>
            <p className="mt-2 font-body text-sm font-light text-foreground">{tubeProducts.join(" · ")}</p>
          </div>

          {/* Extras */}
          <div className="mx-auto mt-6 grid max-w-4xl gap-6 md:grid-cols-2">
            {extras.map((item) => (
              <div key={item.name} className="flex items-center justify-between border border-border bg-card px-8 py-5">
                <div>
                  <p className="font-body text-sm text-foreground">{item.name}</p>
                  <p className="font-body text-[10px] uppercase tracking-luxury text-muted-foreground">{item.note}</p>
                </div>
                <div className="text-right">
                  <p className="font-heading text-2xl font-medium text-foreground">{item.price}</p>
                  <p className="font-body text-[10px] uppercase tracking-luxury text-muted-foreground">{item.unit}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Setup facts */}
          <div className="mx-auto mt-12 grid max-w-4xl gap-6 md:grid-cols-3">
            <div className="flex flex-col items-center gap-3 border border-border bg-gold/10 p-8 text-center">
              <Sparkles className="text-gold" size={22} />
              <p className="font-heading text-lg font-medium uppercase tracking-luxury text-foreground">E 2,000</p>
              <p className="font-body text-xs font-light text-muted-foreground">
                Once-off branding setup fee — every reorder ships in your branded packaging at standard bulk prices
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 border border-border bg-card p-8 text-center">
              <Clock className="text-gold" size={22} />
              <p className="font-heading text-lg font-medium uppercase tracking-luxury text-foreground">14 Working Days</p>
              <p className="font-body text-xs font-light text-muted-foreground">
                Production and delivery time from artwork approval
              </p>
            </div>
            <div className="flex flex-col items-center gap-3 border border-border bg-card p-8 text-center">
              <BadgeCheck className="text-gold" size={22} />
              <p className="font-heading text-lg font-medium uppercase tracking-luxury text-foreground">Guest Trust</p>
              <p className="font-body text-xs font-light text-muted-foreground">
                Your own logo on every tube signals professionalism and care
              </p>
            </div>
          </div>

          {/* Example order */}
          <div className="mx-auto mt-16 max-w-4xl">
            <h3 className="text-center font-heading text-2xl font-medium uppercase tracking-luxury text-foreground">
              Example First Order
            </h3>
            <div className="mt-8 overflow-hidden border border-border bg-card">
              {exampleOrder.map((row) => (
                <div key={row.item} className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-8 py-4">
                  <div>
                    <p className="font-body text-sm text-foreground">{row.item}</p>
                    <p className="font-body text-[10px] uppercase tracking-luxury text-muted-foreground">{row.calc}</p>
                  </div>
                  <p className="font-heading text-lg font-medium text-foreground">{fmt(row.total)}</p>
                </div>
              ))}
              <div className="flex items-center justify-between bg-gold/10 px-8 py-5">
                <p className="font-body text-xs uppercase tracking-luxury text-foreground">Estimated total</p>
                <p className="font-heading text-2xl font-medium text-foreground">{fmt(exampleTotal)}</p>
              </div>
            </div>
            <p className="mt-3 text-center font-body text-[10px] uppercase tracking-luxury text-muted-foreground">
              Indicative only — your final quote depends on your exact quantities and artwork
            </p>
          </div>
        </div>
      </section>

      {/* Booking CTA */}
      <section className="border-t border-border bg-card py-20">
        <div className="container mx-auto px-6 text-center">
          <p className="font-body text-[10px] uppercase tracking-luxury text-gold">Luxury in Every Detail</p>
          <h2 className="mx-auto mt-4 max-w-2xl font-heading text-3xl font-medium uppercase tracking-luxury text-foreground md:text-4xl">
            Book Your Branded Production Run
          </h2>
          <p className="mx-auto mt-4 max-w-xl font-body text-sm font-light leading-relaxed text-muted-foreground">
            Send us your logo, your property name and the quantities you need. We'll check your artwork's print
            readiness, confirm pricing and start your 14-working-day production run.
          </p>
          <button
            onClick={() => setDialogOpen(true)}
            className="mt-8 bg-primary px-10 py-4 font-body text-[11px] font-medium uppercase tracking-luxury text-primary-foreground transition-opacity hover:opacity-90"
          >
            Book Your Branding
          </button>
        </div>
      </section>

      <BrandingQuoteDialog open={dialogOpen} onOpenChange={setDialogOpen} />
    </Layout>
  );
};

export default ShowcasePage;
