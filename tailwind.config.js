/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        blue: {
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        dark: {
          50:  '#1a1a1a',
          100: '#141414',
          200: '#111111',
          300: '#0d0d0d',
          400: '#0a0a0a',
          500: '#080808',
        },
        zinc: {
          750: '#2a2a2a',
          850: '#1f1f1f',
          950: '#0c0c0c',
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        body: ['var(--font-body)', 'sans-serif'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'blue-gradient': 'linear-gradient(135deg, #3b82f6 0%, #93c5fd 50%, #3b82f6 100%)',
        'dark-gradient': 'linear-gradient(180deg, #0a0a0a 0%, #141414 100%)',
        'card-shine': 'linear-gradient(135deg, rgba(59,130,246,0.08) 0%, transparent 60%)',
      },
      animation: {
        'fade-up': 'fadeUp 0.6s ease forwards',
        'fade-in': 'fadeIn 0.4s ease forwards',
        'shimmer': 'shimmer 2s linear infinite',
        'pulse-blue': 'pulseBlue 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'waveform': 'waveform 1.2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        pulseBlue: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(59,130,246,0)' },
          '50%': { boxShadow: '0 0 24px 4px rgba(59,130,246,0.2)' },
        },
        waveform: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1)' },
        },
      },
      boxShadow: {
        'blue': '0 0 24px rgba(59,130,246,0.3)',
        'blue-sm': '0 0 12px rgba(59,130,246,0.2)',
        'card': '0 4px 40px rgba(0,0,0,0.6)',
        'inner-blue': 'inset 0 1px 0 rgba(59,130,246,0.15)',
      },
    },
  },
  plugins: [],
}
