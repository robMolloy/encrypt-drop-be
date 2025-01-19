import { sdk } from "../functionsSdk";

describe("firestore rules for a randomCollection", () => {
  it("should test that the hello world cloud function exists", async () => {
    const result2 = await sdk.helloWorld();
    expect(result2.success).toBe(true);
    expect(result2.data).toBe("Hello from Firebase!");
  });
  it("should test that the stripe payment intent cloud function exists", async () => {
    const result = await sdk.createStripePaymentIntent({
      amount: 100,
      currency: "USD",
    });
    expect(result.success).toBe(true);
    expect(result.data?.client_secret).toBeTruthy();
  });
});
