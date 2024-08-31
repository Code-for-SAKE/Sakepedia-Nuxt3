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

export type BreweryYearSpec = {
  name: string
  description: string
  makedBY: number | undefined | null
  brand: DocumentReference<DocumentData, DocumentData> | null
  brewery: DocumentReference<DocumentData, DocumentData> | null
  sake: DocumentReference<DocumentData, DocumentData> | null
}

export type BreweryYearSpecParams = {
  brandId?: string
  breweryId?: string
  sakeId?: string
  searchText: string
  limit: number
  before: Sake | undefined
}

const collectionName: string = "breweryYearSpec"

/**
 * Firestore へのアクセス
 */
export const useBreweryYearSpec = () => {
  const converter = (
    snapshot: DocumentSnapshot<DocumentData, DocumentData>,
  ): Data<BreweryYearSpec> => {
    return {
      id: snapshot.id,
      path: snapshot.ref.path,
      ref: snapshot.ref,
      data: {
        name: snapshot.data()?.name,
        description: snapshot.data()?.description,
        brand: snapshot.ref.parent.parent,
        brewery: snapshot.ref.parent.parent?.parent.parent,
        sake: snapshot.ref.parent.parent?.parent.parent,
      },
    }
  }

  const getList = async (params: BreweryYearSpecParams) => {
    console.log("BreweryYearSpecParams", params)
    if (typeof params.limit !== "number" || params.limit < 0)
      throw new Error("express-paginate: `limit` is not a number >= 0")
    const coll = params.sakeId
      ? collection(db, `breweries/${params.breweryId}/${collectionName}`)
      : collectionGroup(db, collectionName)
    // let snapshot;
    let q = query(coll, orderBy("name"))
    // snapshot = await getCountFromServer(query(coll));
    if (params.searchText != "") {
      q = query(q, where("name", "==", params.searchText))
      // snapshot = await getCountFromServer(query(coll, q));
    }
    return await getListFirestore<BreweryYearSpec>({
      query: q,
      limit: params.limit,
      before: params.before,
      converter,
    })
  }

  const getItem = async (path: string) => {
    return await getItemFirestore(path, converter)
  }

  const addItem = async (params: BreweryYearSpec) => {
    return await addItemFirestore(
      `breweries/${params.brewery!.id}/brands/${params.brand!.id}/sakes/${params.sake!.id}/breweryYearSpec`,
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
