import type { DocumentData, DocumentReference, DocumentSnapshot } from "firebase/firestore"
import { collectionGroup, query, where, orderBy, collection } from "firebase/firestore"
import type { Data } from "./useFirestore"

const {
  db,
  getList: getListFirestore,
  getItem: getItemFirestore,
  getReference: getReferenceFirestore,
  getFromReference,
  addItem: addItemFirestore,
  setItem: setItemFirestore,
  deleteItem: deleteItemFirestore,
} = useFirestore()
  
export type Brand = {
  name: string
  description: string
  brewery: DocumentReference<DocumentData, DocumentData> | null
}

export type BrandParams = {
  breweryId?: string
  searchText: string
  limit: number
  before: Brand | undefined
}

const collectionName: string = "brands"

/**
 * Firestore へのアクセス
 */
export const useBrand = () => {
  const converter = (snapshot: DocumentSnapshot<DocumentData, DocumentData>): Data<Brand> => {
    return {
      id: snapshot.id,
      path: snapshot.ref.path,
      ref: snapshot.ref,
      data: {
        name: snapshot.data()?.name,
        description: snapshot.data()?.description,
        brewery: snapshot.ref.parent.parent,  
      }
    }
  }

  const getList = async (params: BrandParams) => {
    console.log("params", params)
    if (typeof params.limit !== "number" || params.limit < 0)
      throw new Error("express-paginate: `limit` is not a number >= 0")
    const coll = params.breweryId
      ? collection(db, `breweries/${params.breweryId}/${collectionName}`)
      : collectionGroup(db, collectionName)
    // let snapshot;
    let q = query(coll, orderBy("name"))
    // snapshot = await getCountFromServer(query(coll));
    if (params.searchText != "") {
      q = query(q, where("name", "==", params.searchText))
      // snapshot = await getCountFromServer(query(coll, q));
    }
    return await getListFirestore<Brand>({
      query: q,
      limit: params.limit,
      before: params.before,
      converter,
    })
  }

  const getItem = async (path: string) => {
    const snapshot = await getItemFirestore(path)
    if (snapshot) {
      return converter(snapshot)
    }
    return undefined
  }

  const getReference = async (path: string) => {
    return await getReferenceFirestore(path)
  }

  const addItem = async (params: Brand) => {
    return await addItemFirestore(`breweries/${params.brewery!.id}/brands`, params)
  }

  const setItem = async (path: string, params: Brand) => {
    return await setItemFirestore(path, params)
  }

  const deleteItem = async (path: string) => {
    return await deleteItemFirestore(path)
  }

  return {
    getList,
    getItem,
    getReference,
    getFromReference,
    addItem,
    setItem,
    deleteItem,
    converter,
  }
}
