import admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import {
  adminGetBalanceByUid,
  adminGetPaymentIntentDoc,
  adminGetProcessedPayment,
  adminSetBalance,
  adminSetProcessedPaymentFromPaymentIntent,
} from "./adminFirestoreSdk/adminFirestoreSdk";
import { stripeRetrievePaymentIntent } from "./stripeUtils/stripeUtils";

admin.initializeApp();

const updateBalanceIfValidAndReceipt = async (p: {
  admin: typeof admin;
  paymentIntentId: string;
}) => {
  const getPaymentIntentDocResponse = await adminGetPaymentIntentDoc({
    admin,
    id: p.paymentIntentId,
  });
  if (!getPaymentIntentDocResponse.success) return { success: false };

  const stripePaymentIntentResponse = await stripeRetrievePaymentIntent({
    paymentIntentId: p.paymentIntentId,
  });
  if (!stripePaymentIntentResponse.success) return { success: false };

  const paymentIntent = stripePaymentIntentResponse.data;
  if (paymentIntent.status !== "succeeded") return { success: false };

  const getProcessedPaymentResponse = await adminGetProcessedPayment({
    admin,
    id: p.paymentIntentId,
  });
  if (getProcessedPaymentResponse.success) return { success: false };

  const getBalanceResponse = await adminGetBalanceByUid({
    admin,
    uid: getPaymentIntentDocResponse.data.uid,
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
      data: getPaymentIntentDocResponse.data,
    });

  return { success: setProcessedPaymentResponse.success };
};

export const onCreatePaymentIntentDocUpdateBalanceIfValidAndReceipt =
  onDocumentCreated("paymentIntents/{id}", async (event) => {
    return await updateBalanceIfValidAndReceipt({
      admin,
      paymentIntentId: event.params.id,
    });
  });
