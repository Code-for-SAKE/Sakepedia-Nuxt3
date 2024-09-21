import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";

export const useStorage = () => {
    const app = useFirebaseApp();
    const storage = getStorage(app);

    const upload = async (path:string, data: Blob | Uint8Array | ArrayBuffer) => {
        const storageRef = ref(storage, path);
        return uploadBytes(storageRef, data)
    }

    const download = async (path:string) => {
        const storageRef = ref(storage, path);
        return getDownloadURL(storageRef)
    }

    const ImageFileType = {
        jpeg: "image/jpeg",
        jpg: "image/jpg",
        png: "image/png"
    }
    const getExt = (file:File) => {
        switch(file.type) {
            case ImageFileType.jpeg: return "jpeg";
            case ImageFileType.jpg: return "jpg";
            case ImageFileType.png: return "png";
            default: {
                const pos = file.name.lastIndexOf('.')
                return (pos === -1) ? "" : file.name.slice(pos + 1)
            }
        }
    }
    const getUniqueFileName = (file:File) => {
        const unique = Math.random().toString(32).substring(2)
        return `${unique}.${getExt(file)}`
    }

    return {
        storage,
        upload,
        download,
        getExt,
        getUniqueFileName
    }
}