'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface SkipLink {
  href: string;
  label: string;
}

interface SkipLinksProps {
  links?: SkipLink[];
  className?: string;
}

const DEFAULT_SKIP_LINKS: SkipLink[] = [
  { href: '#main-content', label: 'Skip to main content' },
  { href: '#navigation', label: 'Skip to navigation' },
  { href: '#footer', label: 'Skip to footer' }
];

export default function SkipLinks({ 
  links = DEFAULT_SKIP_LINKS, 
  className = '' 
}: SkipLinksProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Tab' && !event.shiftKey) {
        setIsVisible(true);
      }
    };

    const handleBlur = () => {
      setIsVisible(false);
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('click', handleBlur);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('click', handleBlur);
    };
  }, []);

  return (
    <nav 
      aria-label="Skip navigation links"
      className={cn('skip-links', className)}
    >
      <ul className="list-none p-0 m-0">
        {links.map((link, index) => (
          <li key={index}>
            <Link
              href={link.href}
              className={cn(
                'absolute left-0 top-0 z-50 px-4 py-2 bg-blue-600 text-white font-medium',
                'transform -translate-y-full transition-transform duration-200',
                'focus:translate-y-0 focus:outline-none focus:ring-2 focus:ring-blue-300',
                isVisible && 'translate-y-0'
              )}
              onFocus={() => setIsVisible(true)}
              onBlur={() => setIsVisible(false)}
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}