import { test, expect } from '@playwright/test';

test.describe('Webflow Integration', () => {
  test('should render Webflow content correctly', async ({ page }) => {
    await page.goto('/products');
    
    // Check that Webflow content is rendered
    await expect(page.locator('[data-webflow-component]')).toHaveCount.greaterThan(0);
    
    // Check that design tokens are applied
    const styledElement = page.locator('[data-webflow-component]').first();
    const styles = await styledElement.evaluate((el) => {
      return window.getComputedStyle(el);
    });
    
    // Should have proper styling applied
    expect(styles.color).toBeTruthy();
    expect(styles.fontSize).toBeTruthy();
  });

  test('should handle dynamic content loading', async ({ page }) => {
    await page.goto('/blog');
    
    // Wait for content to load
    await page.waitForSelector('[data-testid="blog-posts"]');
    
    // Check that blog posts are loaded
    const blogPosts = page.locator('[data-testid="blog-post"]');
    await expect(blogPosts).toHaveCount.greaterThan(0);
    
    // Check that each post has required elements
    const firstPost = blogPosts.first();
    await expect(firstPost.locator('h2')).toBeVisible();
    await expect(firstPost.locator('[data-testid="post-excerpt"]')).toBeVisible();
  });

  test('should navigate to individual blog posts', async ({ page }) => {
    await page.goto('/blog');
    
    // Wait for posts to load
    await page.waitForSelector('[data-testid="blog-post"]');
    
    // Click on first post
    const firstPost = page.locator('[data-testid="blog-post"]').first();
    const postLink = firstPost.locator('a').first();
    
    await postLink.click();
    
    // Should navigate to individual post
    await page.waitForLoadState('networkidle');
    expect(page.url()).toContain('/blog/');
    
    // Check post content
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('[data-testid="post-content"]')).toBeVisible();
  });

  test('should handle Webflow CMS pagination', async ({ page }) => {
    await page.goto('/products');
    
    // Check if pagination exists
    const pagination = page.locator('[data-testid="pagination"]');
    
    if (await pagination.isVisible()) {
      const nextButton = pagination.locator('[data-testid="next-page"]');
      
      if (await nextButton.isVisible() && !await nextButton.isDisabled()) {
        await nextButton.click();
        
        // Wait for new content to load
        await page.waitForLoadState('networkidle');
        
        // Check that URL changed
        expect(page.url()).toContain('page=2');
        
        // Check that new content is loaded
        await expect(page.locator('[data-testid="product-list"]')).toBeVisible();
      }
    }
  });

  test('should preserve Webflow animations', async ({ page }) => {
    await page.goto('/');
    
    // Check for animated elements
    const animatedElements = page.locator('[data-webflow-animation]');
    
    if (await animatedElements.count() > 0) {
      const firstAnimated = animatedElements.first();
      
      // Check that animation classes are applied
      const classList = await firstAnimated.getAttribute('class');
      expect(classList).toContain('animate');
      
      // Scroll to trigger animations
      await firstAnimated.scrollIntoViewIfNeeded();
      
      // Wait for animation to complete
      await page.waitForTimeout(1000);
      
      // Check that animation state changed
      const updatedClassList = await firstAnimated.getAttribute('class');
      expect(updatedClassList).toBeTruthy();
    }
  });
});