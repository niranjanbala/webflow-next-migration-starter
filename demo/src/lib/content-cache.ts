import { PageContent } from './types';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class ContentCache {
  private cache = new Map<string, CacheEntry<unknown>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  set<T>(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl: ttl || this.defaultTTL
    });
  }

  get<T>(key: string): T | null {
    const entry = this.cache.get(key) as CacheEntry<T> | undefined;
    
    if (!entry) {
      return null;
    }

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    // Check if entry has expired
    if (Date.now() - entry.timestamp > entry.ttl) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache statistics
  getStats() {
    const now = Date.now();
    let validEntries = 0;
    let expiredEntries = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        expiredEntries++;
      } else {
        validEntries++;
      }
    }

    return {
      totalEntries: this.cache.size,
      validEntries,
      expiredEntries,
      hitRate: this.hitCount / (this.hitCount + this.missCount) || 0
    };
  }

  private hitCount = 0;
  private missCount = 0;

  // Track cache hits and misses
  private recordHit(): void {
    this.hitCount++;
  }

  private recordMiss(): void {
    this.missCount++;
  }

  // Enhanced get method with hit/miss tracking
  getWithStats<T>(key: string): T | null {
    const result = this.get<T>(key);
    if (result !== null) {
      this.recordHit();
    } else {
      this.recordMiss();
    }
    return result;
  }

  // Cleanup expired entries
  cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > entry.ttl) {
        this.cache.delete(key);
      }
    }
  }
}

// Global cache instance
export const contentCache = new ContentCache();

// Cache keys
export const CACHE_KEYS = {
  PAGE: (slug: string) => `page:${slug}`,
  CATEGORY: (category: string) => `category:${category}`,
  CATEGORY_INDEX: (category: string) => `category-index:${category}`,
  ALL_PAGES: 'all-pages',
  SITEMAP: 'sitemap',
  PAGE_SLUGS: 'page-slugs'
} as const;

// Cache utilities for common operations
export class CachedContentLoader {
  static async getPage(slug: string, loader: () => Promise<PageContent | null>): Promise<PageContent | null> {
    const cacheKey = CACHE_KEYS.PAGE(slug);
    
    // Try to get from cache first
    let page = contentCache.getWithStats<PageContent>(cacheKey);
    
    if (page === null) {
      // Load from source and cache
      page = await loader();
      if (page) {
        contentCache.set(cacheKey, page);
      }
    }
    
    return page;
  }

  static async getPagesByCategory(
    category: string, 
    loader: () => Promise<PageContent[]>
  ): Promise<PageContent[]> {
    const cacheKey = CACHE_KEYS.CATEGORY(category);
    
    let pages = contentCache.getWithStats<PageContent[]>(cacheKey);
    
    if (pages === null) {
      pages = await loader();
      contentCache.set(cacheKey, pages);
    }
    
    return pages;
  }

  static async getAllPages(loader: () => Promise<PageContent[]>): Promise<PageContent[]> {
    const cacheKey = CACHE_KEYS.ALL_PAGES;
    
    let pages = contentCache.getWithStats<PageContent[]>(cacheKey);
    
    if (pages === null) {
      pages = await loader();
      contentCache.set(cacheKey, pages);
    }
    
    return pages;
  }

  static invalidateCache(pattern?: string): void {
    if (pattern) {
      // Invalidate specific pattern
      for (const key of contentCache['cache'].keys()) {
        if (key.includes(pattern)) {
          contentCache.delete(key);
        }
      }
    } else {
      // Clear all cache
      contentCache.clear();
    }
  }
}

// Automatic cleanup every 10 minutes
if (typeof window !== 'undefined') {
  setInterval(() => {
    contentCache.cleanup();
  }, 10 * 60 * 1000);
}