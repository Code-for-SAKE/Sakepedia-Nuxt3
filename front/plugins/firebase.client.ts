import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
//import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
//import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getAuth, connectAuthEmulator } from "firebase/auth";
import { defineNuxtPlugin } from '#app';


export default defineNuxtPlugin(() => {
    const config = useRuntimeConfig();
    const firebaseConfig = {
      apiKey: config.public.firebaseApiKey,
      authDomain: config.public.firebaseAuthDomain,
      projectId: config.public.firebaseProjectId,
      storageBucket: config.public.firebaseStorageBucket,
      messagingSenderId: config.public.firebaseMessagingSenderId,
      appId: config.public.firebaseAppId,
      measurementId: config.public.firebaseMeasurementId
    };
    const app = initializeApp(firebaseConfig);
    const analytics = getAnalytics(app);

    const isEmulating = window.location.hostname === "localhost";
    if (isEmulating) {
        const auth = getAuth();
        connectAuthEmulator(auth, "http://localhost:9099");

        //const storage = getStorage();
        //connectStorageEmulator(storage, "localhost", 9199);

        //const db = getFirestore();
        //connectFirestoreEmulator(db, 'localhost', 8080); 

        const functions = getFunctions();
        connectFunctionsEmulator(functions, "localhost", 5001);
    }
});
