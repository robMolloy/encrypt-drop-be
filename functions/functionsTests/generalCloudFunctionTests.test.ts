import { httpsCallable } from "firebase/functions";
import { functions } from "../../config/firebaseConfig";

const helloWorld = httpsCallable(functions, "helloWorld");

describe("firestore rules for a randomCollection", () => {
  it("should test that the hello world cloud function exists", async () => {
    const result = await helloWorld();
    expect(result.data).toBe("Hello from Firebase!");
  });
});
