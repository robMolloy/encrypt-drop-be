import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { updateBalanceIfValidAndReceipt } from "../routeHandlers/updateBalanceIfValidAndReceipt";
import { admin } from "../config/adminFirebaseInitialisations";
import { logger } from "firebase-functions";

export const onCreatePaymentIntentDocUpdateBalanceIfValidAndReceipt =
  onDocumentCreated("paymentIntents/{id}", async (event) => {
    logger.info(
      `onCreatePaymentIntentDocUpdateBalanceIfValidAndReceipt.ts:${/*LL*/ 9}`
    );
    const response = await updateBalanceIfValidAndReceipt({
      admin,
      paymentIntentId: event.params.id,
    });

    logger.info(
      `onCreatePaymentIntentDocUpdateBalanceIfValidAndReceipt.ts:${
        /*LL*/ 18
      } ${JSON.stringify(response)}`
    );

    return response;
  });
