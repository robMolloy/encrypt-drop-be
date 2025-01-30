import { onCall } from "firebase-functions/v2/https";
import z from "zod";
import { stripeSdk } from "../stripeSdk/stripeSdk";
import { adminFirestoreSdk } from "../adminFirestoreSdk/adminFirestoreSdk";
import { admin } from "../config/adminFirebaseInitialisations";
import { Timestamp } from "firebase-admin/firestore";
import { success } from "../utils/devUtils";

const requestDataSchema = z.object({
  amount: z.number(),
  currency: z.string(),
});

export const createStripePaymentIntentAndDoc = onCall(async (request) => {
  const parseResponse = requestDataSchema.safeParse(request.data);
  if (!parseResponse.success)
    return fail({ message: "The function must be called with 'amount' and 'currency' arguments." });
  const amount = parseResponse.data.amount;
  const currency = parseResponse.data.currency;

  const createPaymentIntentResponse = await stripeSdk.createPaymentIntent({ amount, currency });
  if (!createPaymentIntentResponse.success)
    return fail({ message: "createPaymentIntentResponse failed" });

  const setPaymentIntentDocResponse = await adminFirestoreSdk.setPaymentIntentDoc({
    admin,
    data: {
      id: createPaymentIntentResponse.data.id,
      amount,
      currency,
      uid: "",
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    },
  });
  if (!setPaymentIntentDocResponse.success)
    return fail({ message: "setPaymentIntentDocResponse failed" });

  return success({ data: createPaymentIntentResponse.data });
});
