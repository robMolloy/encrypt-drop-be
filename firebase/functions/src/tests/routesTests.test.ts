import { RulesTestEnvironment } from "@firebase/rules-unit-testing";
import Test from "firebase-functions-test";
import { firebaseConfig } from "../config/firebaseConfig";
import * as routes from "../routes";
import { fbTestUtils } from "./firebaseTestUtils";

let testEnv: RulesTestEnvironment;

const test = Test();

describe("firestore rules for a randomCollection", () => {
  beforeAll(async () => {
    fbTestUtils.setDefaultLogLevel();
    testEnv = await fbTestUtils.createTestEnvironment({ projectId: firebaseConfig.projectId });
  });
  beforeEach(async () => {
    // await testEnv.clearFirestore();
  });
  afterAll(async () => {
    // await testEnv.clearFirestore();
    await testEnv.cleanup();
  });
  it("should test that the createStripePaymentIntent cloud function returns a success response", async () => {
    const amount = 300;
    const currency = "USD";
    const uid = "test123";
    const wrappedCreateStripePaymentIntentAndDoc = test.wrap(
      routes.createStripePaymentIntentAndDoc
    );
    const result = await wrappedCreateStripePaymentIntentAndDoc({
      data: { amount, currency },
      // @ts-ignore
      auth: { uid },
    });
    expect(result.success).toBe(true);
    if (!result.success) return;
    expect(result.data.id).toBeDefined();
    expect(result.data.amount).toBe(amount);
    expect(result.data.currency.toLowerCase()).toBe(currency.toLowerCase());
  });
  // it("should test that the createStripePaymentIntentRouteHandler returns a success response", async () => {
  //   const result = await createStripePaymentIntentAndDocRouteHandler({
  //     admin,
  //     uid: "id123",
  //     amount: 300,
  //     currency: "USD",
  //   });

  //   expect(result.success).toBe(true);
  // });
});
