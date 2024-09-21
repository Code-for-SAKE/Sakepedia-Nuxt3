import type {
  DocumentData,
  DocumentReference,
  DocumentSnapshot,
  Query,
  QueryDocumentSnapshot,
  WithFieldValue,
} from "firebase/firestore"
import {
  getFirestore,
  getCountFromServer,
  getDoc,
  setDoc,
  addDoc,
  deleteDoc,
  doc,
  collection,
  query,
  getDocs,
  limit,
  startAfter,
  collectionGroup,
} from "firebase/firestore"
import { useFirebaseApp } from "~/composables/useFirebase"

export type Data<T> = {
  id: string
  path: string
  ref: DocumentReference
  data: T
}

export type Params<T> = {
  query: Query
  limit: number
  before: T | undefined
  converter: Converter<T>
}
export type Results<T> = {
  list: Data<T>[]
  listCount: number
}

export type Converter<T> = (snapshot: DocumentSnapshot<DocumentData, DocumentData>) => Data<T>

/**
 * Firestore へのアクセス
 */
export const useFirestore = () => {
  const app = useFirebaseApp()
  const db = getFirestore(app)

  const getSummary = async () => {
    const brewery = await getCount(query(collection(db, "breweries")))
    const brand = await getCount(query(collectionGroup(db, "brands")))
    const sake = await getCount(query(collectionGroup(db, "sakes")))
    const user = await getCount(query(collection(db, "users")))
    const comment = await getCount(query(collection(db, "comments")))
    return { brewery, brand, sake, user, comment }
  }

  const getCount = async (q: Query) => {
    const listSnapshot = await getCountFromServer(q)
    return listSnapshot.data().count
  }

  const getList = async <T>(params: Params<T>) => {
    let q = params.query
    const listSnapshot = await getCountFromServer(q)
    if (params.before) {
      q = query(q, startAfter(params.before))
    }
    q = query(q, limit(params.limit))
    const querySnapshot = await getDocs(q)
    const listCount = listSnapshot.data().count
    console.log("listCount", listCount)

    const list: Data<T>[] = []
    querySnapshot.forEach((doc: QueryDocumentSnapshot<DocumentData, DocumentData>) => {
      list.push(params.converter(doc))
    })
    console.log("list.length", list.length)

    if (list.length) {
      return {
        list: list,
        listCount: listCount,
      } as Results<T>
    }
    return {
      list: [],
      listCount: listCount,
    } as Results<T>
  }

  const getItem = async <T>(path: string, converter: Converter<T>) => {
    const snapshot = await getDoc(doc(db, path))
    return converter(snapshot)
  }

  const getReference = async (path: string) => {
    //絶対パスとして受け取る
    const pathStr = path.startsWith("/") ? path : "/" + path
    const ref = doc(db, pathStr)
    return ref
  }

  const getFromReference = async (ref: DocumentReference) => {
    return getDoc(ref)
  }

  const addItem = async <T extends WithFieldValue<DocumentData>>(path: string, params: T) => {
    const coll = collection(db, path)
    const entries = Object.entries(params)
    for (const [key, _] of entries) {
      if (params[key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete params[key]
      }
    }
    return await addDoc(coll, params)
  }

  const setItem = async <T extends WithFieldValue<DocumentData>>(path: string, params: T) => {
    const entries = Object.entries(params)
    for (const [key, _] of entries) {
      if (params[key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete params[key]
      }
    }
    return await setDoc(doc(db, path), params)
  }

  const deleteItem = async (path: string) => {
    return await deleteDoc(doc(db, path))
  }

  return {
    db,
    getSummary,
    getCount,
    getList,
    getItem,
    getReference,
    getFromReference,
    addItem,
    setItem,
    deleteItem,
  }
}
