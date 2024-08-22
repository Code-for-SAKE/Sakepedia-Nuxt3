import type { DocumentData, DocumentReference, DocumentSnapshot } from "firebase/firestore"
import { query, where, orderBy, collection } from "firebase/firestore"
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

export type Post = {
  brewery: DocumentReference<DocumentData, DocumentData> | null
  brand: DocumentReference<DocumentData, DocumentData> | null
  sake: DocumentReference<DocumentData, DocumentData> | null
  comment: string
  image: string
  mariages: string[]
}

export type PostParams = {
  breweryId?: string
  brandId?: string
  sakeId?: string
  searchText: string
  limit: number
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  before: any | undefined
}

const collectionName: string = "posts"

/**
 * Firestore へのアクセス
 */
export const usePost = () => {
  const converter = (snapshot: DocumentSnapshot<DocumentData, DocumentData>): Data<Post> => {
    return {
      id: snapshot.id,
      path: snapshot.ref.path,
      ref: snapshot.ref,
      data: {
        brewery: snapshot.data()?.brewery,
        brand: snapshot.data()?.brand,
        sake: snapshot.data()?.sake,
        comment: snapshot.data()?.comment,
        image: snapshot.data()?.image,
        mariages: snapshot.data()?.mariages,
      },
    }
  }

  const getList = async (params: PostParams) => {
    console.log("params", params)
    if (typeof params.limit !== "number" || params.limit < 0)
      throw new Error("express-paginate: `limit` is not a number >= 0")
    const coll = collection(db, collectionName)
    // let snapshot;
    let q = query(coll, orderBy("brewery"))
    if (params.searchText != "") {
      q = query(q, where("comment", "==", params.searchText))
    }
    if (params.sakeId) {
      const ref = await getReference(
        `/breweries/${params.breweryId}/brands/${params.brandId}/sakes/${params.sakeId}`,
      )
      q = query(q, where("sake", "==", ref))
    } else if (params.brandId) {
      const ref = await getReference(`/breweries/${params.breweryId}/brands/${params.brandId}`)
      q = query(q, where("brand", "==", ref))
    } else if (params.breweryId) {
      const ref = await getReference(`/breweries/${params.breweryId}`)
      q = query(q, where("brewery", "==", ref))
    }
    return await getListFirestore<Post>({
      query: q,
      limit: params.limit,
      before: params.before,
      converter,
    })
  }

  const getItem = async (path: string) => {
    return await getItemFirestore(path, converter)
  }

  const addItem = async (params: Post) => {
    return await addItemFirestore(collectionName, params)
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
