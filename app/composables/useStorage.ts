import { getStorage, ref, uploadBytes, getDownloadURL, uploadString, StringFormat } from "firebase/storage";

export const useStorage = () => {
  const app = useFirebaseApp()
  const storage = getStorage(app)

    const upload = async (path:string, data: string | Blob | Uint8Array | ArrayBuffer, type: string) => {
        const storageRef = ref(storage, path);
        const metadata = {
            contentType: type,
        };
        if(typeof data === 'string') {
            return uploadString(storageRef, data, StringFormat.DATA_URL, metadata)
        } else {
            return uploadBytes(storageRef, data, metadata)
        }
    }

  const download = async (path: string) => {
    const storageRef = ref(storage, path)
    return getDownloadURL(storageRef)
  }

    const ImageFileType = {
        jpeg: "image/jpeg",
        jpg: "image/jpg",
        png: "image/png",
        webp: "image/webp"
    }
    const getExt = (file:File, type:string|undefined) => {
        switch(type ?? file.type) {
            case ImageFileType.jpeg: return "jpeg";
            case ImageFileType.jpg: return "jpg";
            case ImageFileType.png: return "png";
            case ImageFileType.webp: return "webp";
            default: {
                const pos = file.name.lastIndexOf('.')
                return (pos === -1) ? "" : file.name.slice(pos + 1)
            }
        }
    }
    const getUniqueFileName = (file:File, type:string|undefined) => {
        const unique = Math.random().toString(32).substring(2)
        return `${unique}.${getExt(file, type)}`
    }
  
  return {
    storage,
    upload,
    download,
    getExt,
    getUniqueFileName,
  }
}
