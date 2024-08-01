/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2B0282',
        borderPrimary: '#2B0282', // 테두리 색상 추가
        hover: '#D5CCE6',
        borderHover: '#D5CCE6',   // 호버 시 테두리 색상 추가
      },
    },
  plugins: [],
}
};

