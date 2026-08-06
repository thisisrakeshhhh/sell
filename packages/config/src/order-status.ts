export const ORDER_STATUS = {
  NEW: "NEW",
  WAITING_CALL: "WAITING_CALL",
  CONFIRMED: "CONFIRMED",
  WAITING_PAYMENT: "WAITING_PAYMENT",
  PAID: "PAID",
  PRINTING: "PRINTING",
  PACKED: "PACKED",
  SHIPPED: "SHIPPED",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
} as const;

export type OrderStatusType = (typeof ORDER_STATUS)[keyof typeof ORDER_STATUS];

export const PAYMENT_STATUS = {
  PENDING: "pending",
  VERIFIED: "verified",
  REJECTED: "rejected",
} as const;

export type PaymentStatusType = (typeof PAYMENT_STATUS)[keyof typeof PAYMENT_STATUS];

export const SIZES = ["S", "M", "L", "XL", "2XL", "3XL"] as const;
export type SizeType = (typeof SIZES)[number];

export const SPORTS = ["Football", "Cricket", "NBA", "Anime"] as const;
export type SportType = (typeof SPORTS)[number];

export const PRODUCT_TAGS = [
  "Retro",
  "Limited",
  "Player Version",
  "Kids",
  "Best Seller",
  "New Arrival",
  "Premium",
] as const;
export type ProductTagType = (typeof PRODUCT_TAGS)[number];
