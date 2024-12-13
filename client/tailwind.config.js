/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#cfcfcf',
        secondary: '#93c5fd',
        'secondary-dark': '#7caafc',
        accent: '#BDBDBD',
        neutral: '#2f1811',
        'base-100': '#262626',
        info: '#00b3ff',
        success: '#23b93d',
        warning: '#e28a00',
        error: '#ff3845',
      },
    },
  },
  plugins: [],
};
