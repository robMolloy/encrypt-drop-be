import adminImport from "firebase-admin";
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";
import { connectStorageEmulator, getStorage } from "firebase/storage";

const useEmulator = true;
const emulatorProjectId = "demo-project";
export const initFirebaseConfig = {
  apiKey: "AIzaSyCewPJhmBtpn6QWXhx2MRrtY7UxaOZfOW4",
  authDomain: "encryptdrop.firebaseapp.com",
  projectId: "encryptdrop",
  storageBucket: "encryptdrop.firebasestorage.app",
  messagingSenderId: "352557738491",
  appId: "1:352557738491:web:6cf71ea7f33e25475a835e",
};
export const emulatorFirebaseConfig = {
  projectId: emulatorProjectId,
  apiKey: emulatorProjectId,
  authDomain: emulatorProjectId,
  storageBucket: emulatorProjectId,
  messagingSenderId: emulatorProjectId,
  appId: emulatorProjectId,
};

export const firebaseConfig = useEmulator
  ? emulatorFirebaseConfig
  : initFirebaseConfig;
export const app = initializeApp(firebaseConfig);
adminImport.initializeApp(firebaseConfig);

export const admin = adminImport;

// export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const functions = getFunctions(app);

// connectAuthEmulator(auth, "http://127.0.0.1:9099");
connectFirestoreEmulator(db, "127.0.0.1", 8080);
connectStorageEmulator(storage, "127.0.0.1", 9199);
connectFunctionsEmulator(functions, "127.0.0.1", 5001);
