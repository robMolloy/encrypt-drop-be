import admin from "firebase-admin";
import z from "zod";
import { TSuccessOrFail } from "../utils/devUtils";
import {
  balanceSchema,
  paymentIntentDocSchema,
  paymentProcessedDocSchema,
} from "./adminFirestoreUtils";

const getBalanceByUid = async (p: { admin: typeof admin; uid: string }) => {
  try {
    const initBalance = await p.admin.firestore().collection("balances").doc(p.uid).get();

    const balanceResponse = balanceSchema.safeParse(initBalance.data());
    return balanceResponse;
  } catch (error) {
    return { success: false } as const;
  }
};

const setBalance = async (p: { admin: typeof admin; data: z.infer<typeof balanceSchema> }) => {
  try {
    await p.admin.firestore().collection("balances").doc(p.data.id).set(p.data);
    return { success: true } as const;
  } catch (error) {
    return { success: false } as const;
  }
};

const setProcessedPaymentFromPaymentIntent = async (p: {
  admin: typeof admin;
  data: z.infer<typeof paymentIntentDocSchema>;
}) => {
  try {
    await p.admin
      .firestore()
      .collection("processedPayments")
      .doc(p.data.id)
      .set({
        ...p.data,
        processedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    return { success: true } as const;
  } catch (error) {
    return { success: false } as const;
  }
};

const getProcessedPayment = async (p: {
  admin: typeof admin;
  id: string;
}): Promise<TSuccessOrFail<z.infer<typeof paymentProcessedDocSchema>>> => {
  try {
    const getProcessedPaymentResponse = await p.admin
      .firestore()
      .collection("processedPayments")
      .doc(p.id)
      .get();

    const processedPaymentResponse = paymentProcessedDocSchema.safeParse(
      getProcessedPaymentResponse.data()
    );

    return processedPaymentResponse;
  } catch (e) {
    const error = e as { message: string };
    return { success: false, error } as const;
  }
};

const getPaymentIntentDoc = async (p: {
  admin: typeof admin;
  id: string;
}): Promise<TSuccessOrFail<z.infer<typeof paymentIntentDocSchema>>> => {
  try {
    const getDocResponse = await p.admin.firestore().collection("paymentIntents").doc(p.id).get();

    const parsedDocResponse = paymentIntentDocSchema.safeParse(getDocResponse.data());

    return parsedDocResponse;
  } catch (e) {
    const error = e as { message: string };
    return { success: false, error } as const;
  }
};

export const adminFirestoreSdk = {
  getPaymentIntentDoc,
  setProcessedPaymentFromPaymentIntent,
  getBalanceByUid,
  getProcessedPayment,
  setBalance,
};
