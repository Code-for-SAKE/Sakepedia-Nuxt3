import {
    getFirestore,
    getCountFromServer,
    getDoc,
    setDoc,
    addDoc,
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
    const getList = async (collectionName: string, params: Params) => {
        console.log('collectionName', collectionName)
        console.log('test')
        const db = getFirestore(app);
        console.log('params.limit', params.limit)
        console.log('params.before', params.before)
        if (typeof params.limit !== 'number' || params.limit < 0)
            throw new Error('express-paginate: `limit` is not a number >= 0');

        const coll = collection(db, collectionName);
        console.log('coll')
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


        console.log('snapshot', snapshot)

        const listCount = snapshot.data().count

        const querySnapshot = await getDocs(q)
        const list = querySnapshot.docs.map((doc: any) => {
            return doc.data()
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
        return (await getDoc(doc(db, collectionName, id))).data();
    }

    const getReference = async (ref: DocumentReference) => {
        const doc = await getDoc(ref)
        return doc.data()
    }

    const addItem = async (collectionName : string, params: any) => {
        const db = getFirestore(app);
        const coll = collection(db, collectionName);
        return await addDoc(coll, params);
    }

    return {
        getList,
        getItem,
        getReference,
        addItem,
    }
}
