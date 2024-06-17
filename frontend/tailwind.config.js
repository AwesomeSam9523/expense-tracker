/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors :{
        primary : "#151515",
        secondary : "#F9A31A",
        gray : "#8A8A8A"
      },
      fontFamily : {
        bextrabold : ["Barlow-ExtraBold", "sans-sarif"],
        pextrabold : ["Poppins-ExtraBold", "sans-sarif"],
        pbold : ["Poppins-Bold", "sans-sarif"],
        psemibold : ["Poppins-SemiBold", "sans-sarif"],
        pmedium : ["Poppins-Medium", "sans-sarif"],
        pregular : ["Poppins-Regular", "sans-sarif"],
      }
    },
  },
  plugins: [],
}
