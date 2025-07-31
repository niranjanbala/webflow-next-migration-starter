import { WebflowSite, WebflowCollection, WebflowItem, WebflowField } from './types';

export interface WebflowAPIResponse<T> {
  items?: T[];
  item?: T;
  count?: number;
  limit?: number;
  offset?: number;
}

export interface WebflowPage {
  id: string;
  name: string;
  slug: string;
  title?: string;
  seoTitle?: string;
  seoDescription?: string;
  openGraphTitle?: string;
  openGraphDescription?: string;
  createdOn: string;
  lastUpdated: string;
  publishedOn?: string;
  [key: string]: unknown;
}

export interface WebflowCollectionItem extends WebflowItem {
  createdOn: string;
  lastUpdated: string;
  publishedOn?: string;
  isDraft: boolean;
  fieldData: Record<string, unknown>;
}

export class WebflowClient {
  private apiKey: string;
  private siteId: string;
  private baseUrl = 'https://api.webflow.com/v2';
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    this.apiKey = process.env.WEBFLOW_API_KEY || '';
    this.siteId = process.env.WEBFLOW_SITE_ID || '';
    
    if (!this.apiKey || !this.siteId) {
      console.warn('Webflow API key or site ID not configured. Using mock data.');
    }
  }

  /**
   * Make authenticated request to Webflow API
   */
  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const cacheKey = `${endpoint}-${JSON.stringify(options)}`;
    
    // Check cache first
    const cached = this.cache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.data as T;
    }

    // If no API key, return mock data
    if (!this.apiKey || !this.siteId) {
      return this.getMockData<T>(endpoint);
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error(`Webflow API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      // Cache the result
      this.cache.set(cacheKey, { data, timestamp: Date.now() });
      
      return data;
    } catch (error) {
      console.error('Webflow API request failed:', error);
      // Fallback to mock data on error
      return this.getMockData<T>(endpoint);
    }
  }

  /**
   * Get mock data for development/fallback
   */
  private getMockData<T>(endpoint: string): T {
    // Return mock data based on endpoint pattern
    if (endpoint.includes('/collections')) {
      if (endpoint.includes('/items')) {
        return {
          items: [
            {
              id: 'mock-item-1',
              name: 'Sample Blog Post',
              slug: 'sample-blog-post',
              fieldData: {
                'post-body': '<p>This is a sample blog post content.</p>',
                'featured-image': { url: '/images/sample-blog.jpg' },
                'summary': 'A sample blog post for testing.',
                'author-name': 'John Doe',
                'category': 'Technology'
              },
              createdOn: new Date().toISOString(),
              lastUpdated: new Date().toISOString(),
              publishedOn: new Date().toISOString(),
              isDraft: false
            }
          ]
        } as T;
      } else {
        return {
          collections: [
            {
              id: 'blog-posts',
              name: 'Blog Posts',
              slug: 'blog-posts',
              fields: [
                { id: 'name', name: 'Name', slug: 'name', type: 'PlainText', required: true },
                { id: 'slug', name: 'Slug', slug: 'slug', type: 'PlainText', required: true },
                { id: 'post-body', name: 'Post Body', slug: 'post-body', type: 'RichText', required: true },
                { id: 'featured-image', name: 'Featured Image', slug: 'featured-image', type: 'ImageRef', required: false }
              ]
            }
          ]
        } as T;
      }
    } else if (endpoint.includes('/pages')) {
      return {
        pages: [
          {
            id: 'mock-page-1',
            name: 'Sample Page',
            slug: 'sample-page',
            title: 'Sample Page Title',
            seoTitle: 'Sample Page - SEO Title',
            seoDescription: 'This is a sample page for testing.',
            createdOn: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            publishedOn: new Date().toISOString()
          }
        ]
      } as T;
    } else if (endpoint.includes('/sites/')) {
      return {
        site: {
          id: 'mock-site-1',
          name: 'Mock Site',
          shortName: 'mock',
          domains: ['mock.com']
        }
      } as T;
    }

    return {} as T;
  }

  /**
   * Get site information
   */
  async getSite(): Promise<WebflowSite> {
    const response = await this.makeRequest<{ site: WebflowSite }>(`/sites/${this.siteId}`);
    return response.site;
  }

  /**
   * Get all collections for the site
   */
  async getCollections(): Promise<WebflowCollection[]> {
    const response = await this.makeRequest<{ collections: WebflowCollection[] }>(`/sites/${this.siteId}/collections`);
    return response.collections || [];
  }

  /**
   * Get a specific collection by ID
   */
  async getCollection(collectionId: string): Promise<WebflowCollection | null> {
    try {
      const response = await this.makeRequest<{ collection: WebflowCollection }>(`/collections/${collectionId}`);
      return response.collection;
    } catch (error) {
      console.error(`Failed to get collection ${collectionId}:`, error);
      return null;
    }
  }

  /**
   * Get a collection by slug
   */
  async getCollectionBySlug(slug: string): Promise<WebflowCollection | null> {
    const collections = await this.getCollections();
    return collections.find(collection => collection.slug === slug) || null;
  }

  /**
   * Get all items from a collection
   */
  async getCollectionItems(collectionId: string, options: {
    limit?: number;
    offset?: number;
    sort?: string;
    filter?: Record<string, unknown>;
  } = {}): Promise<WebflowCollectionItem[]> {
    const { limit = 100, offset = 0, sort, filter } = options;
    
    let endpoint = `/collections/${collectionId}/items?limit=${limit}&offset=${offset}`;
    
    if (sort) {
      endpoint += `&sort=${sort}`;
    }
    
    if (filter) {
      const filterParams = new URLSearchParams();
      Object.entries(filter).forEach(([key, value]) => {
        filterParams.append(`filter[${key}]`, String(value));
      });
      endpoint += `&${filterParams.toString()}`;
    }

    const response = await this.makeRequest<WebflowAPIResponse<WebflowCollectionItem>>(endpoint);
    return response.items || [];
  }

  /**
   * Get a specific collection item
   */
  async getCollectionItem(collectionId: string, itemId: string): Promise<WebflowCollectionItem | null> {
    try {
      const response = await this.makeRequest<{ item: WebflowCollectionItem }>(`/collections/${collectionId}/items/${itemId}`);
      return response.item;
    } catch (error) {
      console.error(`Failed to get collection item ${itemId}:`, error);
      return null;
    }
  }

  /**
   * Get collection item by slug
   */
  async getCollectionItemBySlug(collectionId: string, slug: string): Promise<WebflowCollectionItem | null> {
    const items = await this.getCollectionItems(collectionId, {
      filter: { slug }
    });
    return items[0] || null;
  }

  /**
   * Get all pages from the site
   */
  async getPages(): Promise<WebflowPage[]> {
    const response = await this.makeRequest<WebflowAPIResponse<WebflowPage>>(`/sites/${this.siteId}/pages`);
    return response.items || [];
  }

  /**
   * Get a specific page by ID
   */
  async getPage(pageId: string): Promise<WebflowPage | null> {
    try {
      const response = await this.makeRequest<{ page: WebflowPage }>(`/pages/${pageId}`);
      return response.page;
    } catch (error) {
      console.error(`Failed to get page ${pageId}:`, error);
      return null;
    }
  }

  /**
   * Get page by slug
   */
  async getPageBySlug(slug: string): Promise<WebflowPage | null> {
    const pages = await this.getPages();
    return pages.find(page => page.slug === slug) || null;
  }

  /**
   * Get published collection items only
   */
  async getPublishedCollectionItems(collectionId: string, options: {
    limit?: number;
    offset?: number;
    sort?: string;
  } = {}): Promise<WebflowCollectionItem[]> {
    const items = await this.getCollectionItems(collectionId, options);
    return items.filter(item => !item.isDraft && item.publishedOn);
  }

  /**
   * Search collection items
   */
  async searchCollectionItems(collectionId: string, query: string, fields: string[] = ['name']): Promise<WebflowCollectionItem[]> {
    const allItems = await this.getCollectionItems(collectionId);
    
    return allItems.filter(item => {
      return fields.some(field => {
        const fieldValue = item.fieldData[field] || item[field as keyof WebflowCollectionItem];
        return typeof fieldValue === 'string' && 
               fieldValue.toLowerCase().includes(query.toLowerCase());
      });
    });
  }

  /**
   * Get collection items by category/tag
   */
  async getCollectionItemsByCategory(
    collectionId: string, 
    categoryField: string, 
    categoryValue: string
  ): Promise<WebflowCollectionItem[]> {
    return this.getCollectionItems(collectionId, {
      filter: { [categoryField]: categoryValue }
    });
  }

  /**
   * Get related collection items
   */
  async getRelatedCollectionItems(
    collectionId: string, 
    currentItemId: string, 
    relationField: string,
    limit: number = 5
  ): Promise<WebflowCollectionItem[]> {
    const currentItem = await this.getCollectionItem(collectionId, currentItemId);
    if (!currentItem) return [];

    const relationValue = currentItem.fieldData[relationField];
    if (!relationValue) return [];

    const relatedItems = await this.getCollectionItems(collectionId, {
      filter: { [relationField]: relationValue },
      limit: limit + 1 // Get one extra to exclude current item
    });

    // Filter out the current item and limit results
    return relatedItems
      .filter(item => item.id !== currentItemId)
      .slice(0, limit);
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; keys: string[] } {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys())
    };
  }
}

// Export singleton instance
export const webflowClient = new WebflowClient();