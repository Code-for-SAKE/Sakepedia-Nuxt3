import type {
    DocumentData,
    DocumentReference,
    QueryDocumentSnapshot} from 'firebase/firestore';
import {
    addDoc,
    collectionGroup,
    query,
    where,
    orderBy,
} from 'firebase/firestore'

const {
    db,
    getList: getListFirestore,
    getItem: getItemFirestore,
    getReference: getReferenceFirestore,
    getFromReference: getFromReferenceFirestore,
    addItem: addItemFirestore,
    setItem: setItemFirestore,
    deleteItem: deleteItemFirestore
} = useFirestore();

export type Brand = {
    id: string,
    name: string
}

export type Params = {
    searchText: string,
    limit: number,
    before: Brand | undefined,
}

const collectionName: string = 'brands'

/**
 * Firestore へのアクセス
 */
export const useBrand = () => {
    const converter = (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>) : Brand => {
        return {
            id: snapshot.id,
            name: snapshot.data().name
        }
    }

    const getList = async (params: Params) => {
        console.log('params', params)
        if (typeof params.limit !== 'number' || params.limit < 0)
            throw new Error('express-paginate: `limit` is not a number >= 0');

        const coll = collectionGroup(db, collectionName);
        // let snapshot;
        let q = query(coll,
                orderBy("name"));
        // snapshot = await getCountFromServer(query(coll));
        if(params.searchText != "") {
            q = query(q, where("name", "==", params.searchText));
            // snapshot = await getCountFromServer(query(coll, q));
        }
        return await getListFirestore<Brand>({query: q, limit: params.limit, before: params.before, converter});
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
