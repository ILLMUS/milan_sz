import { motion } from "framer-motion";
import { Star } from "lucide-react";

const mockReviews = [
  { name: "Thabo M.", rating: 5, text: "Milan_sz has been an incredible supply partner. Our guests love the amenities and reordering is seamless." },
  { name: "Nomsa D.", rating: 5, text: "Professional, reliable, and the product quality is outstanding. Highly recommend for any lodge or guesthouse." },
  { name: "David K.", rating: 5, text: "Fast delivery and consistent stock. They understand the hospitality industry and it shows." },
  { name: "Lindiwe S.", rating: 4, text: "Great products at competitive prices. Our Airbnb reviews improved significantly after switching to Milan_sz." },
];

const Reviews = () => (
  <section id="reviews" className="bg-card py-20 md:py-28">
    <div className="container mx-auto px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-16 text-center"
      >
        <span className="font-body text-xs font-light tracking-[0.3em] uppercase text-gold">Testimonials</span>
        <h2 className="mt-3 font-heading text-3xl font-bold text-foreground md:text-5xl">What Our Clients Say</h2>
        <div className="mt-4 flex items-center justify-center gap-1">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="fill-gold text-gold" size={20} />
          ))}
          <span className="ml-2 font-body text-sm text-muted-foreground">4.9 / 5 Average Rating</span>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        {mockReviews.map((review, i) => (
          <motion.div
            key={review.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-sm border border-border bg-background p-6"
          >
            <div className="mb-3 flex gap-0.5">
              {[...Array(review.rating)].map((_, j) => (
                <Star key={j} className="fill-gold text-gold" size={14} />
              ))}
            </div>
            <p className="font-body text-sm leading-relaxed text-muted-foreground">"{review.text}"</p>
            <p className="mt-4 font-heading text-sm font-semibold text-foreground">{review.name}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Reviews;
