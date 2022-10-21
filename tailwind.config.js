module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {},
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      display: ['"Roboto Slab"'],
    },
  },
  plugins: [require("daisyui"), require("@tailwindcss/typography"), require("@tailwindcss/forms")],
  daisyui: {
    styled: true,
    // TODO: Theme needs works
    themes: [
      {
        solana: {
          /* your theme name */
          fontFamily: {
            sans: "Roboto, sans-serif",
            display: ['"Roboto Slab"', "monospace"],
            body: "sans-serif",
          },
          primary: "#e22424" /* Primary color */,
          "primary-focus": "#a21515" /* Primary color - focused */,
          "primary-content": "#fdffff" /* Foreground content color to use on primary color */,

          secondary: "#083d77" /* Secondary color */,
          "secondary-focus": "#052548" /* Secondary color - focused */,
          "secondary-content": "#fdffff" /* Foreground content color to use on secondary color */,

          accent: "#ffe8e5" /* Accent color */,
          "accent-focus": "#FFBBB3" /* Accent color - focused */,
          "accent-content": "#141204" /* Foreground content color to use on accent color */,

          neutral: "#333333" /* Neutral color */,
          "neutral-focus": "#484848" /* Neutral color - focused */,
          "neutral-content": "#fdffff" /* Foreground content color to use on neutral color */,

          "base-100": "#fdffff" /* Base color of page, used for blank backgrounds */,
          "base-200": "#EEF1F1" /* Base color, a little darker */,
          "base-300": "#D9E0E0" /* Base color, even more darker */,
          "base-content": "#141204" /* Foreground content color to use on base color */,

          info: "#2094f3" /* Info */,
          success: "#009485" /* Success */,
          warning: "#ff9900" /* Warning */,
          error: "#ff5724" /* Error */,
        },
      },
      // backup themes:
      // 'dark',
      // 'synthwave'
    ],
    base: true,
    utils: true,
    logs: true,
    rtl: false,
  },
};
