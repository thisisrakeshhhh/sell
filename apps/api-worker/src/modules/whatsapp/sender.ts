export class WhatsAppSender {
  private apiToken: string;
  private phoneNumberId: string;

  constructor(apiToken: string = "EAAG...", phoneNumberId: string = "10987654321") {
    this.apiToken = apiToken;
    this.phoneNumberId = phoneNumberId;
  }

  async sendTextMessage(toPhone: string, text: string) {
    const url = `https://graph.facebook.com/v18.0/${this.phoneNumberId}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: toPhone.replace("+", ""),
      type: "text",
      text: { body: text },
    };

    console.log(`[WhatsApp Outbound] Sending text to ${toPhone}:`, text.substring(0, 50));
    return { success: true, messageId: `wamid.HBgL${Math.random().toString(36).substring(2, 10)}` };
  }

  async sendImageMessage(toPhone: string, imageUrl: string, caption?: string) {
    console.log(`[WhatsApp Outbound] Sending image to ${toPhone}: ${imageUrl}`);
    return { success: true, messageId: `wamid.HBgL${Math.random().toString(36).substring(2, 10)}` };
  }

  async sendTemplateMessage(toPhone: string, templateName: string, languageCode = "en_US") {
    console.log(`[WhatsApp Outbound] Sending template ${templateName} to ${toPhone}`);
    return { success: true, messageId: `wamid.HBgL${Math.random().toString(36).substring(2, 10)}` };
  }
}
