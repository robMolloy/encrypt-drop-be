import admin from "firebase-admin";
import Test from "firebase-functions-test";
import { returnUid } from "../src/returnUid";

const test = Test();
admin.initializeApp();

describe("returnUid cloud function rule test", () => {
  it("should test that returnUid cloud function exists", async () => {
    const userData = { uid: "test123" };
    const wrapped = test.wrap(returnUid);
    // @ts-ignore
    const result = await wrapped({ id: "asd" }, { auth: userData });

    expect(result.uid).toBe(userData.uid);
  });
});
