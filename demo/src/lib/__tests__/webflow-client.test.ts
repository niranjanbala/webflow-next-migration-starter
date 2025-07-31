/**
 * @jest-environment jsdom
 */

import { WebflowClient } from '../webflow-client';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = fetch as jest.MockedFunction<typeof fetch>;

describe('WebflowClient', () => {
  let client: WebflowClient;

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock environment variables
    process.env.WEBFLOW_API_KEY = 'test-api-key';
    process.env.WEBFLOW_SITE_ID = 'test-site-id';
    
    client = new WebflowClient();
  });

  afterEach(() => {
    delete process.env.WEBFLOW_API_KEY;
    delete process.env.WEBFLOW_SITE_ID;
  });

  describe('API Requests', () => {
    it('should make authenticated requests with correct headers', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ site: { id: 'test-site', name: 'Test Site' } })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await client.getSite();

      expect(mockFetch).toHaveBeenCalledWith(
        'https://api.webflow.com/v2/sites/test-site-id',
        expect.objectContaining({
          headers: expect.objectContaining({
            'Authorization': 'Bearer test-api-key',
            'Accept': 'application/json',
            'Content-Type': 'application/json'
          })
        })
      );
    });

    it('should handle API errors gracefully', async () => {
      const mockResponse = {
        ok: false,
        status: 404,
        statusText: 'Not Found'
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // Should fallback to mock data instead of throwing
      const result = await client.getSite();
      expect(result).toBeDefined();
    });

    it('should handle network errors gracefully', async () => {
      mockFetch.mockRejectedValue(new Error('Network error'));

      // Should fallback to mock data instead of throwing
      const result = await client.getSite();
      expect(result).toBeDefined();
    });
  });

  describe('Caching', () => {
    it('should cache API responses', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ site: { id: 'test-site', name: 'Test Site' } })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // First call
      await client.getSite();
      expect(mockFetch).toHaveBeenCalledTimes(1);

      // Second call should use cache
      await client.getSite();
      expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    it('should provide cache statistics', () => {
      const stats = client.getCacheStats();
      expect(stats).toHaveProperty('size');
      expect(stats).toHaveProperty('keys');
      expect(Array.isArray(stats.keys)).toBe(true);
    });

    it('should clear cache when requested', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ site: { id: 'test-site', name: 'Test Site' } })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      // Make a request to populate cache
      await client.getSite();
      expect(client.getCacheStats().size).toBeGreaterThan(0);

      // Clear cache
      client.clearCache();
      expect(client.getCacheStats().size).toBe(0);
    });
  });

  describe('Collections', () => {
    it('should get all collections', async () => {
      const mockCollections = [
        { id: 'col1', name: 'Collection 1', slug: 'collection-1', fields: [] },
        { id: 'col2', name: 'Collection 2', slug: 'collection-2', fields: [] }
      ];
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ collections: mockCollections })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const collections = await client.getCollections();
      
      expect(collections).toHaveLength(2);
      expect(collections[0].name).toBe('Collection 1');
    });

    it('should get collection by slug', async () => {
      const mockCollections = [
        { id: 'col1', name: 'Blog Posts', slug: 'blog-posts', fields: [] },
        { id: 'col2', name: 'Products', slug: 'products', fields: [] }
      ];
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ collections: mockCollections })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const collection = await client.getCollectionBySlug('blog-posts');
      
      expect(collection).toBeDefined();
      expect(collection?.name).toBe('Blog Posts');
    });

    it('should return null for non-existent collection slug', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ collections: [] })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const collection = await client.getCollectionBySlug('non-existent');
      expect(collection).toBeNull();
    });
  });

  describe('Collection Items', () => {
    it('should get collection items with pagination', async () => {
      const mockItems = [
        { id: 'item1', name: 'Item 1', slug: 'item-1', fieldData: {} },
        { id: 'item2', name: 'Item 2', slug: 'item-2', fieldData: {} }
      ];
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ items: mockItems })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const items = await client.getCollectionItems('test-collection', {
        limit: 10,
        offset: 0
      });
      
      expect(items).toHaveLength(2);
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('limit=10&offset=0'),
        expect.any(Object)
      );
    });

    it('should get collection items with sorting', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ items: [] })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await client.getCollectionItems('test-collection', {
        sort: '-publishedOn'
      });
      
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('sort=-publishedOn'),
        expect.any(Object)
      );
    });

    it('should get collection items with filters', async () => {
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ items: [] })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      await client.getCollectionItems('test-collection', {
        filter: { category: 'technology', status: 'published' }
      });
      
      const call = mockFetch.mock.calls[0];
      const url = call[0] as string;
      
      expect(url).toContain('filter%5Bcategory%5D=technology');
      expect(url).toContain('filter%5Bstatus%5D=published');
    });

    it('should get collection item by slug', async () => {
      const mockItems = [
        { id: 'item1', name: 'Item 1', slug: 'test-slug', fieldData: {} }
      ];
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ items: mockItems })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const item = await client.getCollectionItemBySlug('test-collection', 'test-slug');
      
      expect(item).toBeDefined();
      expect(item?.slug).toBe('test-slug');
    });

    it('should get published collection items only', async () => {
      const mockItems = [
        { id: 'item1', isDraft: false, publishedOn: '2023-01-01' },
        { id: 'item2', isDraft: true, publishedOn: null },
        { id: 'item3', isDraft: false, publishedOn: '2023-01-02' }
      ];
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ items: mockItems })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const publishedItems = await client.getPublishedCollectionItems('test-collection');
      
      expect(publishedItems).toHaveLength(2);
      expect(publishedItems.every(item => !item.isDraft && item.publishedOn)).toBe(true);
    });
  });

  describe('Search and Related Items', () => {
    it('should search collection items', async () => {
      const mockItems = [
        { id: 'item1', name: 'Technology Blog Post', fieldData: { category: 'tech' } },
        { id: 'item2', name: 'Business Article', fieldData: { category: 'business' } },
        { id: 'item3', name: 'Tech News', fieldData: { category: 'tech' } }
      ];
      
      const mockResponse = {
        ok: true,
        json: jest.fn().mockResolvedValue({ items: mockItems })
      };
      mockFetch.mockResolvedValue(mockResponse as any);

      const results = await client.searchCollectionItems('test-collection', 'tech', ['name']);
      
      expect(results).toHaveLength(2);
      expect(results.every(item => item.name.toLowerCase().includes('tech'))).toBe(true);
    });

    it('should get related collection items', async () => {
      const mockCurrentItem = {
        id: 'current-item',
        fieldData: { category: 'technology' }
      };
      
      const mockRelatedItems = [
        { id: 'related1', fieldData: { category: 'technology' } },
        { id: 'current-item', fieldData: { category: 'technology' } }, // Should be filtered out
        { id: 'related2', fieldData: { category: 'technology' } }
      ];

      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ item: mockCurrentItem })
        } as any)
        .mockResolvedValueOnce({
          ok: true,
          json: jest.fn().mockResolvedValue({ items: mockRelatedItems })
        } as any);

      const relatedItems = await client.getRelatedCollectionItems(
        'test-collection',
        'current-item',
        'category',
        2
      );
      
      expect(relatedItems).toHaveLength(2);
      expect(relatedItems.every(item => item.id !== 'current-item')).toBe(true);
    });
  });

  describe('Mock Data Fallback', () => {
    beforeEach(() => {
      // Remove API credentials to trigger mock data
      delete process.env.WEBFLOW_API_KEY;
      delete process.env.WEBFLOW_SITE_ID;
      client = new WebflowClient();
    });

    it('should return mock data when no API key is provided', async () => {
      const collections = await client.getCollections();
      expect(collections).toBeDefined();
      expect(Array.isArray(collections)).toBe(true);
    });

    it('should return mock collection items', async () => {
      const items = await client.getCollectionItems('blog-posts');
      expect(items).toBeDefined();
      expect(Array.isArray(items)).toBe(true);
      expect(items.length).toBeGreaterThan(0);
    });

    it('should return mock pages', async () => {
      const pages = await client.getPages();
      expect(pages).toBeDefined();
      expect(Array.isArray(pages)).toBe(true);
    });
  });
});