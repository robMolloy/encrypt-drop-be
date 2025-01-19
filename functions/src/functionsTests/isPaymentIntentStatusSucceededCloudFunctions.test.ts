import { httpsCallable } from "firebase/functions";
import { functions } from "../config/adminFirebaseConfig";
import { z } from "zod";

const isPaymentIntentStatusSucceededFn = httpsCallable(
  functions,
  "isPaymentIntentStatusSucceeded"
);
const isPaymentIntentStatusSucceededSchema = z.object({
  data: z.object({ success: z.literal(true) }),
});
const isPaymentIntentStatusSucceeded = async (p: {
  paymentIntentId: string;
}) => {
  const response = await isPaymentIntentStatusSucceededFn(p);
  const parsedResponse =
    isPaymentIntentStatusSucceededSchema.safeParse(response);
  return { success: parsedResponse.success } as const;
};

const mockPaymentIntentIds = {
  success: "pi_3QiDRhIGFJRyk0Rh1HfQOJ40",
  unused: "pi_3QiE93IGFJRyk0Rh1PlG9Ffi",
  fake: "pi_3QiDrBIGFJRyk0Rh1eDfail",
};

describe("firestore rules for a randomCollection", () => {
  it("should test that the isPaymentIntentStatusSucceeded cloud function exists", async () => {
    const successResult = await isPaymentIntentStatusSucceeded({
      paymentIntentId: mockPaymentIntentIds.success,
    });
    const unusedResult = await isPaymentIntentStatusSucceeded({
      paymentIntentId: mockPaymentIntentIds.unused,
    });
    const fakeResult = await isPaymentIntentStatusSucceeded({
      paymentIntentId: mockPaymentIntentIds.fake,
    });

    expect(successResult.success).toBeTruthy();
    expect(unusedResult.success).toBeFalsy();
    expect(fakeResult.success).toBeFalsy();
  });
});
