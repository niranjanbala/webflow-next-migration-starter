import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs/promises';
import * as path from 'path';

export interface ScrapedPage {
  url: string;
  title: string;
  description: string;
  content: string;
  sections: ScrapedSection[];
  assets: ScrapedAsset[];
  metadata: PageMetadata;
}

export interface ScrapedSection {
  id: string;
  type: string;
  html: string;
  text: string;
  classes: string[];
  styles: Record<string, string>;
  children: ScrapedSection[];
}

export interface ScrapedAsset {
  type: 'image' | 'font' | 'css' | 'js';
  url: string;
  localPath?: string;
  alt?: string;
  dimensions?: { width: number; height: number };
}

export interface PageMetadata {
  title: string;
  description: string;
  keywords: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  canonicalUrl?: string;
  category?: string;
}

export class WebScraper {
  private baseUrl: string;
  private visitedUrls: Set<string> = new Set();
  private assets: Map<string, ScrapedAsset> = new Map();

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl.replace(/\/$/, ''); // Remove trailing slash
  }

  async scrapePage(url: string): Promise<ScrapedPage> {
    try {
      console.log(`Scraping: ${url}`);
      
      const response = await axios.get(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        },
        timeout: 10000
      });

      const $ = cheerio.load(response.data);
      
      // Extract metadata
      const metadata = this.extractMetadata($);
      
      // Extract main content sections
      const sections = this.extractSections($);
      
      // Extract assets
      const assets = this.extractAssets($, url);
      
      const scrapedPage: ScrapedPage = {
        url,
        title: metadata.title,
        description: metadata.description,
        content: $('body').html() || '',
        sections,
        assets,
        metadata
      };

      this.visitedUrls.add(url);
      return scrapedPage;
      
    } catch (error) {
      console.error(`Error scraping ${url}:`, error);
      throw error;
    }
  }

  private extractMetadata($: cheerio.CheerioAPI): PageMetadata {
    return {
      title: $('title').text() || '',
      description: $('meta[name="description"]').attr('content') || '',
      keywords: $('meta[name="keywords"]').attr('content') || '',
      ogTitle: $('meta[property="og:title"]').attr('content'),
      ogDescription: $('meta[property="og:description"]').attr('content'),
      ogImage: $('meta[property="og:image"]').attr('content'),
      canonicalUrl: $('link[rel="canonical"]').attr('href')
    };
  }

  private extractSections($: cheerio.CheerioAPI): ScrapedSection[] {
    const sections: ScrapedSection[] = [];
    
    // Look for common Webflow section patterns
    const sectionSelectors = [
      'section',
      '.section',
      '[class*="section"]',
      '.hero',
      '.container',
      '.wrapper',
      'main > div',
      'body > div'
    ];

    sectionSelectors.forEach(selector => {
      $(selector).each((index, element) => {
        const $el = $(element);
        
        // Skip if this element is already captured by a parent
        if ($el.parents().is(sections.map(s => `[data-scraped-id="${s.id}"]`).join(','))) {
          return;
        }

        const section = this.extractSectionData($, $el, index);
        if (section && section.html.trim()) {
          sections.push(section);
          $el.attr('data-scraped-id', section.id);
        }
      });
    });

    return sections;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private extractSectionData($: cheerio.CheerioAPI, $el: any, index: number): ScrapedSection {
    const classes = $el.attr('class')?.split(' ') || [];
    const id = $el.attr('id') || `section-${index}`;
    
    // Determine section type based on classes and content
    const type = this.determineSectionType(classes, $el.text());
    
    // Extract inline styles
    const styles = this.parseInlineStyles($el.attr('style') || '');
    
    // Extract child sections
    const children: ScrapedSection[] = [];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    $el.children().each((childIndex: number, childElement: any) => {
      const $child = $(childElement);
      if ($child.is('div, section, article, header, footer')) {
        const childSection = this.extractSectionData($, $child, childIndex);
        if (childSection) {
          children.push(childSection);
        }
      }
    });

    return {
      id,
      type,
      html: $el.html() || '',
      text: $el.text().trim(),
      classes,
      styles,
      children
    };
  }

  private determineSectionType(classes: string[], text: string): string {
    const classStr = classes.join(' ').toLowerCase();
    
    if (classStr.includes('hero') || classStr.includes('banner')) return 'hero';
    if (classStr.includes('nav') || classStr.includes('menu')) return 'navigation';
    if (classStr.includes('footer')) return 'footer';
    if (classStr.includes('header')) return 'header';
    if (classStr.includes('contact') || classStr.includes('form')) return 'contact';
    if (classStr.includes('gallery') || classStr.includes('image')) return 'gallery';
    if (classStr.includes('testimonial') || classStr.includes('review')) return 'testimonial';
    if (classStr.includes('feature') || classStr.includes('service')) return 'features';
    if (classStr.includes('about') || classStr.includes('intro')) return 'about';
    if (text.length > 500) return 'content';
    
    return 'section';
  }

  private parseInlineStyles(styleStr: string): Record<string, string> {
    const styles: Record<string, string> = {};
    if (!styleStr) return styles;
    
    styleStr.split(';').forEach(rule => {
      const [property, value] = rule.split(':').map(s => s.trim());
      if (property && value) {
        styles[property] = value;
      }
    });
    
    return styles;
  }

  private extractAssets($: cheerio.CheerioAPI, pageUrl: string): ScrapedAsset[] {
    const assets: ScrapedAsset[] = [];
    
    // Extract images
    $('img').each((_, element) => {
      const $img = $(element);
      const src = $img.attr('src');
      if (src) {
        const asset: ScrapedAsset = {
          type: 'image',
          url: this.resolveUrl(src, pageUrl),
          alt: $img.attr('alt'),
        };
        
        // Try to get dimensions
        const width = $img.attr('width');
        const height = $img.attr('height');
        if (width && height) {
          asset.dimensions = { width: parseInt(width), height: parseInt(height) };
        }
        
        assets.push(asset);
      }
    });

    // Extract CSS files
    $('link[rel="stylesheet"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        assets.push({
          type: 'css',
          url: this.resolveUrl(href, pageUrl)
        });
      }
    });

    // Extract fonts
    $('link[href*="fonts"]').each((_, element) => {
      const href = $(element).attr('href');
      if (href) {
        assets.push({
          type: 'font',
          url: this.resolveUrl(href, pageUrl)
        });
      }
    });

    return assets;
  }

  private resolveUrl(url: string, baseUrl: string): string {
    if (url.startsWith('http')) return url;
    if (url.startsWith('//')) return `https:${url}`;
    if (url.startsWith('/')) return `${this.baseUrl}${url}`;
    
    const base = new URL(baseUrl);
    return new URL(url, base.origin + base.pathname).href;
  }

  async scrapeFullSite(): Promise<ScrapedPage[]> {
    const pages: ScrapedPage[] = [];
    const urlsToScrape = [this.baseUrl];
    
    // Start with homepage
    const homepage = await this.scrapePage(this.baseUrl);
    pages.push(homepage);
    
    // Extract navigation links from homepage
    const $ = cheerio.load(homepage.content);
    $('nav a, .nav a, [class*="nav"] a, header a').each((_, element) => {
      const href = $(element).attr('href');
      if (href && this.isInternalUrl(href)) {
        const fullUrl = this.resolveUrl(href, this.baseUrl);
        if (!this.visitedUrls.has(fullUrl) && !urlsToScrape.includes(fullUrl)) {
          urlsToScrape.push(fullUrl);
        }
      }
    });

    // Scrape additional pages
    for (let i = 1; i < urlsToScrape.length; i++) {
      try {
        const page = await this.scrapePage(urlsToScrape[i]);
        pages.push(page);
        
        // Add a small delay to be respectful
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to scrape ${urlsToScrape[i]}:`, error);
      }
    }

    return pages;
  }

  private isInternalUrl(url: string): boolean {
    if (url.startsWith('#') || url.startsWith('mailto:') || url.startsWith('tel:')) {
      return false;
    }
    
    if (url.startsWith('/')) return true;
    
    try {
      const urlObj = new URL(url);
      const baseUrlObj = new URL(this.baseUrl);
      return urlObj.hostname === baseUrlObj.hostname;
    } catch {
      return false;
    }
  }

  async downloadAsset(asset: ScrapedAsset, outputDir: string): Promise<string> {
    try {
      const response = await axios.get(asset.url, { 
        responseType: 'arraybuffer',
        timeout: 10000 
      });
      
      const urlPath = new URL(asset.url).pathname;
      const filename = path.basename(urlPath) || `asset-${Date.now()}`;
      const localPath = path.join(outputDir, filename);
      
      await fs.writeFile(localPath, response.data);
      return localPath;
    } catch (error) {
      console.error(`Failed to download asset ${asset.url}:`, error);
      throw error;
    }
  }
}