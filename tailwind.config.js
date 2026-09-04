/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: [
          "Harmond",
          "Georgia",
          "Iowan Old Style",
          "Times New Roman",
          "serif",
        ],
        // Structure / interface — nav, buttons, headings, UI labels.
        structure: ["Ranade", "Helvetica Neue", "Arial", "sans-serif"],
        // Body / utility — copy, captions, metadata, multilingual text.
        body: ['"Noto Sans JP"', "Hiragino Sans", "sans-serif"],
      },
      fontSize: {
hero: ['clamp(2rem, min(4vw, 7vh), 4rem)', { lineHeight: '0.95', fontWeight: '600' }], // fluid, caps at 64px, shrinks on short viewports, Harmond
'hero-accent': ['clamp(1rem, min(1.8vw, 3.2vh), 1.875rem)', { lineHeight: '1.3', fontWeight: '600' }], // fluid, caps at 30px, shrinks on short viewports, Harmond Italic
        "major-heading": [
          "clamp(3rem, 5vw, 4.5rem)",
          { lineHeight: "1.05", fontWeight: "600" },
        ], // 48–72px, Ranade
        "section-heading": [
          "clamp(2rem, 3.5vw, 3rem)",
          { lineHeight: "1.1", fontWeight: "500" },
        ], // 32–48px, Ranade
        "project-title": [
          "clamp(1.5rem, 2.5vw, 2.5rem)",
          { lineHeight: "1.15", fontWeight: "500" },
        ], // 24–40px, Ranade
        body: ["1.0625rem", { lineHeight: "1.7", fontWeight: "400" }], // 16–18px, Noto Sans JP
        nav: ["0.8125rem", { lineHeight: "1", fontWeight: "500" }], // 12–14px, Ranade
        metadata: ["0.75rem", { lineHeight: "1.4", fontWeight: "500" }], // 11–13px, Noto Sans JP
        "jp-accent": [
          "clamp(0.875rem, 1.4vw, 1.5rem)",
          { lineHeight: "1.6", fontWeight: "400" },
        ], // 14–24px, Noto Sans JP
        numbers: [
          "clamp(3rem, 6vw, 7.5rem)",
          { lineHeight: "0.95", fontWeight: "500" },
        ], // 48–120px, Ranade
      },
    },
  },
  plugins: [],
};