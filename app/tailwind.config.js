/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {
      colors: {
        sakeprimary: {
          DEFAULT: "#004761",
          50: "#e9ffff",
          100: "#c9fffe",
          200: "#99feff",
          300: "#54faff",
          400: "#004761", //'#07ebff',
          500: "#004761", //'#00cdef',
          600: "#00a2c9",
          700: "#0080a1",
          800: "#086782",
          900: "#0c546d",
          950: "#004761",
        },
        success: {
          50: "#f8fde8",
          100: "#eff9ce",
          200: "#def3a3",
          300: "#c6e96d",
          400: "#addb40",
          500: "#8cbd21",
          600: "#6e9917",
          700: "#547516",
          800: "#445d17",
          900: "#3a4f18",
          950: "#1d2b08",
        },
      },
    },
  },
}
