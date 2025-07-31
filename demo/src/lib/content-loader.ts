import { PageContent } from './types';
import * as fs from 'fs/promises';
import * as path from 'path';
import { CachedContentLoader, CACHE_KEYS } from './content-cache';

export class ContentLoader {
  private contentDir: string;
  private cache: Map<string, PageContent> = new Map();

  constructor() {
    this.contentDir = path.join(process.cwd(), 'src', 'content');
  }

  async getPage(slug: string, category?: string): Promise<PageContent | null> {
    return CachedContentLoader.getPage(slug, async () => {
      try {
        // Try different directories based on category or slug patterns
        const possiblePaths = [
          path.join(this.contentDir, 'pages', `${slug}.json`),
          path.join(this.contentDir, 'blog', `${slug}.json`),
          path.join(this.contentDir, 'products', `${slug}.json`),
          path.join(this.contentDir, 'customers', `${slug}.json`),
          path.join(this.contentDir, 'solutions', `${slug}.json`)
        ];

        if (category) {
          const categoryMap: Record<string, string> = {
            'blog': 'blog',
            'product': 'products',
            'customer': 'customers',
            'solution': 'solutions',
            'main': 'pages'
          };
          const categoryDir = categoryMap[category] || 'pages';
          possiblePaths.unshift(path.join(this.contentDir, categoryDir, `${slug}.json`));
        }

        for (const filePath of possiblePaths) {
          try {
            const content = await fs.readFile(filePath, 'utf-8');
            const pageContent: PageContent = JSON.parse(content);
            return pageContent;
          } catch {
            // Continue to next path
          }
        }

        return null;
      } catch (error) {
        console.error(`Failed to load page content for slug: ${slug}`, error);
        return null;
      }
    });
  }

  async getAllPages(): Promise<PageContent[]> {
    try {
      const pages: PageContent[] = [];
      const directories = ['pages', 'blog', 'products', 'customers', 'solutions'];
      
      for (const dir of directories) {
        try {
          const dirPath = path.join(this.contentDir, dir);
          const files = await fs.readdir(dirPath);
          const jsonFiles = files.filter(file => file.endsWith('.json'));
          
          for (const file of jsonFiles) {
            const slug = file.replace('.json', '');
            const page = await this.getPage(slug);
            if (page) {
              pages.push(page);
            }
          }
        } catch {
          // Directory might not exist, continue
        }
      }
      
      return pages;
    } catch (error) {
      console.error('Failed to load all pages:', error);
      return [];
    }
  }

  async getPageSlugs(): Promise<string[]> {
    try {
      const slugs: string[] = [];
      const directories = ['pages', 'blog', 'products', 'customers', 'solutions'];
      
      for (const dir of directories) {
        try {
          const dirPath = path.join(this.contentDir, dir);
          const files = await fs.readdir(dirPath);
          const dirSlugs = files
            .filter(file => file.endsWith('.json'))
            .map(file => file.replace('.json', ''));
          slugs.push(...dirSlugs);
        } catch {
          // Directory might not exist, continue
        }
      }
      
      return slugs;
    } catch (error) {
      console.error('Failed to get page slugs:', error);
      return [];
    }
  }

  async getSitemap(): Promise<Record<string, unknown> | null> {
    try {
      const sitemapPath = path.join(this.contentDir, 'comprehensive-sitemap.json');
      const content = await fs.readFile(sitemapPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error('Failed to load sitemap:', error);
      return null;
    }
  }

  async getPagesByCategory(category: string): Promise<PageContent[]> {
    return CachedContentLoader.getPagesByCategory(category, async () => {
      try {
        const categoryMap: Record<string, string> = {
          'blog': 'blog',
          'product': 'products',
          'customer': 'customers',
          'solution': 'solutions',
          'main': 'pages'
        };
        
        const categoryDir = categoryMap[category] || 'pages';
        const dirPath = path.join(this.contentDir, categoryDir);
        const files = await fs.readdir(dirPath);
        const jsonFiles = files.filter(file => file.endsWith('.json'));
        
        const pages: PageContent[] = [];
        for (const file of jsonFiles) {
          const slug = file.replace('.json', '');
          const page = await this.getPage(slug, category);
          if (page) {
            pages.push(page);
          }
        }
        
        return pages;
      } catch (error) {
        console.error(`Failed to load pages for category: ${category}`, error);
        return [];
      }
    });
  }

  async getCategoryIndex(category: string): Promise<Record<string, unknown> | null> {
    try {
      const indexPath = path.join(this.contentDir, `${category}-index.json`);
      const content = await fs.readFile(indexPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      console.error(`Failed to load category index: ${category}`, error);
      return null;
    }
  }

  // Static methods for use in Next.js static generation
  static async getStaticPage(slug: string): Promise<PageContent | null> {
    const loader = new ContentLoader();
    return loader.getPage(slug);
  }

  static async getStaticPaths(): Promise<Array<{ params: { slug: string } }>> {
    const loader = new ContentLoader();
    const slugs = await loader.getPageSlugs();
    
    return slugs
      .filter(slug => slug !== 'home') // Exclude home page as it's handled by index
      .map(slug => ({
        params: { slug }
      }));
  }

  static async getAllStaticPages(): Promise<PageContent[]> {
    const loader = new ContentLoader();
    return loader.getAllPages();
  }
}

// Convenience functions for Next.js
export const getPageContent = ContentLoader.getStaticPage;
export const getAllPages = ContentLoader.getAllStaticPages;
export const getPagePaths = ContentLoader.getStaticPaths;