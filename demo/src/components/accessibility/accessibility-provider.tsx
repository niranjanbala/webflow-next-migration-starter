'use client';

import { ReactNode, createContext, useContext, useEffect, useState } from 'react';
import { A11yConfig, DEFAULT_A11Y_CONFIG, ScreenReaderAnnouncer } from '@/lib/accessibility';

interface AccessibilityContextType {
  config: A11yConfig;
  updateConfig: (newConfig: Partial<A11yConfig>) => void;
  announcePageChange: (title: string) => void;
  announceError: (message: string) => void;
  announceSuccess: (message: string) => void;
  isReducedMotion: boolean;
  isHighContrast: boolean;
  fontSize: 'normal' | 'large' | 'larger';
  setFontSize: (size: 'normal' | 'large' | 'larger') => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (!context) {
    throw new Error('useAccessibility must be used within an AccessibilityProvider');
  }
  return context;
}

interface AccessibilityProviderProps {
  children: ReactNode;
  initialConfig?: Partial<A11yConfig>;
}

export default function AccessibilityProvider({ 
  children, 
  initialConfig = {} 
}: AccessibilityProviderProps) {
  const [config, setConfig] = useState<A11yConfig>({
    ...DEFAULT_A11Y_CONFIG,
    ...initialConfig
  });
  
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [fontSize, setFontSize] = useState<'normal' | 'large' | 'larger'>('normal');

  // Initialize screen reader announcer
  useEffect(() => {
    if (config.screenReaderSupport) {
      ScreenReaderAnnouncer.initialize();
    }
  }, [config.screenReaderSupport]);

  // Detect user preferences
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check for reduced motion preference
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(reducedMotionQuery.matches);
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setIsReducedMotion(e.matches);
    };
    
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);

    // Check for high contrast preference
    const highContrastQuery = window.matchMedia('(prefers-contrast: high)');
    setIsHighContrast(highContrastQuery.matches);
    
    const handleHighContrastChange = (e: MediaQueryListEvent) => {
      setIsHighContrast(e.matches);
    };
    
    highContrastQuery.addEventListener('change', handleHighContrastChange);

    // Load saved font size preference
    const savedFontSize = localStorage.getItem('accessibility-font-size') as 'normal' | 'large' | 'larger';
    if (savedFontSize) {
      setFontSize(savedFontSize);
    }

    return () => {
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      highContrastQuery.removeEventListener('change', handleHighContrastChange);
    };
  }, []);

  // Apply font size to document
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const fontSizeMap = {
      normal: '16px',
      large: '18px',
      larger: '20px'
    };

    document.documentElement.style.fontSize = fontSizeMap[fontSize];
    localStorage.setItem('accessibility-font-size', fontSize);
  }, [fontSize]);

  // Apply reduced motion styles
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isReducedMotion) {
      document.documentElement.classList.add('reduce-motion');
    } else {
      document.documentElement.classList.remove('reduce-motion');
    }
  }, [isReducedMotion]);

  // Apply high contrast styles
  useEffect(() => {
    if (typeof window === 'undefined') return;

    if (isHighContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [isHighContrast]);

  const updateConfig = (newConfig: Partial<A11yConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  };

  const announcePageChange = (title: string) => {
    if (config.announcePageChanges) {
      ScreenReaderAnnouncer.announcePageChange(title);
    }
  };

  const announceError = (message: string) => {
    ScreenReaderAnnouncer.announceError(message);
  };

  const announceSuccess = (message: string) => {
    ScreenReaderAnnouncer.announceSuccess(message);
  };

  const handleFontSizeChange = (size: 'normal' | 'large' | 'larger') => {
    setFontSize(size);
  };

  const contextValue: AccessibilityContextType = {
    config,
    updateConfig,
    announcePageChange,
    announceError,
    announceSuccess,
    isReducedMotion,
    isHighContrast,
    fontSize,
    setFontSize: handleFontSizeChange
  };

  return (
    <AccessibilityContext.Provider value={contextValue}>
      {children}
    </AccessibilityContext.Provider>
  );
}