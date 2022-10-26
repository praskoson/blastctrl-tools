module.exports = {
  mode: "jit",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "media",
  theme: {
    extend: {
      keyframes: {
        enter: {
          "0%": { transform: "scale(0.9)", opacity: 0 },
          "100%": { transform: "scale(1)", opacity: 1 },
        },
        leave: {
          "0%": { transform: "scale(1)", opacity: 1 },
          "100%": { transform: "scale(0.9)", opacity: 0 },
        },
        "slide-in": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
      animation: {
        enter: "enter 200ms ease-out",
        "slide-in": "slide-in 1.2s cubic-bezier(.41,.73,.51,1.02)",
        leave: "leave 150ms ease-in forwards",
      },
    },
    fontFamily: {
      sans: ["Roboto", "sans-serif"],
      display: ['"Roboto Slab"'],
    },
  },
  plugins: [
    require("daisyui"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("@tailwindcss/line-clamp"),
  ],
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
