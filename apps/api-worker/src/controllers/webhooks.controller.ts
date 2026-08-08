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
  const reply = await stateMachine.processIncomingMessage(phone, text);

  // Dispatch real outgoing WhatsApp message back to user via Meta API
  const sender = new WhatsAppSender(
    c.env.WHATSAPP_ACCESS_TOKEN,
    c.env.WHATSAPP_PHONE_NUMBER_ID
  );
  await sender.sendTextMessage(phone, reply);

  return c.json(formatSuccessResponse({ phone, incoming: text, reply }, "Webhook processed and automated WhatsApp reply sent"));
});
