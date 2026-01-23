/** @type {import('tailwindcss').Config} */
export default {
  // Use the `dark` class on the <html> element to enable dark mode utilities
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // Map existing utility names in the codebase to @theme tokens
        "btn-primary": "var(--color-btn-primary)",
        "btn-hover": "var(--color-btn-hover)",

        // Used as `bg-bg-primary-light` / `dark:bg-bg-primary-dark`
        "bg-primary-light": "var(--color-bg-primary-light)",
        "bg-primary-dark": "var(--color-bg-primary-dark)",

        // Used as `dark:text-dark-text` / `dark:text-primary-color`
        "dark-text": "var(--color-dark-text)",
        "primary-color": "var(--color-primary-color)",

        border: "var(--color-border-light)",
      },
      fontSize: {
        primary: "var(--text-primary)",
        secondary: "var(--text-secondary)",
        normal: "var(--text-normal)",
        small: "var(--text-small)",
        "card-heading": "var(--text-card-headings)",
      },
    },
  },
};
