import productAmenities from "@/assets/product-amenities.jpg";
import productRoomSpray from "@/assets/product-room-spray.jpg";
import productBodyWash from "@/assets/product-body-wash.jpg";
import productBarSoap from "@/assets/product-bar-soap.jpg";
import productShowerCap from "@/assets/product-shower-cap.jpg";
import productShampooConditioner from "@/assets/product-shampoo-conditioner.jpg";
import productLotion from "@/assets/product-lotion.jpg";

export type Product = {
  id: string;
  title: string;
  range: string;
  description: string;
  price: number;
  unit: string;
  /** minimum order quantity */
  moq: number;
  /** quantity increment */
  step: number;
  image: string;
};

export const products: Product[] = [
  {
    id: "amenity-kit",
    title: "Accommodation Amenity Kits",
    range: "Guest Collection",
    description:
      "Complete kits with soap, shampoo, conditioner and lotion — presentation-ready for guest bathrooms.",
    price: 42,
    unit: "per kit",
    moq: 50,
    step: 10,
    image: productAmenities,
  },
  {
    id: "bar-soap",
    title: "Bar Soap",
    range: "Guest Collection",
    description:
      "Individually wrapped guest bar soap with a clean, gentle lather — a bathroom essential in every room.",
    price: 6,
    unit: "per bar",
    moq: 100,
    step: 50,
    image: productBarSoap,
  },
  {
    id: "shower-cap",
    title: "Shower Cap",
    range: "Guest Collection",
    description:
      "Neatly sachet-packed shower caps that keep guest bathrooms tidy and thoughtfully stocked.",
    price: 4,
    unit: "per cap",
    moq: 100,
    step: 50,
    image: productShowerCap,
  },
  {
    id: "shampoo-conditioner",
    title: "2-in-1 Shampoo & Conditioner",
    range: "Naturals & Pure",
    description:
      "One bottle, two jobs — a mild cleanse and conditioning finish that suits every guest hair type.",
    price: 26,
    unit: "per 50ml",
    moq: 100,
    step: 25,
    image: productShampooConditioner,
  },
  {
    id: "body-wash",
    title: "Shower Gel / Body Wash",
    range: "Naturals & Pure",
    description:
      "Paraben-free body wash formulated for sensitive skin, bulk packaged for effortless restocking.",
    price: 28,
    unit: "per 50ml",
    moq: 100,
    step: 25,
    image: productBodyWash,
  },
  {
    id: "hand-body-lotion",
    title: "Hand & Body Lotion",
    range: "Naturals & Pure",
    description:
      "Light, fast-absorbing lotion that leaves guest skin soft without any greasy residue.",
    price: 30,
    unit: "per 50ml",
    moq: 100,
    step: 25,
    image: productLotion,
  },
  {
    id: "room-spray",
    title: "Room Sprays",
    range: "Botanique",
    description:
      "Long-lasting hospitality fragrances that carry a signature scent through every room and corridor.",
    price: 85,
    unit: "per 100ml",
    moq: 24,
    step: 6,
    image: productRoomSpray,
  },
];

export const formatPrice = (value: number) =>
  `E ${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
