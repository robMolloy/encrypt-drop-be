import admin from "firebase-admin";
import { onDocumentCreated } from "firebase-functions/v2/firestore";
import z from "zod";
import { Timestamp } from "firebase-admin/firestore";

admin.initializeApp();

type TTimestamp = ReturnType<typeof Timestamp.now>;
type TTimestampValue = Pick<TTimestamp, "seconds" | "nanoseconds">;

const getTimestampFromTimestampValue = (x: TTimestampValue) => {
  return new Timestamp(x.seconds, x.nanoseconds);
};

const timestampSchema = z
  .object({ seconds: z.number(), nanoseconds: z.number() })
  .transform((x) => getTimestampFromTimestampValue(x));

export const paymentIntentDocSchema = z.object({
  id: z.string(),
  uid: z.string(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const balanceSchema = z.object({
  id: z.string(),
  uid: z.string(),
  couponStream: z.number(),
  numberOfCoupons: z.number(),
  createdAt: timestampSchema,
  updatedAt: timestampSchema,
});

export const adminGetBalanceByUid = async (p: {
  admin: typeof admin;
  uid: string;
}) => {
  try {
    const initBalance = await admin
      .firestore()
      .collection("balances")
      .doc(p.uid)
      .get();
    //

    const balanceResponse = balanceSchema.safeParse(initBalance.data());
    return balanceResponse;
  } catch (error) {
    return { success: false } as const;
  }
};

const adminSetBalance = async (p: {
  admin: typeof admin;
  data: z.infer<typeof balanceSchema>;
}) => {
  try {
    await admin.firestore().collection("balances").doc(p.data.id).set(p.data);
    return { success: true } as const;
  } catch (error) {
    return { success: false } as const;
  }
};

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
      await admin
        .firestore()
        .collection("processedPayments")
        .doc(docId)
        .set({
          ...newDocData, // Copy the original data
          processedAt: admin.firestore.FieldValue.serverTimestamp(), // Add a timestamp
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
