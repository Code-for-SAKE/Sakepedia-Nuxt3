import type { RouteLocationNormalized } from "vue-router"

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const localePath = useLocalePath()
  // loginページの場合なにもしません
  if (localePath(to.path, "ja") == "/login") return

  // 追加、更新系でなければ権限は不要
  if (!to.path.endsWith("add") && !to.path.endsWith("update")) return

  const { checkAuthState, currentUser } = useAuth()
  await checkAuthState()

  // currentUserがなければログインページにリダイレクト
  if (!currentUser.value)
    return await navigateTo(
      { path: localePath("/login"), query: { redirect: to.fullPath } },
      { replace: true },
    )
})
