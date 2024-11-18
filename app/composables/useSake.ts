import type { DocumentData, DocumentReference, DocumentSnapshot } from "firebase/firestore"
import {
  collectionGroup,
  query,
  where,
  orderBy,
  collection,
  documentId,
  doc,
  getDoc,
} from "firebase/firestore"
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
  subname: string
  type: string[]
  mariages: string[]
  url: string
  description: string
  brand: DocumentReference<DocumentData, DocumentData> | null | undefined
  brewery: DocumentReference<DocumentData, DocumentData> | null | undefined
}

export type SakeParams = {
  brandId?: string
  breweryId?: string
  sakeId?: string
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
        subname: snapshot.data()?.subname,
        type: snapshot.data()?.type,
        mariages: snapshot.data()?.mariages,
        description: snapshot.data()?.description,
        url: snapshot.data()?.url,
        brand: snapshot.ref.parent.parent,
        brewery: snapshot.ref.parent.parent?.parent.parent,
      },
    }
  }

  const getList = async (params: SakeParams) => {
    console.log("SakeParams", params)
    if (typeof params.limit !== "number" || params.limit < 0)
      throw new Error("express-paginate: `limit` is not a number >= 0")
    const coll =
      params.breweryId && params.brandId
        ? collection(db, `breweries/${params.breweryId}/brands/${params.brandId}/${collectionName}`)
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

  const moveItem = async (
    sakePath: string,
    breweryPath: string,
    brandPath: string,
    params: Sake,
  ) => {
    const _params = params

    await addItemFirestore(`${brandPath}/sakes`, _params)

    await deleteItem(sakePath)
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
    moveItem,
  }
}
