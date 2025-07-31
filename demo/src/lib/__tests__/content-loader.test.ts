import { ContentLoader } from '../content-loader';

describe('ContentLoader', () => {
  let contentLoader: ContentLoader;

  beforeEach(() => {
    contentLoader = new ContentLoader();
  });

  describe('getPage', () => {
    it('should load the home page content', async () => {
      const homePage = await contentLoader.getPage('home');
      
      expect(homePage).toBeTruthy();
      expect(homePage?.slug).toBe('home');
      expect(homePage?.title).toContain('Numeral');
      expect(homePage?.sections).toBeDefined();
      expect(homePage?.sections.length).toBeGreaterThan(0);
    });

    it('should load a product page', async () => {
      const productPage = await contentLoader.getPage('product-api', 'product');
      
      expect(productPage).toBeTruthy();
      expect(productPage?.slug).toBe('product-api');
      expect(productPage?.sections).toBeDefined();
    });

    it('should return null for non-existent page', async () => {
      const nonExistentPage = await contentLoader.getPage('non-existent-page');
      expect(nonExistentPage).toBeNull();
    });
  });

  describe('getAllPages', () => {
    it('should load all available pages', async () => {
      const allPages = await contentLoader.getAllPages();
      
      expect(allPages).toBeDefined();
      expect(allPages.length).toBeGreaterThan(0);
      
      // Check that we have the expected pages
      const slugs = allPages.map(page => page.slug);
      expect(slugs).toContain('home');
      expect(slugs).toContain('about');
      expect(slugs).toContain('pricing');
    });
  });

  describe('getPageSlugs', () => {
    it('should return all available page slugs', async () => {
      const slugs = await contentLoader.getPageSlugs();
      
      expect(slugs).toBeDefined();
      expect(slugs.length).toBeGreaterThan(0);
      expect(slugs).toContain('home');
    });
  });

  describe('getSitemap', () => {
    it('should load the comprehensive sitemap', async () => {
      const sitemap = await contentLoader.getSitemap();
      
      expect(sitemap).toBeTruthy();
      expect(sitemap?.pages).toBeDefined();
      expect(sitemap?.categories).toBeDefined();
    });
  });

  describe('getPagesByCategory', () => {
    it('should load blog pages', async () => {
      const blogPages = await contentLoader.getPagesByCategory('blog');
      
      expect(blogPages).toBeDefined();
      expect(Array.isArray(blogPages)).toBe(true);
    });

    it('should load product pages', async () => {
      const productPages = await contentLoader.getPagesByCategory('product');
      
      expect(productPages).toBeDefined();
      expect(Array.isArray(productPages)).toBe(true);
    });
  });

  describe('getCategoryIndex', () => {
    it('should load blog index', async () => {
      const blogIndex = await contentLoader.getCategoryIndex('blog');
      
      expect(blogIndex).toBeTruthy();
      expect(blogIndex?.category).toBe('blog');
    });
  });
});