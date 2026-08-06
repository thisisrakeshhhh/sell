import { DbClient } from "../db";

export class SchedulerService {
  constructor(private db: DbClient) {}

  async sendPaymentReminder() {
    // Interface for Cloudflare Cron Trigger: Send WhatsApp reminder for WAITING_PAYMENT orders
  }

  async abandonDraftOrder() {
    // Interface for Cloudflare Cron Trigger: Mark stale draft_orders as EXPIRED after 24h
  }

  async expireDraftOrder() {
    // Interface for Cloudflare Cron Trigger: Clean up expired draft sessions
  }

  async followUpCustomer() {
    // Interface for Cloudflare Cron Trigger: Re-engage customers who browsed SKUs
  }
}
