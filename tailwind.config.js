/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",
      "./components/**/*.{js,ts,jsx,tsx}",
      "./pages/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          foreground: 'var(--foreground)',
          background: 'var(--background)',
          heading: 'var(--heading)',
          primary: 'var(--primary)',
        },
        fontFamily: {
          sans: 'var(--font-sans)',
          mono: 'var(--font-mono)',
        },
        keyframes: {
          'slide-in-left': {
            '0%': { opacity: 0, transform: 'translateX(-20px) translateY(10px)' },
            '100%': { opacity: 1, transform: 'translateX(0) translateY(0)' },
          },
        },
        animation: {
          'slide-in-left': 'slide-in-left 0.3s ease-out forwards',
        },
      },
    },
    plugins: [],
  };
  