import { z } from "zod";
import { ORDER_STATUS, SIZES } from "@jerseyflow/config";

export const createOrderSchema = z.object({
  productId: z.string().uuid("Invalid product ID"),
  variantName: z.string().default("Standard"),
  size: z.enum(SIZES, { errorMap: () => ({ message: "Select a valid size" }) }),
  customName: z.string().max(20, "Name on back max 20 chars").optional().nullable(),
  customNumber: z.string().max(3, "Number max 3 digits").optional().nullable(),
  quantity: z.number().int().min(1).default(1),
  customerName: z.string().min(2, "Name required"),
  customerPhone: z.string().min(10, "Valid phone number required"),
  instagramHandle: z.string().optional().nullable(),
  shippingAddress: z.string().min(10, "Full shipping address required"),
  paymentMethod: z.enum(["upi", "bank_transfer", "cod"]).default("upi"),
  notes: z.string().optional().nullable(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const updateOrderStatusSchema = z.object({
  status: z.enum([
    ORDER_STATUS.NEW,
    ORDER_STATUS.WAITING_CALL,
    ORDER_STATUS.CONFIRMED,
    ORDER_STATUS.WAITING_PAYMENT,
    ORDER_STATUS.PAID,
    ORDER_STATUS.PRINTING,
    ORDER_STATUS.PACKED,
    ORDER_STATUS.SHIPPED,
    ORDER_STATUS.DELIVERED,
    ORDER_STATUS.CANCELLED,
  ]),
  confirmationCalled: z.boolean().optional(),
  notes: z.string().optional(),
});
