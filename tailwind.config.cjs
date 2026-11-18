/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "Inter", "-apple-system", "BlinkMacSystemFont", "system-ui", "sans-serif"],
        mono: ['"Geist Mono"', "ui-monospace", "monospace"],
      },
      colors: {
        background: "#09090b",
        foreground: "#fafafa",
        // The stock zinc-500 (#71717a) is only ~3.8:1 on the #1d1d1d panels,
        // and it is used for the smallest labels across the hub. Lift it to a
        // muted grey that clears 4.5:1 without competing with primary text.
        zinc: {
          500: "#8f8f99",
        },
      },
    },
  },
  plugins: [],
};
