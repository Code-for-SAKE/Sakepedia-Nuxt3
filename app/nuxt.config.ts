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
  /*
    ** nuxt-tailwindcss config
    */
  tailwindcss: {
    configPath: 'tailwind.config.js',
    exposeConfig: false,
    config: {},
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/style/app.scss" as *;'
        }
      }
    }
  }
})
