import { Hono } from "hono";
import { getDb } from "../db";
import { WhatsAppStateMachine } from "../modules/whatsapp/state-machine";
import { WhatsAppSender } from "../modules/whatsapp/sender";
import { formatSuccessResponse, formatErrorResponse } from "../middleware/error";

export const webhooksRouter = new Hono<{
  Bindings: {
    DB: D1Database;
    WHATSAPP_ACCESS_TOKEN?: string;
    WHATSAPP_PHONE_NUMBER_ID?: string;
    WHATSAPP_VERIFY_TOKEN?: string;
    TELEGRAM_BOT_TOKEN?: string;
  };
}>();

// Meta WhatsApp Webhook Challenge Verification (GET)
webhooksRouter.get("/whatsapp", (c) => {
  const mode = c.req.query("hub.mode");
  const token = c.req.query("hub.verify_token");
  const challenge = c.req.query("hub.challenge");

  const expectedToken = c.env.WHATSAPP_VERIFY_TOKEN || "jerseyflow_webhook_secret";

  if (mode === "subscribe" && token === expectedToken) {
    return c.text(challenge || "");
  }
  return c.json(formatErrorResponse("Webhook verification failed"), 403);
});

// Incoming Meta WhatsApp Webhook Events (POST)
webhooksRouter.post("/whatsapp", async (c) => {
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const stateMachine = new WhatsAppStateMachine(db);

  // Extract message and sender phone from Meta Cloud API payload or simulation
  const phone =
    body.phone ||
    body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from ||
    "+919999999999";

  const text =
    body.message ||
    body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body ||
    "MU-18";

  // Process through state machine
  const res = await stateMachine.processIncomingMessage(phone, text);

  // Dispatch real outgoing WhatsApp message back to user via Meta API
  const sender = new WhatsAppSender(
    c.env.WHATSAPP_ACCESS_TOKEN,
    c.env.WHATSAPP_PHONE_NUMBER_ID
  );
  await sender.sendTextMessage(phone, res.reply);

  return c.json(formatSuccessResponse({ phone, incoming: text, reply: res.reply, buttons: res.buttons }, "Webhook processed and automated WhatsApp reply sent"));
});

// Incoming Telegram Webhook Events (POST)
webhooksRouter.post("/telegram", async (c) => {
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const stateMachine = new WhatsAppStateMachine(db);

  // Support both normal text messages AND inline button clicks (callback_query)
  const isCallback = Boolean(body.callback_query);
  const chatId = body.chat_id || body.callback_query?.message?.chat?.id || body.message?.chat?.id || "tg_demo_user";
  const callbackQueryId = body.callback_query?.id;
  const phone = `tg_${chatId}`;
  const text = body.callback_query?.data || body.message?.text || body.message || "MU-18";

  // Process through state machine
  const res = await stateMachine.processIncomingMessage(phone, text);

  const botToken = c.env.TELEGRAM_BOT_TOKEN;

  // Answer callback query if button was clicked to dismiss Telegram loading clock
  if (botToken && isCallback && callbackQueryId) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/answerCallbackQuery`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ callback_query_id: callbackQueryId }),
      });
    } catch (err) {
      console.warn("Telegram answerCallbackQuery warning:", err);
    }
  }

  // Format interactive inline buttons for Telegram
  const inlineKeyboard = res.buttons && res.buttons.length > 0
    ? {
        inline_keyboard: res.buttons.map((b) => [{ text: b.text, callback_data: b.value }]),
      }
    : undefined;

  // Dispatch to Telegram Bot API
  if (botToken && chatId) {
    try {
      await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chat_id: chatId,
          text: res.reply,
          parse_mode: "Markdown",
          reply_markup: inlineKeyboard,
        }),
      });
    } catch (err) {
      console.warn("Telegram sendMessage warning:", err);
    }
  }

  return c.json(formatSuccessResponse({ chatId, incoming: text, reply: res.reply, buttons: res.buttons }, "Telegram message processed & order logged in D1"));
});
