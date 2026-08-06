import { ConversationContext } from "../state-machine";

export async function handleWaitingName(
  text: string,
  context: ConversationContext
): Promise<{ nextState: string; reply: string; updatedContext: ConversationContext }> {
  const customerName = text.trim();
  context.customerName = customerName;

  return {
    nextState: "WAITING_CUSTOM_NAME",
    reply: `Nice to meet you ${customerName}! What *PLAYER NAME* would you like printed on the back of your jersey? (or reply "NONE"):`,
    updatedContext: context,
  };
}
