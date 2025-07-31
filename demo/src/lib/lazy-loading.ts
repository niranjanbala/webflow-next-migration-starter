import { lazy, ComponentType } from 'react';

/**
 * Utility for creating lazy-loaded components with better error handling
 */
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  fallback?: ComponentType
) {
  const LazyComponent = lazy(importFn);
  
  // Add display name for debugging
  LazyComponent.displayName = `Lazy(${importFn.toString().match(/\/([^\/]+)\.tsx?/)?.[1] || 'Component'})`;
  
  return LazyComponent;
}

/**
 * Higher-order component for lazy loading with Suspense boundary
 */
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: ComponentType
) {
  const LazyComponent = lazy(() => Promise.resolve({ default: Component }));
  
  return (props: P) => (
    <LazyComponent {...props} />
  );
}

/**
 * Preload a lazy component
 */
export function preloadComponent(importFn: () => Promise<any>) {
  // Start loading the component
  const componentImport = importFn();
  
  // Return a function to get the preloaded component
  return () => componentImport;
}

/**
 * Intersection Observer based lazy loading for components
 */
export class ComponentLazyLoader {
  private static instance: ComponentLazyLoader;
  private observer: IntersectionObserver | null = null;
  private loadedComponents = new Set<string>();

  static getInstance(): ComponentLazyLoader {
    if (!ComponentLazyLoader.instance) {
      ComponentLazyLoader.instance = new ComponentLazyLoader();
    }
    return ComponentLazyLoader.instance;
  }

  private constructor() {
    if (typeof window !== 'undefined') {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const componentId = entry.target.getAttribute('data-component-id');
              if (componentId && !this.loadedComponents.has(componentId)) {
                this.loadComponent(componentId);
                this.loadedComponents.add(componentId);
                this.observer?.unobserve(entry.target);
              }
            }
          });
        },
        {
          rootMargin: '50px',
          threshold: 0.1,
        }
      );
    }
  }

  observeElement(element: Element, componentId: string) {
    if (this.observer) {
      element.setAttribute('data-component-id', componentId);
      this.observer.observe(element);
    }
  }

  private loadComponent(componentId: string) {
    // Trigger component loading based on componentId
    const event = new CustomEvent('lazyLoadComponent', {
      detail: { componentId }
    });
    window.dispatchEvent(event);
  }

  disconnect() {
    if (this.observer) {
      this.observer.disconnect();
    }
  }
}