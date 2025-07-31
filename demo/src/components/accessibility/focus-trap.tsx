'use client';

import { ReactNode, useEffect, useRef } from 'react';
import { FocusManager } from '@/lib/accessibility';

interface FocusTrapProps {
  children: ReactNode;
  active: boolean;
  restoreFocus?: boolean;
  className?: string;
}

export default function FocusTrap({ 
  children, 
  active, 
  restoreFocus = true,
  className = '' 
}: FocusTrapProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!active || !containerRef.current) return;

    // Save current focus if we should restore it later
    if (restoreFocus) {
      FocusManager.saveFocus();
    }

    // Set up focus trap
    FocusManager.trapFocus(containerRef.current);

    return () => {
      // Clean up focus trap
      FocusManager.releaseFocusTrap();
      
      // Restore focus if requested
      if (restoreFocus) {
        FocusManager.restoreFocus();
      }
    };
  }, [active, restoreFocus]);

  return (
    <div 
      ref={containerRef}
      className={className}
      tabIndex={-1}
    >
      {children}
    </div>
  );
}