/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090b', // Deep Zinc
        foreground: '#fafafa',
        muted: {
          DEFAULT: '#27272a',
          foreground: '#a1a1aa'
        },
        accent: {
          DEFAULT: '#3b82f6', // Pro Blue
          hover: '#2563eb',
          foreground: '#ffffff'
        },
        card: {
          DEFAULT: 'rgba(24, 24, 27, 0.8)', // Zinc 900 with grain
          border: 'rgba(255, 255, 255, 0.1)'
        }
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        'pro-glow': '0 0 40px -10px rgba(59, 130, 246, 0.2)',
        'pro-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.05)',
      }
    },
  },
  plugins: [],
}
