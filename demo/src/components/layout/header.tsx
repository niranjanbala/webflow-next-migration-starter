'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationMenu, NavButton } from '@/components/navigation';
import { MAIN_NAVIGATION } from '@/lib/navigation';
import { cn } from '@/lib/utils';

interface HeaderProps {
  className?: string;
  transparent?: boolean;
  sticky?: boolean;
}

export default function Header({ 
  className = '', 
  transparent = false,
  sticky = true 
}: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    if (sticky) {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [sticky]);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const headerClasses = cn(
    'w-full transition-all duration-300 z-50',
    sticky && 'sticky top-0',
    transparent && !isScrolled 
      ? 'bg-transparent' 
      : 'bg-white shadow-sm border-b border-gray-200',
    className
  );

  return (
    <header className={headerClasses}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span>NumeralHQ</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <NavigationMenu 
              navigation={MAIN_NAVIGATION}
              className="flex items-center space-x-8"
            />
          </div>

          {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <NavButton 
              href="/contact" 
              variant="outline" 
              size="sm"
            >
              Contact Sales
            </NavButton>
            <NavButton 
              href="/demo" 
              variant="primary" 
              size="sm"
            >
              Get Demo
            </NavButton>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <XIcon className="block h-6 w-6" />
              ) : (
                <MenuIcon className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <MobileNavigationMenu 
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />
    </header>
  );
}

// Mobile Navigation Menu Component
interface MobileNavigationMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

function MobileNavigationMenu({ isOpen, onClose }: MobileNavigationMenuProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Mobile menu panel */}
      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-xl z-50 md:hidden">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <Link 
              href="/" 
              className="flex items-center space-x-2 text-xl font-bold text-gray-900"
              onClick={onClose}
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <span>NumeralHQ</span>
            </Link>
            <button
              onClick={onClose}
              className="p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100"
              aria-label="Close menu"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Navigation */}
          <div className="flex-1 overflow-y-auto p-4">
            <NavigationMenu 
              navigation={MAIN_NAVIGATION}
              mobile
              onItemClick={onClose}
              className="space-y-2"
            />
          </div>

          {/* CTA Buttons */}
          <div className="p-4 border-t border-gray-200 space-y-3">
            <NavButton 
              href="/contact" 
              variant="outline" 
              size="md"
              className="w-full justify-center"
              onClick={onClose}
            >
              Contact Sales
            </NavButton>
            <NavButton 
              href="/demo" 
              variant="primary" 
              size="md"
              className="w-full justify-center"
              onClick={onClose}
            >
              Get Demo
            </NavButton>
          </div>
        </div>
      </div>
    </>
  );
}

// Icon Components
function MenuIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M4 6h16M4 12h16M4 18h16" 
      />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
      aria-hidden="true"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M6 18L18 6M6 6l12 12" 
      />
    </svg>
  );
}

// Sticky Header Hook
export function useStickyHeader() {
  const [isSticky, setIsSticky] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsSticky(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return isSticky;
}

// Header with different variants
export function TransparentHeader(props: Omit<HeaderProps, 'transparent'>) {
  return <Header {...props} transparent />;
}

export function FixedHeader(props: Omit<HeaderProps, 'sticky'>) {
  return <Header {...props} sticky />;
}

export function SimpleHeader(props: Omit<HeaderProps, 'transparent' | 'sticky'>) {
  return <Header {...props} transparent={false} sticky={false} />;
}