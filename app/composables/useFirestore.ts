import {
    getFirestore,
    getCountFromServer,
    getDoc,
    doc,
    collection,
    query,
    where,
    getDocs,
    orderBy,
    startAfter,
    limit,
} from 'firebase/firestore'
import { useFirebaseApp } from "~/composables/useFirebase";
type Params = {
    searchText: string,
    limit: number,
    page: number,
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
        console.log('params.page', params.page)
        let ope: string = '>'
        if (params.searchText) {
            ope = 'in'
          }
        if (typeof params.limit !== 'number' || params.limit < 0)
            throw new Error('express-paginate: `limit` is not a number >= 0');

        if (Number.isNaN(params.page) || params.page < 0)
            throw new Error('express-paginate: `page` is not a number >= 0');

        const lastVisible: number = (params.page - 1) * params.limit
        console.log('lastVisible', lastVisible)

        const coll = collection(db, collectionName);
        console.log('coll')
        const snapshot = await getCountFromServer(query(coll, where("name", ope, params.searchText)));

        console.log('snapshot', snapshot)

        const listCount = snapshot.data().count

        const q = query(coll,
            where("name", ope, params.searchText),
            orderBy("name"),
            startAfter(lastVisible),
            limit(params.limit))

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

    return {
        getList,
    }
}
