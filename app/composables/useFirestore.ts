import {
    getFirestore,
    getCountFromServer,
    getDoc,
    setDoc,
    addDoc,
    deleteDoc,
    doc,
    collection,
    collectionGroup,
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
    const db = getFirestore(app);

    const getList = async (collectionName: string, params: Params, isSub: boolean = false) => {
        if (typeof params.limit !== 'number' || params.limit < 0)
            throw new Error('express-paginate: `limit` is not a number >= 0');

        const coll = isSub ? collectionGroup(db, collectionName) : collection(db, collectionName);
        let snapshot;
        let q;
        if(params.searchText != "") {
            snapshot = await getCountFromServer(query(coll, where("name", "==", params.searchText)));
            q = query(coll,
                orderBy("name"),
                where("name", "==", params.searchText),
                startAfter(params.before),
                limit(params.limit))
        }else{
            snapshot = await getCountFromServer(query(coll));
            q = query(coll,
                orderBy("name"),
                startAfter(params.before),
                limit(params.limit))
        }

        const listCount = snapshot.data().count

        const querySnapshot = await getDocs(q)
        const list = []
        querySnapshot.forEach((doc: any) => {
            list.push(doc)
        })
        if (list.length) {
            return {
                list: list,
                listCount: listCount,
            } as Results
        }
        return {
            list: [],
            listCount: 0,
        } as Results
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

        const entries = Object.entries(params)
        for (const [key, value] of entries) {
            if (params[key] === undefined) {
                delete params[key]
            }
        }
        return await addDoc(coll, params);
    }

    const setItem = async (collectionName : string, id : string, params: any) => {
        return await setDoc(doc(db, collectionName, id), params);
    }

    const deleteItem = async (collectionName : string, id : string) => {
        return await deleteDoc(doc(db, collectionName, id));
    }


    return {
        getList,
        getItem,
        getReference,
        getFromReference,
        addItem,
        setItem,
        deleteItem,
    }
}
