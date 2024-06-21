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
    prefecture: number,
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
export const useBrewery = () => {
    const collectionName: string = 'breweries'
    const app = useFirebaseApp()

    const getList = async (params: Params) => {
        console.log('params', params)
        const db = getFirestore(app);
        if (typeof params.limit !== 'number' || params.limit < 0)
            throw new Error('express-paginate: `limit` is not a number >= 0');

        const coll = collection(db, collectionName);
        // var coll = db.collection(collectionName);
        let snapshot;
        let q;
        // q = coll.orderBy("name").startAfter(params.before).limit(params.limit)
        // if(params.searchText != "") {
        //     q.where("name", "==", params.searchText)
        // }

        q = query(coll,
                orderBy("name"),
                startAfter(params.before),
                limit(params.limit));
        snapshot = await getCountFromServer(query(coll));
        if(params.searchText != "") {
            q = query(q, where("name", "==", params.searchText));
            snapshot = await getCountFromServer(query(coll, q));
        }
        if(params.prefecture != 0) {
            q = query(q, where("prefecture", "==", params.prefecture));
            snapshot = await getCountFromServer(query(coll, q));
        }


        // if(params.searchText != "") {
        //     snapshot = await getCountFromServer(query(coll, where("name", "==", params.searchText)));
        //     q = query(coll,
        //         orderBy("name"),
        //         where("name", "==", params.searchText),
        //         startAfter(params.before),
        //         limit(params.limit))
        // }else{
        //     snapshot = await getCountFromServer(query(coll));
        //     q = query(coll,
        //         orderBy("name"),
        //         startAfter(params.before),
        //         limit(params.limit))
        // }

        const listCount = snapshot.data().count

        const querySnapshot = await getDocs(q)
        const list = querySnapshot.docs.map((doc: any) => {
            return doc
        })
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
