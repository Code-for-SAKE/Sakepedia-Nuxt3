// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  ssr: false,
  nitro: {
    firebase: {
      gen: 2,
    },
  },
  typescript: {
    strict: true,
  },
  runtimeConfig: {
    isEmulating: true,
    public: {
      firebaseApiKey: "",
      firebaseAuthDomain: "",
      firebaseProjectId: "",
      firebaseStorageBucket: "",
      firebaseMessagingSenderId: "",
      firebaseAppId: "",
      firebaseMeasurementId: "",
    },
  },
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "nuxt3-leaflet", "@nuxtjs/i18n", "@nuxt/eslint", "@nuxtjs/seo"],
  /*
   ** nuxt-tailwindcss config
   */
  tailwindcss: {
    configPath: "tailwind.config.js",
    exposeConfig: false,
    config: {},
  },
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "~/assets/style/app.scss" as *;',
        },
      },
    },
  },
  i18n: {
    locales: [
      {
        code: "en",
        name: "English",
      },
      {
        code: "ja",
        name: "日本語",
      },
      {
        code: "ko",
        name: "언어",
      },
      {
        code: "zhHant",
        name: "語言",
      },
    ],
    defaultLocale: "ja",
    strategy: "prefix_and_default",
    vueI18n: "./i18n.config.ts",
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_redirected",
      redirectOn: "root", // recommended
    },
  },
  site: {
    // url: "", // 公開URLを記述する
    name: "Sakepedia Nuxt3",
    description: "みんなで作る日本酒オープンデータ",
    indexable: false, // 本番公開時には設定を変更する
  },
  ogImage: { enabled: false },
})
