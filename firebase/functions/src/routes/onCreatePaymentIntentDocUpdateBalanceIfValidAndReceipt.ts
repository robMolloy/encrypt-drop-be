import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { updateBalanceIfValidAndReceipt } from "../routeHandlers/updateBalanceIfValidAndReceipt";
import { admin } from "../config/adminFirebaseInitialisations";

export const onCreatePaymentIntentDocUpdateBalanceIfValidAndReceipt =
  onDocumentCreated("paymentIntents/{id}", async (event) => {
    return await updateBalanceIfValidAndReceipt({
      admin,
      paymentIntentId: event.params.id,
    });
  });
