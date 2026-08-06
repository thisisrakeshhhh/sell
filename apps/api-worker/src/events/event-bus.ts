type EventCallback = (data: any) => Promise<void> | void;

export class EventBus {
  private static instance: EventBus;
  private listeners: Map<string, EventCallback[]> = new Map();

  private constructor() {}

  public static getInstance(): EventBus {
    if (!EventBus.instance) {
      EventBus.instance = new EventBus();
    }
    return EventBus.instance;
  }

  public subscribe(eventType: string, callback: EventCallback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType)!.push(callback);
  }

  public async emit(eventType: string, data: any) {
    console.log(`[EventBus Emit] ${eventType}:`, data);
    const callbacks = this.listeners.get(eventType) || [];
    for (const cb of callbacks) {
      try {
        await cb(data);
      } catch (err) {
        console.error(`[EventBus Error] Handler failed for ${eventType}:`, err);
      }
    }
  }
}
