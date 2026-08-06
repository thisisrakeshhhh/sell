export const WHATSAPP_TEMPLATES = {
  ORDER_CONFIRMED: (orderNumber: string, upiId: string, totalAmount: number) =>
    `🎉 *Order Confirmed!*\n\nOrder Number: *${orderNumber}*\nTotal Amount: *₹${totalAmount}*\n\nPlease pay via UPI to VPA: *${upiId}*\n\nReply with a screenshot of your payment to proceed with custom jersey printing!`,

  SHIPPED_UPDATE: (orderNumber: string, courier: string, trackingNumber: string) =>
    `🚚 *Your Jersey Has Been Shipped!*\n\nOrder Number: *${orderNumber}*\nCourier: *${courier}*\nTracking Number: *${trackingNumber}*\n\nTrack your package online! Thank you for ordering with JerseyFlow.`,
};
