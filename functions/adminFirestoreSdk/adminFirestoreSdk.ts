import admin from "firebase-admin";
import { Timestamp } from "firebase-admin/firestore";
import z from "zod";

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
