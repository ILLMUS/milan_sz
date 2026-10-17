import { motion } from "framer-motion";

type Props = {
  eyebrow: string;
  title: string;
  description?: string;
};

const PageHeader = ({ eyebrow, title, description }: Props) => (
  <header className="border-b border-border bg-secondary/40 pb-14 pt-32 md:pb-20 md:pt-40">
    <div className="container mx-auto px-6 text-center">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <span className="font-body text-xs font-light uppercase tracking-luxury text-gold">{eyebrow}</span>
        <h1 className="mt-4 font-heading text-4xl font-normal uppercase tracking-wide text-foreground md:text-6xl">
          {title}
        </h1>
        {description && (
          <p className="mx-auto mt-5 max-w-xl font-body text-sm font-light leading-relaxed text-muted-foreground">
            {description}
          </p>
        )}
      </motion.div>
    </div>
  </header>
);

export default PageHeader;
