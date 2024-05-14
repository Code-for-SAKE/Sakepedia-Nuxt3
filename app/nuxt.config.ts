// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    firebase: {
      gen: 2
    }
  },
  typescript: {
    strict: true
  },
  runtimeConfig: {
    isEmulating: true,
    public: {
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: '',
      firebaseMeasurementId: '',
      }
  },
  devtools: { enabled: true },
  modules: ['@nuxt/ui', 'nuxt3-leaflet'],
})
