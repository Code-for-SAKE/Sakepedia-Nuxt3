import type {
    DocumentData,
    DocumentReference,
    Query,
    QueryDocumentSnapshot} from 'firebase/firestore';
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
    getDocs,
    limit,
    startAfter,
    collectionGroup,
} from 'firebase/firestore'
import { useFirebaseApp } from "~/composables/useFirebase";
export type Params<T> = {
    query: Query,
    limit: number,
    before: T | undefined,
    converter: Converter<T>,
}
export type Results<T> = {
    list: T[],
    listCount: number,
}

export type Converter<T> = (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>) => T


/**
 * Firestore へのアクセス
 */
export const useFirestore = () => {
    const app = useFirebaseApp()
    const db = getFirestore(app);

    const getSummary = async () => {
        const brewery = await getCount(query(collection(db, "breweries")));
        const brand = await getCount(query(collectionGroup(db, "brands")));
        const sake = await getCount(query(collectionGroup(db, "sakes")));
        const user = await getCount(query(collection(db, "users")));
        const comment = await getCount(query(collection(db, "comments")));
        return {brewery, brand, sake, user, comment}
    }

    const getCount = async (q: Query) => {
        const listSnapshot = await getCountFromServer(q);
        return listSnapshot.data().count
    }

    const getList = async <T>(params:Params<T>) => {
        let q = params.query;
        const listSnapshot = await getCountFromServer(q);
        if(params.before) {
            q = query(q, startAfter(params.before));
        }
        q = query(q, limit(params.limit));
        const querySnapshot = await getDocs(q)
        const listCount = listSnapshot.data().count
        console.log("listCount", listCount)

        const list: T[] = []
        querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
            list.push(params.converter(doc))
        })
        console.log("list.length", list.length)


        if (list.length) {
            return {
                list: list,
                listCount: listCount,
            } as Results<T>
        }
        return {
            list: [],
            listCount: listCount,
        } as Results<T>
    }

    const getItem = async (collectionName : string,id: string) => {
        const snapshot = await getDoc(doc(db, collectionName, id));
        return snapshot;
    }

    const getReference = async (collectionName : string,id: string) => {
        const ref = doc(db, collectionName, id);
        return ref;
    }

    const getFromReference = async (ref: DocumentReference) => {
        return doc
    }

    const addItem = async (collectionName : string, params: any) => {
        const coll = collection(db, collectionName);
        return await addDoc(coll, params);
    }

    const setItem = async (collectionName : string, id : string, params: any) => {
        return await setDoc(doc(db, collectionName, id), params);
    }

    const deleteItem = async (collectionName : string, id : string) => {
        return await deleteDoc(doc(db, collectionName, id));
    }


    return {
        db,
        getSummary,
        getCount,
        getList,
        getItem,
        getReference,
        getFromReference,
        addItem,
        setItem,
        deleteItem,
    }
}
