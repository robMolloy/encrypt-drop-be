import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { fbTestUtils } from "@/utils/firebaseTestUtils";
import { RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { firebaseConfig } from "../config/firebaseConfig";
import { functionsSdk } from "../functionsSdk";
import { auth } from "@/config/firebaseInitialisations";

let testEnv: RulesTestEnvironment;

describe("firestore rules for a randomCollection", () => {
  beforeAll(async () => {
    fbTestUtils.setDefaultLogLevel();
    testEnv = await fbTestUtils.createTestEnvironment({
      projectId: firebaseConfig.projectId,
    });
    await createUserWithEmailAndPassword(auth, "test@test.com123", "test123");
  });
  beforeEach(async () => {
    // await testEnv.clearFirestore();
  });
  afterAll(async () => {
    // await testEnv.clearFirestore();
    await testEnv.cleanup();
  });
  // it("should test that the createStripePaymentIntent cloud function returns a success response", async () => {
  //   await signInWithEmailAndPassword(auth, "test@test.com", "test123");
  //   const result2 = await functionsSdk.createStripePaymentIntentAndDoc({
  //     amount: 100,
  //     currency: "USD",
  //   });

  //   expect(result2.success).toBe(true);
  // });
  it("should test that the createStripePaymentIntent cloud function returns a success response", async () => {
    await signInWithEmailAndPassword(auth, "test@test.com", "test123");
    const result2 = await functionsSdk.createStripePaymentIntent({
      amount: 100,
      currency: "USD",
    });
    console.log(`createStripePaymentIntentCloudFunctions.test.ts:${/*LL*/ 36}`, { result2 });
    expect(result2.success).toBe(true);
  });
});
