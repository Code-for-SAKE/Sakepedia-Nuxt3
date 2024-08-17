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
  breweryId: string | undefined
  name: string
  kana: string
  prefecture: string | undefined
  address: string | undefined
  location: {
    latitude: number | undefined
    longitude: number | undefined
  }
  email: string | undefined
  tel: string | undefined
  fax: string | undefined
  url: string | undefined
  ecurl: string | undefined
  facebook: string | undefined
  twitter: string | undefined
  instagram: string | undefined
  othersns: string | undefined
  hasVisit: boolean
  visit: string | undefined
  hasTasting: boolean
  tasting: string | undefined
  hasCafe: boolean
  cafe: string | undefined
  hasShop: boolean
  shop: string | undefined
  hasOtherBrewing: boolean
  otherBrewing: string | undefined
  startYear: number | undefined
  endYear: number | undefined
  createdAt: Date | undefined
  updatedAt: Date | undefined
}

export type BreweryParams = {
  searchText: string
  prefecture: string | undefined
  limit: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  before: any | undefined
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
        hasVisit: snapshot.data()?.hasVisit,
        visit: snapshot.data()?.visit,
        hasTasting: snapshot.data()?.hasTasting,
        tasting: snapshot.data()?.tasting,
        hasCafe: snapshot.data()?.hasCafe,
        cafe: snapshot.data()?.cafe,
        hasShop: snapshot.data()?.hasShop,
        shop: snapshot.data()?.shop,
        hasOtherBrewing: snapshot.data()?.hasOtherBrewing,
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
