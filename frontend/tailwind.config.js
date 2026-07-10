/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        pink: {
          DEFAULT: '#FF3EA5',
          dark: '#E02589',
          light: '#FF7BC1',
        },
        lemon: {
          DEFAULT: '#F5FF3D',
          dark: '#D8E22B',
        },
        claude: {
          DEFAULT: '#DA7756',
          dark: '#C25F3E',
        },
        ink: '#0A0A0A',
        lime: '#3DFF88',
        electric: '#3D9BFF',
        paper: '#FFF9F0',
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        brutal: '6px 6px 0 0 #0A0A0A',
        'brutal-sm': '3px 3px 0 0 #0A0A0A',
        'brutal-lg': '10px 10px 0 0 #0A0A0A',
        'brutal-pink': '6px 6px 0 0 #FF3EA5',
        'brutal-lemon': '6px 6px 0 0 #F5FF3D',
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        marquee: 'marquee 22s linear infinite',
        blob: 'blob 9s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0, 0) scale(1)' },
          '33%': { transform: 'translate(28px, -40px) scale(1.12)' },
          '66%': { transform: 'translate(-22px, 24px) scale(0.94)' },
        },
      },
    },
  },
  plugins: [],
}
