/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "background": "#0b1326",
        "on-background": "#dae2fd",
        "surface": "#0b1326",
        "surface-dim": "#0b1326",
        "surface-bright": "#31394d",
        "surface-container-lowest": "#060e20",
        "surface-container-low": "#131b2e",
        "surface-container": "#171f33",
        "surface-container-high": "#222a3d",
        "surface-container-highest": "#2d3449",
        "on-surface": "#dae2fd",
        "on-surface-variant": "#bbc9cd",
        "outline": "#859397",
        "outline-variant": "#3c494c",
        "surface-tint": "#2fd9f4",
        "primary": "#8aebff",
        "on-primary": "#00363e",
        "primary-container": "#22d3ee",
        "on-primary-container": "#005763",
        "inverse-primary": "#006877",
        "secondary": "#ffe083",
        "on-secondary": "#3c2f00",
        "secondary-container": "#eec200",
        "on-secondary-container": "#645000",
        "tertiary": "#ffd6a3",
        "on-tertiary": "#462b00",
        "tertiary-container": "#ffb13b",
        "on-tertiary-container": "#6e4600",
        "error": "#ffb4ab",
        "on-error": "#690005",
        "error-container": "#93000a",
        "on-error-container": "#ffdad6"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "lg": "0.5rem",
        "xl": "0.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin-edge": "5rem",
        "gutter-x": "2rem",
        "gutter-y": "3rem",
        "focus-outline": "4px",
        "stack-sm": "1rem",
        "stack-md": "2rem"
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        "display-lg": ["Inter", "sans-serif"],
        "headline-lg": ["Inter", "sans-serif"],
        "headline-md": ["Inter", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "label-lg": ["Inter", "sans-serif"],
        "label-sm": ["Inter", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["72px", { lineHeight: "80px", letterSpacing: "-0.02em", fontWeight: "800" }],
        "headline-lg": ["48px", { lineHeight: "56px", fontWeight: "700" }],
        "headline-md": ["32px", { lineHeight: "40px", fontWeight: "600" }],
        "body-lg": ["24px", { lineHeight: "36px", fontWeight: "400" }],
        "body-md": ["20px", { lineHeight: "30px", fontWeight: "400" }],
        "label-lg": ["18px", { lineHeight: "24px", letterSpacing: "0.05em", fontWeight: "600" }],
        "label-sm": ["14px", { lineHeight: "16px", letterSpacing: "0.1em", fontWeight: "700" }]
      }
    }
  },
  plugins: []
}
