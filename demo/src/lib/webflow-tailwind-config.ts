import type { Config } from 'tailwindcss';
import { WebflowDesignTokens } from './webflow-design-extractor';

export function generateTailwindConfig(designTokens: WebflowDesignTokens): Partial<Config> {
  return {
    theme: {
      extend: {
        // Colors from Webflow
        colors: {
          primary: designTokens.colors.primary,
          secondary: designTokens.colors.secondary,
          neutral: designTokens.colors.neutral,
          success: designTokens.colors.success,
          warning: designTokens.colors.warning,
          error: designTokens.colors.error,
          brand: designTokens.colors.brand,
          ...designTokens.colors.custom
        },

        // Typography from Webflow
        fontFamily: designTokens.typography.fontFamilies,
        fontSize: designTokens.typography.fontSizes,
        fontWeight: designTokens.typography.fontWeights,
        lineHeight: designTokens.typography.lineHeights,
        letterSpacing: designTokens.typography.letterSpacing,

        // Spacing from Webflow
        spacing: designTokens.spacing.scale,

        // Responsive breakpoints from Webflow
        screens: designTokens.breakpoints,

        // Shadows from Webflow
        boxShadow: designTokens.shadows,

        // Borders from Webflow
        borderRadius: designTokens.borders.radius,
        borderWidth: designTokens.borders.width,

        // Animations from Webflow
        transitionDuration: designTokens.animations.duration,
        transitionTimingFunction: designTokens.animations.easing,

        // Custom utilities for Webflow-specific patterns
        container: {
          center: true,
          padding: {
            DEFAULT: '1rem',
            sm: '2rem',
            lg: '4rem',
            xl: '5rem',
            '2xl': '6rem',
          },
          screens: {
            sm: '640px',
            md: '768px',
            lg: '1024px',
            xl: '1280px',
            '2xl': '1400px',
          }
        },

        // Webflow-specific spacing
        gap: {
          'section': designTokens.spacing.semantic['section-padding'] || '4rem',
          'component': designTokens.spacing.semantic['component-gap'] || '2rem',
          'element': designTokens.spacing.semantic['element-gap'] || '1.5rem',
        },

        // Webflow-specific typography scales
        textStyles: designTokens.typography.textStyles
      }
    },
    plugins: [
      // Custom plugin for Webflow text styles
      function({ addUtilities, theme }: any) {
        const textStyles = theme('textStyles') || {};
        const utilities: Record<string, any> = {};

        Object.entries(textStyles).forEach(([name, style]: [string, any]) => {
          utilities[`.text-${name}`] = {
            fontFamily: style.fontFamily,
            fontSize: style.fontSize,
            fontWeight: style.fontWeight,
            lineHeight: style.lineHeight,
            ...(style.letterSpacing && { letterSpacing: style.letterSpacing }),
            ...(style.textTransform && { textTransform: style.textTransform })
          };
        });

        addUtilities(utilities);
      },

      // Custom plugin for Webflow-style containers
      function({ addComponents, theme }: any) {
        addComponents({
          '.w-container': {
            maxWidth: '940px',
            marginLeft: 'auto',
            marginRight: 'auto',
            paddingLeft: theme('spacing.4'),
            paddingRight: theme('spacing.4'),
            '@screen sm': {
              paddingLeft: theme('spacing.6'),
              paddingRight: theme('spacing.6'),
            },
            '@screen lg': {
              paddingLeft: theme('spacing.8'),
              paddingRight: theme('spacing.8'),
            }
          },
          '.w-row': {
            display: 'flex',
            flexWrap: 'wrap',
            marginLeft: `-${theme('spacing.4')}`,
            marginRight: `-${theme('spacing.4')}`,
          },
          '.w-col': {
            flex: '1',
            paddingLeft: theme('spacing.4'),
            paddingRight: theme('spacing.4'),
          },
          '.w-button': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme('colors.primary.500'),
            color: theme('colors.white'),
            padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
            borderRadius: theme('borderRadius.md'),
            border: 'none',
            fontWeight: theme('fontWeight.medium'),
            fontSize: theme('fontSize.sm'),
            lineHeight: theme('lineHeight.none'),
            cursor: 'pointer',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              backgroundColor: theme('colors.primary.600'),
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            }
          }
        });
      },

      // Custom plugin for Webflow-style sections
      function({ addComponents, theme }: any) {
        addComponents({
          '.section': {
            paddingTop: theme('spacing.16'),
            paddingBottom: theme('spacing.16'),
            '@screen md': {
              paddingTop: theme('spacing.20'),
              paddingBottom: theme('spacing.20'),
            },
            '@screen lg': {
              paddingTop: theme('spacing.24'),
              paddingBottom: theme('spacing.24'),
            }
          },
          '.section-sm': {
            paddingTop: theme('spacing.12'),
            paddingBottom: theme('spacing.12'),
            '@screen md': {
              paddingTop: theme('spacing.16'),
              paddingBottom: theme('spacing.16'),
            }
          },
          '.section-lg': {
            paddingTop: theme('spacing.20'),
            paddingBottom: theme('spacing.20'),
            '@screen md': {
              paddingTop: theme('spacing.32'),
              paddingBottom: theme('spacing.32'),
            }
          }
        });
      },

      // Custom plugin for Webflow-style animations
      function({ addUtilities, theme }: any) {
        addUtilities({
          '.animate-fade-in': {
            animation: 'fadeIn 0.3s ease-out',
          },
          '.animate-slide-up': {
            animation: 'slideUp 0.3s ease-out',
          },
          '.animate-slide-down': {
            animation: 'slideDown 0.3s ease-out',
          },
          '.animate-scale-in': {
            animation: 'scaleIn 0.2s ease-out',
          }
        });
      }
    ]
  };
}

// Default Webflow-inspired configuration
export const defaultWebflowConfig: Partial<Config> = {
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
          800: '#1e40af',
          900: '#1e3a8a',
          950: '#172554'
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'serif'],
        mono: ['Monaco', 'Consolas', 'monospace']
      },
      fontSize: {
        'xs': '0.75rem',
        'sm': '0.875rem',
        'base': '1rem',
        'lg': '1.125rem',
        'xl': '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
        '5xl': '3rem',
        '6xl': '3.75rem'
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem'
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px'
      },
      container: {
        center: true,
        padding: {
          DEFAULT: '1rem',
          sm: '2rem',
          lg: '4rem',
          xl: '5rem',
          '2xl': '6rem',
        },
        screens: {
          sm: '640px',
          md: '768px',
          lg: '1024px',
          xl: '1280px',
          '2xl': '1400px',
        }
      }
    }
  },
  plugins: []
};

// Utility function to merge configs
export function mergeWebflowConfig(baseConfig: Partial<Config>, designTokens?: WebflowDesignTokens): Config {
  if (designTokens) {
    const webflowConfig = generateTailwindConfig(designTokens);
    return {
      ...baseConfig,
      theme: {
        ...baseConfig.theme,
        extend: {
          ...baseConfig.theme?.extend,
          ...webflowConfig.theme?.extend
        }
      },
      plugins: [
        ...(baseConfig.plugins || []),
        ...(webflowConfig.plugins || [])
      ]
    } as Config;
  }

  return {
    ...baseConfig,
    ...defaultWebflowConfig,
    theme: {
      ...baseConfig.theme,
      extend: {
        ...baseConfig.theme?.extend,
        ...defaultWebflowConfig.theme?.extend
      }
    }
  } as Config;
}