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

const { converter: converterSake } = useSake()

export type Brand = {
  name: string
  description: string
  brewery: DocumentReference<DocumentData, DocumentData> | null
}

export type BrandParams = {
  breweryId?: string
  searchText: string
  limit: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  before: any | undefined
}

export type SakeListParams = {
  brandPath: string
  searchText: string
  limit: number
  before: Sake | undefined
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
      },
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
    return await getItemFirestore(path, converter)
  }

  const addItem = async (params: Brand) => {
    return await addItemFirestore(`breweries/${params.brewery!.id}/brands`, params)
  }

  const getSakeList = async (params: SakeListParams) => {
    console.log("SakeListParams", params)
    if (typeof params.limit !== "number" || params.limit < 0)
      throw new Error("express-paginate: `limit` is not a number >= 0")

    const coll = collection(db, params.brandPath, "sakes")
    // let snapshot;
    const q = query(coll, orderBy("name"))
    // snapshot = await getCountFromServer(query(coll));
    return await getListFirestore<Brand>({
      query: q,
      limit: params.limit,
      before: params.before,
      converter: converterSake,
    })
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
    getSakeList,
  }
}
