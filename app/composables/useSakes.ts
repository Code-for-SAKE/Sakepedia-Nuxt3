import type { DocumentData, DocumentReference, DocumentSnapshot } from "firebase/firestore"
import { collectionGroup, query, where, orderBy, collection } from "firebase/firestore"
import type { Data } from "./useFirestore"

const {
  db,
  getList: getListFirestore,
  getItem: getItemFirestore,
  getReference,
  getFromReference,
  addItem: addItemFirestore,
  setItem,
  deleteItem,
} = useFirestore()

export type Sake = {
  name: string
  description: string
  brand: DocumentReference<DocumentData, DocumentData> | null
  brewery: DocumentReference<DocumentData, DocumentData> | null
}

export type SakeParams = {
  brandId?: string
  breweryId?: string
  searchText: string
  limit: number
  before: Sake | undefined
}

const collectionName: string = "sakes"

/**
 * Firestore へのアクセス
 */
export const useSake = () => {
  const converter = (snapshot: DocumentSnapshot<DocumentData, DocumentData>): Data<Sake> => {
    return {
      id: snapshot.id,
      path: snapshot.ref.path,
      ref: snapshot.ref,
      data: {
        name: snapshot.data()?.name,
        description: snapshot.data()?.description,
        brand: snapshot.ref.parent.parent,
        brewery: snapshot.ref.parent.parent?.parent.parent,
      },
    }
  }

  const getList = async (params: SakeParams) => {
    console.log("SakeParams", params)
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
    return await getListFirestore<Sake>({
      query: q,
      limit: params.limit,
      before: params.before,
      converter,
    })
  }

  const getItem = async (path: string) => {
    return await getItemFirestore(path, converter)
  }

  const addItem = async (params: Sake) => {
    return await addItemFirestore(
      `breweries/${params.brewery!.id}/brands/${params.brand!.id}/sakes`,
      params,
    )
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
