'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  children?: NavigationItem[];
  external?: boolean;
  prefetch?: boolean;
}

export interface BreadcrumbItem {
  label: string;
  href: string;
  current?: boolean;
}

// Navigation configuration
export const MAIN_NAVIGATION: NavigationItem[] = [
  {
    label: 'Home',
    href: '/',
    prefetch: true
  },
  {
    label: 'Products',
    href: '/products',
    children: [
      { label: 'Tax Automation', href: '/products/tax-automation' },
      { label: 'Compliance Tools', href: '/products/compliance' },
      { label: 'Integrations', href: '/products/integrations' }
    ]
  },
  {
    label: 'Solutions',
    href: '/solutions',
    children: [
      { label: 'E-commerce', href: '/solutions/ecommerce' },
      { label: 'SaaS', href: '/solutions/saas' },
      { label: 'Enterprise', href: '/solutions/enterprise' }
    ]
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'Documentation', href: '/docs' },
      { label: 'Case Studies', href: '/customers' },
      { label: 'Webinars', href: '/webinars' }
    ]
  },
  {
    label: 'Pricing',
    href: '/pricing',
    prefetch: true
  },
  {
    label: 'About',
    href: '/about'
  }
];

export const FOOTER_NAVIGATION: NavigationItem[] = [
  {
    label: 'Product',
    href: '/products',
    children: [
      { label: 'Features', href: '/features' },
      { label: 'Integrations', href: '/integrations' },
      { label: 'API', href: '/api' },
      { label: 'Security', href: '/security' }
    ]
  },
  {
    label: 'Company',
    href: '/company',
    children: [
      { label: 'About Us', href: '/about' },
      { label: 'Careers', href: '/careers' },
      { label: 'Press', href: '/press' },
      { label: 'Contact', href: '/contact' }
    ]
  },
  {
    label: 'Resources',
    href: '/resources',
    children: [
      { label: 'Blog', href: '/blog' },
      { label: 'Help Center', href: '/help' },
      { label: 'Community', href: '/community' },
      { label: 'Status', href: '/status', external: true }
    ]
  },
  {
    label: 'Legal',
    href: '/legal',
    children: [
      { label: 'Privacy Policy', href: '/privacy' },
      { label: 'Terms of Service', href: '/terms' },
      { label: 'Cookie Policy', href: '/cookies' },
      { label: 'GDPR', href: '/gdpr' }
    ]
  }
];

// Route patterns for dynamic routing
export const ROUTE_PATTERNS = {
  HOME: '/',
  BLOG_POST: '/blog/[slug]',
  PRODUCT_PAGE: '/products/[slug]',
  SOLUTION_PAGE: '/solutions/[slug]',
  CUSTOMER_STORY: '/customers/[slug]',
  RESOURCE_PAGE: '/resources/[slug]',
  CATEGORY_PAGE: '/[category]',
  DYNAMIC_PAGE: '/[...slug]'
};

// Navigation utilities
export class NavigationManager {
  private static instance: NavigationManager;
  private prefetchedRoutes: Set<string> = new Set();
  private router: any = null;

  static getInstance(): NavigationManager {
    if (!NavigationManager.instance) {
      NavigationManager.instance = new NavigationManager();
    }
    return NavigationManager.instance;
  }

  setRouter(router: any) {
    this.router = router;
  }

  /**
   * Navigate to a route with optional transition
   */
  async navigate(href: string, options: {
    replace?: boolean;
    scroll?: boolean;
    transition?: boolean;
  } = {}): Promise<void> {
    if (!this.router) return;

    const { replace = false, scroll = true, transition = true } = options;

    if (transition) {
      // Add page transition class
      document.documentElement.classList.add('page-transitioning');
    }

    try {
      if (replace) {
        await this.router.replace(href, { scroll });
      } else {
        await this.router.push(href, { scroll });
      }
    } finally {
      if (transition) {
        // Remove transition class after navigation
        setTimeout(() => {
          document.documentElement.classList.remove('page-transitioning');
        }, 300);
      }
    }
  }

  /**
   * Prefetch a route for faster navigation
   */
  prefetch(href: string): void {
    if (!this.router || this.prefetchedRoutes.has(href)) return;

    this.router.prefetch(href);
    this.prefetchedRoutes.add(href);
  }

  /**
   * Prefetch multiple routes
   */
  prefetchRoutes(routes: string[]): void {
    routes.forEach(route => this.prefetch(route));
  }

  /**
   * Check if a route is currently active
   */
  isActive(href: string, pathname: string, exact: boolean = false): boolean {
    if (exact) {
      return pathname === href;
    }
    return pathname.startsWith(href) && (href === '/' ? pathname === '/' : true);
  }

