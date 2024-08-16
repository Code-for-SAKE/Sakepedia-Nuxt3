import {
  getAuth,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup,
  type User,
} from "firebase/auth"

export const useUser = (): globalThis.Ref<User | null> => useState<User | null>(() => null)

type Auth = {
  currentUser: globalThis.Ref<User | null>
  signIn: () => Promise<void>
  signOut: () => Promise<void>
  checkAuthState: () => Promise<void>
}

export const useAuth = (): Auth => {
  const currentUser = useUser()
  const app = useFirebaseApp()
  const route = useRoute()

  const authRedirect = () => {
    if (route.query.redirect) {
      navigateTo(`${route.query.redirect}`)
    }
  }
  const signIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      const auth_1 = await signInWithPopup(getAuth(app), provider)
      console.log("login", auth_1.user)
      currentUser.value = auth_1.user
      authRedirect()
    } catch (error) {
      const errorCode = error.code
      const errorMessage = error.message
      console.log("faild to login", errorCode, errorMessage)
      currentUser.value = null
    }
  }

  const signOut = async (): Promise<void> => {
    const auth = getAuth(app)
    await firebaseSignOut(auth)
    currentUser.value = null
  }

  const checkAuthState = async (): Promise<void> => {
    // serverからは利用できなくします
    if (import.meta.server) return
    return new Promise((resolve) => {
      const auth = getAuth(app)
      onAuthStateChanged(auth, async (user) => {
        currentUser.value = user
        resolve()
      })
    })
  }

  return {
    signIn,
    signOut,
    currentUser,
    checkAuthState,
  }
}
