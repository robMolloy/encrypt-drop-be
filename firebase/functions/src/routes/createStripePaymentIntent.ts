import { onCall } from "firebase-functions/v2/https";
import z from "zod";
import { stripeSdk } from "../stripeSdk/stripeSdk";

const requestDataSchema = z.object({
  amount: z.number(),
  currency: z.string(),
});

export const createStripePaymentIntent = onCall(async (initRequest) => {
  const data = initRequest.data;
  const requestParseResponse = requestDataSchema.safeParse(data);
  if (!requestParseResponse.success) {
    const errorMessage = "The function must be called with 'amount' and 'currency' arguments.";
    return { success: false, error: { message: errorMessage } };
  }

  return stripeSdk.createPaymentIntent({
    amount: requestParseResponse.data.amount,
    currency: requestParseResponse.data.currency,
  });
});
