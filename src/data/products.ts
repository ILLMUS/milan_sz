import productAmenities from "@/assets/product-amenities.jpg";
import productRoomSpray from "@/assets/product-room-spray.jpg";
import productBodyWash from "@/assets/product-body-wash.png";
import productBarSoap from "@/assets/product-bar-soap.png";
import productShowerCap from "@/assets/product-shower-cap.png";
import productShampooConditioner from "@/assets/product-shampoo-conditioner.png";
import productLotion from "@/assets/product-lotion.png";

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
    id: "bar-soap",
    title: "Bar Soap",
    range: "Guest Collection",
    description:
      "Individually wrapped guest bar soap with a clean, gentle lather — a bathroom essential in every room.",
    price: 6,
    unit: "per bar",
    moq:  288,
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
    moq: 250,
    step: 50,
    image: productShowerCap,
  },
  {
    id: "shampoo-conditioner",
    title: "2-in-1 Shampoo & Conditioner",
    range: "Naturals & Pure",
    description:
      "One bottle, two jobs — a mild cleanse and conditioning finish that suits every guest hair type.",
    price: 10.50,
    unit: "per 35ml",
    moq: 250,
    step: 25,
    image: productShampooConditioner,
  },
  {
    id: "body-wash",
    title: "Shower Gel / Body Wash",
    range: "Naturals & Pure",
    description:
      "Paraben-free body wash formulated for sensitive skin, bulk packaged for effortless restocking.",
    price: 10.50,
    unit: "per 35ml",
    moq: 250,
    step: 25,
    image: productBodyWash,
  },
  {
    id: "hand-body-lotion",
    title: "Hand & Body Lotion",
    range: "Naturals & Pure",
    description:
      "Light, fast-absorbing lotion that leaves guest skin soft without any greasy residue.",
    price: 10.50,
    unit: "per 35ml",
    moq: 250,
    step: 25,
    image: productLotion,
  },

];

export const formatPrice = (value: number) =>
  `E ${value.toLocaleString("en-ZA", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
