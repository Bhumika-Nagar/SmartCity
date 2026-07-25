/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        concrete: '#F2F4F1',
        panel: '#FFFFFF',
        ink: '#132420',
        inkmuted: '#4C5B57',
        signal: {
          DEFAULT: '#1D5C4A',
          dark: '#123D31',
          light: '#DCEBE4',
        },
        pending: { DEFAULT: '#C77D22', bg: '#FBF0DE' },
        progress: { DEFAULT: '#2A5C8A', bg: '#E4EDF5' },
        resolved: { DEFAULT: '#2F7A4D', bg: '#E3F1E6' },
        urgent: { DEFAULT: '#B23A3A', bg: '#FBE7E7' },
        line: '#D8DDD6',
      },
      fontFamily: {
        display: ['"Archivo"', '"Barlow Condensed"', 'sans-serif'],
        body: ['"Inter"', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        ticket: '4px',
      },
    },
  },
  plugins: [],
};
