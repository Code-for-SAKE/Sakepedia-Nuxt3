import {
    getFirestore,
    getCountFromServer,
    getDoc,
    setDoc,
    addDoc,
    deleteDoc,
    doc,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    startAfter,
    limit,
    DocumentReference,
} from 'firebase/firestore'
import { useFirebaseApp } from "~/composables/useFirebase";
type Params = {
    searchText: string,
    limit: number,
    before: any,
}
type Results = {
    list: any,
    listCount: number,
}


/**
 * Firestore へのアクセス
 */
export const useFirestore = () => {
    const app = useFirebaseApp()
    const getList = async (q: query) => {
        const querySnapshot = await getDocs(q)
        const list = querySnapshot.docs.map((doc: any) => {
            return doc
        })
        if (list.length) {
            return {
                list: list,
                listCount: list.length,
            } as Results
        }
        return {
            list: ['null'],
            listCount: 0,
        } as Results
    }

    const getItem = async (collectionName : string,id: string) => {
        const db = getFirestore(app);
        const snapshot = await getDoc(doc(db, collectionName, id));
        return snapshot;
    }

    const getReference = async (collectionName : string,id: string) => {
        const db = getFirestore(app);
        const ref = doc(db, collectionName, id);
        return ref;
    }

    const getFromReference = async (ref: DocumentReference) => {
        const doc = await getDoc(ref)
        return doc
    }

    const addItem = async (collectionName : string, params: any) => {
        const db = getFirestore(app);
        const coll = collection(db, collectionName);
        return await addDoc(coll, params);
    }

    const setItem = async (collectionName : string, id : string, params: any) => {
        const db = getFirestore(app);
        return await setDoc(doc(db, collectionName, id), params);
    }

    const deleteItem = async (collectionName : string, id : string) => {
        const db = getFirestore(app);
        return await deleteDoc(doc(db, collectionName, id));
    }

    return {
        getList,
        getItem,
        getReference,
        getFromReference,
        addItem,
        setItem,
        deleteItem
    }
}
