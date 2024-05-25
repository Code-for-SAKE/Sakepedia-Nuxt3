import {
    DocumentReference,
} from 'firebase/firestore'

export type Brand = {
    name: string,
    description: string,
    brewery: DocumentReference
}