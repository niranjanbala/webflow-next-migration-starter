import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ContentSectionProps {
  children: ReactNode;
  className?: string;
  backgroundColor?: 'white' | 'gray' | 'dark';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '7xl';
  padding?: 'sm' | 'md' | 'lg' | 'xl';
}

const backgroundClasses = {
  white: 'bg-white',
  gray: 'bg-gray-50',
  dark: 'bg-gray-900 text-white',
};

const maxWidthClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
  '2xl': 'max-w-2xl',
  '7xl': 'max-w-7xl',
};

const paddingClasses = {
  sm: 'py-8 sm:py-12',
  md: 'py-12 sm:py-16',
  lg: 'py-16 sm:py-20',
  xl: 'py-20 sm:py-24',
};

export default function ContentSection({
  children,
  className = '',
  backgroundColor = 'white',
  maxWidth = '7xl',
  padding = 'lg'
}: ContentSectionProps) {
  return (
    <section className={cn(
      backgroundClasses[backgroundColor],
      paddingClasses[padding],
      className
    )}>
      <div className={cn(
        maxWidthClasses[maxWidth],
        'mx-auto px-4 sm:px-6 lg:px-8'
      )}>
        {children}
      </div>
    </section>
  );
}