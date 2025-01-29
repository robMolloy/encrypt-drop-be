import { fbTestUtils } from "@/utils/firebaseTestUtils";
import { RulesTestEnvironment } from "@firebase/rules-unit-testing";
import { firebaseConfig } from "../config/firebaseConfig";
import { functionsSdk } from "../functionsSdk/functionsSdk";

let testEnv: RulesTestEnvironment;

describe("firestore rules for a randomCollection", () => {
  beforeAll(async () => {
    fbTestUtils.setDefaultLogLevel();
    testEnv = await fbTestUtils.createTestEnvironment({
      projectId: firebaseConfig.projectId,
    });
  });
  beforeEach(async () => {
    await testEnv.clearFirestore();
  });
  afterAll(async () => {
    await testEnv.clearFirestore();
    await testEnv.cleanup();
  });
  it("should test that the hello world cloud function exists", async () => {
    const result2 = await functionsSdk.helloWorld();

    expect(result2.success).toBe(true);
    if (!result2.success) return;

    expect(result2.data).toBe("Hello from Firebase!");
  });
});
