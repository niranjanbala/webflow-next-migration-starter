'use client';

import { useEffect } from 'react';
import { ScreenReaderAnnouncer } from '@/lib/accessibility';

interface LiveAnnouncerProps {
  message?: string;
  priority?: 'polite' | 'assertive';
}

export default function LiveAnnouncer({ 
  message, 
  priority = 'polite'
}: LiveAnnouncerProps) {
  useEffect(() => {
    ScreenReaderAnnouncer.initialize();
  }, []);

  useEffect(() => {
    if (message) {
      ScreenReaderAnnouncer.announce(message, priority);
    }
  }, [message, priority]);

  // This component doesn't render anything visible
  return null;
}

// Hook for programmatic announcements
export function useAnnouncer() {
  useEffect(() => {
    ScreenReaderAnnouncer.initialize();
  }, []);

  return {
    announce: (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      ScreenReaderAnnouncer.announce(message, priority);
    },
    announcePageChange: (title: string) => {
      ScreenReaderAnnouncer.announcePageChange(title);
    },
    announceError: (message: string) => {
      ScreenReaderAnnouncer.announceError(message);
    },
    announceSuccess: (message: string) => {
      ScreenReaderAnnouncer.announceSuccess(message);
    }
  };
}