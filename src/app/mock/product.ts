import { ProductImages } from "../constants/images";
import { Product, StockStatus } from "../types";

export const mockProducts: Product[] = [
  {
    id: 1,
    name: "Game Card 100 coins",
    description: "Virtual currency card for gaming",
    price: 100,
    denomination: 100,
    imageUrl: ProductImages.IconGacha,
    availableStock: 50,
  },
  {
    id: 2,
    name: "Game Card 300 coins  ",
    description: "Virtual currency card for gaming",
    price: 300,
    denomination: 300,
    imageUrl: ProductImages.IconFornites,
    availableStock: 30,
  },
  {
    id: 3,
    name: "Game Card 500 coins",
    description: "Virtual currency card for gaming",
    price: 500,
    denomination: 500,
    imageUrl: ProductImages.IconFreeFire,
    availableStock: 20,
    stock: 20,
  },
  {
    id: 4,
    name: "Game Card 1000 coins",
    description: "Premium virtual currency card",
    price: 1000,
    imageUrl: ProductImages.IconPubG,
    denomination: 1000,
    availableStock: 10,
  },
];
