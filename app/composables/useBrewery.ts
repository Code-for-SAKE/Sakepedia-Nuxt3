import {
    addDoc,
    collection,
    query,
    where,
    orderBy,
    DocumentReference,
    QueryDocumentSnapshot,
    type DocumentData,
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

const collectionName: string = 'breweries'

type Brewery = {
    id: string,
    name: string,
    prefecture: number,
    location: {
        latitude: number,
        longitude: number
    }
}

export type ListParams = {
    searchText: string,
    prefecture: number,
    limit: number,
    before: any,
}

export type BrandListParams = {
    breweryId: string,
    searchText: string,
    limit: number,
    before: any,
}


/**
 * Firestore へのアクセス
 */
export const useBrewery = () => {

    const converter = (snapshot: QueryDocumentSnapshot<DocumentData, DocumentData>): Brewery => {
        return {
            id: snapshot.id,
            name: snapshot.data().name,
            prefecture: snapshot.data().prefecture,
            location: snapshot.data().location,
        }
    }

    const getList = async (params: ListParams) => {
        console.log('params', params)
        if (typeof params.limit !== 'number' || params.limit < 0)
            throw new Error('express-paginate: `limit` is not a number >= 0');

        const coll = collection(db, collectionName);
        // let snapshot;
        let q = query(coll,
            orderBy("name"));
        // snapshot = await getCountFromServer(query(coll));
        if (params.searchText != "") {
            q = query(q, where("name", "==", params.searchText));
            // snapshot = await getCountFromServer(query(coll, q));
        }
        if (params.prefecture && params.prefecture != 0) {
            console.log('params.prefecture', params.prefecture)
            q = query(q, where("prefecture", "==", params.prefecture));
            // snapshot = await getCountFromServer(query(coll, q));
        }
        return await getListFirestore<Brewery>({ query: q, limit: params.limit, before: params.before, converter });
    }

    const getItem = async (id: string) => {
        const snapshot = await getItemFirestore(collectionName, id);
        return snapshot;
    }

    const getBrandList = async (params: BrandListParams) => {
        console.log('BrandListParams', params)
        if (typeof params.limit !== 'number' || params.limit < 0)
            throw new Error('express-paginate: `limit` is not a number >= 0');

        const coll = collection(db, collectionName, params.breweryId, 'brands');
        // let snapshot;
        let q = query(coll,
            orderBy("name"));
        // snapshot = await getCountFromServer(query(coll));
        return await getListFirestore<Brand>({ query: q, limit: params.limit, before: params.before, converter });
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

    const setItem = async (id: string, params: any) => {
        return await setItemFirestore(collectionName, id, params);
    }

    const deleteItem = async (collectionName: string, id: string) => {
        return await deleteItemFirestore(collectionName, id);
    }

    return {
        getList,
        getItem,
        getBrandList,
        getReference,
        getFromReference,
        addItem,
        setItem,
        deleteItem
    }
}
