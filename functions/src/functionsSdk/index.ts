import { createStripePaymentIntent } from "./createStripePaymentIntentSdkFunction";
import { helloWorld } from "./helloWorldSdkFunction";
import { isPaymentIntentStatusSucceeded } from "./isPaymentIntentStatusSucceededSdkFunction";

export const sdk = {
  createStripePaymentIntent,
  helloWorld,
  isPaymentIntentStatusSucceeded,
};
