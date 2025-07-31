'use client';

import { useNavigation } from '@/lib/navigation';
import NavLink from './nav-link';
import { cn } from '@/lib/utils';

interface BreadcrumbNavProps {
  customLabels?: Record<string, string>;
  className?: string;
  separator?: React.ReactNode;
  showHome?: boolean;
}

export default function BreadcrumbNav({
  customLabels = {},
  className = '',
  separator = '/',
  showHome = true
}: BreadcrumbNavProps) {
  const { breadcrumbs } = useNavigation();
  const breadcrumbItems = breadcrumbs(customLabels);

  if (!showHome && breadcrumbItems.length <= 1) {
    return null;
  }

  const displayItems = showHome ? breadcrumbItems : breadcrumbItems.slice(1);

  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm text-gray-600', className)}
    >
      <ol className="flex items-center space-x-2">
        {displayItems.map((item, index) => {
          const isLast = index === displayItems.length - 1;
          
          return (
            <li key={item.href} className="flex items-center">
              {index > 0 && (
                <span className="mx-2 text-gray-400" aria-hidden="true">
                  {separator}
                </span>
              )}
              
              {isLast ? (
                <span 
                  className="font-medium text-gray-900"
                  aria-current="page"
                >
                  {item.label}
                </span>
              ) : (
                <NavLink
                  href={item.href}
                  className="hover:text-gray-900 transition-colors"
                  activeClassName="text-gray-900"
                  exact
                >
                  {item.label}
                </NavLink>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}