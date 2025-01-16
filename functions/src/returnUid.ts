import { onCall, HttpsError } from "firebase-functions/v2/https";
import z from "zod";

const contextSchema = z.object({
  auth: z.object({ uid: z.string() }),
});
const dataSchema = z.object({ id: z.string() });
export const returnUid = onCall((initData, initContext) => {
  const contextParseResponse = contextSchema.safeParse(initContext);
  if (!contextParseResponse.success || !contextParseResponse.data.auth.uid) {
    throw new HttpsError("unauthenticated", "User must be authenticated");
  }

  const dataParseResponse = dataSchema.safeParse(initData);
  if (!dataParseResponse.success || !dataParseResponse.data.id) {
    throw new HttpsError("internal", "data id must be provided");
  }

  const uid = contextParseResponse.data?.auth?.uid;
  return { uid };
});
