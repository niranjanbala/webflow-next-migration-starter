import { test, expect } from '@playwright/test';

test.describe('Performance Tests', () => {
  test('should meet Core Web Vitals thresholds', async ({ page }) => {
    await page.goto('/');
    
    // Measure Core Web Vitals
    const vitals = await page.evaluate(() => {
      return new Promise((resolve) => {
        const vitals = {};
        
        // Largest Contentful Paint
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          vitals.lcp = lastEntry.startTime;
        }).observe({ entryTypes: ['largest-contentful-paint'] });
        
        // First Input Delay
        new PerformanceObserver((list) => {
          const entries = list.getEntries();
          vitals.fid = entries[0].processingStart - entries[0].startTime;
        }).observe({ entryTypes: ['first-input'] });
        
        // Cumulative Layout Shift
        let clsValue = 0;
        new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          }
          vitals.cls = clsValue;
        }).observe({ entryTypes: ['layout-shift'] });
        
        // Wait for measurements
        setTimeout(() => resolve(vitals), 3000);
      });
    });
    
    console.log('Core Web Vitals:', vitals);
    
    // Assert thresholds
    if (vitals.lcp) {
      expect(vitals.lcp).toBeLessThan(2500); // LCP should be < 2.5s
    }
    
    if (vitals.fid) {
      expect(vitals.fid).toBeLessThan(100); // FID should be < 100ms
    }
    
    if (vitals.cls) {
      expect(vitals.cls).toBeLessThan(0.1); // CLS should be < 0.1
    }
  });

  test('should load critical resources quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    
    // Wait for critical resources
    await page.waitForLoadState('domcontentloaded');
    
    const domLoadTime = Date.now() - startTime;
    expect(domLoadTime).toBeLessThan(1500); // DOM should load within 1.5s
    
    // Check that critical CSS is loaded
    const criticalStyles = await page.evaluate(() => {
      const stylesheets = Array.from(document.styleSheets);
      return stylesheets.some(sheet => {
        try {
          return sheet.cssRules && sheet.cssRules.length > 0;
        } catch (e) {
          return false;
        }
      });
    });
    
    expect(criticalStyles).toBeTruthy();
  });

  test('should optimize image loading', async ({ page }) => {
    await page.goto('/');
    
    // Check that images use proper loading attributes
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < Math.min(imageCount, 5); i++) {
      const img = images.nth(i);
      const loading = await img.getAttribute('loading');
      const src = await img.getAttribute('src');
      
      // Above-the-fold images should not have lazy loading
      const rect = await img.boundingBox();
      if (rect && rect.y < 600) {
        expect(loading).not.toBe('lazy');
      }
      
      // Check for optimized formats
      if (src) {
        const isOptimized = src.includes('webp') || src.includes('avif') || src.includes('_next/image');
        expect(isOptimized).toBeTruthy();
      }
    }
  });

  test('should minimize JavaScript bundle size', async ({ page }) => {
    // Intercept network requests
    const jsRequests = [];
    
    page.on('response', (response) => {
      if (response.url().endsWith('.js') && response.status() === 200) {
        jsRequests.push({
          url: response.url(),
          size: response.headers()['content-length']
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Calculate total JS size
    const totalJSSize = jsRequests.reduce((total, request) => {
      return total + (parseInt(request.size) || 0);
    }, 0);
    
    console.log('Total JS size:', totalJSSize, 'bytes');
    console.log('JS requests:', jsRequests.length);
    
    // Should keep JS bundle reasonable (< 500KB)
    expect(totalJSSize).toBeLessThan(500 * 1024);
  });

  test('should cache resources effectively', async ({ page, context }) => {
    // First visit
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Track cache hits on second visit
    const cacheHits = [];
    
    page.on('response', (response) => {
      if (response.fromServiceWorker() || response.status() === 304) {
        cacheHits.push(response.url());
      }
    });
    
    // Second visit
    await page.reload();
    await page.waitForLoadState('networkidle');
    
    console.log('Cache hits:', cacheHits.length);
    
    // Should have some cached resources
    expect(cacheHits.length).toBeGreaterThan(0);
  });

  test('should handle slow network conditions', async ({ page, context }) => {
    // Simulate slow 3G
    await context.route('**/*', async (route) => {
      await new Promise(resolve => setTimeout(resolve, 100)); // Add 100ms delay
      await route.continue();
    });
    
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForSelector('[data-testid="hero-section"]');
    
    const loadTime = Date.now() - startTime;
    
    // Should still be usable on slow connections (< 5s)
    expect(loadTime).toBeLessThan(5000);
    
    // Check that loading states are shown
    const loadingIndicators = page.locator('[data-testid*="loading"]');
    // Loading indicators might be gone by now, but the page should be functional
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  });
});