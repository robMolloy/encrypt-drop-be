import { RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { admin } from "../config/adminFirebaseInitialisations";
import { firebaseConfig } from "../config/firebaseConfig";
import { createStripePaymentIntentAndDocRouteHandler } from "../routes/routeHandlers/createStripePaymentIntentAndDocRouteHandler.ts";
import * as routes from "../routes";
import { fbTestUtils } from "./firebaseTestUtils";
import Test from "firebase-functions-test";

let testEnv: RulesTestEnvironment;

const test = Test();

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
    const userData = { uid: "test123" };
    const wrapped = test.wrap(routes.createStripePaymentIntentAndDoc);
    // @ts-ignore
    const result = await wrapped({ data: { amount: 300, currency: "USD" } }, { auth: userData });
    console.log(`routesTests.ts:${/*LL*/ 33}`, { result });
  });
  it("should test that the createStripePaymentIntentRouteHandler returns a success response", async () => {
    const result = await createStripePaymentIntentAndDocRouteHandler({
      admin,
      uid: "id123",
      amount: 300,
      currency: "USD",
    });

    expect(result.success).toBe(true);
  });
});
