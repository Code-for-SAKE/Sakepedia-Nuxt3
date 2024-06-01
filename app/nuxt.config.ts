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
  modules: ['@nuxt/ui', 'nuxt3-leaflet', "@nuxtjs/i18n", "@nuxt/eslint"],
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
  },
  i18n: {
    locales: ['ja', 'en'],
    defaultLocale: 'ja',
    strategy: "prefix_and_default",
    vueI18n: './i18n.config.ts',
  },
})
