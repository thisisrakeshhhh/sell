import { OrderStatusType, PaymentStatusType, SizeType } from "@jerseyflow/config";
import { ProductDTO } from "./product.types";

export interface OrderTimelineEventDTO {
  id: string;
  orderId: string;
  eventType: string;
  title: string;
  description: string | null;
  createdAt: string;
}

export interface PaymentDTO {
  id: string;
  orderId: string;
  amount: number;
  screenshotUrl: string | null;
  status: PaymentStatusType;
  notes: string | null;
  createdAt: string;
}

export interface CustomerDTO {
  id: string;
  phoneNumber: string;
  name: string | null;
  instagramHandle: string | null;
  source: "Instagram" | "WhatsApp" | "Referral" | "Direct";
  defaultAddress: string | null;
}

export interface OrderDTO {
  id: string;
  orderNumber: string;
  customerId: string;
  customer?: CustomerDTO;
  productId: string;
  product?: ProductDTO;
  variantName: string;
  size: SizeType;
  customName: string | null;
  customNumber: string | null;
  quantity: number;
  totalAmount: number;
  customerPhone: string;
  shippingAddress: string;
  paymentMethod: "upi" | "bank_transfer" | "cod";
  paymentStatus: PaymentStatusType;
  status: OrderStatusType;
  confirmationCalled: boolean;
  notes: string | null;
  payments?: PaymentDTO[];
  timelineEvents?: OrderTimelineEventDTO[];
  createdAt: string;
  updatedAt: string;
}
