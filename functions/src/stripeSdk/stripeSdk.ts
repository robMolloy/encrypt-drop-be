import { Stripe } from "stripe";
import z from "zod";
import { stripeUtils } from "../stripeUtils/stripeUtils";

const stripeSecretKey =
  "sk_test_51QhH4nIGFJRyk0RhUnRTVsXZICgwBLG5C6tiDecTJNR5MC40Skm1y3HMQt0HQA0dEdReAcEH3v2TozuJ9mlLHBQM00d3N3noeZ";
const stripe = new Stripe(stripeSecretKey);

const paymentIntentSchema = z.object({
  amount: z.number(),
  currency: z.literal("usd"),
  status: z.string(),
});

const retrievePaymentIntent = async (p: { paymentIntentId: string }) => {
  try {
    const paymentIntent = await stripeUtils.retrievePaymentIntent({
      stripe,
      paymentIntentId: p.paymentIntentId,
    });

    const paymentIntentParseResponse =
      paymentIntentSchema.safeParse(paymentIntent);
    return paymentIntentParseResponse;
  } catch (e) {
    const error = e as { message: string };
    return { success: false, error } as const;
  }
};
const createPaymentIntent = async (p: { amount: number; currency: string }) => {
  try {
    const paymentIntent = await stripeUtils.createPaymentIntent({
      stripe,
      amount: p.amount,
      currency: p.currency,
    });

    const paymentIntentParseResponse =
      paymentIntentSchema.safeParse(paymentIntent);
    return paymentIntentParseResponse;
  } catch (e) {
    const error = e as { message: string };
    return { success: false, error } as const;
  }
};

export const stripeSdk = {
  retrievePaymentIntent,
  createPaymentIntent,
};
