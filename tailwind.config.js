/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0f1419',
          50: '#1a1f2e',
          100: '#151a26',
        },
        secondary: {
          DEFAULT: '#1a1f2e',
        },
        border: {
          DEFAULT: '#2d3748',
        },
        accent: {
          purple: {
            DEFAULT: '#667eea',
            start: '#667eea',
            end: '#764ba2',
          },
          green: {
            DEFAULT: '#10b981',
            start: '#10b981',
            end: '#059669',
          }
        },
        text: {
          primary: '#ffffff',
          secondary: '#e2e8f0',
          tertiary: '#cbd5e0',
          muted: '#9ca3af',
          subtle: '#718096',
        },
        success: {
          DEFAULT: '#10b981',
          bg: '#065f46',
          text: '#6ee7b7',
        },
        error: {
          DEFAULT: '#dc2626',
        }
      },
      backgroundImage: {
        'gradient-accent': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-success': 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      },
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['source-code-pro', 'Menlo', 'Monaco', 'Consolas', '"Courier New"', 'monospace'],
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
        'sidebar': '280px',
      },
      width: {
        'sidebar': '280px',
      },
      zIndex: {
        'dropdown': '999',
        'modal': '1000',
      },
      boxShadow: {
        'dropdown': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'focus': '0 0 0 2px rgba(102, 126, 234, 0.2)',
      },
      typography: {
        DEFAULT: {
          css: {
            '--tw-prose-body': '#e2e8f0',
            '--tw-prose-headings': '#ffffff',
            '--tw-prose-lead': '#cbd5e0',
            '--tw-prose-links': '#667eea',
            '--tw-prose-bold': '#ffffff',
            '--tw-prose-counters': '#9ca3af',
            '--tw-prose-bullets': '#718096',
            '--tw-prose-hr': '#2d3748',
            '--tw-prose-quotes': '#e2e8f0',
            '--tw-prose-quote-borders': '#667eea',
            '--tw-prose-captions': '#9ca3af',
            '--tw-prose-code': '#e2e8f0',
            '--tw-prose-pre-code': '#e2e8f0',
            '--tw-prose-pre-bg': '#1a1f2e',
            '--tw-prose-th-borders': '#2d3748',
            '--tw-prose-td-borders': '#2d3748',
            maxWidth: 'none',
            code: {
              backgroundColor: '#2d3748',
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
              backgroundColor: '#1a1f2e',
              border: '1px solid #2d3748',
              borderRadius: '0.5rem',
            },
            blockquote: {
              backgroundColor: 'rgba(102, 126, 234, 0.1)',
              borderLeftColor: '#667eea',
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
              backgroundColor: '#1a1f2e',
              borderColor: '#2d3748',
            },
            td: {
              borderColor: '#2d3748',
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
