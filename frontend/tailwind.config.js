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
        gray : "#8A8A8A",
        darkgray: "#262626",
        lightgray: "#9A9393",
        textgray: "#A6A6A6",
        ECcolor: "#ff4c4c",
        CCcolor: "#f1d72e",
        JCcolor: "#68ff61",
        notifUnread : "rgba(249,163,26,0.25)",
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
