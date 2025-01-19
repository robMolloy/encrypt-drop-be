import { Stripe } from "stripe";
import z from "zod";

const stripeSecretKey =
  "sk_test_51QhH4nIGFJRyk0RhUnRTVsXZICgwBLG5C6tiDecTJNR5MC40Skm1y3HMQt0HQA0dEdReAcEH3v2TozuJ9mlLHBQM00d3N3noeZ";
const stripe = new Stripe(stripeSecretKey);

export const paymentIntentSchema = z.object({
  amount: z.number(),
  currency: z.literal("usd"),
  status: z.string(),
});

export const stripeRetrievePaymentIntent = async (p: {
  paymentIntentId: string;
}) => {
  try {
    const paymentIntent = await stripe.paymentIntents.retrieve(
      p.paymentIntentId
    );

    console.log(`stripeUtils.ts:${/*LL*/ 18}`, { paymentIntent });

    const paymentIntentParseResponse =
      paymentIntentSchema.safeParse(paymentIntent);
    console.log(`stripeUtils.ts:${/*LL*/ 26}`, { paymentIntentParseResponse });
    return paymentIntentParseResponse;
  } catch (e) {
    const error = e as { message: string };
    return { success: false, error } as const;
  }
};
