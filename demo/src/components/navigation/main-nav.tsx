'use client';

import { useState, useRef, useEffect } from 'react';
import { MAIN_NAVIGATION, NavigationItem } from '@/lib/navigation';
import NavLink from './nav-link';
import { cn } from '@/lib/utils';

interface MainNavProps {
  className?: string;
  navigation?: NavigationItem[];
}

export default function MainNav({ 
  className = '', 
  navigation = MAIN_NAVIGATION 
}: MainNavProps) {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = (href: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setActiveDropdown(href);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setActiveDropdown(null);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <nav className={cn('hidden md:flex space-x-8', className)}>
      {navigation.map((item) => (
        <div
          key={item.href}
          className="relative"
          onMouseEnter={() => item.children && handleMouseEnter(item.href)}
          onMouseLeave={handleMouseLeave}
        >
          <NavLink
            href={item.href}
            className={cn(
              'flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium',
              'transition-colors duration-200'
            )}
            prefetch={item.prefetch}
          >
            {item.label}
            {item.children && (
              <svg
                className={cn(
                  'ml-1 h-4 w-4 transition-transform duration-200',
                  activeDropdown === item.href && 'rotate-180'
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            )}
          </NavLink>

          {/* Dropdown Menu */}
          {item.children && (
            <div
              className={cn(
                'absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50',
                'transform transition-all duration-200 origin-top',
                activeDropdown === item.href
                  ? 'opacity-100 scale-100 translate-y-0'
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              )}
            >
              {item.children.map((child) => (
                <NavLink
                  key={child.href}
                  href={child.href}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-colors"
                  external={child.external}
                  onClick={() => setActiveDropdown(null)}
                >
                  <div className="flex items-center">
                    {child.icon && (
                      <child.icon className="mr-3 h-4 w-4 text-gray-400" />
                    )}
                    {child.label}
                  </div>
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}