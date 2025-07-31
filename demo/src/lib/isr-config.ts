// ISR (Incremental Static Regeneration) configuration

export const ISR_CONFIG = {
  // Revalidate pages every hour
  DEFAULT_REVALIDATE: 3600, // 1 hour in seconds
  
  // Different revalidation times for different content types
  REVALIDATE_TIMES: {
    homepage: 1800,      // 30 minutes - high traffic page
    blog: 7200,          // 2 hours - blog posts don't change often
    products: 3600,      // 1 hour - product pages may update
    customers: 86400,    // 24 hours - customer stories are stable
    solutions: 3600,     // 1 hour - solution pages may update
    static: 86400,       // 24 hours - static pages rarely change
  },
  
  // Pages that should be regenerated on-demand
  ON_DEMAND_PAGES: [
    'pricing',
    'about',
    'contact'
  ],
  
  // Maximum number of pages to regenerate per request
  MAX_REGENERATE_BATCH: 10,
} as const;

export function getRevalidateTime(slug: string, category?: string): number {
  // Homepage gets special treatment
  if (slug === 'home' || slug === '') {
    return ISR_CONFIG.REVALIDATE_TIMES.homepage;
  }
  
  // Category-based revalidation
  if (category) {
    switch (category) {
      case 'blog':
        return ISR_CONFIG.REVALIDATE_TIMES.blog;
      case 'product':
        return ISR_CONFIG.REVALIDATE_TIMES.products;
      case 'customer':
        return ISR_CONFIG.REVALIDATE_TIMES.customers;
      case 'solution':
        return ISR_CONFIG.REVALIDATE_TIMES.solutions;
      default:
        return ISR_CONFIG.DEFAULT_REVALIDATE;
    }
  }
  
  // On-demand pages get longer revalidation times
  if (ISR_CONFIG.ON_DEMAND_PAGES.includes(slug as 'pricing' | 'about' | 'contact')) {
    return ISR_CONFIG.REVALIDATE_TIMES.static;
  }
  
  return ISR_CONFIG.DEFAULT_REVALIDATE;
}

// Webhook handler for content updates
export interface WebhookPayload {
  type: 'content_update' | 'content_delete' | 'site_publish';
  slug?: string;
  category?: string;
  timestamp: string;
}

export function shouldRevalidate(payload: WebhookPayload): boolean {
  // Always revalidate on site publish
  if (payload.type === 'site_publish') {
    return true;
  }
  
  // Revalidate specific content updates
  if (payload.type === 'content_update' && payload.slug) {
    return true;
  }
  
  // Handle content deletion
  if (payload.type === 'content_delete') {
    return true;
  }
  
  return false;
}

export function getPagesToRevalidate(payload: WebhookPayload): string[] {
  const pages: string[] = [];
  
  switch (payload.type) {
    case 'site_publish':
      // Revalidate key pages on site publish
      pages.push('/', '/blog', '/products');
      break;
      
    case 'content_update':
      if (payload.slug) {
        // Revalidate the specific page
        if (payload.category) {
          pages.push(`/${payload.category}/${payload.slug}`);
          pages.push(`/${payload.category}`); // Also revalidate category index
        } else {
          pages.push(`/${payload.slug}`);
        }
      }
      break;
      
    case 'content_delete':
      if (payload.category) {
        // Revalidate category index when content is deleted
        pages.push(`/${payload.category}`);
      }
      break;
  }
  
  return pages;
}