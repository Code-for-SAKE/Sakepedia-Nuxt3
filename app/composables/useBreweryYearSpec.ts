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
  makedBY: number | undefined
  aminoAcidContent: number[] | undefined
  alcoholContent: number[] | undefined
  sakeMeterValue: number[] | undefined
  acidity: number[] | undefined
  ricePolishingRate: number[] | undefined
  sakeYeast: string | undefined
  riceForMakingKoji: string | undefined
  sakeRiceExceptForKojiMaking: string | undefined
  bottledDate: Date | undefined
  sake: DocumentReference<DocumentData, DocumentData> | null
}

export type BreweryYearSpecParams = {
  sake?: Data<Sake> | null
  searchText: string
  limit: number
  before: Sake | undefined
}

const collectionName: string = "breweryYearSpecs"

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
        makedBY: snapshot.data()?.makedBY,
        aminoAcidContent: snapshot.data()?.aminoAcidContent
          ? [snapshot.data()?.aminoAcidContent[0], snapshot.data()?.aminoAcidContent[1]]
          : undefined,
        alcoholContent: snapshot.data()?.alcoholContent
          ? [snapshot.data()?.alcoholContent[0], snapshot.data()?.alcoholContent[1]]
          : undefined,
        sakeMeterValue: snapshot.data()?.sakeMeterValue
          ? [snapshot.data()?.sakeMeterValue[0], snapshot.data()?.sakeMeterValue[1]]
          : undefined,
        acidity: snapshot.data()?.acidity
          ? [snapshot.data()?.acidity[0], snapshot.data()?.acidity[1]]
          : undefined,
        ricePolishingRate: snapshot.data()?.ricePolishingRate
          ? [snapshot.data()?.ricePolishingRate[0], snapshot.data()?.ricePolishingRate[1]]
          : undefined,
        sakeYeast: snapshot.data()?.sakeYeast,
        bottledDate: snapshot.data()?.bottledDate,
        riceForMakingKoji: snapshot.data()?.riceForMakingKoji,
        sakeRiceExceptForKojiMaking: snapshot.data()?.sakeRiceExceptForKojiMaking,
        sake: snapshot.ref.parent.parent,
      },
    }
  }

  const getList = async (params: BreweryYearSpecParams) => {
    if (typeof params.limit !== "number" || params.limit < 0)
      throw new Error("express-paginate: `limit` is not a number >= 0")
    const coll = params.sake
      ? collection(db, `/${params.sake.path}/${collectionName}`)
      : collectionGroup(db, collectionName)
    let q = query(coll, orderBy("makedBY", "desc"))
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
      `breweries/${params.sake?.parent?.parent?.parent?.parent?.id}/brands/${params.sake?.parent?.parent?.id}/sakes/${params.sake!.id}/breweryYearSpecs`,
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
