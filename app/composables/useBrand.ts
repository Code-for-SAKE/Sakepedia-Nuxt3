import type {
    DocumentData,
    DocumentReference,
    DocumentSnapshot} from 'firebase/firestore';
import {
    collectionGroup,
    query,
    where,
    orderBy,
    collection,
} from 'firebase/firestore'

const {
    db,
    getList: getListFirestore,
    getItem: getItemFirestore,
    getItemFromPath,
    getReference: getReferenceFirestore,
    getFromReference,
    addItem: addItemFirestore,
    setItem: setItemFirestore,
    deleteItem: deleteItemFirestore
} = useFirestore();

export type Brand = {
    id: string,
    name: string,
    description: string,
    path: string,
    ref: DocumentReference<DocumentData, DocumentData>,
    brewery: DocumentReference<DocumentData, DocumentData> | null
}

export type BrandParams = {
    breweryId?: string,
    searchText: string,
    limit: number,
    before: Brand | undefined,
}

const collectionName: string = 'brands'

/**
 * Firestore へのアクセス
 */
export const useBrand = () => {
    const converter = (snapshot: DocumentSnapshot<DocumentData, DocumentData>) : Brand => {
        return {
            id: snapshot.id,
            name: snapshot.data()?.name,
            description: snapshot.data()?.description,
            path: snapshot.ref.path,
            ref: snapshot.ref,
            brewery: snapshot.ref.parent.parent,
        }
    }

    const getList = async (params: BrandParams) => {
        console.log('params', params)
        if (typeof params.limit !== 'number' || params.limit < 0)
            throw new Error('express-paginate: `limit` is not a number >= 0'); 
        const coll = (params.breweryId)
            ? collection(db, `breweries/${params.breweryId}/${collectionName}`)
            : collectionGroup(db, collectionName);
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
        if(snapshot){
            return converter(snapshot)
        }
        return null;
    }

    const getReference = async (id: string) => {
        return await getReferenceFirestore(collectionName, id);
    }

    const addItem = async (params: any) => {
        return await addItemFirestore(collectionName, params);
    }

    const setItem = async (id : string, params: any) => {
        return await setItemFirestore(collectionName, id, params);
    }

    const deleteItem = async (id : string) => {
        return await deleteItemFirestore(collectionName, id);
    }

    return {
        getList,
        getItem,
        getItemFromPath,
        getReference,
        getFromReference,
        addItem,
        setItem,
        deleteItem,
    }
}
