import { defineConfig } from 'windicss/helpers'

export default defineConfig({
  darkMode: 'class',
  shortcuts: {
    transition: "transition-all duration-1000 ease-in-out",
    button: "dark:(fill-white bg-dark-200 hover:bg-true-gray-600) fill-black rounded-full bg-light-700 hover:bg-true-gray-300",
    mobile: "<sm:(h-6rem mx-auto)"
  },
  theme: {
    extend: {
      boxShadow: {
        'full': '0 0 5rem rgba(0, 0, 0, 255)'
      }
    }
  }
})
