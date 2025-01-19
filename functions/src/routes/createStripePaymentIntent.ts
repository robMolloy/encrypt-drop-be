import { onCall } from "firebase-functions/v2/https";
import { Stripe } from "stripe";
import z from "zod";

const stripeSecretKey =
  "sk_test_51QhH4nIGFJRyk0RhUnRTVsXZICgwBLG5C6tiDecTJNR5MC40Skm1y3HMQt0HQA0dEdReAcEH3v2TozuJ9mlLHBQM00d3N3noeZ";
const stripe = new Stripe(stripeSecretKey);

const requestDataSchema = z.object({
  amount: z.number(),
  currency: z.string(),
});

export const createStripePaymentIntent = onCall(async (initRequest) => {
  try {
    const data = initRequest.data;
    const requestParseResponse = requestDataSchema.safeParse(data);

    if (!requestParseResponse.success) {
      const errorMessage =
        "The function must be called with 'amount' and 'currency' arguments.";
      return { success: false, error: { message: errorMessage } };
    }

    const amount = requestParseResponse.data.amount;
    const currency = requestParseResponse.data.currency;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    return { success: true, data: paymentIntent };
  } catch (e) {
    const error = e as { message: string };
    return { success: false, error };
  }
});
