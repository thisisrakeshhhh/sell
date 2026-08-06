import { ConversationContext } from "../state-machine";

export async function handleWaitingCustomName(
  text: string,
  context: ConversationContext
): Promise<{ nextState: string; reply: string; updatedContext: ConversationContext }> {
  const upperText = text.trim().toUpperCase();
  context.customName = upperText === "NONE" ? "" : upperText;

  return {
    nextState: "WAITING_NUMBER",
    reply: `Got it! What *SQUAD NUMBER* would you like on back? (e.g. 7, 10, or "NONE"):`,
    updatedContext: context,
  };
}
