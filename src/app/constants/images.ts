// src/constants/images.ts
import IconFornites from "@/images/fortnite.webp";
import IconFreeFire from "@/images/freefire.webp";
import IconPubG from "@/images/pubg.webp";
import IconGacha from "@/images/gacha.webp";

export const ProductImages = {
  IconFornites: IconFornites,
  IconFreeFire: IconFreeFire,
  IconPubG: IconPubG,
  IconGacha: IconGacha,
} as const;

export function mapImagePath(imagePath: string) {
  switch (imagePath) {
    case "/images/icon-gacha.png":
      return ProductImages.IconGacha;
    case "/images/icon-freefire.png":
      return ProductImages.IconFreeFire;
    case "/images/icon-pubg.png":
      return ProductImages.IconPubG;
    case "/images/icon-fortnite.png":
      return ProductImages.IconFornites;
    // Add more cases here if needed
    default:
      return ProductImages.IconFornites; /// or some default image
  }
}
