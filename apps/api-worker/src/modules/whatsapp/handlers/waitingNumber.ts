import { ConversationContext } from "../state-machine";

export async function handleWaitingNumber(
  text: string,
  context: ConversationContext
): Promise<{ nextState: string; reply: string; updatedContext: ConversationContext }> {
  const upperText = text.trim().toUpperCase();
  context.customNumber = upperText === "NONE" ? "" : upperText;

  return {
    nextState: "WAITING_SIZE",
    reply: `Selected squad number: ${upperText}\n\nPlease select your *JERSEY SIZE*:\n1️⃣ S\n2️⃣ M\n3️⃣ L\n4️⃣ XL\n5️⃣ 2XL`,
    updatedContext: context,
  };
}
