/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme-aware colors using CSS variables
        primary: {
          DEFAULT: 'var(--color-primary)',
          50: 'var(--color-primary-50)',
          100: 'var(--color-primary-100)',
        },
        sidebar: {
          DEFAULT: 'var(--color-sidebar)',
          hover: 'var(--color-sidebar-hover)',
        },
        secondary: {
          DEFAULT: 'var(--color-secondary)',
        },
        border: {
          DEFAULT: 'var(--color-border)',
          subtle: 'var(--color-border-subtle)',
        },
        accent: {
          DEFAULT: '#10a37f',
          hover: '#0d8a6a',
          light: '#19c37d',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          muted: 'var(--color-text-muted)',
          subtle: 'var(--color-text-subtle)',
        },
        success: {
          DEFAULT: '#10a37f',
          bg: 'rgba(16, 163, 127, 0.15)',
          text: '#10a37f',
        },
        error: {
          DEFAULT: '#ef4444',
        },
        user: {
          message: 'var(--color-user-message)',
        },
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #10a37f 0%, #0d8a6a 100%)',
      },
      fontFamily: {
        sans: ['Söhne', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['Söhne Mono', 'Monaco', 'Andale Mono', 'Ubuntu Mono', 'monospace'],
      },
      borderRadius: {
        'message': '18px',
        'message-tail': '4px',
      },
      animation: {
        'typing': 'typing 1.4s infinite',
        'spin-slow': 'spin 0.8s linear infinite',
        'fade-slide-in': 'fadeSlideIn 0.3s ease-out both',
        'pulse-opacity': 'pulseOpacity 2s ease-in-out infinite',
      },
      keyframes: {
        typing: {
          '0%, 60%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '30%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeSlideIn: {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        pulseOpacity: {
          '0%, 100%': { opacity: '0.5' },
          '50%': { opacity: '1' },
        },
      },
      maxWidth: {
        'chat': '768px',
        'message': '70%',
      },
      minWidth: {
        'sidebar': '260px',
      },
      width: {
        'sidebar': '260px',
      },
      zIndex: {
        'dropdown': '999',
        'modal': '1000',
      },
      boxShadow: {
        'dropdown': 'var(--shadow-dropdown)',
        'focus': '0 0 0 2px rgba(16, 163, 127, 0.2)',
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
