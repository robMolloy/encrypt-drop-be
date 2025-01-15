import { httpsCallable } from "firebase/functions";
import { functions } from "../config/firebaseConfig";

const helloWorld = httpsCallable(functions, "helloWorld");

describe("firestore rules for a randomCollection", () => {
  it("should test that the hello world cloud function exists", async () => {
    const result = await helloWorld({});
    console.log(`generalCloudFunctionTests.test.ts:${/*LL*/ 16}`, { result });
    expect(true).toBe(true);
  });
});
