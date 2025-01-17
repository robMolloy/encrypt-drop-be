import { httpsCallable } from "firebase/functions";
import { functions } from "../../config/firebaseConfig";
import { sdk } from "../functionsSdk";

const helloWorld = httpsCallable(functions, "helloWorld");

describe("firestore rules for a randomCollection", () => {
  it("should test that the hello world cloud function exists", async () => {
    const result = await helloWorld();
    expect(result.data).toBe("Hello from Firebase!");
  });
  it("should test that the stripe payment intent cloud function exists", async () => {
    const result = await sdk.createStripePaymentIntent({
      amount: 100,
      currency: "USD",
    });
    expect(result.success).toBe(true);
  });
});
