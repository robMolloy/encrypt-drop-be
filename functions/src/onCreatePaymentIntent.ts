import admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import z from "zod";
import {
  adminGetBalanceByUid,
  adminGetProcessedPayment,
  adminSetBalance,
  adminSetProcessedPaymentFromPaymentIntent,
  paymentIntentDocSchema,
} from "./adminFirestoreSdk/adminFirestoreSdk";
import { stripeRetrievePaymentIntent } from "./stripeUtils/stripeUtils";

admin.initializeApp();

// const updateBalanceIfValidPaymentIntentAndCreateProcessedPaymentDoc =
// async (p: { admin: typeof admin; paymentIntentId: string }) => {
//   const getPaymentIntentDocResponse = await adminGetPaymentIntentDoc({
//     admin,
//     id: p.paymentIntentId,
//   });
//   if (!getPaymentIntentDocResponse.success) return { success: false };

//   const stripePaymentIntentResponse = await stripeRetrievePaymentIntent({
//     paymentIntentId: p.paymentIntentId,
//   });
//   if (!stripePaymentIntentResponse.success) return { success: false };

//   const paymentIntent = stripePaymentIntentResponse.data;
//   if (paymentIntent.status !== "succeeded") return { success: false };

//   const getProcessedPaymentResponse = await adminGetProcessedPayment({
//     admin,
//     id: p.paymentIntentId,
//   });
//   if (getProcessedPaymentResponse.success) return { success: false };

//   const getBalanceResponse = await adminGetBalanceByUid({
//     admin,
//     uid: getPaymentIntentDocResponse.data.uid,
//   });
//   if (!getBalanceResponse.success) return { success: false };

//   const setBalanceResponse = await adminSetBalance({
//     admin,
//     data: {
//       ...getBalanceResponse.data,
//       numberOfCoupons: getBalanceResponse.data.numberOfCoupons + 10,
//       couponStream: getBalanceResponse.data.couponStream + 1,
//     },
//   });

//   if (!setBalanceResponse.success) return { success: false };

//   const setProcessedPaymentResponse =
//     await adminSetProcessedPaymentFromPaymentIntent({
//       admin,
//       data: getPaymentIntentDocResponse.data,
//     });

//   return { success: setProcessedPaymentResponse.success };
// };

export const onCreatePaymentIntentDocUpdateBalanceAndReceipt =
  onDocumentCreated("paymentIntents/{id}", async (event) => {
    const paymentIntentDocData = event.data?.data() as z.infer<
      typeof paymentIntentDocSchema
    >;

    const paymentIntentResponse = await stripeRetrievePaymentIntent({
      paymentIntentId: paymentIntentDocData.id,
    });

    if (!paymentIntentResponse.success) return { success: false };

    const paymentIntent = paymentIntentResponse.data;
    if (paymentIntent.status !== "succeeded") return { success: false };

    const getProcessedPaymentResponse = await adminGetProcessedPayment({
      admin,
      id: paymentIntentDocData.id,
    });
    if (getProcessedPaymentResponse.success) return { success: false };

    const getBalanceResponse = await adminGetBalanceByUid({
      admin,
      uid: paymentIntentDocData.uid,
    });
    if (!getBalanceResponse.success) return { success: false };

    const setBalanceResponse = await adminSetBalance({
      admin,
      data: {
        ...getBalanceResponse.data,
        numberOfCoupons:
          getBalanceResponse.data.numberOfCoupons + paymentIntent.amount,
        couponStream: getBalanceResponse.data.couponStream + 1,
      },
    });

    if (!setBalanceResponse.success) return { success: false };

    const setProcessedPaymentResponse =
      await adminSetProcessedPaymentFromPaymentIntent({
        admin,
        data: paymentIntentDocData,
      });

    return { success: setProcessedPaymentResponse.success };
  });
