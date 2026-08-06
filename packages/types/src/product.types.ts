import { ProductTagType, SizeType, SportType } from "@jerseyflow/config";

export interface ProductMediaDTO {
  id: string;
  productId: string;
  url: string;
  altText: string | null;
  mediaType: "front" | "back" | "player_version" | "close_up" | "size_chart";
  displayOrder: number;
}

export interface InventoryItemDTO {
  id: string;
  productId: string;
  variantName: string;
  size: SizeType;
  sku: string;
  availableStock: number;
  reservedStock: number;
}

export interface ProductDTO {
  id: string;
  code: string;
  slug: string;
  name: string;
  sport: SportType;
  club: string | null;
  season: string | null;
  tags: ProductTagType[];
  description: string | null;
  basePrice: number;
  discountPrice: number | null;
  isFeatured: boolean;
  isActive: boolean;
  seoTitle: string | null;
  seoDescription: string | null;
  media: ProductMediaDTO[];
  inventory: InventoryItemDTO[];
  createdAt: string;
  updatedAt: string;
}
