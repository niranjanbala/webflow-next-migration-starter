import { ContentItem } from './content-loader';

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority?: number;
}

export interface SitemapOptions {
  baseUrl?: string;
  excludePaths?: string[];
  includePaths?: string[];
  defaultChangeFreq?: SitemapEntry['changeFrequency'];
  defaultPriority?: number;
}

const DEFAULT_OPTIONS: Required<SitemapOptions> = {
  baseUrl: 'https://numeralhq.com',
  excludePaths: ['/api', '/admin', '/_next', '/components-demo'],
  includePaths: [],
  defaultChangeFreq: 'weekly',
  defaultPriority: 0.7
};

export function generateSitemapEntries(
  content: ContentItem[],
  options: SitemapOptions = {}
): SitemapEntry[] {
  const opts = { ...DEFAULT_OPTIONS, ...options };
  const entries: SitemapEntry[] = [];

  // Add static pages
  const staticPages = [
    { url: '/', priority: 1.0, changeFrequency: 'daily' as const },
    { url: '/about', priority: 0.8, changeFrequency: 'monthly' as const },
    { url: '/pricing', priority: 0.9, changeFrequency: 'weekly' as const },
    { url: '/contact', priority: 0.7, changeFrequency: 'monthly' as const },
    { url: '/blog', priority: 0.8, changeFrequency: 'daily' as const },
    { url: '/resources', priority: 0.7, changeFrequency: 'weekly' as const },
    { url: '/customers', priority: 0.6, changeFrequency: 'monthly' as const },
    { url: '/integrations', priority: 0.7, changeFrequency: 'weekly' as const }
  ];

  staticPages.forEach(page => {
    if (!opts.excludePaths.some(exclude => page.url.startsWith(exclude))) {
      entries.push({
        url: `${opts.baseUrl}${page.url}`,
        lastModified: new Date(),
        changeFrequency: page.changeFrequency,
        priority: page.priority
      });
    }
  });

  // Add dynamic content pages
  content.forEach(item => {
    const url = item.slug ? `/${item.category}/${item.slug}` : `/${item.category}`;
    
    if (!opts.excludePaths.some(exclude => url.startsWith(exclude))) {
      let priority = opts.defaultPriority;
      let changeFreq = opts.defaultChangeFreq;

      // Adjust priority and frequency based on content type
      switch (item.category) {
        case 'blog':
          priority = 0.6;
          changeFreq = 'monthly';
          break;
        case 'products':
          priority = 0.8;
          changeFreq = 'weekly';
          break;
        case 'customers':
          priority = 0.5;
          changeFreq = 'yearly';
          break;
        case 'resources':
          priority = 0.6;
          changeFreq = 'monthly';
          break;
        default:
          priority = opts.defaultPriority;
          changeFreq = opts.defaultChangeFreq;
      }

      entries.push({
        url: `${opts.baseUrl}${url}`,
        lastModified: item.updatedAt ? new Date(item.updatedAt) : new Date(),
        changeFrequency: changeFreq,
        priority
      });
    }
  });

  // Add manually included paths
  opts.includePaths.forEach(path => {
    entries.push({
      url: `${opts.baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: opts.defaultChangeFreq,
      priority: opts.defaultPriority
    });
  });

  // Remove duplicates and sort by priority
  const uniqueEntries = entries.filter((entry, index, self) => 
    index === self.findIndex(e => e.url === entry.url)
  );

  return uniqueEntries.sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

export function generateSitemapXML(entries: SitemapEntry[]): string {
  const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
  const urlsetOpen = '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">';
  const urlsetClose = '</urlset>';

  const urls = entries.map(entry => {
    const lastmod = entry.lastModified 
      ? `<lastmod>${entry.lastModified.toISOString().split('T')[0]}</lastmod>`
      : '';
    
    const changefreq = entry.changeFrequency 
      ? `<changefreq>${entry.changeFrequency}</changefreq>`
      : '';
    
    const priority = entry.priority !== undefined 
      ? `<priority>${entry.priority.toFixed(1)}</priority>`
      : '';

    return `  <url>
    <loc>${entry.url}</loc>${lastmod}${changefreq}${priority}
  </url>`;
  }).join('\n');

  return `${xmlHeader}
${urlsetOpen}
${urls}
${urlsetClose}`;
}

export function generateRobotsTxt(options: {
  baseUrl?: string;
  allowAll?: boolean;
  disallowPaths?: string[];
  allowPaths?: string[];
  crawlDelay?: number;
  userAgents?: Array<{
    userAgent: string;
    allow?: string[];
    disallow?: string[];
    crawlDelay?: number;
  }>;
} = {}): string {
  const {
    baseUrl = 'https://numeralhq.com',
    allowAll = true,
    disallowPaths = ['/api/', '/admin/', '/_next/', '/components-demo/'],
    allowPaths = [],
    crawlDelay,
    userAgents = []
  } = options;

  let robotsTxt = '';

  if (userAgents.length > 0) {
    // Custom user agents
    userAgents.forEach(ua => {
      robotsTxt += `User-agent: ${ua.userAgent}\n`;
      
      if (ua.allow) {
        ua.allow.forEach(path => {
          robotsTxt += `Allow: ${path}\n`;
        });
      }
      
      if (ua.disallow) {
        ua.disallow.forEach(path => {
          robotsTxt += `Disallow: ${path}\n`;
        });
      }
      
      if (ua.crawlDelay) {
        robotsTxt += `Crawl-delay: ${ua.crawlDelay}\n`;
      }
      
      robotsTxt += '\n';
    });
  } else {
    // Default configuration
    robotsTxt += 'User-agent: *\n';
    
    if (allowAll) {
      allowPaths.forEach(path => {
        robotsTxt += `Allow: ${path}\n`;
      });
      
      disallowPaths.forEach(path => {
        robotsTxt += `Disallow: ${path}\n`;
      });
    } else {
      robotsTxt += 'Disallow: /\n';
    }
    
    if (crawlDelay) {
      robotsTxt += `Crawl-delay: ${crawlDelay}\n`;
    }
    
    robotsTxt += '\n';
  }

  // Add sitemap reference
  robotsTxt += `Sitemap: ${baseUrl}/sitemap.xml\n`;

  return robotsTxt;
}