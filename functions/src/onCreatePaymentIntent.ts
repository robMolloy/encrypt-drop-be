import { onDocumentCreated } from "firebase-functions/v2/firestore";
import admin from "firebase-admin";

admin.initializeApp();

export const onCreatePaymentIntent = onDocumentCreated(
  "paymentIntents/{id}",
  async (event) => {
    const newDocData = event.data?.data(); // Data of the created document
    const docId = event.params.id; // Document ID

    console.log(`New document created with ID: ${docId}`);

    if (newDocData) {
      try {
        // Example: Write to another Firestore collection
        await admin
          .firestore()
          .collection("processedPayments")
          .doc(docId)
          .set({
            ...newDocData, // Copy the original data
            processedAt: admin.firestore.FieldValue.serverTimestamp(), // Add a timestamp
          });

        console.log(
          "Data successfully written to 'processedPayments' collection"
        );
      } catch (error) {
        console.error("Error writing to Firestore:", error);
      }
    }
  }
);
