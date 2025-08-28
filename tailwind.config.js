const { addIconSelectors } = require("@iconify/tailwind");
const flowbiteReact = require("flowbite-react/plugin/tailwindcss");

flowbiteReact.config = {
  charts: true,
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    ".flowbite-react/class-list.json"
  ],
  plugins: [
    addIconSelectors(["mdi", "material-symbols", "twemoji", "fa6-brands", "solar"]),
    flowbiteReact,
    require("tailwind-scrollbar")
  ],
  darkMode: "selector",
  theme: {
    extend: {
      animation: {
        bg_zoom: "bg_zoom 150ms linear",
        bg_zoom_rev: "bg_zoom_rev 150ms linear",
      },
      keyframes: {
        bg_zoom: {
          "0%": {
            "background-size": "100% auto",
          },
          "100%": {
            "background-size": "110% auto",
          },
        },
        bg_zoom_rev: {
          "0%": {
            "background-size": "110% auto",
          },
          "100%": {
            "background-size": "100% auto",
          },
        },
      },
    },
  },
};