import { httpsCallable } from "firebase/functions";
import { z } from "zod";
import { functions } from "../../config/firebaseConfig";

const helloWorld = httpsCallable(functions, "helloWorld");
const createStripePaymentIntent = httpsCallable(
  functions,
  "createStripePaymentIntent"
);

describe("firestore rules for a randomCollection", () => {
  it("should test that the hello world cloud function exists", async () => {
    const result = await helloWorld();
    expect(result.data).toBe("Hello from Firebase!");
  });
  it("should test that the stripe payment intent cloud function exists", async () => {
    const result = await createStripePaymentIntent({
      amount: 100,
      currency: "USD",
    });
    const responseSchema = z.object({ clientSecret: z.string() });
    const responseSchemaResponse = responseSchema.safeParse(result.data);

    expect(responseSchemaResponse.success).toBe(true);
  });
});
