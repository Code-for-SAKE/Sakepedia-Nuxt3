import type { DocumentData, DocumentSnapshot } from "firebase/firestore"
import { collection, query, where, orderBy } from "firebase/firestore"
import type { Data } from "./useFirestore"

const {
  db,
  getList: getListFirestore,
  getItem: getItemFirestore,
  addItem: addItemFirestore,
  setItem,
  deleteItem,
  getReference,
  getFromReference,
} = useFirestore()

const { converter: converterBrand } = useBrand()

const collectionName: string = "breweries"

export type Brewery = {
  breweryId: string
  name: string
  kana: string
  prefecture: string
  address: string
  location: {
    latitude: number
    longitude: number
  }
  email: string
  tel: string
  fax: string
  url: string
  ecurl: string
  facebook: string
  twitter: string
  instagram: string
  othersns: string
  visit: string
  tasting: string
  cafe: string
  shop: string
  otherBrewing: string
  startYear: number
  endYear: number
  createdAt: Date
  updatedAt: Date
}

export type BreweryParams = {
  searchText: string
  prefecture: string | undefined
  limit: number
  before: Brewery | undefined
}

export type BrandListParams = {
  breweryId: string
  searchText: string
  limit: number
  before: Brand | undefined
}

/**
 * Firestore へのアクセス
 */
export const useBrewery = () => {
  const converter = (snapshot: DocumentSnapshot<DocumentData, DocumentData>): Data<Brewery> => {
    return {
      path: snapshot.ref.path,
      id: snapshot.id,
      ref: snapshot.ref,
      data: {
        breweryId: snapshot.data()?.breweryId,
        name: snapshot.data()?.name,
        kana: snapshot.data()?.kana,
        address: snapshot.data()?.address,
        prefecture: snapshot.data()?.prefecture,
        location: snapshot.data()?.location,
        email: snapshot.data()?.email,
        tel: snapshot.data()?.tel,
        fax: snapshot.data()?.fax,
        url: snapshot.data()?.url,
        ecurl: snapshot.data()?.ecurl,
        facebook: snapshot.data()?.facebook,
        twitter: snapshot.data()?.twitter,
        instagram: snapshot.data()?.instagram,
        othersns: snapshot.data()?.othersns,
        visit: snapshot.data()?.visit,
        tasting: snapshot.data()?.tasting,
        cafe: snapshot.data()?.cafe,
        shop: snapshot.data()?.shop,
        otherBrewing: snapshot.data()?.otherBrewing,
        startYear: snapshot.data()?.startYear,
        endYear: snapshot.data()?.endYear,
        createdAt: snapshot.data()?.createdAt?.toDate(),
        updatedAt: snapshot.data()?.updatedAt?.toDate(),
      },
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

  const getItem = async (path: string) => {
    return await getItemFirestore(path, converter)
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

  const addItem = async (params: Brewery) => {
    return await addItemFirestore(`breweries`, params)
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
