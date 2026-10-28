/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fff3ee',
          100: '#ffe4d7',
          200: '#ffc6ad',
          300: '#ffa17a',
          400: '#ff6f38',
          500: '#ff4400',
          600: '#ff3b00', // Electric Flame Accent
          700: '#e03000',
          800: '#b82700',
          900: '#8f2000',
          DEFAULT: '#ff3b00',
        },
        dark: {
          DEFAULT: '#0A0A0C',
          surface: '#121216',
          border: '#23232A',
        },
        cafe: {
          bg: '#F8F9FA',
          surface: '#FFFFFF',
          muted: '#F1F2F5',
          border: '#E5E7EB',
          borderDark: '#D1D5DB',
          text: '#0F0F11',
          subtext: '#6B7280',
        },
        veg: {
          DEFAULT: '#008A3E',
          light: '#E8F5E9',
          border: '#007032',
        },
        nonveg: {
          DEFAULT: '#D32F2F',
          light: '#FFEBEE',
          border: '#B71C1C',
        },
      },
      fontFamily: {
        title: ['"Lovelo Black"', '"Lovelo"', '"Cabinet Grotesk"', '"Syne"', 'sans-serif'],
        heading: ['"Clash Grotesk"', '"Gilroy"', '"Okra"', '"General Sans"', '"Plus Jakarta Sans"', 'sans-serif'],
        sans: ['"Instrument Sans"', '"Satoshi"', '"Basis Grotesque Pro"', '"Plus Jakarta Sans"', '"Inter"', '"Proxima Nova"', '"General Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        order: ['"Instrument Sans"', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        tighter: '-0.03em',
        tight: '-0.02em',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.06), 0 1px 2px -1px rgba(0, 0, 0, 0.06)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.25rem',
      },
    },
  },
  plugins: [],
};
