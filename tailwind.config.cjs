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
      // One radius ladder: panels 16, cards 12, controls 8, chips 6.
      borderRadius: {
        panel: "16px",
        card: "12px",
        control: "8px",
        chip: "6px",
      },
      // One easing for every state change. The hub moves at 150ms for state
      // and 200ms for the glass panels that carry the eye in.
      transitionTimingFunction: {
        out: "cubic-bezier(0.2, 0, 0, 1)",
      },
      // The only entrance in the interface.
      keyframes: {
        enter: {
          from: { opacity: "0", transform: "translateY(4px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        enter: "enter 150ms cubic-bezier(0.2, 0, 0, 1) both",
      },
    },
  },
  plugins: [],
};
