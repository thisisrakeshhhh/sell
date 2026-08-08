export class WhatsAppSender {
  private apiToken: string;
  private phoneNumberId: string;

  constructor(apiToken?: string, phoneNumberId?: string) {
    this.apiToken =
      apiToken ||
      "EAAVsOb4k3lMBSBxcN63T4cfZBENZBp9xmEasQZBTHRo5Kj02ZBNLWDu1cXjO8fPtSx3vuDfmXbXqvWdSZCy6M2u3FfSgmNZBTN79eWDtB7HjV1MZC3xsxb7ZBUDfHjqHH6eV7qHZBvqGlZAWM5GuE5i286MPqbk9lLNPA3LfAv0poZAcZCY5ScZApCm8y4XjbCJYg9gOpUY83ubFgBUMd8BPRKO4OD8ZCSE35zYpAbLr5Q6AhOIZA5Ryyc8rsdm7HgQTlQ9Ja3NQC1DyypZAnuuz0ckIQJ1l";
    this.phoneNumberId = phoneNumberId || "1266379983225569";
  }

  async sendTextMessage(toPhone: string, text: string) {
    const cleanPhone = toPhone.replace(/[^0-9]/g, "");
    const url = `https://graph.facebook.com/v21.0/${this.phoneNumberId}/messages`;
    const payload = {
      messaging_product: "whatsapp",
      recipient_type: "individual",
      to: cleanPhone,
      type: "text",
      text: { body: text },
    };

    console.log(`[WhatsApp Outbound Meta API] Sending to ${cleanPhone}...`);

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.apiToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (res.ok) {
        console.log(`[WhatsApp Outbound Meta API Success] Message ID:`, (data as any)?.messages?.[0]?.id);
        return { success: true, data };
      } else {
        console.warn(`[WhatsApp Outbound Meta API Error]:`, data);
        return { success: false, error: data };
      }
    } catch (err) {
      console.warn(`[WhatsApp Outbound Exception]:`, err);
      return { success: false, error: err };
    }
  }
}
