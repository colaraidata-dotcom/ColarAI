/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        bg: '#0F0F23',
        surface: '#1A1A35',
        card: '#1E1E3F',
        primary: '#6366F1',
        accent: '#8B5CF6',
        success: '#10B981',
        warning: '#F59E0B',
        danger: '#EF4444',
        muted: '#6B7280',
        border: '#2D2D5A',
        teal: '#06B6D4',
      },
    },
  },
  plugins: [],
};
