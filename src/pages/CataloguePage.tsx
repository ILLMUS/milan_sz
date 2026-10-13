import { forwardRef, useEffect, useRef, useState, type ReactNode } from "react";
import HTMLFlipBook from "react-pageflip";
import { ArrowLeft, ArrowRight, ShoppingBag, Plus, Minus } from "lucide-react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { products, formatPrice, type Product } from "@/data/products";
import { useCart } from "@/context/CartContext";
import logo from "@/assets/milan-logo.png";
import cover from "@/assets/product-amenities.jpg";

const BookSheet = forwardRef<HTMLDivElement, { children: ReactNode; hard?: boolean; number?: number }>(
  ({ children, hard, number }, ref) => (
    <div ref={ref} data-density={hard ? "hard" : "soft"} className="h-full overflow-hidden border border-border bg-card text-card-foreground">
      <div className="relative h-full pb-8">{children}
        {number !== undefined && <span className="absolute bottom-2 left-0 right-0 text-center text-xs text-muted-foreground">{number}</span>}
      </div>
    </div>
  )
);
BookSheet.displayName = "BookSheet";

const CatalogueProduct = ({ product }: { product: Product }) => {
  const [qty, setQty] = useState(product.moq);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  return (
    <article className="flex h-full min-w-0 flex-col">
      <img src={product.image} alt={product.title} draggable={false} className="h-[30%] w-full shrink-0 object-cover" />
      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto p-4 sm:p-6">
        <p className="text-xs uppercase text-gold">{product.range}</p>
        <h2 className="mt-2 font-heading text-2xl text-foreground">{product.title}</h2>
        <p className="mt-3 text-sm text-muted-foreground">{product.description}</p>
        <div className="mt-4 flex flex-wrap items-baseline gap-2">
          <span className="font-heading text-3xl">{formatPrice(product.price)}</span>
          <span className="text-xs text-muted-foreground">{product.unit}</span>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">Minimum order: {product.moq}</p>
        <div className="mt-auto flex flex-wrap items-center gap-3 pt-4" onMouseDown={(event) => event.stopPropagation()} onTouchStart={(event) => event.stopPropagation()}>
          <div className="flex items-center border border-border">
            <Button variant="ghost" size="icon" disabled={qty <= product.moq} aria-label={`Decrease ${product.title} quantity`} onClick={() => { setQty(Math.max(product.moq, qty - product.step)); setAdded(false); }}><Minus /></Button>
            <span className="w-12 text-center text-sm" aria-live="polite">{qty}</span>
            <Button variant="ghost" size="icon" aria-label={`Increase ${product.title} quantity`} onClick={() => { setQty(qty + product.step); setAdded(false); }}><Plus /></Button>
          </div>
          <Button onClick={() => { addItem(product, qty); setAdded(true); }}><ShoppingBag />{added ? "Added to order" : "Add to order"}</Button>
        </div>
        <p className="mt-3 text-xs text-muted-foreground">Line total: {formatPrice(qty * product.price)}</p>
      </div>
    </article>
  );
};

