'use client';

export interface PerformanceMetrics {
  // Core Web Vitals
  lcp?: number; // Largest Contentful Paint
  fid?: number; // First Input Delay
  cls?: number; // Cumulative Layout Shift
  fcp?: number; // First Contentful Paint
  ttfb?: number; // Time to First Byte
  
  // Custom metrics
  navigationStart?: number;
  domContentLoaded?: number;
  loadComplete?: number;
  
  // Resource metrics
  resourceCount?: number;
  totalResourceSize?: number;
  
  // User experience metrics
  pageLoadTime?: number;
  timeToInteractive?: number;
}

export interface PerformanceEntry {
  name: string;
  entryType: string;
  startTime: number;
  duration: number;
  value?: number;
}

export class PerformanceMonitor {
  private static instance: PerformanceMonitor;
  private metrics: PerformanceMetrics = {};
  private observers: PerformanceObserver[] = [];
  private isInitialized = false;

  static getInstance(): PerformanceMonitor {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor();
    }
    return PerformanceMonitor.instance;
  }

  /**
   * Initialize performance monitoring
   */
  init(): void {
    if (this.isInitialized || typeof window === 'undefined') return;

    this.isInitialized = true;
    this.setupCoreWebVitals();
    this.setupNavigationTiming();
    this.setupResourceTiming();
    this.setupCustomMetrics();
  }

  /**
   * Setup Core Web Vitals monitoring
   */
  private setupCoreWebVitals(): void {
    // Largest Contentful Paint (LCP)
    this.observePerformance('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.metrics.lcp = lastEntry.startTime;
      this.reportMetric('LCP', lastEntry.startTime);
    });

    // First Input Delay (FID)
    this.observePerformance('first-input', (entries) => {
      const firstEntry = entries[0];
      this.metrics.fid = firstEntry.processingStart - firstEntry.startTime;
      this.reportMetric('FID', this.metrics.fid);
    });

    // Cumulative Layout Shift (CLS)
    this.observePerformance('layout-shift', (entries) => {
      let clsValue = 0;
      entries.forEach((entry) => {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      });
      this.metrics.cls = clsValue;
      this.reportMetric('CLS', clsValue);
    });

    // First Contentful Paint (FCP)
    this.observePerformance('paint', (entries) => {
      entries.forEach((entry) => {
        if (entry.name === 'first-contentful-paint') {
          this.metrics.fcp = entry.startTime;
          this.reportMetric('FCP', entry.startTime);
        }
      });
    });
  }

  /**
   * Setup navigation timing monitoring
   */
  private setupNavigationTiming(): void {
    if ('performance' in window && 'getEntriesByType' in performance) {
      const navigationEntries = performance.getEntriesByType('navigation') as PerformanceNavigationTiming[];
      
      if (navigationEntries.length > 0) {
        const nav = navigationEntries[0];
        
        this.metrics.navigationStart = nav.navigationStart || nav.fetchStart;
        this.metrics.domContentLoaded = nav.domContentLoadedEventEnd - nav.navigationStart;
        this.metrics.loadComplete = nav.loadEventEnd - nav.navigationStart;
        this.metrics.ttfb = nav.responseStart - nav.requestStart;
        this.metrics.pageLoadTime = nav.loadEventEnd - nav.navigationStart;

        this.reportMetric('TTFB', this.metrics.ttfb);
        this.reportMetric('DOM_CONTENT_LOADED', this.metrics.domContentLoaded);
        this.reportMetric('LOAD_COMPLETE', this.metrics.loadComplete);
      }
    }
  }

  /**
   * Setup resource timing monitoring
   */
  private setupResourceTiming(): void {
    this.observePerformance('resource', (entries) => {
      let totalSize = 0;
      let resourceCount = 0;

      entries.forEach((entry) => {
        resourceCount++;
        if ('transferSize' in entry) {
          totalSize += (entry as any).transferSize || 0;
        }
      });

      this.metrics.resourceCount = resourceCount;
      this.metrics.totalResourceSize = totalSize;
    });
  }

  /**
   * Setup custom performance metrics
   */
  private setupCustomMetrics(): void {
    // Time to Interactive (TTI) approximation
    if ('performance' in window) {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (entry.entryType === 'measure' && entry.name === 'time-to-interactive') {
            this.metrics.timeToInteractive = entry.duration;
            this.reportMetric('TTI', entry.duration);
          }
        });
      });

      try {
        observer.observe({ entryTypes: ['measure'] });
        this.observers.push(observer);
      } catch (error) {
        console.warn('Performance Observer not supported for measures:', error);
      }
    }
  }

  /**
   * Observe performance entries
   */
  private observePerformance(entryType: string, callback: (entries: any[]) => void): void {
    if (!('PerformanceObserver' in window)) return;

    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });

      observer.observe({ entryTypes: [entryType] });
      this.observers.push(observer);
    } catch (error) {
      console.warn(`Performance Observer not supported for ${entryType}:`, error);
    }
  }

  /**
   * Report metric to analytics
   */
  private reportMetric(name: string, value: number): void {
    // Send to analytics service
    if (typeof window !== 'undefined' && 'gtag' in window) {
      (window as any).gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: name,
        value: Math.round(value),
        non_interaction: true
      });
    }

    // Log for development
    if (process.env.NODE_ENV === 'development') {
      console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);
    }
  }

  /**
   * Get current metrics
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Mark a custom performance point
   */
  mark(name: string): void {
    if ('performance' in window && 'mark' in performance) {
      performance.mark(name);
    }
  }

  /**
   * Measure time between two marks
   */
  measure(name: string, startMark: string, endMark?: string): number | null {
    if ('performance' in window && 'measure' in performance) {
      try {
        if (endMark) {
          performance.measure(name, startMark, endMark);
        } else {
          performance.measure(name, startMark);
        }

        const measures = performance.getEntriesByName(name, 'measure');
        if (measures.length > 0) {
          const duration = measures[measures.length - 1].duration;
          this.reportMetric(name, duration);
          return duration;
        }
      } catch (error) {
        console.warn('Performance measure failed:', error);
      }
    }
    return null;
  }

  /**
   * Get Core Web Vitals score
   */
  getCoreWebVitalsScore(): {
    lcp: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    fid: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    cls: 'good' | 'needs-improvement' | 'poor' | 'unknown';
    overall: 'good' | 'needs-improvement' | 'poor' | 'unknown';
  } {
    const lcpScore = this.metrics.lcp 
      ? this.metrics.lcp <= 2500 ? 'good' : this.metrics.lcp <= 4000 ? 'needs-improvement' : 'poor'
      : 'unknown';

    const fidScore = this.metrics.fid
      ? this.metrics.fid <= 100 ? 'good' : this.metrics.fid <= 300 ? 'needs-improvement' : 'poor'
      : 'unknown';

    const clsScore = this.metrics.cls !== undefined
      ? this.metrics.cls <= 0.1 ? 'good' : this.metrics.cls <= 0.25 ? 'needs-improvement' : 'poor'
      : 'unknown';

    // Overall score is the worst individual score
    const scores = [lcpScore, fidScore, clsScore].filter(score => score !== 'unknown');
    let overall: 'good' | 'needs-improvement' | 'poor' | 'unknown' = 'unknown';
    
    if (scores.length > 0) {
      if (scores.includes('poor')) overall = 'poor';
      else if (scores.includes('needs-improvement')) overall = 'needs-improvement';
      else overall = 'good';
    }

    return { lcp: lcpScore, fid: fidScore, cls: clsScore, overall };
  }

  /**
   * Get performance recommendations
   */
  getRecommendations(): string[] {
    const recommendations: string[] = [];
    const scores = this.getCoreWebVitalsScore();

    if (scores.lcp === 'poor' || scores.lcp === 'needs-improvement') {
      recommendations.push('Optimize Largest Contentful Paint by reducing server response times and optimizing images');
    }

    if (scores.fid === 'poor' || scores.fid === 'needs-improvement') {
      recommendations.push('Improve First Input Delay by reducing JavaScript execution time and using code splitting');
    }

    if (scores.cls === 'poor' || scores.cls === 'needs-improvement') {
      recommendations.push('Reduce Cumulative Layout Shift by setting dimensions for images and avoiding dynamic content insertion');
    }

    if (this.metrics.ttfb && this.metrics.ttfb > 600) {
      recommendations.push('Improve Time to First Byte by optimizing server response times');
    }

    if (this.metrics.totalResourceSize && this.metrics.totalResourceSize > 1000000) {
      recommendations.push('Reduce total resource size by optimizing images and using compression');
    }

    return recommendations;
  }

  /**
   * Export metrics for analysis
   */
  exportMetrics(): string {
    const data = {
      timestamp: new Date().toISOString(),
      url: typeof window !== 'undefined' ? window.location.href : '',
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      metrics: this.metrics,
      scores: this.getCoreWebVitalsScore(),
      recommendations: this.getRecommendations()
    };

    return JSON.stringify(data, null, 2);
  }

  /**
   * Cleanup observers
   */
  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.isInitialized = false;
  }
}

// Export singleton instance
export const performanceMonitor = PerformanceMonitor.getInstance();

// Auto-initialize in browser environment
if (typeof window !== 'undefined') {
  // Initialize after page load
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      performanceMonitor.init();
    });
  } else {
    performanceMonitor.init();
  }
}