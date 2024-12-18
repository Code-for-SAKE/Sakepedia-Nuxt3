import dayjs from "dayjs"
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
  updateDoc,
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
  createdAt?: Date | undefined
  createdUser?: Editor | undefined
  updatedAt?: Date | undefined
  updatedUser?: Editor | undefined
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

const SEC_IN_HOUR = 3600 * 1000
const DEFAULT_CACHE_EXPIRE = 10 * 24 * SEC_IN_HOUR  // 10日間

/**
 * Firestore へのアクセス
 */
export const useFirestore = () => {
  const app = useFirebaseApp()
  const db = getFirestore(app)
  const user = useUser()

  const _converterDateUser = <T>(snapshot: DocumentSnapshot<DocumentData, DocumentData>, data: Data<T>) => {
    data.createdAt = snapshot.data()?.createdAt?.toDate()
    data.createdUser = snapshot.data()?.createdUser
    data.updatedAt = snapshot.data()?.updatedAt?.toDate()
    data.updatedUser = snapshot.data()?.updatedUser
    return data
  }  

  const getSummary = async () => {
    const brewery = await getCount(query(collection(db, "breweries")))
    const brand = await getCount(query(collectionGroup(db, "brands")))
    const sake = await getCount(query(collectionGroup(db, "sakes")))
    const breweryYearSpec = await getCount(query(collectionGroup(db, "breweryYearSpecs")))
    const post = await getCount(query(collection(db, "posts")))
    return { brewery, brand, sake, breweryYearSpec, post }
  }

  const getCount = async (q: Query) => {
    const listSnapshot = await getCountFromServer(q)
    return listSnapshot.data().count
  }

  /// キャッシュを取得 キャッシュが有効期限を切れていれば再作成
  const getCache = async <T>(path: string, params:Params<T>, expire: number = DEFAULT_CACHE_EXPIRE) => {
    const snapshot = await getDoc(doc(db, path))
    const list: Data<T>[] = snapshot.data()?.list as Data<T>[]
    const updatedAt = snapshot.data()?.updatedAt?.toDate()
    
    const diff = dayjs().diff(updatedAt)
    console.log("diff expire", diff, expire)

    if(updatedAt == undefined || diff > expire){
      console.log("created cache")
      getList(params).then((datas)=>{
        setItem(path, {list: datas.list}, true)
      })
    }
    return list
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
      list.push(_converterDateUser(doc, params.converter(doc)))
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
    return _converterDateUser(snapshot, converter(snapshot))
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
    params.createdAt = params.createdAt ?? new Date()
    params.updatedAt = params.updatedAt ?? new Date()
    params.createdUser = params.createdUser ?? useEditor(user.value)
    params.updatedUser = params.updatedUser ?? useEditor(user.value)
    return await addDoc(coll, params)
  }

  const setItem = async <T extends WithFieldValue<DocumentData>>(path: string, params: T, isNew?: boolean) => {
    const entries = Object.entries(params)
    for (const [key, _] of entries) {
      if (params[key] === undefined) {
        // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
        delete params[key]
      }
    }
    params.updatedAt = params.updatedAt ?? new Date()
    params.updatedUser = params.updatedUser ?? useEditor(user.value)
    if(isNew){
      return await setDoc(doc(db, path), params)
    }else{
      return await updateDoc(doc(db, path), params)
    }
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
    getCache,
    getReference,
    getFromReference,
    addItem,
    setItem,
    deleteItem,
  }
}
