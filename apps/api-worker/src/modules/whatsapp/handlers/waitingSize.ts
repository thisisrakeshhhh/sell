import { ConversationContext } from "../state-machine";

export async function handleWaitingSize(
  text: string,
  context: ConversationContext
): Promise<{ nextState: string; reply: string; updatedContext: ConversationContext }> {
  const size = text.trim().toUpperCase();
  context.size = size;

  return {
    nextState: "WAITING_ADDRESS",
    reply: `Size set to: ${size}\n\nFinally, please reply with your complete *DELIVERY ADDRESS* & pincode:`,
    updatedContext: context,
  };
}
