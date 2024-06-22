import {
    getFirestore,
    addDoc,
    collection,
    query,
    where,
    orderBy,
    startAfter,
    limit,
    DocumentReference,
} from 'firebase/firestore'
import { useFirebaseApp } from "~/composables/useFirebase";

const {
    getList: getListFirestore,
    getItem: getItemFirestore,
    getReference: getReferenceFirestore,
    getFromReference: getFromReferenceFirestore,
    addItem: addItemFirestore,
    setItem: setItemFirestore,
    deleteItem: deleteItemFirestore
} = useFirestore();

type Params = {
    searchText: string,
    limit: number,
    before: any,
}
type Results = {
    list: any,
    listCount: number,
}

const collectionName: string = 'brands'

/**
 * Firestore へのアクセス
 */
export const useBrand = () => {
    const app = useFirebaseApp()

    const getList = async (params: Params) => {
        console.log('params', params)
        const db = getFirestore(app);
        if (typeof params.limit !== 'number' || params.limit < 0)
            throw new Error('express-paginate: `limit` is not a number >= 0');

        const coll = collection(db, collectionName);
        // let snapshot;
        let q = query(coll,
                orderBy("name"),
                startAfter(params.before),
                limit(params.limit));
        // snapshot = await getCountFromServer(query(coll));
        if(params.searchText != "") {
            q = query(q, where("name", "==", params.searchText));
            // snapshot = await getCountFromServer(query(coll, q));
        }
        const { list, listCount } = await getListFirestore(q);

        if (list.length) {
            return {
                list: list,
                listCount: listCount,
            } as Results
        }
        return {
            list: ['null'],
            listCount: 0,
        } as Results
    }

    const getItem = async (id: string) => {
        const snapshot = await getItemFirestore(collectionName, id);
        return snapshot;
    }

    const getReference = async (id: string) => {
        const ref = await getReferenceFirestore(collectionName, id);
        return ref;
    }

    const getFromReference = async (ref: DocumentReference) => {
        const doc = await getFromReferenceFirestore(ref);
        return doc
    }

    const addItem = async (params: any) => {
        const coll = await addItemFirestore(collectionName, params);
        return await addDoc(coll, params);
    }

    const setItem = async (id : string, params: any) => {
        return await setItemFirestore(collectionName, id, params);
    }

    const deleteItem = async (collectionName : string, id : string) => {
        return await deleteItemFirestore(collectionName, id);
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
