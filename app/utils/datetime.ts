import dayjs from "dayjs"
import { Timestamp } from "firebase/firestore"

export const datetime = (t:Date|Timestamp, format:string="YYYY/MM/DD HH:mm:ss"):string => {
    if(t instanceof Date)
        return dayjs(t).format(format)
    if(t instanceof Timestamp)
        return dayjs(t.toDate()).format(format)
    else
        return dayjs().format(format)
}
