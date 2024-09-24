import { initializeApp, getApps } from "firebase/app"
import type { FirebaseApp } from "firebase/app"
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getStorage, connectStorageEmulator } from "firebase/storage"

export const useFirebaseApp = (): FirebaseApp => {
  console.log("useFirebase")
  const config = useRuntimeConfig()
  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId,
  }
  let app: FirebaseApp
  if (!getApps().length) {
    app = initializeApp(firebaseConfig)
    const isEmulating = config.isEmulating ?? window.location.hostname == "localhost"
    if (isEmulating) {
      const auth = getAuth()
      connectAuthEmulator(auth, "http://localhost:9099")

      //const storage = getStorage();
      //connectStorageEmulator(storage, "localhost", 9199);

      const db = getFirestore(app)
      connectFirestoreEmulator(db, "localhost", 8080)

      const functions = getFunctions(app)
      connectFunctionsEmulator(functions, "localhost", 5001)

      const storage = getStorage()
      connectStorageEmulator(storage, "localhost", 9199)
    }
  } else {
    app = getApps()[0]
  }

  return app
}
