import admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import {
  adminGetBalanceByUid,
  adminSetBalance,
  adminSetProcessedPaymentFromPaymentIntent,
  paymentIntentDocSchema,
} from "./adminFirestoreSdk/adminFirestoreSdk";

admin.initializeApp();

export const onCreatePaymentIntent = onDocumentCreated(
  "paymentIntents/{id}",
  async (event) => {
    const newDocData = event.data?.data(); // Data of the created document
    const docId = event.params.id; // Document ID

    const paymentIntentParseResponse =
      paymentIntentDocSchema.safeParse(newDocData);
    if (!paymentIntentParseResponse.success) return { success: false };
    console.log(`New document created with ID: ${docId}`);

    try {
      // Example: Write to another Firestore collection
      await adminSetProcessedPaymentFromPaymentIntent({
        admin,
        data: paymentIntentParseResponse.data,
      });

      const balanceResponse = await adminGetBalanceByUid({
        admin,
        uid: paymentIntentParseResponse.data.uid,
      });

      if (!balanceResponse.success) return { success: false };

      const setBalanceResponse = await adminSetBalance({
        admin,
        data: {
          ...balanceResponse.data,
          numberOfCoupons: balanceResponse.data.numberOfCoupons + 10,
          couponStream: balanceResponse.data.couponStream + 1,
        },
      });

      return { success: setBalanceResponse.success };
    } catch (error) {
      console.error("Error writing to Firestore:", error);
      return { success: false };
    }
  }
);
