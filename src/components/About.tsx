import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";

const points = [
  "Locally owned and operated in Eswatini",
  "Professional bulk supplier to the hospitality industry",
  "Serving guesthouses, Airbnbs, lodges and hotels nationwide",
  "Long-term restocking partnerships for consistent supply",
  "Competitive pricing on wholesale orders",
  "Dedicated to quality and reliability",
];

const About = () => (
  <section id="about" className="gradient-dark py-20 md:py-28">
    <div className="container mx-auto px-6">
      <div className="mx-auto max-w-3xl text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <span className="font-body text-xs font-light tracking-[0.3em] uppercase text-gold">About Us</span>
          <h2 className="mt-3 font-heading text-3xl font-bold text-primary-foreground md:text-5xl">
            Trusted Hospitality Amenities Supplier in Eswatini
          </h2>
          <p className="mx-auto mt-6 max-w-2xl font-body text-lg font-light leading-relaxed text-primary-foreground/70">
            Milan_sz is a professional accommodation amenities supplier dedicated to equipping hospitality businesses
            across Eswatini with premium products at scale.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mt-12 grid grid-cols-1 gap-4 text-left sm:grid-cols-2"
        >
          {points.map((point) => (
            <div key={point} className="flex items-start gap-3">
              <CheckCircle className="mt-0.5 shrink-0 text-gold" size={18} />
              <span className="font-body text-sm text-primary-foreground/80">{point}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  </section>
);

export default About;
