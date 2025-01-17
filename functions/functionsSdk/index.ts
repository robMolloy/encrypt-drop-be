import { createStripePaymentIntent } from "./createStripePaymentIntentSdkFunction";
import { isPaymentIntentStatusSucceeded } from "./isPaymentIntentStatusSucceededSdkFunction";

export const sdk = {
  createStripePaymentIntent,
  isPaymentIntentStatusSucceeded,
};
