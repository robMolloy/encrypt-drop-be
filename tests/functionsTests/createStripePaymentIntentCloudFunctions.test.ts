import { fbTestUtils } from "@/utils/firebaseTestUtils";
import { RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { firebaseConfig } from "../config/firebaseConfig";
import { functionsSdk } from "../functionsSdk";

let testEnv: RulesTestEnvironment;

describe("firestore rules for a randomCollection", () => {
  beforeAll(async () => {
    fbTestUtils.setDefaultLogLevel();
    testEnv = await fbTestUtils.createTestEnvironment({
      projectId: firebaseConfig.projectId,
    });
  });
  beforeEach(async () => {
    // await testEnv.clearFirestore();
  });
  afterAll(async () => {
    // await testEnv.clearFirestore();
    await testEnv.cleanup();
  });
  it("should test that the createStripePaymentIntent cloud function returns a success response", async () => {
    const result2 = await functionsSdk.createStripePaymentIntent({ amount: 100, currency: "USD" });

    expect(result2.success).toBe(true);
  });
  it("should test that the createStripePaymentIntent cloud function returns a success response", async () => {
    const result2 = await functionsSdk.createStripePaymentIntentAndDoc({
      amount: 100,
      currency: "USD",
    });

    expect(result2.success).toBe(true);
  });
});
