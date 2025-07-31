import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load homepage successfully', async ({ page }) => {
    // Check that the page loads
    await expect(page).toHaveTitle(/NumeralHQ/);
    
    // Check for main navigation
    await expect(page.locator('nav')).toBeVisible();
    
    // Check for hero section
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  });

  test('should have working navigation', async ({ page }) => {
    // Test navigation links
    const navLinks = page.locator('nav a');
    const firstLink = navLinks.first();
    
    await expect(firstLink).toBeVisible();
    await firstLink.click();
    
    // Wait for navigation
    await page.waitForLoadState('networkidle');
    
    // Check that we navigated
    expect(page.url()).not.toBe('http://localhost:3000/');
  });

  test('should be accessible', async ({ page }) => {
    // Check for proper heading hierarchy
    const h1 = page.locator('h1');
    await expect(h1).toBeVisible();
    
    // Check for alt text on images
    const images = page.locator('img');
    const imageCount = await images.count();
    
    for (let i = 0; i < imageCount; i++) {
      const img = images.nth(i);
      await expect(img).toHaveAttribute('alt');
    }
    
    // Check for proper ARIA labels
    const buttons = page.locator('button');
    const buttonCount = await buttons.count();
    
    for (let i = 0; i < buttonCount; i++) {
      const button = buttons.nth(i);
      const hasAriaLabel = await button.getAttribute('aria-label');
      const hasText = await button.textContent();
      
      expect(hasAriaLabel || hasText).toBeTruthy();
    }
  });

  test('should work on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Check mobile navigation
    const mobileMenuButton = page.locator('[data-testid="mobile-menu-button"]');
    if (await mobileMenuButton.isVisible()) {
      await mobileMenuButton.click();
      await expect(page.locator('[data-testid="mobile-menu"]')).toBeVisible();
    }
    
    // Check responsive layout
    await expect(page.locator('[data-testid="hero-section"]')).toBeVisible();
  });

  test('should load quickly', async ({ page }) => {
    const startTime = Date.now();
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const loadTime = Date.now() - startTime;
    
    // Should load within 3 seconds
    expect(loadTime).toBeLessThan(3000);
    
    // Check that critical resources are loaded
    const images = page.locator('img[src*="hero"]');
    if (await images.count() > 0) {
      await expect(images.first()).toBeVisible();
    }
  });

  test('should handle offline scenarios', async ({ page, context }) => {
    // Go offline
    await context.setOffline(true);
    
    // Try to navigate
    await page.goto('/');
    
    // Should show offline page or cached content
    const offlineIndicator = page.locator('[data-testid="offline-indicator"]');
    const cachedContent = page.locator('[data-testid="hero-section"]');
    
    const hasOfflineIndicator = await offlineIndicator.isVisible();
    const hasCachedContent = await cachedContent.isVisible();
    
    expect(hasOfflineIndicator || hasCachedContent).toBeTruthy();
    
    // Go back online
    await context.setOffline(false);
  });
});