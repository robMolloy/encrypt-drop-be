import { onCall } from "firebase-functions/v2/https";

export const helloWorld = onCall(() => {
  return { success: true, data: "Hello from Firebase!" };
});
