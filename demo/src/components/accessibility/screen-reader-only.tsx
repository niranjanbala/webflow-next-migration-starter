import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ScreenReaderOnlyProps {
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

export default function ScreenReaderOnly({ 
  children, 
  className = '',
  as: Component = 'span'
}: ScreenReaderOnlyProps) {
  return (
    <Component
      className={cn(
        'sr-only',
        // Ensure the element is completely hidden visually but available to screen readers
        'absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0',
        className
      )}
    >
      {children}
    </Component>
  );
}