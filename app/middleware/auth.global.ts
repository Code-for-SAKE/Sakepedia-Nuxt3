import type { RouteLocationNormalized } from "vue-router";

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  // loginページの場合なにもしません
  if(to.path == '/login') return;

  if(!to.path.endsWith('add') && !to.path.endsWith('update')) return;

  const { checkAuthState, currentUser } = useAuth();
  await checkAuthState();

  // tokenがなければログインページにリダイレクト
  if (!currentUser.value) return await navigateTo('/login', { replace: true });
});