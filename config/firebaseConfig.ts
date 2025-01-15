import { initializeApp } from "firebase/app";
import { connectFunctionsEmulator, getFunctions } from "firebase/functions";

const emulatorProjectId = "demo-project";
const firebaseConfig = {
  projectId: emulatorProjectId,
  apiKey: emulatorProjectId,
  authDomain: emulatorProjectId,
  storageBucket: emulatorProjectId,
  messagingSenderId: emulatorProjectId,
  appId: emulatorProjectId,
};

export const app = initializeApp(firebaseConfig);

export const functions = getFunctions(app);

connectFunctionsEmulator(functions, "127.0.0.1", 5001);
