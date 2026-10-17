import { motion } from "framer-motion";
import { Shield, Truck, Package, RefreshCw } from "lucide-react";

const indicators = [
  { icon: Shield, title: "Trusted Supplier", desc: "Serving establishments across Eswatini" },
  { icon: Package, title: "Bulk Orders", desc: "Wholesale quantities always available" },
  { icon: Truck, title: "Fast Delivery", desc: "Reliable local delivery across the country" },
  { icon: RefreshCw, title: "Restocking", desc: "Consistent supply you can count on" },
];

const TrustIndicators = () => (
  <section className="border-b border-border bg-card py-16 md:py-20">
    <div className="container mx-auto px-6">
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {indicators.map((item, i) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="flex flex-col items-center text-center"
          >
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-gold/20 bg-primary">
              <item.icon className="text-gold" size={24} />
            </div>
            <h3 className="font-heading text-lg font-semibold text-foreground">{item.title}</h3>
            <p className="mt-1 font-body text-sm text-muted-foreground">{item.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default TrustIndicators;
