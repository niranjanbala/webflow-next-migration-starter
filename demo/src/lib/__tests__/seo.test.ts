/**
 * @jest-environment jsdom
 */

import {
  generateMetadata,
  generateOrganizationStructuredData,
  generateWebsiteStructuredData,
  generateArticleStructuredData,
  generateProductStructuredData,
  generateBreadcrumbStructuredData,
  generateFAQStructuredData
} from '../seo';

describe('SEO Utilities', () => {
  describe('generateMetadata', () => {
    it('generates default metadata when no data provided', () => {
      const metadata = generateMetadata();
      
      expect(metadata.title).toBe('Numeral - Sales Tax Automation Platform');
      expect(metadata.description).toContain('Automate your sales tax compliance');
      expect(metadata.openGraph?.title).toBe('Numeral - Sales Tax Automation Platform');
      expect(metadata.twitter?.card).toBe('summary_large_image');
    });

    it('generates custom metadata with provided data', () => {
      const seoData = {
        title: 'Custom Page Title',
        description: 'Custom page description',
        keywords: ['custom', 'keywords'],
        url: '/custom-page',
        type: 'article' as const
      };

      const metadata = generateMetadata(seoData);
      
      expect(metadata.title).toBe('Custom Page Title | Numeral');
      expect(metadata.description).toBe('Custom page description');
      expect(metadata.keywords).toBe('custom, keywords');
      expect(metadata.openGraph?.type).toBe('article');
      expect(metadata.openGraph?.url).toBe('https://numeralhq.com/custom-page');
    });

    it('handles noIndex and noFollow flags', () => {
      const seoData = {
        title: 'Private Page',
        noIndex: true,
        noFollow: true
      };

      const metadata = generateMetadata(seoData);
      
      expect(metadata.robots?.index).toBe(false);
      expect(metadata.robots?.follow).toBe(false);
      expect(metadata.robots?.googleBot?.index).toBe(false);
      expect(metadata.robots?.googleBot?.follow).toBe(false);
    });
  });

  describe('generateOrganizationStructuredData', () => {
    it('generates valid organization structured data', () => {
      const structuredData = generateOrganizationStructuredData();
      
      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('Organization');
      expect(structuredData.name).toBe('Numeral');
      expect(structuredData.url).toBe('https://numeralhq.com');
      expect(structuredData.contactPoint).toBeDefined();
      expect(structuredData.address).toBeDefined();
      expect(Array.isArray(structuredData.sameAs)).toBe(true);
    });
  });

  describe('generateWebsiteStructuredData', () => {
    it('generates valid website structured data', () => {
      const structuredData = generateWebsiteStructuredData();
      
      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('WebSite');
      expect(structuredData.name).toBe('Numeral');
      expect(structuredData.url).toBe('https://numeralhq.com');
      expect(structuredData.potentialAction).toBeDefined();
      expect(structuredData.potentialAction['@type']).toBe('SearchAction');
    });
  });

  describe('generateArticleStructuredData', () => {
    it('generates valid article structured data', () => {
      const article = {
        title: 'Test Article',
        description: 'Test article description',
        author: 'John Doe',
        publishedTime: '2024-01-01T00:00:00Z',
        image: '/test-image.jpg',
        url: '/blog/test-article',
        section: 'Tax Tips',
        tags: ['tax', 'compliance']
      };

      const structuredData = generateArticleStructuredData(article);
      
      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('Article');
      expect(structuredData.headline).toBe('Test Article');
      expect(structuredData.author.name).toBe('John Doe');
      expect(structuredData.publisher.name).toBe('Numeral');
      expect(structuredData.image).toBe('https://numeralhq.com/test-image.jpg');
      expect(structuredData.url).toBe('https://numeralhq.com/blog/test-article');
      expect(structuredData.articleSection).toBe('Tax Tips');
      expect(structuredData.keywords).toBe('tax, compliance');
    });
  });

  describe('generateProductStructuredData', () => {
    it('generates valid product structured data', () => {
      const product = {
        name: 'Test Product',
        description: 'Test product description',
        image: '/product-image.jpg',
        url: '/products/test-product',
        price: 99.99,
        currency: 'USD',
        availability: 'InStock' as const,
        brand: 'Numeral',
        category: 'Software'
      };

      const structuredData = generateProductStructuredData(product);
      
      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('Product');
      expect(structuredData.name).toBe('Test Product');
      expect(structuredData.offers.price).toBe(99.99);
      expect(structuredData.offers.priceCurrency).toBe('USD');
      expect(structuredData.offers.availability).toBe('https://schema.org/InStock');
      expect(structuredData.brand.name).toBe('Numeral');
      expect(structuredData.category).toBe('Software');
    });

    it('generates product structured data without pricing', () => {
      const product = {
        name: 'Free Product',
        description: 'Free product description',
        image: '/product-image.jpg',
        url: '/products/free-product'
      };

      const structuredData = generateProductStructuredData(product);
      
      expect(structuredData.offers).toBeUndefined();
      expect(structuredData.name).toBe('Free Product');
    });
  });

  describe('generateBreadcrumbStructuredData', () => {
    it('generates valid breadcrumb structured data', () => {
      const breadcrumbs = [
        { name: 'Home', url: '/' },
        { name: 'Blog', url: '/blog' },
        { name: 'Article', url: '/blog/article' }
      ];

      const structuredData = generateBreadcrumbStructuredData(breadcrumbs);
      
      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('BreadcrumbList');
      expect(structuredData.itemListElement).toHaveLength(3);
      expect(structuredData.itemListElement[0].position).toBe(1);
      expect(structuredData.itemListElement[0].name).toBe('Home');
      expect(structuredData.itemListElement[0].item).toBe('https://numeralhq.com/');
      expect(structuredData.itemListElement[2].position).toBe(3);
      expect(structuredData.itemListElement[2].name).toBe('Article');
    });
  });

  describe('generateFAQStructuredData', () => {
    it('generates valid FAQ structured data', () => {
      const faqs = [
        {
          question: 'What is sales tax automation?',
          answer: 'Sales tax automation is the process of using software to handle tax calculations, filing, and remittance.'
        },
        {
          question: 'How does Numeral work?',
          answer: 'Numeral integrates with your existing systems to automate all aspects of sales tax compliance.'
        }
      ];

      const structuredData = generateFAQStructuredData(faqs);
      
      expect(structuredData['@context']).toBe('https://schema.org');
      expect(structuredData['@type']).toBe('FAQPage');
      expect(structuredData.mainEntity).toHaveLength(2);
      expect(structuredData.mainEntity[0]['@type']).toBe('Question');
      expect(structuredData.mainEntity[0].name).toBe('What is sales tax automation?');
      expect(structuredData.mainEntity[0].acceptedAnswer['@type']).toBe('Answer');
      expect(structuredData.mainEntity[0].acceptedAnswer.text).toContain('Sales tax automation');
    });
  });
});