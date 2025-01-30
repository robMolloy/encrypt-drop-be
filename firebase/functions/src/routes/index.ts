import { onCall } from "firebase-functions/v2/https";
import z from "zod";
import { stripeSdk } from "../stripeSdk/stripeSdk";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { admin } from "../config/adminFirebaseInitialisations";
import { updateBalanceIfValidAndReceipt } from "./routeHandlers/updateBalanceIfValidAndReceipt";

const requestDataSchema = z.object({
  amount: z.number(),
  currency: z.string(),
});

export const createStripePaymentIntent = onCall(async (request) => {
  const requestParseResponse = requestDataSchema.safeParse(request.data);
  if (!requestParseResponse.success)
    return fail({ message: "The function must be called with 'amount' and 'currency' arguments." });

  return stripeSdk.createPaymentIntent({
    amount: requestParseResponse.data.amount,
    currency: requestParseResponse.data.currency,
  });
});

export const onCreatePaymentIntentDocUpdateBalanceIfValidAndReceipt = onDocumentCreated(
  "paymentIntents/{id}",
  async (event) => {
    const response = await updateBalanceIfValidAndReceipt({
      admin,
      paymentIntentId: event.params.id,
    });

    return response;
  }
);
