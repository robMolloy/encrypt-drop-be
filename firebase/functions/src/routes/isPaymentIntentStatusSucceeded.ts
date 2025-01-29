import { onCall } from "firebase-functions/v2/https";
import { Stripe } from "stripe";
import z from "zod";

const stripeSecretKey =
  "sk_test_51QhH4nIGFJRyk0RhUnRTVsXZICgwBLG5C6tiDecTJNR5MC40Skm1y3HMQt0HQA0dEdReAcEH3v2TozuJ9mlLHBQM00d3N3noeZ";
const stripe = new Stripe(stripeSecretKey);

const requestSchema = z.object({
  data: z.object({ paymentIntentId: z.string() }),
});
const paymentIntentSchema = z.object({ status: z.string() });

export const isPaymentIntentStatusSucceeded = onCall(async (request) => {
  try {
    const requestParseResponse = requestSchema.safeParse(request);

    if (!requestParseResponse.success) {
      const errorMessage =
        "invalid-argument: The function must be called with 'paymentIntentId' argument.";
      return { success: false, error: { message: errorMessage } };
    }

    const paymentIntentId = requestParseResponse.data.data.paymentIntentId;
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

    const paymentIntentParseResponse =
      paymentIntentSchema.safeParse(paymentIntent);
    const success =
      paymentIntentParseResponse.success &&
      paymentIntentParseResponse.data.status === "succeeded";
    return { success };
  } catch (e) {
    const error = e as { message: string };
    return { success: false, error } as const;
  }
});
