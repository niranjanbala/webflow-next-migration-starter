import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
  size?: 'sm' | 'md' | 'lg';
  rounded?: boolean;
}

const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', rounded = false, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center font-medium transition-colors';
    
    const variants = {
      default: 'bg-gray-100 text-gray-800 hover:bg-gray-200',
      secondary: 'bg-gray-800 text-white hover:bg-gray-700',
      success: 'bg-green-100 text-green-800 hover:bg-green-200',
      warning: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      error: 'bg-red-100 text-red-800 hover:bg-red-200',
      info: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
    };
    
    const sizes = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1 text-sm',
      lg: 'px-4 py-2 text-base',
    };
    
    const roundedClasses = rounded ? 'rounded-full' : 'rounded-md';

    return (
      <span
        ref={ref}
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          roundedClasses,
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = 'Badge';

export default Badge;