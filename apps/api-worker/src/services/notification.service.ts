import { WhatsAppSender } from "../modules/whatsapp/sender";
import { WHATSAPP_TEMPLATES } from "../modules/whatsapp/templates";

export class NotificationService {
  private waSender: WhatsAppSender;

  constructor() {
    this.waSender = new WhatsAppSender();
  }

  async sendOrderConfirmation(toPhone: string, orderNumber: string, upiId: string, amount: number) {
    const text = WHATSAPP_TEMPLATES.ORDER_CONFIRMED(orderNumber, upiId, amount);
    await this.waSender.sendTextMessage(toPhone, text);
  }

  async sendShippingNotification(toPhone: string, orderNumber: string, courier: string, trackingNumber: string) {
    const text = WHATSAPP_TEMPLATES.SHIPPED_UPDATE(orderNumber, courier, trackingNumber);
    await this.waSender.sendTextMessage(toPhone, text);
  }

  async sendEmailInvoice(toEmail: string, orderNumber: string, invoiceHtml: string) {
    console.log(`[Resend/Brevo Email Outbound] Sending PDF Tax Invoice for #${orderNumber} to ${toEmail}`);
    // Integration stub for Resend API (https://api.resend.com/emails) or Brevo API
    return { success: true, emailId: `resend_${Math.random().toString(36).substring(2, 10)}` };
  }

  async sendAdminAlert(message: string) {
    console.log(`[Notification Alert] Admin Alert: ${message}`);
  }
}