const CataloguePage = () => {
  const [page, setPage] = useState(0);
  const book = useRef<{ pageFlip: () => { flipNext: () => void; flipPrev: () => void; flip: (page: number) => void } } | null>(null);
  const { count, setOpen } = useCart();
  const lastPage = products.length + 2;
  useEffect(() => { document.title = "Milan_sz | Hospitality Catalogue"; }, []);
  const turn = (direction: number) => { if (direction > 0) book.current?.pageFlip().flipNext(); else book.current?.pageFlip().flipPrev(); };

  return (
    <Layout>
      <main className="pb-16 pt-28 md:pt-32">
        <div className="container mx-auto px-6">
          <div className="mx-auto mb-6 flex max-w-5xl flex-wrap items-center justify-between gap-4 border-b border-border pb-5">
            <h1 className="font-heading text-3xl uppercase">Milan Catalogue</h1>
            <Button variant="outline" onClick={() => setOpen(true)}><ShoppingBag />Your order{count > 0 ? ` (${count})` : ""}</Button>
          </div>
          <div className="mx-auto max-w-5xl" aria-label="Catalogue pages" onKeyDown={(event) => { if (event.target !== event.currentTarget) return; if (event.key === "ArrowRight") turn(1); if (event.key === "ArrowLeft") turn(-1); }} tabIndex={0}>
            <HTMLFlipBook ref={book} width={440} height={740} size="stretch" minWidth={270} maxWidth={500} minHeight={450} maxHeight={840} startPage={0} drawShadow flippingTime={850} usePortrait startZIndex={1} autoSize maxShadowOpacity={0.25} showCover mobileScrollSupport={false} clickEventForward useMouseEvents swipeDistance={30} showPageCorners disableFlipByClick className="mx-auto" style={{}} onFlip={(event: { data: number }) => setPage(event.data)}>
              <BookSheet hard>
              <div className="relative flex h-full items-end overflow-hidden">
                <img src={cover} alt="Milan guest amenity collection" draggable={false} className="absolute inset-0 h-full w-full object-cover" />
                <div className="relative w-full bg-background/95 px-8 py-8 md:px-12">
                  <img src={logo} alt="Milan" className="mb-4 h-16 w-16 object-contain" />
                  <p className="font-heading text-5xl uppercase">Milan</p>
                  <p className="mt-2 text-sm uppercase">Accommodation Amenities</p>
                  <p className="mt-5 font-heading text-2xl">Thoughtful amenities. Memorable stays.</p>
                  <p className="mt-3 text-xs text-muted-foreground">Hospitality collection · Eswatini</p>
                </div>
              </div>
              </BookSheet>
              {products.map((product, index) => <BookSheet key={product.id} number={index + 1}><CatalogueProduct product={product} /></BookSheet>)}
              <BookSheet number={8}>
                  <div className="flex h-full flex-col justify-center bg-secondary/40 p-6 sm:p-8">
                    <p className="text-xs uppercase text-gold">Custom Branding</p>
                    <h2 className="mt-4 font-heading text-4xl">Luxury in Every Detail</h2>
                    <p className="mt-5 text-sm leading-relaxed text-muted-foreground">Your property's logo, printed on white or transparent amenity tubes.</p>
                    <dl className="mt-8 space-y-4 border-y border-border py-6 text-sm">
                      <div className="flex flex-wrap justify-between gap-2"><dt>Once-off setup</dt><dd>E 2,000</dd></div>
                      <div className="flex flex-wrap justify-between gap-2"><dt>Production & delivery</dt><dd>14 working days</dd></div>
                    </dl>
                    <Button asChild className="mt-8"><a href="/showcase">View branded collection <ArrowRight /></a></Button>
                  </div>
              </BookSheet>
              <BookSheet hard><div className="flex h-full flex-col items-center justify-center bg-secondary p-8 text-center"><img src={logo} alt="Milan" draggable={false} className="h-24 w-24 object-contain" /><p className="mt-6 font-heading text-4xl">Milan</p><p className="mt-4 text-sm">Thoughtful amenities. Memorable stays.</p><Button className="mt-8" onClick={() => setOpen(true)} onMouseDown={(event) => event.stopPropagation()}><ShoppingBag />Your order</Button></div></BookSheet>
            </HTMLFlipBook>
          </div>
          <div className="mx-auto mt-6 flex max-w-5xl items-center justify-between gap-3">
            <Button variant="outline" size="icon" aria-label="Previous catalogue page" disabled={page === 0} onClick={() => turn(-1)}><ArrowLeft /></Button>
            <label className="flex items-center gap-3 text-sm text-muted-foreground">Page
              <select aria-label="Catalogue page" value={page} onChange={(event) => book.current?.pageFlip().flip(Number(event.target.value))} className="h-10 border border-input bg-background px-3 text-foreground">
                {Array.from({ length: lastPage + 1 }, (_, index) => <option key={index} value={index}>{index === 0 ? "Cover" : index === lastPage ? "Back cover" : `${index} / ${lastPage - 1}`}</option>)}
              </select>
            </label>
            <Button variant="outline" size="icon" aria-label="Next catalogue page" disabled={page === lastPage} onClick={() => turn(1)}><ArrowRight /></Button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default CataloguePage;