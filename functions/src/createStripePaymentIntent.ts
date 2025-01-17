// import * as admin from "firebase-admin";
// admin.initializeApp();

import { Stripe } from "stripe";
import { onCall, HttpsError } from "firebase-functions/v2/https";
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

    if (!requestParseResponse.success)
      throw new HttpsError(
        "invalid-argument",
        "The function must be called with 'amount' and 'currency' arguments."
      );

    const amount = requestParseResponse.data.amount;
    const currency = requestParseResponse.data.currency;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    // Return the client secret to the client
    return { clientSecret: paymentIntent.client_secret };
  } catch (e) {
    const error = e as { message: string };
    console.error("Error creating payment intent:", error);
    throw new HttpsError("internal", error.message);
  }
});
