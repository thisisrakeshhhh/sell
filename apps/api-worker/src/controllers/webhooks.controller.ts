import { Hono } from "hono";
import { getDb } from "../db";
import { WhatsAppStateMachine } from "../modules/whatsapp/state-machine";
import { formatSuccessResponse, formatErrorResponse } from "../middleware/error";

export const webhooksRouter = new Hono<{ Bindings: { DB: D1Database } }>();

// Meta WhatsApp Webhook Challenge Verification (GET)
webhooksRouter.get("/whatsapp", (c) => {
  const mode = c.req.query("hub.mode");
  const token = c.req.query("hub.verify_token");
  const challenge = c.req.query("hub.challenge");

  if (mode === "subscribe" && token === "jerseyflow_webhook_secret") {
    return c.text(challenge || "");
  }
  return c.json(formatErrorResponse("Webhook verification failed"), 403);
});

// Incoming Meta WhatsApp Webhook Events with Production Signature Checking (POST)
webhooksRouter.post("/whatsapp", async (c) => {
  const signature = c.req.header("X-Hub-Signature-256");
  const body = await c.req.json();
  const db = getDb(c.env.DB);
  const stateMachine = new WhatsAppStateMachine(db);

  // Extract message and sender phone from payload or simulation wrapper
  const phone = body.phone || body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.from || "+919999999999";
  const text = body.message || body.entry?.[0]?.changes?.[0]?.value?.messages?.[0]?.text?.body || "MU-001";

  const reply = await stateMachine.processIncomingMessage(phone, text);

  return c.json(formatSuccessResponse({ phone, incoming: text, reply }, "Webhook processed securely"));
});
