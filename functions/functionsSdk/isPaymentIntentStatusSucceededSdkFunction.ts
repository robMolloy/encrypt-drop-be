import { httpsCallable } from "firebase/functions";
import { functions } from "../../config/firebaseConfig";
import { z } from "zod";

const isPaymentIntentStatusSucceededFn = httpsCallable(
  functions,
  "isPaymentIntentStatusSucceeded"
);
const responseSchema = z.object({
  data: z.object({ success: z.literal(true) }),
});

export const isPaymentIntentStatusSucceeded = async (p: {
  paymentIntentId: string;
}) => {
  const response = await isPaymentIntentStatusSucceededFn(p);
  const parsedResponse = responseSchema.safeParse(response);
  return { success: parsedResponse.success } as const;
};
