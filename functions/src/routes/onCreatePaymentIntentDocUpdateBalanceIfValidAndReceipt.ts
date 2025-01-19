import admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { updateBalanceIfValidAndReceipt } from "../routeHandlers/updateBalanceIfValidAndReceipt";

admin.initializeApp();

export const onCreatePaymentIntentDocUpdateBalanceIfValidAndReceipt =
  onDocumentCreated("paymentIntents/{id}", async (event) => {
    return await updateBalanceIfValidAndReceipt({
      admin,
      paymentIntentId: event.params.id,
    });
  });
