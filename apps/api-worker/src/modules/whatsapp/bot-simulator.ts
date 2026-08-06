/**
 * JerseyFlow WhatsApp Automation Engine & Bot Guided Simulator
 * 
 * Customer Journey Sequence:
 * 1. Product SKU lookup ("MU-18") -> Replies with details + web link
 * 2. Order collection prompts (Name -> Number -> Size -> Address)
 * 3. Status set to WAITING_CALL
 * 4. Admin manual call -> Confirmation
 * 5. Payment choice (UPI QR sent) -> WAITING_PAYMENT
 * 6. Screenshot upload -> Admin verifies -> PAID (JF-1025)
 */

export interface BotState {
  step: "IDLE" | "AWAITING_NAME" | "AWAITING_NUMBER" | "AWAITING_SIZE" | "AWAITING_ADDRESS" | "AWAITING_PAYMENT_SCREENSHOT";
  selectedSku?: string;
  customName?: string;
  customNumber?: string;
  size?: string;
  address?: string;
}

export class WhatsAppBotSimulator {
  private static userStates = new Map<string, BotState>();

  public static handleIncomingMessage(phone: string, text: string): string {
    const cleanText = text.trim();
    const upperText = cleanText.toUpperCase();
    const currentState = this.userStates.get(phone) || { step: "IDLE" };

    // 1. SKU LOOKUP TRIGGER (e.g. MU-18, BAR-10, RMA-07, IND-18)
    if (upperText === "MU-18" || upperText === "BAR-10" || upperText === "RMA-07" || upperText === "IND-18") {
      this.userStates.set(phone, { step: "AWAITING_NAME", selectedSku: upperText });
      return `✅ *Manchester United Home 24/25* (SKU: ${upperText})

*Price:* ₹999
*Available Sizes:* S, M, L, XL, 2XL

👇 *Inspect Photos & Customizer Preview:*
https://jerseyflow.vercel.app/products/${upperText.toLowerCase()}

Would you like to order this jersey?
Please reply with the *PLAYER NAME* to print on back (or type "NONE"):`;
    }

    // 2. GUIDED ORDER COLLECTION SEQUENCE
    if (currentState.step === "AWAITING_NAME") {
      currentState.customName = upperText === "NONE" ? "" : upperText;
      currentState.step = "AWAITING_NUMBER";
      this.userStates.set(phone, currentState);
      return `Got it! What *SQUAD NUMBER* would you like on back? (e.g. 7, 10, or "NONE"):`;
    }

    if (currentState.step === "AWAITING_NUMBER") {
      currentState.customNumber = upperText === "NONE" ? "" : upperText;
      currentState.step = "AWAITING_SIZE";
      this.userStates.set(phone, currentState);
      return `Selected squad number: ${upperText}\n\nPlease select your *JERSEY SIZE*:\n1️⃣ S\n2️⃣ M\n3️⃣ L\n4️⃣ XL\n5️⃣ 2XL`;
    }

    if (currentState.step === "AWAITING_SIZE") {
      currentState.size = upperText;
      currentState.step = "AWAITING_ADDRESS";
      this.userStates.set(phone, currentState);
      return `Size set to: ${upperText}\n\nPlease reply with your full *DELIVERY ADDRESS* & pincode:`;
    }

    if (currentState.step === "AWAITING_ADDRESS") {
      currentState.address = cleanText;
      currentState.step = "IDLE";
      this.userStates.delete(phone);

      const orderNumber = `JF-${Math.floor(1000 + Math.random() * 9000)}`;

      return `🎉 *Order Created Successfully!*

*Order Number:* ${orderNumber}
*Product SKU:* ${currentState.selectedSku}
*Custom Name:* ${currentState.customName || "None"}
*Custom Number:* ${currentState.customNumber || "None"}
*Size:* ${currentState.size}
*Status:* 🟡 WAITING_CALL

A JerseyFlow store representative will call you shortly to confirm your order details!`;
    }

    // DEFAULT BOT RESPONSE
    return `Hi 👋\nWelcome to JerseyFlow! Reply with a product SKU code (e.g. *MU-18*, *BAR-10*, *RMA-07*, *IND-18*) to view pricing, sizes, and start your order.`;
  }
}
