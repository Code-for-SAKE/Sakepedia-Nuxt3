import { initializeApp, getApps } from 'firebase/app';
import type { FirebaseApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import { getFunctions, connectFunctionsEmulator } from "firebase/functions";
import { getFirestore, connectFirestoreEmulator, setDoc, doc } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

export const useFirebaseApp = (): FirebaseApp => {
    console.log("useFirebase")
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
    let app: FirebaseApp;
    if (!getApps().length) {
        console.log("initializeApp")
        app = initializeApp(firebaseConfig);
        const isEmulating = config.isEmulating ?? window.location.hostname == 'localhost';
        if (isEmulating) {
            const auth = getAuth();
            connectAuthEmulator(auth, "http://localhost:9099");

            //const storage = getStorage();
            //connectStorageEmulator(storage, "localhost", 9199);

            const db = getFirestore(app);
            connectFirestoreEmulator(db, 'localhost', 8080);
            // 酒蔵
            setDoc(doc(db, "breweries", "60638e8e8d83689315fb5c1f"), {
                name: "田中酒造",
                kana: "たなかしゅぞう",
                prefecture: "1",
                address: "北海道小樽市色内３丁目２−５"
            });
            setDoc(doc(db, "breweries", "60638e8d8d83689315fb588b"), {
                name: "EH酒造",
                kana: "いえいちしゅぞう",
                prefecture: "20",
                address: "長野県安曇野市豊科高家1090－1"
            });
            setDoc(doc(db, "breweries", "60638e8e8d83689315fb5d23"), {
                name: "桝田酒造店",
                kana: "ますだしゅぞうてん",
                prefecture: "",
                address: "富山県富山市東岩瀬町269"
            });
            // 銘柄
            setDoc(doc(db, "brands", "60638ea4a5c0139ca764747f"), {
                name: "小樽の貴醸酒",
                brewery: doc(db, "breweries", "60638e8e8d83689315fb5d23"),
                description: ""
            });
            setDoc(doc(db, "brands", "60638ea4a5c0139ca7647480"), {
                name: "亀甲蔵大吟醸",
                brewery: doc(db, "breweries", "60638e8e8d83689315fb5c1f"),
                description: ""
            });
            setDoc(doc(db, "brands", "60638ea4a5c0139ca7647485"), {
                name: "大雪乃蔵",
                brewery: doc(db, "breweries", "60638e8e8d83689315fb5d23"),
                description: ""
            });
            setDoc(doc(db, "brands", "657e9c887da36bdc3c145f42"), {
                name: "満寿泉",
                brewery: doc(db, "breweries", "60638e8e8d83689315fb5c1f"),
                description: "岩瀬では「岩泉」という銘柄で始めたが、港の芸者衆にも飲んでもらう為、昭和の始め頃今で言う 別ブランド展開で苗字の桝田にちなんだ｢満寿泉｣というまことにめでたい名をつけ販売した。 それが成功し、現在は「満寿泉」が主力ブランドになった。"
            });
            // 日本酒
            setDoc(doc(db, "sakes", "657e9d9b7da36bdc3c146004"), {
                name: "濃醇原酒「酔」",
                brewery: doc(db, "breweries", "60638e8e8d83689315fb5d23"),
                brand: doc(db, "brands", "657e9c887da36bdc3c145f42"),
                description: "満寿泉の中で一番個性派で濃厚、飲み手を選ぶお酒。"
            });
            setDoc(doc(db, "sakes", "6270d0aba61c674723a05247"), {
                name: "刈穂六舟吟醸酒",
                brewery: doc(db, "breweries", "60638e8d8d83689315fb593a"),
                brand: doc(db, "brands", "60638ea5a5c0139ca7647531"),
                description: ""
            });

            const functions = getFunctions(app);
            connectFunctionsEmulator(functions, "localhost", 5001);
        }

    } else {
        app = getApps()[0];
    }

    return app;
}