import admin from "firebase-admin";
import {
  adminGetBalanceByUid,
  adminGetPaymentIntentDoc,
  adminGetProcessedPayment,
  adminSetBalance,
  adminSetProcessedPaymentFromPaymentIntent,
} from "../adminFirestoreSdk/adminFirestoreSdk";
import { stripeSdk } from "../stripeSdk/stripeSdk";

export const updateBalanceIfValidAndReceipt = async (p: {
  admin: typeof admin;
  paymentIntentId: string;
}) => {
  const getPaymentIntentDocResponse = await adminGetPaymentIntentDoc({
    admin,
    id: p.paymentIntentId,
  });
  if (!getPaymentIntentDocResponse.success)
    return {
      success: false,
      error: { message: "getPaymentIntentDocResponse failed" },
    };

  const stripePaymentIntentResponse = await stripeSdk.retrievePaymentIntent({
    paymentIntentId: p.paymentIntentId,
  });
  if (!stripePaymentIntentResponse.success)
    return {
      success: false,
      error: { message: "stripePaymentIntentResponse failed" },
    };

  const paymentIntent = stripePaymentIntentResponse.data;
  if (paymentIntent.status !== "succeeded")
    return { success: false, error: { message: "payment has not succeeded" } };

  const getProcessedPaymentResponse = await adminGetProcessedPayment({
    admin,
    id: p.paymentIntentId,
  });
  if (getProcessedPaymentResponse.success)
    return { success: false, error: { message: "getProcessedPayment failed" } };

  const getBalanceResponse = await adminGetBalanceByUid({
    admin,
    uid: getPaymentIntentDocResponse.data.uid,
  });
  if (!getBalanceResponse.success)
    return { success: false, error: { message: "getBalanceResponse failed" } };

  const setBalanceResponse = await adminSetBalance({
    admin,
    data: {
      ...getBalanceResponse.data,
      numberOfCoupons: getBalanceResponse.data.numberOfCoupons + paymentIntent.amount,
      couponStream: getBalanceResponse.data.couponStream + 1,
    },
  });

  if (!setBalanceResponse.success)
    return { success: false, error: { message: "setBalanceResponse failed" } };

  const setProcessedPaymentResponse = await adminSetProcessedPaymentFromPaymentIntent({
    admin,
    data: getPaymentIntentDocResponse.data,
  });

  if (!setProcessedPaymentResponse.success)
    return { success: false, error: { message: "setProcessedPayment failed" } };

  return { success: setProcessedPaymentResponse.success };
};
