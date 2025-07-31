'use client';

import { createContext, useContext } from 'react';
import { WebflowTheme, WebflowProviderProps } from './types';

const defaultTheme: WebflowTheme = {
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
    },
    white: '#ffffff',
    black: '#000000'
  },
  typography: {
    fontFamilies: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      serif: ['Georgia', 'serif'],
      mono: ['Monaco', 'Consolas', 'monospace']
    },
    fontSizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '3.75rem'
    },
    fontWeights: {
      thin: 100,
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900
    }
  },
  spacing: {
    0: '0px',
    1: '0.25rem',
    2: '0.5rem',
    3: '0.75rem',
    4: '1rem',
    5: '1.25rem',
    6: '1.5rem',
    8: '2rem',
    10: '2.5rem',
    12: '3rem',
    16: '4rem',
    20: '5rem',
    24: '6rem'
  },
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },
  shadows: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)'
  },
  borders: {
    radius: {
      none: '0px',
      sm: '0.125rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      '2xl': '1rem',
      full: '9999px'
    },
    width: {
      0: '0px',
      1: '1px',
      2: '2px',
      4: '4px'
    }
  },
  animations: {
    duration: {
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms'
    },
    easing: {
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)'
    }
  }
};

const WebflowThemeContext = createContext<WebflowTheme>(defaultTheme);

export function useWebflowTheme(): WebflowTheme {
  const context = useContext(WebflowThemeContext);
  if (!context) {
    throw new Error('useWebflowTheme must be used within a WebflowProvider');
  }
  return context;
}

export default function WebflowProvider({ theme, children }: WebflowProviderProps) {
  const mergedTheme: WebflowTheme = {
    colors: { ...defaultTheme.colors, ...theme?.colors },
    typography: { ...defaultTheme.typography, ...theme?.typography },
    spacing: { ...defaultTheme.spacing, ...theme?.spacing },
    breakpoints: { ...defaultTheme.breakpoints, ...theme?.breakpoints },
    shadows: { ...defaultTheme.shadows, ...theme?.shadows },
    borders: { ...defaultTheme.borders, ...theme?.borders },
    animations: { ...defaultTheme.animations, ...theme?.animations }
  };

  return (
    <WebflowThemeContext.Provider value={mergedTheme}>
      {children}
    </WebflowThemeContext.Provider>
  );
}