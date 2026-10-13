import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  unit: string;
  image: string;
  qty: number;
  step?: number;
  moq?: number;
};


type Reaction = "like" | "dislike" | null;

type CartContextValue = {
  items: CartItem[];
  count: number;
  total: number;
  addItem: (item: Omit<CartItem, "qty">, qty?: number) => void;
  removeItem: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
  reactions: Record<string, Reaction>;
  react: (id: string, reaction: Exclude<Reaction, null>) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

const CART_KEY = "milansz_cart";
const REACTION_KEY = "milansz_reactions";

const read = <T,>(key: string, fallback: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
};

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>(() => read<CartItem[]>(CART_KEY, []));
  const [reactions, setReactions] = useState<Record<string, Reaction>>(() =>
    read<Record<string, Reaction>>(REACTION_KEY, {})
  );
  const [isOpen, setOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem(REACTION_KEY, JSON.stringify(reactions));
  }, [reactions]);

  const value = useMemo<CartContextValue>(
    () => ({
      items,
      count: items.reduce((sum, i) => sum + i.qty, 0),
      total: items.reduce((sum, i) => sum + i.qty * i.price, 0),
      addItem: (item, qty = 1) =>
        setItems((prev) => {
          const existing = prev.find((i) => i.id === item.id);
          if (existing) {
            return prev.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i));
          }
          return [...prev, { ...item, qty }];
        }),
      removeItem: (id) => setItems((prev) => prev.filter((i) => i.id !== id)),
      setQty: (id, qty) =>
        setItems((prev) =>
          qty <= 0 ? prev.filter((i) => i.id !== id) : prev.map((i) => (i.id === id ? { ...i, qty } : i))
        ),
      clear: () => setItems([]),
      isOpen,
      setOpen,
      reactions,
      react: (id, reaction) =>
        setReactions((prev) => ({ ...prev, [id]: prev[id] === reaction ? null : reaction })),
    }),
    [items, isOpen, reactions]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
