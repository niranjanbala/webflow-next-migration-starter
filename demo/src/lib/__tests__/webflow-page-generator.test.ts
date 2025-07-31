/**
 * @jest-environment jsdom
 */

import { WebflowPageGenerator, WebflowPageTemplate } from '../webflow-page-generator';
import { WebflowClient } from '../webflow-client';

// Mock the WebflowClient
jest.mock('../webflow-client');
const MockedWebflowClient = WebflowClient as jest.MockedClass<typeof WebflowClient>;

describe('WebflowPageGenerator', () => {
  let pageGenerator: WebflowPageGenerator;
  let mockWebflowClient: jest.Mocked<WebflowClient>;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();
    
    // Create mock client instance
    mockWebflowClient = {
      getCollectionItem: jest.fn(),
      getCollectionItemBySlug: jest.fn(),
      getCollectionBySlug: jest.fn(),
      getPage: jest.fn(),
      getCollectionItems: jest.fn(),
      getPublishedCollectionItems: jest.fn()
    } as any;

    // Mock the constructor to return our mock instance
    MockedWebflowClient.mockImplementation(() => mockWebflowClient);
    
    pageGenerator = new WebflowPageGenerator();
  });

  describe('Template Registration', () => {
    it('should register a new template', () => {
      const template: WebflowPageTemplate = {
        type: 'blog',
        name: 'Test Blog Template',
        slug: 'test-blog',
        collectionId: 'test-collection',
        template: {
          layout: 'blog',
          sections: [],
          seo: {
            title: { field: 'name' },
            description: { field: 'description' }
          }
        }
      };

      pageGenerator.registerTemplate(template);
      
      const retrievedTemplate = pageGenerator.getTemplate('test-blog');
      expect(retrievedTemplate).toEqual(template);
    });

    it('should return all registered templates', () => {
      const templates = pageGenerator.getTemplates();
      expect(templates.length).toBeGreaterThan(0);
      
      // Check that default templates are registered
      const blogTemplate = templates.find(t => t.slug === 'blog-post');
      expect(blogTemplate).toBeDefined();
      expect(blogTemplate?.type).toBe('blog');
    });
  });

  describe('Page Generation', () => {
    const mockWebflowData = {
      id: 'test-item-1',
      name: 'Test Blog Post',
      slug: 'test-blog-post',
      fieldData: {
        'post-body': '<p>This is test content</p>',
        'featured-image': { url: '/test-image.jpg' },
        summary: 'Test summary',
        'author-name': 'Test Author',
        category: 'Technology'
      },
      createdOn: '2023-01-01T00:00:00Z',
      lastUpdated: '2023-01-01T00:00:00Z',
      publishedOn: '2023-01-01T00:00:00Z',
      isDraft: false
    };

    it('should generate a blog post page', async () => {
      mockWebflowClient.getCollectionBySlug.mockResolvedValue({
        id: 'blog-posts',
        name: 'Blog Posts',
        slug: 'blog-posts',
        fields: []
      });
      
      mockWebflowClient.getCollectionItem.mockResolvedValue(mockWebflowData);

      const result = await pageGenerator.generatePage('blog-post', 'test-item-1', 'blog-posts');
      
      expect(result).toBeDefined();
      expect(result?.content.title).toBe('Test Blog Post');
      expect(result?.content.slug).toBe('test-blog-post');
      expect(result?.content.sections.length).toBeGreaterThan(0);
      
      // Check that hero section is generated
      const heroSection = result?.content.sections.find(s => s.type === 'hero');
      expect(heroSection).toBeDefined();
      expect(heroSection?.data.title).toBe('Test Blog Post');
    });

    it('should generate metadata correctly', async () => {
      mockWebflowClient.getCollectionBySlug.mockResolvedValue({
        id: 'blog-posts',
        name: 'Blog Posts',
        slug: 'blog-posts',
        fields: []
      });
      
      mockWebflowClient.getCollectionItem.mockResolvedValue(mockWebflowData);

      const result = await pageGenerator.generatePage('blog-post', 'test-item-1', 'blog-posts');
      
      expect(result?.metadata.title).toBe('Test Blog Post');
      expect(result?.metadata.description).toBeDefined();
    });

    it('should handle missing data gracefully', async () => {
      mockWebflowClient.getCollectionBySlug.mockResolvedValue({
        id: 'blog-posts',
        name: 'Blog Posts',
        slug: 'blog-posts',
        fields: []
      });
      
      mockWebflowClient.getCollectionItem.mockResolvedValue(null);

      const result = await pageGenerator.generatePage('blog-post', 'non-existent', 'blog-posts');
      
      expect(result).toBeNull();
    });

    it('should handle invalid template slug', async () => {
      await expect(
        pageGenerator.generatePage('non-existent-template', 'test-item-1')
      ).rejects.toThrow('Template not found: non-existent-template');
    });
  });

  describe('Field Mapping', () => {
    it('should map simple string fields', () => {
      const data = { name: 'Test Title', description: 'Test Description' };
      const mapping = { title: 'name', desc: 'description' };
      
      // Access private method for testing
      const result = (pageGenerator as any).mapFields(mapping, data);
      
      expect(result.title).toBe('Test Title');
      expect(result.desc).toBe('Test Description');
    });

    it('should apply field transformations', () => {
      const data = { 
        content: '<p>HTML content</p>',
        date: '2023-01-01T00:00:00Z',
        image: { url: '/test.jpg' }
      };
      
      const mapping = {
        plainText: { field: 'content', transform: 'plain-text' },
        formattedDate: { field: 'date', transform: 'date' },
        imageUrl: { field: 'image', transform: 'image' }
      };
      
      const result = (pageGenerator as any).mapFields(mapping, data);
      
      expect(result.plainText).toBe('HTML content');
      expect(result.formattedDate).toBe('2023-01-01T00:00:00.000Z');
      expect(result.imageUrl).toBe('/test.jpg');
    });

    it('should use fallback values', () => {
      const data = { name: 'Test' };
      const mapping = {
        title: { field: 'missing-field', fallback: 'Default Title' },
        description: { field: 'missing-field', fallback: { field: 'name' } }
      };
      
      const result = (pageGenerator as any).mapFields(mapping, data);
      
      expect(result.title).toBe('Default Title');
      expect(result.description).toBe('Test');
    });
  });

  describe('Condition Evaluation', () => {
    const testData = {
      status: 'published',
      count: 5,
      tags: 'technology,web',
      title: 'Test Title'
    };

    it('should evaluate equals conditions', () => {
      const condition = { field: 'status', operator: 'equals' as const, value: 'published' };
      const result = (pageGenerator as any).evaluateCondition(condition, testData);
      expect(result).toBe(true);
    });

    it('should evaluate contains conditions', () => {
      const condition = { field: 'tags', operator: 'contains' as const, value: 'technology' };
      const result = (pageGenerator as any).evaluateCondition(condition, testData);
      expect(result).toBe(true);
    });

    it('should evaluate exists conditions', () => {
      const condition = { field: 'title', operator: 'exists' as const };
      const result = (pageGenerator as any).evaluateCondition(condition, testData);
      expect(result).toBe(true);
    });

    it('should evaluate not-empty conditions', () => {
      const condition = { field: 'title', operator: 'not-empty' as const };
      const result = (pageGenerator as any).evaluateCondition(condition, testData);
      expect(result).toBe(true);
    });

    it('should evaluate greater-than conditions', () => {
      const condition = { field: 'count', operator: 'greater-than' as const, value: 3 };
      const result = (pageGenerator as any).evaluateCondition(condition, testData);
      expect(result).toBe(true);
    });

    it('should evaluate less-than conditions', () => {
      const condition = { field: 'count', operator: 'less-than' as const, value: 10 };
      const result = (pageGenerator as any).evaluateCondition(condition, testData);
      expect(result).toBe(true);
    });
  });

  describe('Static Path Generation', () => {
    it('should generate static paths for collection items', async () => {
      const mockItems = [
        { id: '1', slug: 'post-1', name: 'Post 1' },
        { id: '2', slug: 'post-2', name: 'Post 2' },
        { id: '3', slug: 'post-3', name: 'Post 3' }
      ];

      mockWebflowClient.getCollectionItems.mockResolvedValue(mockItems as any);

      const paths = await pageGenerator.generateStaticPaths('blog-post');
      
      expect(paths).toHaveLength(3);
      expect(paths[0]).toEqual({ params: { slug: 'post-1' } });
      expect(paths[1]).toEqual({ params: { slug: 'post-2' } });
      expect(paths[2]).toEqual({ params: { slug: 'post-3' } });
    });

    it('should handle templates without collection ID', async () => {
      const paths = await pageGenerator.generateStaticPaths('non-collection-template');
      expect(paths).toEqual([]);
    });
  });

  describe('Value Transformations', () => {
    it('should transform HTML to plain text', () => {
      const html = '<p>Hello <strong>world</strong></p>';
      const result = (pageGenerator as any).transformValue(html, 'plain-text');
      expect(result).toBe('Hello world');
    });

    it('should transform image objects to URLs', () => {
      const imageObj = { url: '/test-image.jpg', alt: 'Test' };
      const result = (pageGenerator as any).transformValue(imageObj, 'image');
      expect(result).toBe('/test-image.jpg');
    });

    it('should transform dates to ISO strings', () => {
      const date = '2023-01-01';
      const result = (pageGenerator as any).transformValue(date, 'date');
      expect(result).toBe(new Date(date).toISOString());
    });

    it('should handle rich text format', () => {
      const richText = { html: '<p>Rich text content</p>' };
      const result = (pageGenerator as any).transformValue(richText, 'rich-text');
      expect(result).toBe('<p>Rich text content</p>');
    });

    it('should return original value for unknown transforms', () => {
      const value = 'test value';
      const result = (pageGenerator as any).transformValue(value, 'unknown-transform');
      expect(result).toBe('test value');
    });
  });
});