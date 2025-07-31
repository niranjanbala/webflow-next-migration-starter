'use client';

import { useState, useRef, useEffect } from 'react';
import { NavigationItem, MAIN_NAVIGATION, usePrefetchNavigation, useNavigation } from '@/lib/navigation';
import NavLink, { MobileNavLink } from './nav-link';
import { cn } from '@/lib/utils';

interface NavigationMenuProps {
  navigation?: NavigationItem[];
  className?: string;
  mobile?: boolean;
  onItemClick?: () => void;
}

export default function NavigationMenu({
  navigation = MAIN_NAVIGATION,
  className = '',
  mobile = false,
  onItemClick
}: NavigationMenuProps) {
  usePrefetchNavigation(navigation);

  if (mobile) {
    return (
      <MobileNavigationMenu
        navigation={navigation}
        className={className}
        onItemClick={onItemClick}
      />
    );
  }

  return (
    <DesktopNavigationMenu
      navigation={navigation}
      className={className}
      onItemClick={onItemClick}
    />
  );
}

// Desktop navigation with dropdowns
function DesktopNavigationMenu({
  navigation,
  className,
  onItemClick
}: NavigationMenuProps) {
  return (
    <nav className={cn('flex space-x-8', className)}>
      {navigation.map((item) => (
        <NavigationMenuItem
          key={item.href}
          item={item}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );
}

// Mobile navigation with collapsible sections
function MobileNavigationMenu({
  navigation,
  className,
  onItemClick
}: NavigationMenuProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  const toggleExpanded = (href: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(href)) {
      newExpanded.delete(href);
    } else {
      newExpanded.add(href);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <nav className={cn('space-y-2', className)}>
      {navigation.map((item) => (
        <MobileNavigationMenuItem
          key={item.href}
          item={item}
          expanded={expandedItems.has(item.href)}
          onToggle={() => toggleExpanded(item.href)}
          onItemClick={onItemClick}
        />
      ))}
    </nav>
  );
}

// Desktop navigation menu item with dropdown
function NavigationMenuItem({
  item,
  onItemClick
}: {
  item: NavigationItem;
  onItemClick?: () => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  if (!item.children || item.children.length === 0) {
    return (
      <NavLink
        href={item.href}
        prefetch={item.prefetch}
        external={item.external}
        onClick={onItemClick}
        className="text-gray-700 hover:text-blue-600 font-medium"
      >
        {item.label}
      </NavLink>
    );
  }

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        className={cn(
          'flex items-center text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200',
          isOpen && 'text-blue-600'
        )}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        {item.label}
        <svg
          className={cn(
            'ml-1 h-4 w-4 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
          {item.children.map((child) => (
            <NavLink
              key={child.href}
              href={child.href}
              prefetch={child.prefetch}
              external={child.external}
              onClick={() => {
                setIsOpen(false);
                onItemClick?.();
              }}
              className="block px-4 py-2 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50"
            >
              {child.label}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
}

// Mobile navigation menu item with collapsible children
function MobileNavigationMenuItem({
  item,
  expanded,
  onToggle,
  onItemClick
}: {
  item: NavigationItem;
  expanded: boolean;
  onToggle: () => void;
  onItemClick?: () => void;
}) {
  if (!item.children || item.children.length === 0) {
    return (
      <MobileNavLink
        href={item.href}
        prefetch={item.prefetch}
        external={item.external}
        onClick={onItemClick}
      >
        {item.label}
      </MobileNavLink>
    );
  }

  return (
    <div>
      <button
        onClick={onToggle}
        className="flex items-center justify-between w-full px-4 py-3 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg"
        aria-expanded={expanded}
      >
        {item.label}
        <svg
          className={cn(
            'h-5 w-5 transition-transform duration-200',
            expanded && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {expanded && (
        <div className="ml-4 mt-2 space-y-1">
          {item.children.map((child) => (
            <MobileNavLink
              key={child.href}
              href={child.href}
              prefetch={child.prefetch}
              external={child.external}
              onClick={onItemClick}
              className="text-sm"
            >
              {child.label}
            </MobileNavLink>
          ))}
        </div>
      )}
    </div>
  );
}

// Breadcrumb navigation component
interface BreadcrumbNavigationProps {
  className?: string;
  customLabels?: Record<string, string>;
  separator?: React.ReactNode;
}

export function BreadcrumbNavigation({
  className = '',
  customLabels = {},
  separator = '/'
}: BreadcrumbNavigationProps) {
  const { breadcrumbs } = useNavigation();
  const breadcrumbItems = breadcrumbs(customLabels);

  if (breadcrumbItems.length <= 1) return null;

  return (
    <nav className={cn('flex items-center space-x-2 text-sm', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {breadcrumbItems.map((item, index) => (
          <li key={item.href} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {separator}
              </span>
            )}
            {item.current ? (
              <span className="font-medium text-gray-900" aria-current="page">
                {item.label}
              </span>
            ) : (
              <NavLink
                href={item.href}
                className="text-gray-500 hover:text-gray-700"
                prefetch={false}
              >
                {item.label}
              </NavLink>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Footer navigation component
export function FooterNavigation({
  navigation,
  className = ''
}: {
  navigation: NavigationItem[];
  className?: string;
}) {
  return (
    <div className={cn('grid grid-cols-2 md:grid-cols-4 gap-8', className)}>
      {navigation.map((section) => (
        <div key={section.href}>
          <h3 className="text-sm font-semibold text-gray-900 mb-4">
            {section.label}
          </h3>
          {section.children && (
            <ul className="space-y-3">
              {section.children.map((item) => (
                <li key={item.href}>
                  <NavLink
                    href={item.href}
                    external={item.external}
                    className="text-sm text-gray-600 hover:text-gray-900"
                  >
                    {item.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}