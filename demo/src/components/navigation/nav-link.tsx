'use client';

import Link from 'next/link';
import { useNavigation } from '@/lib/navigation';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  activeClassName?: string;
  exact?: boolean;
  prefetch?: boolean;
  external?: boolean;
  onClick?: () => void;
}

export default function NavLink({
  href,
  children,
  className = '',
  activeClassName = 'text-blue-600 font-semibold',
  exact = false,
  prefetch = true,
  external = false,
  onClick
}: NavLinkProps) {
  const { isActive, prefetch: prefetchRoute } = useNavigation();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const isCurrentlyActive = isActive(href, exact);

  // Prefetch on mount if enabled
  useEffect(() => {
    if (prefetch && !external) {
      prefetchRoute(href);
    }
  }, [href, prefetch, external, prefetchRoute]);

  // Prefetch on hover
  const handleMouseEnter = () => {
    if (!external) {
      prefetchRoute(href);
    }
  };

  const handleClick = (e: React.MouseEvent) => {
    onClick?.();
    
    // Add click animation
    if (linkRef.current) {
      linkRef.current.style.transform = 'scale(0.95)';
      setTimeout(() => {
        if (linkRef.current) {
          linkRef.current.style.transform = 'scale(1)';
        }
      }, 100);
    }
  };

  const linkProps = {
    ref: linkRef,
    href,
    className: cn(
      'transition-all duration-200 ease-in-out',
      'hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
      isCurrentlyActive && activeClassName,
      className
    ),
    onMouseEnter: handleMouseEnter,
    onClick: handleClick,
    ...(external && {
      target: '_blank',
      rel: 'noopener noreferrer'
    })
  };

  return (
    <Link {...linkProps}>
      {children}
    </Link>
  );
}

// Mobile nav link with touch-friendly styling
export function MobileNavLink({
  href,
  children,
  className = '',
  onClick
}: Omit<NavLinkProps, 'activeClassName' | 'exact'>) {
  return (
    <NavLink
      href={href}
      className={cn(
        'block px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg',
        className
      )}
      activeClassName="text-blue-600 bg-blue-50"
      onClick={onClick}
    >
      {children}
    </NavLink>
  );
}

// Breadcrumb link component
export function BreadcrumbLink({
  href,
  children,
  current = false,
  className = ''
}: {
  href: string;
  children: React.ReactNode;
  current?: boolean;
  className?: string;
}) {
  if (current) {
    return (
      <span className={cn('text-gray-900 font-medium', className)}>
        {children}
      </span>
    );
  }

  return (
    <NavLink
      href={href}
      className={cn('text-gray-500 hover:text-gray-700', className)}
      prefetch={false}
    >
      {children}
    </NavLink>
  );
}

// Button-style nav link
export function NavButton({
  href,
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}: NavLinkProps & {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}) {
  const variants = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  return (
    <NavLink
      href={href}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-lg transition-colors duration-200',
        variants[variant],
        sizes[size],
        className
      )}
      activeClassName="" // Override default active styling
      {...props}
    >
      {children}
    </NavLink>
  );
}