  /**
   * Generate breadcrumbs from current path
   */
  generateBreadcrumbs(pathname: string, customLabels: Record<string, string> = {}): BreadcrumbItem[] {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [
      { label: 'Home', href: '/', current: pathname === '/' }
    ];

    if (pathname === '/') return breadcrumbs;

    let currentPath = '';
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === segments.length - 1;
      
      const label = customLabels[segment] || this.formatSegmentLabel(segment);
      
      breadcrumbs.push({
        label,
        href: currentPath,
        current: isLast
      });
    });

    return breadcrumbs;
  }

  /**
   * Format URL segment into readable label
   */
  private formatSegmentLabel(segment: string): string {
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  /**
   * Get navigation item by href
   */
  findNavigationItem(href: string, navigation: NavigationItem[] = MAIN_NAVIGATION): NavigationItem | null {
    for (const item of navigation) {
      if (item.href === href) {
        return item;
      }
      if (item.children) {
        const found = this.findNavigationItem(href, item.children);
        if (found) return found;
      }
    }
    return null;
  }

  /**
   * Get all navigation links for prefetching
   */
  getAllNavigationLinks(navigation: NavigationItem[] = MAIN_NAVIGATION): string[] {
    const links: string[] = [];
    
    const extractLinks = (items: NavigationItem[]) => {
      items.forEach(item => {
        if (!item.external) {
          links.push(item.href);
        }
        if (item.children) {
          extractLinks(item.children);
        }
      });
    };

    extractLinks(navigation);
    return links;
  }
}

// React hooks for navigation
export function useNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);

  const navigationManager = NavigationManager.getInstance();
  
  useEffect(() => {
    navigationManager.setRouter(router);
  }, [router]);

  const navigate = useCallback(async (href: string, options?: {
    replace?: boolean;
    scroll?: boolean;
    transition?: boolean;
  }) => {
    setIsNavigating(true);
    try {
      await navigationManager.navigate(href, options);
    } finally {
      setIsNavigating(false);
    }
  }, [navigationManager]);

  const prefetch = useCallback((href: string) => {
    navigationManager.prefetch(href);
  }, [navigationManager]);

  const isActive = useCallback((href: string, exact: boolean = false) => {
    return navigationManager.isActive(href, pathname, exact);
  }, [navigationManager, pathname]);

  const breadcrumbs = useCallback((customLabels?: Record<string, string>) => {
    return navigationManager.generateBreadcrumbs(pathname, customLabels);
  }, [navigationManager, pathname]);

  return {
    navigate,
    prefetch,
    isActive,
    breadcrumbs,
    isNavigating,
    pathname,
    router
  };
}

// Hook for route change detection
export function useRouteChange(callback: (url: string) => void) {
  const pathname = usePathname();

  useEffect(() => {
    callback(pathname);
  }, [pathname, callback]);
}

// Hook for prefetching navigation links
export function usePrefetchNavigation(navigation: NavigationItem[] = MAIN_NAVIGATION) {
  const navigationManager = NavigationManager.getInstance();

  useEffect(() => {
    const links = navigationManager.getAllNavigationLinks(navigation);
    const priorityLinks = links.filter(link => {
      const item = navigationManager.findNavigationItem(link, navigation);
      return item?.prefetch;
    });

    // Prefetch priority links immediately
    navigationManager.prefetchRoutes(priorityLinks);

    // Prefetch other links after a delay
    const timer = setTimeout(() => {
      const otherLinks = links.filter(link => !priorityLinks.includes(link));
      navigationManager.prefetchRoutes(otherLinks);
    }, 2000);

    return () => clearTimeout(timer);
  }, [navigation, navigationManager]);
}

// Route matching utilities
export function matchRoute(pathname: string, pattern: string): { match: boolean; params: Record<string, string> } {
  const patternParts = pattern.split('/');
  const pathParts = pathname.split('/');

  if (patternParts.length !== pathParts.length && !pattern.includes('[...')) {
    return { match: false, params: {} };
  }

  const params: Record<string, string> = {};
  let match = true;

  for (let i = 0; i < patternParts.length; i++) {
    const patternPart = patternParts[i];
    const pathPart = pathParts[i];

    if (patternPart.startsWith('[...')) {
      // Catch-all route
      const paramName = patternPart.slice(4, -1);
      params[paramName] = pathParts.slice(i).join('/');
      break;
    } else if (patternPart.startsWith('[') && patternPart.endsWith(']')) {
      // Dynamic route
      const paramName = patternPart.slice(1, -1);
      params[paramName] = pathPart;
    } else if (patternPart !== pathPart) {
      match = false;
      break;
    }
  }

  return { match, params };
}

// Get route type from pathname
export function getRouteType(pathname: string): string {
  for (const [type, pattern] of Object.entries(ROUTE_PATTERNS)) {
    const { match } = matchRoute(pathname, pattern);
    if (match) {
      return type;
    }
  }
  return 'UNKNOWN';
}