/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        sage: {
          DEFAULT: '#8FA391',
          soft: '#DCE4DC',
        },
        forest: {
          DEFAULT: '#2D3830',
          hover: '#3D4C41',
        },
        cream: {
          DEFAULT: '#F6F3EC',
          card: '#F0EDE6',
          inset: '#FBF9F6',
        },
        ink: {
          DEFAULT: '#232924',
          muted: '#5C665E',
        },
        error: {
          DEFAULT: '#BA1A1A',
          container: '#FFDAD6',
        },
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', '"Times New Roman"', 'serif'],
        sans: ['"Plus Jakarta Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'sans-serif'],
      },
      borderRadius: {
        card: '24px',
        thumb: '12px',
      },
      boxShadow: {
        drawer: '0 16px 40px -12px rgba(45, 56, 48, 0.08)',
      },
      maxWidth: {
        store: '1320px',
      },
    },
  },
  plugins: [],
};
