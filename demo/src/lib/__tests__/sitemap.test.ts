/**
 * @jest-environment jsdom
 */

import {
  generateSitemapEntries,
  generateSitemapXML,
  generateRobotsTxt
} from '../sitemap';
import { ContentItem } from '../content-loader';

describe('Sitemap Utilities', () => {
  const mockContent: ContentItem[] = [
    {
      id: '1',
      title: 'Test Blog Post',
      slug: 'test-blog-post',
      category: 'blog',
      content: 'Test content',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-02T00:00:00Z'
    },
    {
      id: '2',
      title: 'Test Product',
      slug: 'test-product',
      category: 'products',
      content: 'Product content',
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-03T00:00:00Z'
    },
    {
      id: '3',
      title: 'Test Customer Story',
      slug: 'test-customer',
      category: 'customers',
      content: 'Customer content',
      createdAt: '2024-01-01T00:00:00Z'
    }
  ];

  describe('generateSitemapEntries', () => {
    it('generates sitemap entries with static and dynamic pages', () => {
      const entries = generateSitemapEntries(mockContent);
      
      // Should include static pages
      const homeEntry = entries.find(e => e.url === 'https://numeralhq.com/');
      expect(homeEntry).toBeDefined();
      expect(homeEntry?.priority).toBe(1.0);
      expect(homeEntry?.changeFrequency).toBe('daily');

      const aboutEntry = entries.find(e => e.url === 'https://numeralhq.com/about');
      expect(aboutEntry).toBeDefined();
      expect(aboutEntry?.priority).toBe(0.8);

      // Should include dynamic content
      const blogEntry = entries.find(e => e.url === 'https://numeralhq.com/blog/test-blog-post');
      expect(blogEntry).toBeDefined();
      expect(blogEntry?.priority).toBe(0.6);
      expect(blogEntry?.changeFrequency).toBe('monthly');

      const productEntry = entries.find(e => e.url === 'https://numeralhq.com/products/test-product');
      expect(productEntry).toBeDefined();
      expect(productEntry?.priority).toBe(0.8);
      expect(productEntry?.changeFrequency).toBe('weekly');
    });

    it('respects exclude paths', () => {
      const entries = generateSitemapEntries(mockContent, {
        excludePaths: ['/blog']
      });
      
      const blogEntry = entries.find(e => e.url.includes('/blog/'));
      expect(blogEntry).toBeUndefined();
    });

    it('includes custom paths', () => {
      const entries = generateSitemapEntries(mockContent, {
        includePaths: ['/custom-page']
      });
      
      const customEntry = entries.find(e => e.url === 'https://numeralhq.com/custom-page');
      expect(customEntry).toBeDefined();
    });

    it('uses custom base URL', () => {
      const entries = generateSitemapEntries(mockContent, {
        baseUrl: 'https://example.com'
      });
      
      const homeEntry = entries.find(e => e.url === 'https://example.com/');
      expect(homeEntry).toBeDefined();
    });

    it('removes duplicates', () => {
      const duplicateContent = [...mockContent, mockContent[0]];
      const entries = generateSitemapEntries(duplicateContent);
      
      const blogEntries = entries.filter(e => e.url === 'https://numeralhq.com/blog/test-blog-post');
      expect(blogEntries).toHaveLength(1);
    });

    it('sorts by priority', () => {
      const entries = generateSitemapEntries(mockContent);
      
      // Home page should be first (priority 1.0)
      expect(entries[0].url).toBe('https://numeralhq.com/');
      expect(entries[0].priority).toBe(1.0);
    });
  });

  describe('generateSitemapXML', () => {
    it('generates valid XML sitemap', () => {
      const entries = [
        {
          url: 'https://numeralhq.com/',
          lastModified: new Date('2024-01-01'),
          changeFrequency: 'daily' as const,
          priority: 1.0
        },
        {
          url: 'https://numeralhq.com/about',
          lastModified: new Date('2024-01-02'),
          changeFrequency: 'monthly' as const,
          priority: 0.8
        }
      ];

      const xml = generateSitemapXML(entries);
      
      expect(xml).toContain('<?xml version="1.0" encoding="UTF-8"?>');
      expect(xml).toContain('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
      expect(xml).toContain('<loc>https://numeralhq.com/</loc>');
      expect(xml).toContain('<lastmod>2024-01-01</lastmod>');
      expect(xml).toContain('<changefreq>daily</changefreq>');
      expect(xml).toContain('<priority>1.0</priority>');
      expect(xml).toContain('<loc>https://numeralhq.com/about</loc>');
      expect(xml).toContain('</urlset>');
    });

    it('handles entries without optional fields', () => {
      const entries = [
        {
          url: 'https://numeralhq.com/simple'
        }
      ];

      const xml = generateSitemapXML(entries);
      
      expect(xml).toContain('<loc>https://numeralhq.com/simple</loc>');
      expect(xml).not.toContain('<lastmod>');
      expect(xml).not.toContain('<changefreq>');
      expect(xml).not.toContain('<priority>');
    });
  });

  describe('generateRobotsTxt', () => {
    it('generates default robots.txt', () => {
      const robotsTxt = generateRobotsTxt();
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Disallow: /api/');
      expect(robotsTxt).toContain('Disallow: /admin/');
      expect(robotsTxt).toContain('Sitemap: https://numeralhq.com/sitemap.xml');
    });

    it('generates robots.txt with custom options', () => {
      const robotsTxt = generateRobotsTxt({
        baseUrl: 'https://example.com',
        disallowPaths: ['/private/'],
        allowPaths: ['/public/'],
        crawlDelay: 2
      });
      
      expect(robotsTxt).toContain('Disallow: /private/');
      expect(robotsTxt).toContain('Allow: /public/');
      expect(robotsTxt).toContain('Crawl-delay: 2');
      expect(robotsTxt).toContain('Sitemap: https://example.com/sitemap.xml');
    });

    it('generates robots.txt with custom user agents', () => {
      const robotsTxt = generateRobotsTxt({
        userAgents: [
          {
            userAgent: 'Googlebot',
            allow: ['/'],
            disallow: ['/private/'],
            crawlDelay: 1
          },
          {
            userAgent: 'Bingbot',
            disallow: ['/admin/']
          }
        ]
      });
      
      expect(robotsTxt).toContain('User-agent: Googlebot');
      expect(robotsTxt).toContain('Allow: /');
      expect(robotsTxt).toContain('Disallow: /private/');
      expect(robotsTxt).toContain('Crawl-delay: 1');
      expect(robotsTxt).toContain('User-agent: Bingbot');
      expect(robotsTxt).toContain('Disallow: /admin/');
    });

    it('blocks all crawlers when allowAll is false', () => {
      const robotsTxt = generateRobotsTxt({
        allowAll: false
      });
      
      expect(robotsTxt).toContain('User-agent: *');
      expect(robotsTxt).toContain('Disallow: /');
    });
  });
});