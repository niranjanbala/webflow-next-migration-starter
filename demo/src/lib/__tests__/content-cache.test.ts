/**
 * @jest-environment jsdom
 */

import { contentCache, CACHE_KEYS, CachedContentLoader } from '../content-cache';
import { PageContent } from '../types';

describe('ContentCache', () => {
  beforeEach(() => {
    contentCache.clear();
  });

  describe('basic cache operations', () => {
    it('should set and get cache entries', () => {
      const testData = { test: 'data' };
      contentCache.set('test-key', testData);
      
      const retrieved = contentCache.get('test-key');
      expect(retrieved).toEqual(testData);
    });

    it('should return null for non-existent keys', () => {
      const result = contentCache.get('non-existent');
      expect(result).toBeNull();
    });

    it('should handle cache expiration', async () => {
      const testData = { test: 'data' };
      contentCache.set('test-key', testData, 10); // 10ms TTL
      
      // Should be available immediately
      expect(contentCache.get('test-key')).toEqual(testData);
      
      // Wait for expiration
      await new Promise(resolve => setTimeout(resolve, 15));
      
      // Should be expired
      expect(contentCache.get('test-key')).toBeNull();
    });

    it('should check if key exists', () => {
      contentCache.set('test-key', { test: 'data' });
      
      expect(contentCache.has('test-key')).toBe(true);
      expect(contentCache.has('non-existent')).toBe(false);
    });

    it('should delete entries', () => {
      contentCache.set('test-key', { test: 'data' });
      expect(contentCache.has('test-key')).toBe(true);
      
      contentCache.delete('test-key');
      expect(contentCache.has('test-key')).toBe(false);
    });

    it('should clear all entries', () => {
      contentCache.set('key1', { test: 'data1' });
      contentCache.set('key2', { test: 'data2' });
      
      expect(contentCache.has('key1')).toBe(true);
      expect(contentCache.has('key2')).toBe(true);
      
      contentCache.clear();
      
      expect(contentCache.has('key1')).toBe(false);
      expect(contentCache.has('key2')).toBe(false);
    });
  });

  describe('CACHE_KEYS', () => {
    it('should generate correct cache keys', () => {
      expect(CACHE_KEYS.PAGE('home')).toBe('page:home');
      expect(CACHE_KEYS.CATEGORY('blog')).toBe('category:blog');
      expect(CACHE_KEYS.CATEGORY_INDEX('product')).toBe('category-index:product');
    });
  });

  describe('CachedContentLoader', () => {
    it('should cache page loading results', async () => {
      const mockPage: PageContent = {
        slug: 'test-page',
        title: 'Test Page',
        description: 'Test Description',
        sections: []
      };

      let loaderCallCount = 0;
      const mockLoader = jest.fn(async () => {
        loaderCallCount++;
        return mockPage;
      });

      // First call should invoke loader
      const result1 = await CachedContentLoader.getPage('test-page', mockLoader);
      expect(result1).toEqual(mockPage);
      expect(loaderCallCount).toBe(1);

      // Second call should use cache
      const result2 = await CachedContentLoader.getPage('test-page', mockLoader);
      expect(result2).toEqual(mockPage);
      expect(loaderCallCount).toBe(1); // Should not increment
    });

    it('should handle null results from loader', async () => {
      const mockLoader = jest.fn(async () => null);

      const result = await CachedContentLoader.getPage('non-existent', mockLoader);
      expect(result).toBeNull();
      expect(mockLoader).toHaveBeenCalledTimes(1);
    });

    it('should invalidate cache by pattern', () => {
      contentCache.set('page:home', { test: 'data' });
      contentCache.set('page:about', { test: 'data' });
      contentCache.set('category:blog', { test: 'data' });

      CachedContentLoader.invalidateCache('page');

      expect(contentCache.has('page:home')).toBe(false);
      expect(contentCache.has('page:about')).toBe(false);
      expect(contentCache.has('category:blog')).toBe(true); // Should remain
    });
  });
});