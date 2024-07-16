import type { DocumentData, QueryDocumentSnapshot } from "firebase/firestore"
import { collection, query, where, orderBy } from "firebase/firestore"

const {
  db,
  getList: getListFirestore,
  getItem: getItemFirestore,
  addItem: addItemFirestore,
  setItem: setItemFirestore,
  deleteItem: deleteItemFirestore,
  getReference: getReferenceFirestore,
  getFromReference,
} = useFirestore()

const { converter: converterBrand } = useBrand()

const collectionName: string = "breweries"

export type Brewery = {
  id: string
  name: string
  prefecture: string
  location: {
    latitude: number
    longitude: number
  }
  createdAt: Date
  updatedAt: Date
}

export type BreweryParams = {
  searchText: string
  prefecture: string
  limit: number
  before: Brewery
}

export type BrandListParams = {
  breweryId: string
  searchText: string
  limit: number
  before: Brand
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
      createdAt: snapshot.data().createdAt?.toDate(),
      updatedAt: snapshot.data().updatedAt?.toDate(),
    }
  }

  const getList = async (params: BreweryParams) => {
    console.log("params", params)
    if (typeof params.limit !== "number" || params.limit < 0)
      throw new Error("express-paginate: `limit` is not a number >= 0")

    const coll = collection(db, collectionName)

    // let snapshot;
    let q = query(coll, orderBy("name"))
    // snapshot = await getCountFromServer(query(coll));
    if (params.searchText != "") {
      q = query(q, where("name", "==", params.searchText))
      // snapshot = await getCountFromServer(query(coll, q));
    }
    if (params.prefecture && params.prefecture != "0") {
      console.log("params.prefecture", params.prefecture)
      q = query(q, where("prefecture", "==", params.prefecture))
      // const snapshot = await getCountFromServer(q);
      // console.log(snapshot);
    }
    return await getListFirestore<Brewery>({
      query: q,
      limit: params.limit,
      before: params.before,
      converter,
    })
  }

  const getItem = async (id: string) => {
    const snapshot = await getItemFirestore(collectionName, id)
    return snapshot
  }

  const getBrandList = async (params: BrandListParams) => {
    console.log("BrandListParams", params)
    if (typeof params.limit !== "number" || params.limit < 0)
      throw new Error("express-paginate: `limit` is not a number >= 0")

    const coll = collection(db, collectionName, params.breweryId, "brands")
    // let snapshot;
    const q = query(coll, orderBy("name"))
    // snapshot = await getCountFromServer(query(coll));
    return await getListFirestore<Brand>({
      query: q,
      limit: params.limit,
      before: params.before,
      converter: converterBrand,
    })
  }

  const getReference = async (id: string) => {
    return await getReferenceFirestore(collectionName, id)
  }

  const addItem = async (params: Brewery) => {
    return await addItemFirestore(collectionName, params)
  }

  const setItem = async (id: string, params: Brewery) => {
    return await setItemFirestore(collectionName, id, params)
  }

  const deleteItem = async (id: string) => {
    return await deleteItemFirestore(collectionName, id)
  }

  return {
    getList,
    getItem,
    getBrandList,
    getReference,
    getFromReference,
    addItem,
    setItem,
    deleteItem,
    converter,
  }
}
