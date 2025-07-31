'use client';

import { ReactNode, useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface DropdownProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
  className?: string;
  disabled?: boolean;
}

const alignments = {
  left: 'left-0',
  right: 'right-0',
  center: 'left-1/2 transform -translate-x-1/2',
};

export default function Dropdown({
  trigger,
  children,
  align = 'left',
  className = '',
  disabled = false
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Close dropdown on escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  return (
    <div className={cn('relative inline-block', className)} ref={dropdownRef}>
      <div
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={cn(
          'cursor-pointer',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
      >
        {trigger}
      </div>

      {isOpen && (
        <div
          className={cn(
            'absolute top-full mt-2 z-50 bg-white border border-gray-200 rounded-lg shadow-lg py-2 min-w-48',
            alignments[align]
          )}
        >
          {children}
        </div>
      )}
    </div>
  );
}

// Dropdown sub-components
export function DropdownItem({
  children,
  onClick,
  disabled = false,
  className = ''
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors',
        disabled && 'opacity-50 cursor-not-allowed hover:bg-transparent',
        className
      )}
    >
      {children}
    </button>
  );
}

export function DropdownSeparator({ className = '' }: { className?: string }) {
  return (
    <div className={cn('my-2 border-t border-gray-200', className)} />
  );
}

export function DropdownLabel({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('px-4 py-2 text-xs font-medium text-gray-500 uppercase tracking-wider', className)}>
      {children}
    </div>
  );
}