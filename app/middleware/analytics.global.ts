//Googleアナリティクスに送る
export default defineNuxtRouteMiddleware(async () => {
  useAnalytics()
})
