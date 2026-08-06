export type PaymentProvider = "razorpay" | "phonepe" | "cashfree" | "manual";

export interface CreatePaymentLinkDTO {
  orderId: string;
  amount: number;
  customerPhone: string;
  provider?: PaymentProvider;
}

export class PaymentService {
  async createPaymentLink(dto: CreatePaymentLinkDTO) {
    const provider = dto.provider || "manual";
    console.log(`[PaymentService] Creating payment via provider '${provider}' for Order ${dto.orderId}`);

    if (provider === "razorpay") {
      return { paymentUrl: `https://rzp.io/i/${dto.orderId}`, provider };
    } else if (provider === "phonepe") {
      return { paymentUrl: `https://merchants.phonepe.com/pay/${dto.orderId}`, provider };
    }

    // Manual UPI QR fallback
    return { upiVpa: "jerseyflow@upi", provider: "manual" };
  }
}
