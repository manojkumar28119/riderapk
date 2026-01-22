/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/styles/globals.css",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "rgb(var(--color-brand-primary) / <alpha-value>)",
          secondary: "rgb(var(--color-brand-secondary) / <alpha-value>)",
          bgwhite: "rgb(var(--color-brand-bgwhite) / <alpha-value>)",
        },
        red: "rgb(var(--color-system-red) / <alpha-value>)",
        yellow: "rgb(var(--color-system-yellow) / <alpha-value>)",
        green: "rgb(var(--color-system-green) / <alpha-value>)",
        white: "rgb(var(--color-brand-bgwhite) / <alpha-value>)",
        redshade: "rgb(var(--color-shade-red) / <alpha-value>)",
        yellowshade: "rgb(var(--color-shade-yellow) / <alpha-value>)",
        greenshade: "rgb(var(--color-shade-green) / <alpha-value>)",
        blueshade: "rgb(var(--color-shade-blue) / <alpha-value>)",
        purpleshade: "rgb(var(--color-shade-purple) / <alpha-value>)",
        lightpinkshade: "rgb(var(--color-shade-lightpink) / <alpha-value>)",
        blue: {
          50: "rgb(var(--color-text-50) / <alpha-value>)",
          100: "rgb(var(--color-text-100) / <alpha-value>)",
          200: "rgb(var(--color-text-200) / <alpha-value>)",
          300: "rgb(var(--color-text-300) / <alpha-value>)",
          400: "rgb(var(--color-text-400) / <alpha-value>)",
          500: "rgb(var(--color-text-500) / <alpha-value>)",
          600: "rgb(var(--color-text-600) / <alpha-value>)",
          700: "rgb(var(--color-text-700) / <alpha-value>)",
          800: "rgb(var(--color-text-800) / <alpha-value>)",
          900: "rgb(var(--color-text-900) / <alpha-value>)",
          950: "rgb(var(--color-text-950) / <alpha-value>)",
        },
        grey: {
          50: "rgb(var(--color-grey-50) / <alpha-value>)",
          100: "rgb(var(--color-grey-100) / <alpha-value>)",
          200: "rgb(var(--color-grey-200) / <alpha-value>)",
          300: "rgb(var(--color-grey-300) / <alpha-value>)",
          400: "rgb(var(--color-grey-400) / <alpha-value>)",
          500: "rgb(var(--color-grey-500) / <alpha-value>)",
          600: "rgb(var(--color-grey-600) / <alpha-value>)",
          700: "rgb(var(--color-grey-700) / <alpha-value>)",
          800: "rgb(var(--color-grey-800) / <alpha-value>)",
          900: "rgb(var(--color-grey-900) / <alpha-value>)",
        },
        purple:{
          50:"rgb(var(--color-text-1000)/<alpha-value>)",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
      },
      borderRadius: {
        xs: "var(--radius-xs)",      // 2px
        sm: "var(--radius-sm)",      // 4px
        md: "var(--radius-md)",      // 6px
        lg: "var(--radius-lg)",      // 8px
        xl: "var(--radius-xl)",      // 12px
        "2xl": "var(--radius-2xl)",  // 16px
        full: "var(--radius-full)",  // 9999px
      },
      boxShadow: {
        sm: "var(--shadow-sm)",  // 0 1px 2px rgba(0, 0, 0, 0.05)
        md: "var(--shadow-md)",  // 0 4px 6px rgba(0, 0, 0, 0.1)
        lg: "var(--shadow-lg)",  // 0 10px 15px rgba(0, 0, 0, 0.15)
      },
      fontFamily: {
        roboto: "var(--font-roboto)",  // Roboto
      },
      fontSize: {
        xs: [  // 12px / 1.5 line-height
          "var(--font-size-xs)",
          {
            lineHeight: "var(--line-height-normal)",
          },
        ],
        sm: [  // 14px / 1.5 line-height
          "var(--font-size-sm)",
          {
            lineHeight: "var(--line-height-normal)",
          },
        ],
        md: [  // 16px / 1.5 line-height
          "var(--font-size-md)",
          {
            lineHeight: "var(--line-height-normal)",
          },
        ],
        lg: [  // 18px / 1.5 line-height
          "var(--font-size-lg)",
          {
            lineHeight: "var(--line-height-normal)",
          },
        ],
        xl: [  // 20px / 1.2 line-height
          "var(--font-size-xl)",
          {
            lineHeight: "var(--line-height-tight)",
          },
        ],
        "2xl": [  // 24px / 1.2 line-height
          "var(--font-size-2xl)",
          {
            lineHeight: "var(--line-height-tight)",
          },
        ],
        "3xl": [  // 30px / 1.2 line-height
          "var(--font-size-3xl)",
          {
            lineHeight: "var(--line-height-tight)",
          },
        ],
        "4xl": [  // 36px / 1.2 line-height
          "var(--font-size-4xl)",
          {
            lineHeight: "var(--line-height-tight)",
          },
        ],
      },
      fontWeight: {
        light: "var(--font-weight-light)",      // 300
        normal: "var(--font-weight-normal)",    // 400
        medium: "var(--font-weight-medium)",    // 500
        semibold: "var(--font-weight-semibold)",  // 600
        bold: "var(--font-weight-bold)",        // 700
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "badge-pop": {
          from: { opacity: "0", transform: "scale(0.5)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "badge-pulse": {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.15)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "badge-pop": "badge-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        "badge-pulse": "badge-pulse 0.4s ease-in-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
