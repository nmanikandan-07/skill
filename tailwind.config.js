/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          hover: '#4338CA',
          deep: '#3730D3',
          light: '#EEF2FF',
        },
        brand: {
          navActive: '#E5EDFF',
          lavender: '#F7F8FF',
          bg: '#F8F9FF',
          card: '#FFFFFF',
          softBlue: '#EEF3FF',
          textMain: '#10213A',
          textSecondary: '#5E6680',
          textMuted: '#8992AA',
          border: '#E4E7F2',
          success: '#087F5B',
          successBg: '#D9F4E9',
          warning: '#F59E0B',
          error: '#DC2626',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      borderRadius: {
        'card': '18px',
        'btn': '12px',
        'input': '12px',
      },
      boxShadow: {
        'subtle': '0 1px 3px 0 rgba(16, 33, 58, 0.04), 0 1px 2px -1px rgba(16, 33, 58, 0.04)',
        'card': '0 4px 16px -2px rgba(16, 33, 58, 0.05), 0 2px 6px -2px rgba(16, 33, 58, 0.03)',
        'dropdown': '0 10px 25px -5px rgba(16, 33, 58, 0.08), 0 8px 10px -6px rgba(16, 33, 58, 0.04)',
        'elevated': '0 20px 30px -10px rgba(79, 70, 229, 0.12), 0 10px 10px -5px rgba(16, 33, 58, 0.04)',
      },
      spacing: {
        'sidebar': '304px',
        'topbar': '76px',
      }
    },
  },
  plugins: [],
}
