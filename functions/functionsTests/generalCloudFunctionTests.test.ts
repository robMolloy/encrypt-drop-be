import { httpsCallable } from "firebase/functions";
import { functions } from "../../config/firebaseConfig";
import { z } from "zod";

const helloWorld = httpsCallable(functions, "helloWorld");
const createPaymentIntent = httpsCallable(functions, "createPaymentIntent");

describe("firestore rules for a randomCollection", () => {
  it("should test that the hello world cloud function exists", async () => {
    const result = await helloWorld();
    expect(result.data).toBe("Hello from Firebase!");
  });
  it("should test that the stripe payment intent cloud function exists", async () => {
    const result = await createPaymentIntent({ amount: 100, currency: "USD" });
    const responseSchema = z.object({ clientSecret: z.string() });
    const responseSchemaResponse = responseSchema.safeParse(result.data);

    expect(responseSchemaResponse.success).toBe(true);
  });
});
