import Link from 'next/link';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  name: string;
  url: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

export default function Breadcrumbs({ 
  items, 
  className = '',
  separator = '/'
}: BreadcrumbsProps) {
  if (items.length === 0) return null;

  return (
    <nav 
      aria-label="Breadcrumb"
      className={cn('flex items-center space-x-2 text-sm text-gray-600', className)}
    >
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          
          return (
            <li key={item.url} className="flex items-center">
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
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url}
                  className="hover:text-gray-900 transition-colors"
                >
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

// Utility function to generate breadcrumbs from pathname
export function generateBreadcrumbs(pathname: string, customLabels: Record<string, string> = {}): BreadcrumbItem[] {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs: BreadcrumbItem[] = [
    { name: 'Home', url: '/' }
  ];

  let currentPath = '';
  
  segments.forEach((segment) => {
    currentPath += `/${segment}`;
    
    // Convert segment to readable label
    const label = customLabels[segment] || segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    breadcrumbs.push({
      name: label,
      url: currentPath
    });
  });

  return breadcrumbs;
}