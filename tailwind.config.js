/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // ChatGPT-style colors
        primary: {
          DEFAULT: '#212121',
          50: '#2f2f2f',
          100: '#171717',
        },
        sidebar: {
          DEFAULT: '#171717',
          hover: '#2f2f2f',
        },
        secondary: {
          DEFAULT: '#2f2f2f',
        },
        border: {
          DEFAULT: '#424242',
          subtle: '#2d2d2d',
        },
        accent: {
          DEFAULT: '#10a37f',
          hover: '#0d8a6a',
          light: '#19c37d',
        },
        text: {
          primary: '#ececec',
          secondary: '#c5c5d2',
          tertiary: '#8e8ea0',
          muted: '#666680',
          subtle: '#4a4a5a',
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
          message: '#2f2f2f',
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
        'dropdown': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'focus': '0 0 0 2px rgba(16, 163, 127, 0.2)',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#c5c5d2',
            '--tw-prose-headings': '#ececec',
            '--tw-prose-lead': '#8e8ea0',
            '--tw-prose-links': '#10a37f',
            '--tw-prose-bold': '#ececec',
            '--tw-prose-counters': '#8e8ea0',
            '--tw-prose-bullets': '#666680',
            '--tw-prose-hr': '#424242',
            '--tw-prose-quotes': '#c5c5d2',
            '--tw-prose-quote-borders': '#10a37f',
            '--tw-prose-captions': '#8e8ea0',
            '--tw-prose-code': '#c5c5d2',
            '--tw-prose-pre-code': '#c5c5d2',
            '--tw-prose-pre-bg': '#2f2f2f',
            '--tw-prose-th-borders': '#424242',
            '--tw-prose-td-borders': '#424242',
            maxWidth: 'none',
            code: {
              backgroundColor: '#424242',
              padding: '0.125rem 0.375rem',
              borderRadius: '0.25rem',
              fontWeight: '400',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
            pre: {
              backgroundColor: '#2f2f2f',
              border: '1px solid #424242',
              borderRadius: '0.5rem',
            },
            blockquote: {
              backgroundColor: 'rgba(16, 163, 127, 0.1)',
              borderLeftColor: '#10a37f',
              fontStyle: 'normal',
            },
            'blockquote p:first-of-type::before': {
              content: '""',
            },
            'blockquote p:last-of-type::after': {
              content: '""',
            },
            table: {
              borderCollapse: 'collapse',
            },
            th: {
              backgroundColor: '#2f2f2f',
              borderColor: '#424242',
            },
            td: {
              borderColor: '#424242',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
