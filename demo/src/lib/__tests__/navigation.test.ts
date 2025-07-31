/**
 * @jest-environment jsdom
 */

import {
  NavigationManager,
  matchRoute,
  getRouteType,
  MAIN_NAVIGATION,
  ROUTE_PATTERNS
} from '../navigation';

// Mock Next.js router
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn()
};

describe('Navigation Utilities', () => {
  let navigationManager: NavigationManager;

  beforeEach(() => {
    navigationManager = NavigationManager.getInstance();
    navigationManager.setRouter(mockRouter);
    jest.clearAllMocks();
  });

  describe('NavigationManager', () => {
    it('creates singleton instance', () => {
      const instance1 = NavigationManager.getInstance();
      const instance2 = NavigationManager.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('navigates to route', async () => {
      await navigationManager.navigate('/test-route');
      expect(mockRouter.push).toHaveBeenCalledWith('/test-route', { scroll: true });
    });

    it('navigates with replace option', async () => {
      await navigationManager.navigate('/test-route', { replace: true });
      expect(mockRouter.replace).toHaveBeenCalledWith('/test-route', { scroll: true });
    });

    it('prefetches routes', () => {
      navigationManager.prefetch('/test-route');
      expect(mockRouter.prefetch).toHaveBeenCalledWith('/test-route');
    });

    it('does not prefetch same route twice', () => {
      // First call should prefetch
      navigationManager.prefetch('/test-route');
      expect(mockRouter.prefetch).toHaveBeenCalledWith('/test-route');
      
      // Second call should not prefetch again
      mockRouter.prefetch.mockClear();
      navigationManager.prefetch('/test-route');
      expect(mockRouter.prefetch).not.toHaveBeenCalled();
    });

    it('checks if route is active', () => {
      expect(navigationManager.isActive('/products', '/products/item', false)).toBe(true);
      expect(navigationManager.isActive('/products', '/products/item', true)).toBe(false);
      expect(navigationManager.isActive('/products', '/products', true)).toBe(true);
    });

    it('handles home route correctly', () => {
      expect(navigationManager.isActive('/', '/', true)).toBe(true);
      expect(navigationManager.isActive('/', '/products', false)).toBe(false);
    });

    it('generates breadcrumbs from pathname', () => {
      const breadcrumbs = navigationManager.generateBreadcrumbs('/products/tax-automation');
      
      expect(breadcrumbs).toHaveLength(3);
      expect(breadcrumbs[0]).toEqual({ label: 'Home', href: '/', current: false });
      expect(breadcrumbs[1]).toEqual({ label: 'Products', href: '/products', current: false });
      expect(breadcrumbs[2]).toEqual({ label: 'Tax Automation', href: '/products/tax-automation', current: true });
    });

    it('generates breadcrumbs with custom labels', () => {
      const customLabels = { 'tax-automation': 'Tax Solutions' };
      const breadcrumbs = navigationManager.generateBreadcrumbs('/products/tax-automation', customLabels);
      
      expect(breadcrumbs[2].label).toBe('Tax Solutions');
    });

    it('returns only home for root path', () => {
      const breadcrumbs = navigationManager.generateBreadcrumbs('/');
      expect(breadcrumbs).toHaveLength(1);
      expect(breadcrumbs[0]).toEqual({ label: 'Home', href: '/', current: true });
    });

    it('finds navigation item by href', () => {
      const item = navigationManager.findNavigationItem('/pricing');
      expect(item).toBeTruthy();
      expect(item?.label).toBe('Pricing');
    });

    it('finds nested navigation item', () => {
      const item = navigationManager.findNavigationItem('/blog');
      expect(item).toBeTruthy();
      expect(item?.label).toBe('Blog');
    });

    it('returns null for non-existent navigation item', () => {
      const item = navigationManager.findNavigationItem('/non-existent');
      expect(item).toBeNull();
    });

    it('gets all navigation links', () => {
      const links = navigationManager.getAllNavigationLinks();
      expect(links.length).toBeGreaterThan(0);
      expect(links.every(link => typeof link === 'string')).toBe(true);
    });
  });

  describe('Route Matching', () => {
    it('matches exact routes', () => {
      expect(matchRoute('/products', '/products').match).toBe(true);
      expect(matchRoute('/products', '/products/item').match).toBe(false);
    });

    it('matches dynamic routes', () => {
      expect(matchRoute('/products/123', '/products/[id]').match).toBe(true);
      expect(matchRoute('/products/abc', '/products/[id]').match).toBe(true);
      expect(matchRoute('/products', '/products/[id]').match).toBe(false);
    });

    it('extracts route parameters', () => {
      const result = matchRoute('/products/123', '/products/[id]');
      expect(result.match).toBe(true);
      expect(result.params.id).toBe('123');
    });
  });

  describe('Route Type Detection', () => {
    it('detects route types from patterns', () => {
      expect(getRouteType('/')).toBe('HOME');
      expect(getRouteType('/blog/test-post')).toBe('BLOG_POST');
      expect(getRouteType('/products/tax-automation')).toBe('PRODUCT_PAGE');
    });

    it('returns UNKNOWN for unmatched routes', () => {
      expect(getRouteType('/completely/unknown/route/that/does/not/match')).toBe('UNKNOWN');
    });
  });

  describe('Navigation Configuration', () => {
    it('has valid main navigation structure', () => {
      expect(Array.isArray(MAIN_NAVIGATION)).toBe(true);
      expect(MAIN_NAVIGATION.length).toBeGreaterThan(0);
      
      MAIN_NAVIGATION.forEach(item => {
        expect(item).toHaveProperty('label');
        expect(item).toHaveProperty('href');
        expect(typeof item.label).toBe('string');
        expect(typeof item.href).toBe('string');
      });
    });

    it('has valid route patterns', () => {
      expect(typeof ROUTE_PATTERNS).toBe('object');
      expect(Object.keys(ROUTE_PATTERNS).length).toBeGreaterThan(0);
      
      Object.entries(ROUTE_PATTERNS).forEach(([key, pattern]) => {
        expect(typeof key).toBe('string');
        expect(typeof pattern).toBe('string');
      });
    });
  });
});

// Mock useRouter hook for component tests
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '/test-path',
  useSearchParams: () => new URLSearchParams()
}));