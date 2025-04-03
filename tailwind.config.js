/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./src/**/*.{js,ts,jsx,tsx}', './pages/**/*.{js,ts,jsx,tsx}'],
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
      },
    },
    plugins: [],
  };
  