/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#09090D',
        'background-secondary': '#111118',
        panel: '#171720',
        'panel-subtle': '#1D1D28',
        border: '#282833',
        'border-light': '#363647',
        'accent-primary': '#A78BFA',
        'accent-secondary': '#8B5CF6',
        'accent-glow': 'rgba(167, 139, 250, 0.15)',
        text: '#F5F3FF',
        'text-muted': '#9999AA',
        'text-subtle': '#68687A',
        success: '#22C55E',
        warning: '#F59E0B',
        danger: '#EF4444',
        cyan: {
          400: '#22D3EE',
          500: '#06B6D4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(167, 139, 250, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.3)',
        'panel-soft': '0 10px 30px -10px rgba(0, 0, 0, 0.6)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'wave-flow': 'wave 2s ease-in-out infinite',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.4)' },
          '50%': { transform: 'scaleY(1.0)' },
        },
      },
    },
  },
  plugins: [],
};
