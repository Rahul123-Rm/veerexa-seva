/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#F7F8FA",
        surface: "#FFFFFF",
        surface2: "#F1F3F6",
        border: "#E4E7EC",
        navy: "#0F2942",
        navy2: "#173A5E",
        accent: "#1F6FEB",
        accent2: "#E8A33D",
        ok: "#1E9E6C",
        ink: "#1B2430",
        muted: "#5B6572",
      },
      fontFamily: {
        display: ["'Sora'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
    },
  },
  plugins: [],
}
