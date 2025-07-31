import axios from 'axios';
import * as cheerio from 'cheerio';

export interface SitemapUrl {
  url: string;
  lastmod?: string;
  changefreq?: string;
  priority?: string;
  category?: string;
}

export class SitemapParser {
  
  async parseSitemap(sitemapUrl: string): Promise<SitemapUrl[]> {
    try {
      const response = await axios.get(sitemapUrl);
      const $ = cheerio.load(response.data, { xmlMode: true });
      
      const urls: SitemapUrl[] = [];
      
      $('url').each((_, element) => {
        const $url = $(element);
        const loc = $url.find('loc').text();
        
        if (loc) {
          const sitemapUrl: SitemapUrl = {
            url: loc,
            lastmod: $url.find('lastmod').text() || undefined,
            changefreq: $url.find('changefreq').text() || undefined,
            priority: $url.find('priority').text() || undefined,
            category: this.categorizeUrl(loc)
          };
          
          urls.push(sitemapUrl);
        }
      });
      
      return urls;
    } catch (error) {
      console.error('Failed to parse sitemap:', error);
      throw error;
    }
  }

  private categorizeUrl(url: string): string {
    const path = new URL(url).pathname.toLowerCase();
    
    if (path === '/' || path === '') return 'homepage';
    if (path.startsWith('/blog/')) return 'blog';
    if (path.startsWith('/product/')) return 'product';
    if (path.startsWith('/customers/')) return 'customer-story';
    if (path.startsWith('/author/')) return 'author';
    if (path.startsWith('/vat/')) return 'vat-guide';
    if (path.startsWith('/alternative/')) return 'alternative';
    if (path.startsWith('/partners/')) return 'partner';
    if (path.startsWith('/solutions/')) return 'solution';
    if (path.startsWith('/ads/')) return 'landing-page';
    if (path.startsWith('/legal/')) return 'legal';
    
    // Main pages
    if (['about', 'pricing', 'careers', 'demo', 'get-started', 'case-studies', 'partner-program', 'reviews'].includes(path.replace('/', ''))) {
      return 'main-page';
    }
    
    return 'other';
  }

  filterUrlsByCategory(urls: SitemapUrl[], categories: string[]): SitemapUrl[] {
    return urls.filter(url => categories.includes(url.category || 'other'));
  }

  filterUrlsByPriority(urls: SitemapUrl[], minPriority: number = 0.5): SitemapUrl[] {
    return urls.filter(url => {
      const priority = parseFloat(url.priority || '0.5');
      return priority >= minPriority;
    });
  }

  getUrlsByCategory(urls: SitemapUrl[]): Record<string, SitemapUrl[]> {
    const categorized: Record<string, SitemapUrl[]> = {};
    
    urls.forEach(url => {
      const category = url.category || 'other';
      if (!categorized[category]) {
        categorized[category] = [];
      }
      categorized[category].push(url);
    });
    
    return categorized;
  }

  getHighPriorityUrls(urls: SitemapUrl[]): SitemapUrl[] {
    // Get essential pages for the migration
    const essentialCategories = [
      'homepage',
      'main-page',
      'product',
      'solution'
    ];
    
    const essentialUrls = this.filterUrlsByCategory(urls, essentialCategories);
    
    // Add a few sample blog posts and customer stories
    const blogUrls = this.filterUrlsByCategory(urls, ['blog']).slice(0, 5);
    const customerUrls = this.filterUrlsByCategory(urls, ['customer-story']).slice(0, 3);
    
    return [...essentialUrls, ...blogUrls, ...customerUrls];
  }

  async saveSitemapAnalysis(urls: SitemapUrl[], outputPath: string): Promise<void> {
    const analysis = {
      totalUrls: urls.length,
      categories: this.getUrlsByCategory(urls),
      categoryCounts: Object.entries(this.getUrlsByCategory(urls)).reduce(
        (acc, [category, urls]) => {
          acc[category] = urls.length;
          return acc;
        },
        {} as Record<string, number>
      ),
      highPriorityUrls: this.getHighPriorityUrls(urls),
      analyzedAt: new Date().toISOString()
    };
    
    const fs = await import('fs/promises');
    await fs.writeFile(outputPath, JSON.stringify(analysis, null, 2));
  }
}