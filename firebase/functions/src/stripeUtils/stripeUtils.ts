import Stripe from "stripe";
import z from "zod";

export const paymentIntentSchema = z.object({
  amount: z.number(),
  currency: z.literal("usd"),
  status: z.string(),
});

const retrievePaymentIntent = async (p: {
  stripe: Stripe;
  paymentIntentId: string;
}) => {
  try {
    const paymentIntent = await p.stripe.paymentIntents.retrieve(
      p.paymentIntentId
    );

    const paymentIntentParseResponse =
      paymentIntentSchema.safeParse(paymentIntent);
    return paymentIntentParseResponse;
  } catch (e) {
    const error = e as { message: string };
    return { success: false, error } as const;
  }
};
const createPaymentIntent = async (p: {
  stripe: Stripe;
  currency: string;
  amount: number;
}) => {
  try {
    const paymentIntent = await p.stripe.paymentIntents.create({
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

export const stripeUtils = {
  retrievePaymentIntent,
  createPaymentIntent,
};
